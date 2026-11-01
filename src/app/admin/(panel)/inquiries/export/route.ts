import { getStaff } from "@/lib/auth";
import { csvResponse, toCsv } from "@/lib/csv";
import { createSessionClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const staff = await getStaff();
  if (!staff || !["super_admin", "project_manager"].includes(staff.role)) {
    return new Response("Not allowed", { status: 403 });
  }
  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? "all";
  const type = url.searchParams.get("type") ?? "all";
  const db = await createSessionClient();
  // The database rules decide which inquiries this person may export.
  let q = db.from("inquiries").select("*").order("created_at", { ascending: false });
  if (["new", "pending", "resolved"].includes(status)) q = q.eq("inquiry_status", status);
  if (["general", "partnership", "project", "media", "other"].includes(type)) q = q.eq("inquiry_type", type);
  const { data, error } = await q;
  if (error) return new Response("Export failed", { status: 500 });
  const cols = ["created_at", "inquiry_type", "inquiry_status", "full_name", "email", "organization", "country", "subject", "message", "website", "partnership_category", "proposed_collaboration", "internal_notes"];
  return csvResponse(toCsv(data ?? [], cols), "asei-inquiries");
}
