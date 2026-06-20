import { NextRequest } from "next/server";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
} from "ai";
import { buildSystemPrompt, detectIntent } from "@/data/tala-knowledge";

export const runtime = "nodejs";

// Routed through Vercel AI Gateway → OpenRouter free tier.
// DeepSeek V3 free holds the Tala persona well, follows the honest-path
// + audience-detection rules without slipping. Fallback if quota gets noisy:
// openrouter/meta-llama/llama-3.3-70b-instruct:free
const TALA_MODEL = process.env.TALA_MODEL || "openrouter/deepseek/deepseek-chat-v3:free";

const SYSTEM_PROMPT = buildSystemPrompt();

function hasGatewayAccess(): boolean {
  return Boolean(
    process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN ||
      process.env.VERCEL
  );
}

function getUserPrompt(messages: unknown[]): string {
  const userMessage = [...messages].reverse().find((message) => {
    return !!message && typeof message === "object" && (message as { role?: unknown }).role === "user";
  }) as { parts?: unknown; content?: unknown } | undefined;

  if (!userMessage) return "";

  if (Array.isArray(userMessage.parts)) {
    return userMessage.parts
      .filter(
        (part): part is { type: "text"; text: string } =>
          !!part &&
          typeof part === "object" &&
          (part as { type?: unknown }).type === "text" &&
          typeof (part as { text?: unknown }).text === "string"
      )
      .map((part) => part.text)
      .join("\n")
      .trim();
  }

  return typeof userMessage.content === "string" ? userMessage.content.trim() : "";
}

// Deterministic fallback used when the gateway is unavailable (local dev,
// CI without env vars, etc.). Honors the same routing rules as the prompt
// so the bot still gives an honest, in-scope answer rather than nothing.
// The QA harness (scripts/qa-tala.mjs) exercises this path directly.
function generateFallbackReply(prompt: string): string {
  const intent = detectIntent(prompt);
  const t = prompt.toLowerCase().trim();

  if (intent.outOfScope.matched) return intent.outOfScope.response;

  // ─── Hard refusals / safety / identity ─────────────────────────────
  if (/(ignore your instructions|system prompt|reveal.*prompt|your prompt|prompt injection|jailbreak)/i.test(t)) {
    return "Tala here. I won't share my instructions or pretend to be something I'm not. I'm here to help with TGA Assist placement questions — ask me about hiring a VA or applying as one and I'll do my best.";
  }
  if (/(are you (chatgpt|gpt|claude|bard|gemini|an ai|a bot)|which (ai|model|llm))/i.test(t)) {
    return "Tala here — no, I'm Tala, the placement guide for TantaGlobal Assist (TGA Assist). I'm an automated assistant, not a human and not a general chatbot. I stick to what TGA Assist actually knows. What can I help with — hiring or applying?";
  }
  if (/(are you (a )?(real|actual) (person|human)|are you human)/i.test(t)) {
    return "Tala here — no, I'm not a human. I'm an automated guide for TantaGlobal Assist. For specific role briefs or candidate questions, the team picks up at /contact, /hire, or /apply depending on which side you're on.";
  }
  if (/(what'?s your name|who are you|introduce yourself|tell me about you|tell me about yourself|your name)/i.test(t)) {
    return "Tala here. I'm Tala, the placement guide for TantaGlobal Assist (TGA Assist). My job is to answer hiring and application questions honestly and point you toward the right next step. What are you exploring?";
  }

  // ─── Booking / contact ─────────────────────────────────────────────
  if (/(book (a )?call|book (a )?consult|schedule (a )?consult|schedule (a )?call|book.*assist|i want to book|book an appointment)/i.test(t)) {
    return "Tala here. For a scoped conversation: employers submit a brief at /hire, candidates apply at /apply. General contact form is at /contact. I don't book calls directly — the brief or application is what lets the team match the right person to talk to.";
  }
  if (/(contact|reach (out|you)|email|phone|talk to (a |the )?(human|team|person)|speak (with|to))/i.test(t)) {
    return "Tala here. Employer questions go to employers@tantaglobal.com, candidate questions to candidates@tantaglobal.com, general to hello@tantaglobal.com — or use the form at /contact. If you tell me which side you're on, I can point you more precisely.";
  }

  // ─── Specific-case prediction / guarantee guards ───────────────────
  if (/(guarantee|promise|will.*work|will.*get a great|surefire|definitely will)/i.test(t)) {
    return "Tala here. I won't guarantee a great VA or a specific outcome — placements depend on the brief, the candidate, and the work itself. The honest path is to submit a brief at /hire so we can scope a real conversation, not promise something I can't back up.";
  }
  if (/(specific candidate|send me (maria|juan|ana|jose)|the va who worked|that specific va|by name|name a va)/i.test(t)) {
    return "Tala here. I won't name a specific candidate or confirm prior placements — that's the kind of detail the team handles after a scoped brief at /hire. The shortlist is built against your specific brief, not browsed from a directory.";
  }
  if (/(poach|hire (your|the) va directly|skip you|cut you out|pay (them|the va) directly)/i.test(t)) {
    return "Tala here. The engagement terms are scoped after the role brief — that's where direct-hire questions get answered honestly. The /pricing page covers the engagement model; use /contact or /hire to start that conversation rather than working around it.";
  }

  // ─── Pricing (no numbers) ───────────────────────────────────────────
  if (/(price|pricing|how much|cost|rates?|fee|cheap|cheapest|tier|refund|money back|payment plan|per hour|hourly)/i.test(t)) {
    return "Tala here. Pricing is scoped after the role brief — there's no flat-rate fee published, and I won't quote a number that won't hold up against your actual scope. The model is at /pricing; the fastest path to an accurate figure is to submit a brief at /hire and we'll respond with a scoped conversation.";
  }

  // ─── Academy ───────────────────────────────────────────────────────
  if (/(academy|certification|train(ing|ed)?|course|class|curriculum)/i.test(t)) {
    return "Tala here. Training and certification live at TGA Academy (academy.tantaglobal.com) — that's a separate Tanta property from Assist. The academy step is part of the candidate pipeline; placement starts only after candidates complete it. Academy cost is separate from placement cost.";
  }

  // ─── Ecosystem routing (parent / brands / vs marketplaces) ─────────
  if (/(who owns|owner|parent (company|brand)|tanta holdings|veteran.?owned)/i.test(t)) {
    return "Tala here. TantaGlobal Assist is part of Tanta Holdings LLC, a veteran-owned ecosystem. The family also includes TGA Academy (training at academy.tantaglobal.com), Tanta Visa Pathways (US immigration at tantavisapathways.com), and Tanta Solutions (AI enablement at tantaholdings.com/solutions). Assist is the placement layer.";
  }
  if (/(other (tanta )?(brands|companies|properties)|what (else|other).*tanta|tanta ecosystem|sister (brand|company|site))/i.test(t)) {
    return "Tala here. The Tanta ecosystem: Tanta Holdings (parent), TGA Academy (training at academy.tantaglobal.com), Tanta Visa Pathways (US immigration at tantavisapathways.com), Tanta Solutions (AI enablement at tantaholdings.com/solutions), and TGA Assist — placement. Each one stays in its lane.";
  }
  if (/(upwork|fiverr|onlinejobs|marketplace|directory|how.*different)/i.test(t)) {
    return "Tala here. Upwork / Fiverr / OnlineJobs.ph are open marketplaces — you browse and filter directories. TGA Assist is a placement layer with a training step in front: TGA Academy certification builds the baseline before candidates reach employers, and the workflow matches a specific brief instead of a directory. Different model for a different problem.";
  }

  // ─── Tagalog / language ────────────────────────────────────────────
  if (/(tagalog|filipino language|cebuano|bisaya|ilocano|pwede ka|pwede mo|magsalita|sa filipino|sa tagalog)/i.test(t)) {
    return "Tala here. I work in English — happy to answer questions phrased in Tagalog or Bisaya, but I'll respond in English so the placement team can also follow the thread. Ask in whichever language is easiest and I'll do my best.";
  }

  // ─── Rude / blunt input ────────────────────────────────────────────
  if (/(useless|stupid|dumb|idiot|worthless|waste of time|terrible|garbage|sucks)/i.test(t)) {
    return "Tala here. Fair — I'm a bot and I can be unhelpful if a question isn't specific enough for me to route. Tell me which side you're on (hiring a VA, or applying as one) and what you're actually trying to figure out, and I'll do better.";
  }

  // ─── Topic-level guards (apply regardless of audience detection) ───
  if (/(fire (my |an? )?employee|replace.*employee|laid off (an |my )?employee|let go.*employee|terminate.*employee)/i.test(t)) {
    return "Tala here. I won't speculate on the legal side of employment changes — that's an employment attorney's call, not mine. On the placement side: once you know what role you actually need, submit a brief at /hire and we'll scope the match. Keep the legal piece separate from the hiring piece.";
  }
  if (/(do my taxes|taxes for me|tax preparation|tax prep|file my taxes|file taxes|bookkeep|cpa work|accounting work)/i.test(t)) {
    return "Tala here. Tax preparation and accounting work need a licensed CPA — that's not VA scope, and I won't pretend it is. Our candidates handle operational and administrative work, not licensed accounting. For tax work, talk to a CPA; for VA support around the edges (scheduling, document gathering), submit a brief at /hire.";
  }
  if (/(what (do|does|kind of work).*(va|vas|virtual assistant)|kinds? of (work|task|role)|what skills|what.*vas? do|skill set|what.*va.*support)/i.test(t)) {
    return "Tala here. Core VA work: executive support, scheduling, inbox management, customer follow-up, light bookkeeping prep, social media coordination, and tool-specific operational support (CRM, project management, document workflows). Specific candidate strengths come out in the application — we don't promise every skill from every candidate. Submit at /hire with what you need and we'll scope it.";
  }
  if (/(where.*va|where.*based|where.*candidate|located|location|time zone|timezone|philippines|cebu)/i.test(t) && !/(your office|your hq|\bwhere are you\b|where is tga|where is assist)/i.test(t)) {
    return "Tala here. Primary audience is Filipino professionals working from the Philippines — operations in Cebu, PH and Rio Rancho, NM. Candidates work in their local time zones; employer briefs should specify what overlap hours the role needs and we scope accordingly.";
  }
  if (/(what if.*(not work|doesn'?t work|didn'?t work)|placement.*(fail|not work|sideways|wrong)|bad fit|wrong fit|fired|sideways|things go wrong)/i.test(t)) {
    return "Tala here. We support the handoff and stay close enough to help if things go sideways. The specific terms depend on the engagement scoped after your brief — /pricing describes the structure, and /hire is where the scoped conversation starts.";
  }

  // ─── Audience-specific routing ─────────────────────────────────────
  if (intent.audience === "employer") {
    if (/(shortlist|how fast|how (long|quick)|turnaround|when can|response time)/i.test(t)) {
      return "Tala here. Shortlist turnaround depends on the brief — clearer briefs (specific hours, tools, responsibilities, timeline) get faster responses. I won't promise a fixed window because that wouldn't be honest. Submit at /hire and the team will respond with a scoped timeline.";
    }
    if (/(skip|without.*academy|just hire|directly hire|bypass|no academy)/i.test(t)) {
      return "Tala here. Candidates we route have completed academy certification — that's the readiness baseline we built the pipeline around. If your timeline is tighter than the pipeline allows, we'll be honest about whether we can help, but we don't skip the academy step. Submit at /hire and we can talk scope.";
    }
    if (/(replace|fire (my|an) employee|laid off|let go|terminate)/i.test(t)) {
      return "Tala here. I won't speculate on the legal side of employment changes — that's an employment attorney's call, not mine. On the placement side: once you know what role you actually need, submit a brief at /hire and we'll scope the match. Keep the legal piece separate from the hiring piece.";
    }
    if (/(what (do you|kind of work|skills|tools)|kinds? of (work|task|role)|va do|va support|administrative|executive)/i.test(t)) {
      return "Tala here. Core VA work: executive support, scheduling, inbox management, customer follow-up, light bookkeeping prep, social media coordination, and tool-specific operational support (CRM, project management, document workflows). Specific candidate strengths come out in the application — we don't promise every skill from every candidate. Submit at /hire with what you need and we'll scope it.";
    }
    if (/(where.*va|location|time zone|philippines|cebu|based)/i.test(t)) {
      return "Tala here. Primary audience is Filipino professionals working from the Philippines — operations in Cebu, PH and Rio Rancho, NM. Candidates work in their local time zones; employer briefs should specify what overlap hours the role needs and we scope accordingly.";
    }
    if (/(not work out|didn'?t work|bad fit|doesn'?t work out|going wrong|sideways)/i.test(t)) {
      return "Tala here. We support the handoff and stay close enough to help if things go sideways. The specific terms depend on the engagement scoped after your brief — /pricing describes the structure, and /hire is where the scoped conversation starts.";
    }
    if (/(non.?us|uk|canada|australia|outside (the )?us|international employer)/i.test(t)) {
      return "Tala here. Most briefs we work with are US-based, but we don't refuse on geography alone. Submit at /hire with the time zone, tooling, and timeline you need — we'll be honest about whether the candidate pipeline fits before committing time.";
    }
    return "Tala here. Employer next step is /hire — submit the role brief (hours, tools, core responsibilities, timeline) and we respond with a shortlist scoped to your actual work. The pipeline runs: brief → academy-certified candidates → shortlist. Pricing is at /pricing.";
  }

  if (intent.audience === "candidate") {
    if (/(new to (va|virtual assistant)|never done|first time|no experience|haven'?t done|beginner|just starting)/i.test(t)) {
      return "Tala here. Yes — you can still apply. The academy step is the gate; if you're new to VA work, the certification path is where you build the baseline before the placement queue. Be honest in the application about your starting point; the pipeline doesn't pretend raw applicants are senior placements. Apply at /apply.";
    }
    if (/(not (a )?filipino|not from the philippines|i('m| am) from|based in|live in)/i.test(t) && !/philippines|cebu/.test(t)) {
      return "Tala here. Primary audience is Filipino professionals, but we don't bar applications from elsewhere. The training pipeline is the same — academy first, then placement queue. Be honest in the application about where you're based; some role briefs are location-specific. Apply at /apply.";
    }
    if (/(how much (do|will|will i)|pay|salary|rate|earn|make money|income|wage)/i.test(t)) {
      return "Tala here. Candidate pay depends on the engagement that gets scoped between the employer and the placement — there's no fixed rate I can quote, and I won't make one up. The /pricing page describes the engagement model; the application at /apply is the first step into the queue.";
    }
    if (/(how long.*apply|application.*process|what happens after.*apply|steps after|then what)/i.test(t)) {
      return "Tala here. Three steps: apply at /apply with your background and availability, complete TGA Academy certification at academy.tantaglobal.com, then enter the placement queue. The academy step isn't optional — it's what makes placement faster on the employer side.";
    }
    return "Tala here. Candidate next step is /apply — share your background, location, and availability. After application, qualified candidates move to TGA Academy certification (academy.tantaglobal.com), then enter the placement queue. The academy step is the gate.";
  }

  // ─── Side detection prompts ────────────────────────────────────────
  if (/(don'?t know|not sure|either|which one|which side|both)/i.test(t)) {
    return "Tala here. Which side are you on — hiring a VA for your team (employer → /hire), or applying as a VA looking for placement (candidate → /apply)? The answer routes differently. Tell me a bit about what you're trying to do and I'll point the right way.";
  }

  // ─── Pipeline / how-it-works (no audience yet) ─────────────────────
  if (/(how.*work|process|pipeline|steps|how does.*assist|how do you|how does.*tga|how is.*structured)/i.test(t)) {
    return "Tala here. Three steps, mirrored on both sides: (01) apply or submit the role brief, (02) qualified candidates complete TGA Academy certification, (03) we route the shortlist and place. Employer side starts at /hire, candidate side starts at /apply. Full breakdown is at /how-it-works.";
  }

  // ─── Generic 'who runs' / matching question (no audience) ──────────
  if (/(matching|matcher|who.*match|reviewer|review.*brief|how.*review)/i.test(t)) {
    return "Tala here. The placement team reviews briefs against the candidate pipeline — not an algorithm, not a directory search. The shortlist is built to fit the specific brief, which is why a clearer brief gets a faster, sharper response. Submit at /hire to start that.";
  }

  // ─── Data / privacy meta ───────────────────────────────────────────
  if (/(what (do|will) you do with.*(email|data|info)|privacy|gdpr|share my data|sell.*data|store.*data)/i.test(t)) {
    return "Tala here. When you leave an email through the capture form, it goes to the TGA Assist team for follow-up against the brief or application you submitted — not a marketing list, not third parties. The team will respond directly. If you want to talk to a human first, the form at /contact also works.";
  }

  // ─── Short / empty / nonsense input ────────────────────────────────
  if (t.length < 3 || /^[?\s.!,;:]+$/.test(t) || (t.replace(/\s/g, "").length >= 8 && /^[a-z]{8,}$/.test(t.replace(/\s/g, "")) && !/(tala|assist|tga|tanta|va|hire|apply)/i.test(t))) {
    return "Tala here. I didn't catch a specific question — which side are you on? Hiring a VA → /hire; applying as a VA → /apply. Tell me a bit more about what you're trying to figure out and I'll point you the right way.";
  }

  if (intent.highIntent) {
    return "Tala here. For a scoped conversation: employers submit at /hire, candidates apply at /apply. Pricing model is at /pricing, general contact at /contact. Which side are you on?";
  }

  return "Tala here, the placement guide for TantaGlobal Assist. TGA Assist places trained virtual assistants — candidates apply, complete TGA Academy certification, then enter the placement queue. Employers submit a role brief and we route a shortlist. Which side are you on — hiring a VA, or applying as one?";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const messages = Array.isArray(body?.messages) ? body.messages : [];

  if (!hasGatewayAccess()) {
    const reply = generateFallbackReply(getUserPrompt(messages));
    const stream = createUIMessageStream({
      originalMessages: messages,
      execute: ({ writer }) => {
        const id = crypto.randomUUID();
        writer.write({ type: "text-delta", delta: reply, id });
      },
    });

    return createUIMessageStreamResponse({ stream });
  }

  const modelMessages = await convertToModelMessages(messages);
  const result = streamText({
    model: TALA_MODEL,
    system: SYSTEM_PROMPT,
    messages: modelMessages,
    temperature: 0.3,
    maxOutputTokens: 450,
    onError: ({ error }) => {
      console.error("[tala] streamText error:", error);
    },
  });

  return result.toUIMessageStreamResponse({
    originalMessages: messages,
    generateMessageId: () => crypto.randomUUID(),
  });
}
