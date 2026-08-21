"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useChat, type UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { detectIntent } from "@/data/tala-knowledge";
import {
  PUBLIC_ASSISTANT_FAILURE_COPY,
  canRetryPublicAssistant,
  shouldClosePublicAssistant,
} from "@/lib/public-assistant-ui";

const STORAGE_KEY = "tala-chat-session";
const CAPTURE_STORAGE_KEY = "tala-capture-state";
const HIRE_URL = "/hire";
const APPLY_URL = "/apply";
const CONTACT_URL = "/contact";

const WELCOME_MESSAGE: UIMessage = {
  id: "tala-welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Tala here, the placement guide for TantaGlobal Assist. Hiring a VA, or applying as one? Tell me a bit about what you're after and I'll point you the right way.",
    },
  ],
};

type CaptureState =
  | { status: "idle" }
  | { status: "needed"; audience: "employer" | "candidate" | null }
  | { status: "submitting" }
  | { status: "captured"; email: string; audience: "employer" | "candidate" | null }
  | { status: "error"; message: string };

function isUIMessagePart(part: unknown): part is { type: "text"; text: string } {
  return (
    !!part &&
    typeof part === "object" &&
    (part as { type?: unknown }).type === "text" &&
    typeof (part as { text?: unknown }).text === "string"
  );
}

function isUIMessage(value: unknown): value is UIMessage {
  return (
    !!value &&
    typeof value === "object" &&
    "role" in value &&
    typeof (value as { role?: unknown }).role === "string" &&
    Array.isArray((value as { parts?: unknown }).parts) &&
    (value as { parts?: unknown[] }).parts!.every(isUIMessagePart)
  );
}

function messageText(message: UIMessage) {
  return message.parts
    .filter(isUIMessagePart)
    .map((part) => part.text)
    .join("\n")
    .trim();
}

export default function TalaChatWidget() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [input, setInput] = useState("");
  const [capture, setCapture] = useState<CaptureState>({ status: "idle" });
  const [captureEmail, setCaptureEmail] = useState("");
  const [captureIntent, setCaptureIntent] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/tala" }), []);
  const { messages, setMessages, sendMessage, status, error, regenerate, clearError } = useChat({
    transport,
    messages: [WELCOME_MESSAGE],
  });

  useEffect(() => {
    setHydrated(true);
    try {
      const savedMsgs = window.sessionStorage.getItem(STORAGE_KEY);
      if (savedMsgs) {
        const parsed = JSON.parse(savedMsgs) as unknown;
        if (Array.isArray(parsed) && parsed.every(isUIMessage)) {
          setMessages(parsed);
        }
      }
      const savedCapture = window.sessionStorage.getItem(CAPTURE_STORAGE_KEY);
      if (savedCapture) {
        const parsed = JSON.parse(savedCapture) as CaptureState;
        if (parsed?.status === "captured") setCapture(parsed);
      }
    } catch {
      // Session storage is best-effort only.
    }
  }, [setMessages]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Ignore storage failures.
    }
  }, [hydrated, messages]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      if (capture.status === "captured") {
        window.sessionStorage.setItem(CAPTURE_STORAGE_KEY, JSON.stringify(capture));
      }
    } catch {
      // Ignore storage failures.
    }
  }, [hydrated, capture]);

  useEffect(() => {
    if (!open) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, open, capture]);

  const closeChat = useCallback(() => {
    clearError();
    setOpen(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }, [clearError]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!shouldClosePublicAssistant(open, event.key)) return;
      event.preventDefault();
      closeChat();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeChat, open]);

  const retryReply = () => {
    if (!canRetryPublicAssistant(status)) return;
    clearError();
    void regenerate();
  };

  const { exchangeCount, audience, highIntent } = useMemo(() => {
    const userMessages = messages.filter((m) => m.role === "user");
    const joined = userMessages.map(messageText).join(" ").trim();
    const intent = joined ? detectIntent(joined) : { highIntent: false, audience: null, outOfScope: { matched: false, response: "" } };
    return {
      exchangeCount: userMessages.length,
      audience: intent.audience,
      highIntent: intent.highIntent,
    };
  }, [messages]);

  const captureNeeded =
    capture.status === "idle" && (highIntent || exchangeCount >= 3) && exchangeCount >= 1;

  useEffect(() => {
    if (captureNeeded) {
      setCapture({ status: "needed", audience });
    }
  }, [captureNeeded, audience]);

  const submitCapture = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = captureEmail.trim().toLowerCase();
    const intent = captureIntent.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setCapture({ status: "error", message: "That email looks off. Try again." });
      return;
    }
    if (intent.length < 3) {
      setCapture({ status: "error", message: "Add one line about what you need." });
      return;
    }
    setCapture({ status: "submitting" });
    try {
      const transcript = messages.slice(-10).map((m) => ({ role: m.role, text: messageText(m) }));
      const res = await fetch("/api/tala/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          intent,
          source_bot: "tala",
          source_site: "tantaglobal-assist",
          audience,
          transcript,
        }),
      });
      if (!res.ok) throw new Error(`status ${res.status}`);
      setCapture({ status: "captured", email, audience });
    } catch (err) {
      console.error("[Tala] capture failed", err);
      setCapture({ status: "error", message: "Couldn't save that. Try again, or email hello@tantaglobal.com." });
    }
  };

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] font-sans">
      {open ? (
        <section
          id="tala-chat-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="tala-chat-title"
          className="pointer-events-auto mb-3 w-[min(94vw,25rem)] overflow-hidden rounded-2xl border border-[#0d5c63]/20 bg-white text-[#0d2326] shadow-2xl shadow-black/15"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[#0d5c63]/15 bg-[#0d5c63] px-4 py-4 text-white">
            <div>
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-white/75">Tala</p>
              <h2 id="tala-chat-title" className="text-base font-semibold tracking-tight">Placement guide</h2>
              <p className="text-xs text-white/70">Hiring · Applying · Honest reads</p>
            </div>
            <button
              type="button"
              onClick={closeChat}
              className="rounded-full border border-white/20 px-2.5 py-1 text-sm text-white/70 transition-colors hover:border-white/60 hover:text-white"
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div ref={scrollerRef} className="max-h-[28rem] space-y-3 overflow-y-auto bg-[#f4f6f6] px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-[#0d5c63] text-white"
                      : "bg-white text-[#0d2326] border border-[#0d5c63]/15"
                  }`}
                >
                  {messageText(message)}
                </div>
              </div>
            ))}

            {error ? (
              <div role="alert" aria-live="assertive" className="rounded-xl border border-red-700/30 bg-red-700/5 px-4 py-3 text-xs text-red-900">
                <p>{PUBLIC_ASSISTANT_FAILURE_COPY}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={retryReply}
                    disabled={!canRetryPublicAssistant(status)}
                    className="rounded-full border border-red-900/30 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Retry reply
                  </button>
                  <button
                    type="button"
                    onClick={closeChat}
                    className="rounded-full border border-red-900/30 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]"
                  >
                    Close guide
                  </button>
                  <a href={CONTACT_URL} className="rounded-full border border-red-900/30 px-3 py-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]">
                    Contact team
                  </a>
                </div>
              </div>
            ) : null}

            {capture.status === "needed" || capture.status === "submitting" || capture.status === "error" ? (
              <form
                onSubmit={submitCapture}
                className="rounded-2xl border border-[#0d5c63]/40 bg-white px-4 py-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#0d5c63] mb-2">
                  Quick capture
                </p>
                <p className="text-sm text-[#0d2326] mb-3 leading-snug">
                  Drop your email and one line about what you need. The TGA Assist team will respond directly — no marketing list, no third parties.
                </p>
                <div className="space-y-2">
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={captureEmail}
                    onChange={(e) => setCaptureEmail(e.target.value)}
                    className="w-full rounded-lg border border-[#0d5c63]/30 bg-[#f4f6f6] px-3 py-2 text-sm text-[#0d2326] placeholder:text-[#0d5c63]/50 focus:border-[#0d5c63] focus:outline-none"
                  />
                  <textarea
                    required
                    rows={2}
                    placeholder={
                      audience === "employer"
                        ? "Role you need filled (hours, tools, scope)"
                        : audience === "candidate"
                        ? "Your background and what you're looking for"
                        : "Hiring a VA, or applying? One line about what you need."
                    }
                    value={captureIntent}
                    onChange={(e) => setCaptureIntent(e.target.value)}
                    className="w-full resize-none rounded-lg border border-[#0d5c63]/30 bg-[#f4f6f6] px-3 py-2 text-sm text-[#0d2326] placeholder:text-[#0d5c63]/50 focus:border-[#0d5c63] focus:outline-none"
                  />
                </div>
                {capture.status === "error" ? (
                  <p className="mt-2 text-xs text-red-900">{capture.message}</p>
                ) : null}
                <button
                  type="submit"
                  disabled={capture.status === "submitting"}
                  className="mt-3 w-full rounded-full bg-[#0d5c63] px-4 py-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition-all hover:bg-[#0a4a50] disabled:opacity-50"
                >
                  {capture.status === "submitting" ? "Sending..." : "Send to TGA Assist"}
                </button>
              </form>
            ) : null}

            {capture.status === "captured" ? (
              <div className="rounded-2xl border border-[#0d5c63]/40 bg-white px-4 py-4">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#0d5c63] mb-1">
                  Captured · routing
                </p>
                <p className="text-sm text-[#0d2326] leading-snug">
                  Got it. Check {capture.email} for confirmation — the team will reply directly.
                  {audience === "employer" ? (
                    <> Looks like the employer side; the role brief is the right next step.</>
                  ) : audience === "candidate" ? (
                    <> Looks like the candidate side; the application is the right next step.</>
                  ) : null}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {audience === "employer" || !audience ? (
                    <a
                      href={HIRE_URL}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0d5c63] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white hover:bg-[#0a4a50]"
                    >
                      Submit role brief →
                    </a>
                  ) : null}
                  {audience === "candidate" || !audience ? (
                    <a
                      href={APPLY_URL}
                      className="inline-flex items-center gap-2 rounded-full bg-[#0d5c63] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-white hover:bg-[#0a4a50]"
                    >
                      Apply →
                    </a>
                  ) : null}
                  <a
                    href={CONTACT_URL}
                    className="inline-flex items-center gap-2 rounded-full border border-[#0d5c63]/40 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#0d2326] hover:border-[#0d5c63]"
                  >
                    Contact form →
                  </a>
                </div>
              </div>
            ) : null}
          </div>

          <form
            method="post"
            onSubmit={async (event) => {
              event.preventDefault();
              const prompt = input.trim();
              if (!prompt || status !== "ready") return;
              clearError();
              setInput("");
              await sendMessage({ text: prompt });
            }}
            className="border-t border-[#0d5c63]/15 bg-white p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask Tala about hiring or applying..."
                rows={2}
                className="min-h-[3rem] flex-1 resize-none rounded-xl border border-[#0d5c63]/25 bg-[#f4f6f6] px-3 py-2 text-sm text-[#0d2326] placeholder:text-[#0d5c63]/55 focus:border-[#0d5c63] focus:outline-none"
              />
              <button
                type="submit"
                disabled={status !== "ready" || !input.trim()}
                className="rounded-xl bg-[#0d5c63] px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        ref={launcherRef}
        onClick={() => {
          clearError();
          setOpen((value) => !value);
        }}
        className="pointer-events-auto ml-auto flex items-center gap-3 rounded-full bg-[#0d5c63] px-4 py-3 text-white shadow-lg shadow-black/30 ring-1 ring-[#0d5c63]/30 transition-transform hover:scale-[1.02]"
        aria-label={open ? "Close Tala chat" : "Open Tala chat"}
        aria-expanded={open}
        aria-controls="tala-chat-panel"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0d5c63] font-bold">
          T
        </span>
        <span className="text-left leading-tight">
          <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-white/85">
            Tala
          </span>
          <span className="block text-sm font-semibold">Placement guide</span>
        </span>
      </button>
    </div>
  );
}
