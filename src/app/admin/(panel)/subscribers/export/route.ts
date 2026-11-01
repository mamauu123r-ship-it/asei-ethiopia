import { getStaff } from "@/lib/auth";
import { csvResponse, toCsv } from "@/lib/csv";
import { site } from "@/lib/site";
import { createSessionClient } from "@/lib/supabase/server";

export async function GET() {
  const staff = await getStaff();
  if (staff?.role !== "super_admin") return new Response("Not allowed", { status: 403 });
  const db = await createSessionClient();
  const { data, error } = await db
    .from("newsletter_subscribers")
    .select("email, subscribed_at, consent_at, consent_text, unsubscribe_token")
    .eq("subscription_status", "subscribed")
    .order("subscribed_at");
  if (error) return new Response("Export failed", { status: 500 });
  const rows = (data ?? []).map((r) => ({ ...r, unsubscribe_link: `${site.url}/unsubscribe?token=${r.unsubscribe_token}` }));
  return csvResponse(toCsv(rows, ["email", "subscribed_at", "consent_at", "consent_text", "unsubscribe_link"]), "asei-subscribers");
}
