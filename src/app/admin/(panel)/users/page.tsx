import type { Metadata } from "next";
import { changeRole, removeUser } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { AdminHeader, Table, formatDay } from "@/components/admin/ui";
import { requireStaff, roleLabels, type Role } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { NewUserForm } from "./NewUserForm";

export const metadata: Metadata = { title: "Users" };

export default async function UsersPage() {
  const me = await requireStaff(["super_admin"]);
  const db = await createSessionClient();
  const { data: users } = await db.from("profiles").select("*").order("created_at");

  return (
    <>
      <AdminHeader title="Users and permissions">
        Super Admin: everything. Editor: programs, news, publications, partners. Project Manager: projects and project inquiries.
      </AdminHeader>
      <Table head={["Name", "Email", "Role", "Added", "Actions"]}>
        {(users ?? []).map((u) => (
          <tr key={u.id}>
            <td className="px-4 py-3 font-semibold text-ink">{u.full_name}{u.id === me.id && " (you)"}</td>
            <td className="px-4 py-3">{u.email}</td>
            <td className="px-4 py-3">
              {u.id === me.id ? (
                roleLabels[u.role as Role]
              ) : (
                <form action={changeRole.bind(null, u.id)} className="flex items-center gap-2">
                  <label htmlFor={`role-${u.id}`} className="sr-only">Role for {u.full_name}</label>
                  <select id={`role-${u.id}`} name="role" defaultValue={u.role} className="rounded-lg border border-[#A9BAB4] bg-white px-2 py-2">
                    {Object.entries(roleLabels).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <button type="submit" className="h-10 rounded-lg border border-ink px-3 text-sm font-semibold text-ink">Change</button>
                </form>
              )}
            </td>
            <td className="px-4 py-3 text-muted">{formatDay(u.created_at)}</td>
            <td className="px-4 py-3">
              {u.id !== me.id && (
                <form action={removeUser.bind(null, u.id)}>
                  <ConfirmButton message={`Remove ${u.full_name}? They will no longer be able to log in.`}>Remove</ConfirmButton>
                </form>
              )}
            </td>
          </tr>
        ))}
      </Table>
      <h2 className="mb-3 mt-10 font-display text-xl font-bold text-ink">Add an administrator</h2>
      <NewUserForm />
    </>
  );
}
