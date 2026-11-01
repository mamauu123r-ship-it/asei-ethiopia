import "server-only";
import { redirect } from "next/navigation";
import { createSessionClient } from "./supabase/server";

export type Role = "super_admin" | "editor" | "project_manager";

export type Staff = {
  id: string;
  full_name: string;
  email: string;
  role: Role;
};

export const roleLabels: Record<Role, string> = {
  super_admin: "Super Admin",
  editor: "Editor",
  project_manager: "Project Manager",
};

/** The logged-in staff member, or null. */
export async function getStaff(): Promise<Staff | null> {
  const supabase = await createSessionClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return null;
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("id", userData.user.id)
    .maybeSingle();
  return (data as Staff | null) ?? null;
}

/** Use at the top of every admin page and action. Sends others to the login page. */
export async function requireStaff(allowed?: Role[]): Promise<Staff> {
  const supabase = await createSessionClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) redirect("/admin/login");
  const staff = await getStaff();
  // Logged in, but not an ASEI administrator: sign them out.
  if (!staff) redirect("/admin/signout?reason=not-staff");
  if (allowed && !allowed.includes(staff.role)) redirect("/admin/dashboard?denied=1");
  return staff;
}

export async function logActivity(staff: Staff, action: string, entity: string, entityId?: string) {
  const supabase = await createSessionClient();
  const { error } = await supabase.from("activity_log").insert({
    user_id: staff.id,
    user_name: staff.full_name,
    action,
    entity,
    entity_id: entityId ?? null,
  });
  if (error) console.error("activity log failed", error.message);
}
