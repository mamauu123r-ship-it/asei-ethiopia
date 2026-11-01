import "server-only";
import { createHash } from "crypto";
import { headers } from "next/headers";
import { createServiceClient } from "./supabase/admin";

const MAX_PER_HOUR = 5;
const MIN_SECONDS_TO_FILL = 3;

/**
 * Basic spam protection for public forms:
 * 1. a hidden "honeypot" field people never fill in, but bots often do,
 * 2. forms sent too fast after the page loaded are rejected,
 * 3. at most 5 submissions per hour per form from one network address.
 * Returns an error message, or null when the submission may continue.
 */
export async function checkSpam(form: string, data: FormData): Promise<string | null> {
  if (String(data.get("company_website") ?? "") !== "") return "Your message could not be sent.";

  const started = Number(data.get("started_at") ?? 0);
  if (!started || Date.now() - started < MIN_SECONDS_TO_FILL * 1000) {
    return "That was very fast. Please check the form and send it again.";
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "unknown";
  const salt = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const ipHash = createHash("sha256").update(ip + salt).digest("hex");

  const db = createServiceClient();
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await db
    .from("form_rate_limits")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .eq("form", form)
    .gte("created_at", since);
  if (error) console.error("rate limit check failed", error.message);
  if ((count ?? 0) >= MAX_PER_HOUR) {
    return "Too many submissions from your network. Please try again in an hour.";
  }
  await db.from("form_rate_limits").insert({ ip_hash: ipHash, form });
  // Remove old records so the table stays small.
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  await db.from("form_rate_limits").delete().lt("created_at", dayAgo);
  return null;
}
