// Shared server-side Supabase helpers for API routes.
//
// - createAdminClient: lazy-imports supabase-js (keeps cold starts small) and gives
//   tests a seam to inject a stubbed client.
// - logDbError / logDbException: surface Supabase `{ error }` results that the routes
//   used to ignore. They log ONLY the route name, table, operation and the error code
//   (plus the message when it cannot embed submitted values). Never request bodies or
//   personal data.

type Factory = (url: string, key: string, options?: unknown) => unknown;
let override: Factory | null = null;

// Test-only seam.
export function __setClientFactoryForTests(factory: Factory | null): void {
  override = factory;
}

export async function createAdminClient(
  url: string,
  key: string,
  options?: Record<string, unknown>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (override) return override(url, key, options);
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, key, options);
}

export type DbErrorLike = { code?: string | null; message?: string | null } | null | undefined;

export function logDbError(
  route: string,
  table: string,
  operation: string,
  error: DbErrorLike,
): void {
  if (!error) return;
  const code = error.code ?? "unknown";
  // Class 22 (data exception) messages quote the offending value: omit them.
  const message =
    typeof error.code === "string" && error.code.startsWith("22")
      ? "(omitted)"
      : String(error.message ?? "").slice(0, 200);
  console.error(
    `[${route}] Supabase ${operation} failed table=${table} code=${code} message=${message}`,
  );
}

export function logDbException(
  route: string,
  table: string,
  operation: string,
  err: unknown,
): void {
  const message = err instanceof Error ? err.message.slice(0, 200) : typeof err;
  console.error(
    `[${route}] Supabase ${operation} threw table=${table} message=${message}`,
  );
}
