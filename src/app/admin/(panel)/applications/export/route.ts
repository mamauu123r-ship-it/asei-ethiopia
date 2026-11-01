import { getStaff } from "@/lib/auth";
import { csvResponse, toCsv } from "@/lib/csv";
import { createSessionClient } from "@/lib/supabase/server";

export async function GET() {
  const staff = await getStaff();
  if (staff?.role !== "super_admin") return new Response("Not allowed", { status: 403 });
  const db = await createSessionClient();
  const { data, error } = await db.from("volunteer_applications").select("*").order("created_at", { ascending: false });
  if (error) return new Response("Export failed", { status: 500 });
  const cols = ["created_at", "application_status", "full_name", "email", "country", "education", "professional_background", "skills", "area_of_interest", "experience", "internal_notes"];
  return csvResponse(toCsv(data ?? [], cols), "asei-volunteers");
}
