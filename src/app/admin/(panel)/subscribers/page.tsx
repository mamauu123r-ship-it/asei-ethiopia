import type { Metadata } from "next";
import { Download } from "lucide-react";
import { deleteSubscriber } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { AdminHeader, EmptyRow, Pill, Table, formatDateTime } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Newsletter subscribers" };

export default async function SubscribersPage() {
  await requireStaff(["super_admin"]);
  const db = await createSessionClient();
  const { data: rows } = await db.from("newsletter_subscribers").select("*").order("subscribed_at", { ascending: false }).limit(2000);
  const active = (rows ?? []).filter((r) => r.subscription_status === "subscribed").length;

  return (
    <>
      <AdminHeader title="Newsletter subscribers">{active} active subscribers. Each one agreed to receive emails; their consent is recorded.</AdminHeader>
      <div className="mb-5 flex justify-end">
        <a href="/admin/subscribers/export" className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink px-3 text-sm font-semibold text-ink no-underline">
          <Download size={16} aria-hidden="true" /> Export active subscribers (CSV)
        </a>
      </div>
      <Table head={["Email", "Status", "Consent given", "Actions"]} empty={(rows ?? []).length === 0 ? <EmptyRow text="No subscribers yet." /> : null}>
        {(rows ?? []).map((r) => (
          <tr key={r.id}>
            <td className="px-4 py-3 font-semibold text-ink">{r.email}</td>
            <td className="px-4 py-3"><Pill value={r.subscription_status} /></td>
            <td className="px-4 py-3 text-muted">{formatDateTime(r.consent_at)}</td>
            <td className="px-4 py-3">
              <form action={deleteSubscriber.bind(null, r.id)}>
                <ConfirmButton message={`Permanently delete ${r.email}? Use this only if they asked for their data to be deleted.`}>Delete</ConfirmButton>
              </form>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
