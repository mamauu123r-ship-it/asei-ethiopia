import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { AdminHeader, EmptyRow, Notice, Pill, Table, formatDateTime } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Volunteer applications" };

export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  await requireStaff(["super_admin"]);
  const { deleted } = await searchParams;
  const db = await createSessionClient();
  const { data: rows } = await db
    .from("volunteer_applications")
    .select("id, full_name, country, area_of_interest, application_status, created_at")
    .order("created_at", { ascending: false })
    .limit(500);

  return (
    <>
      {deleted && <Notice>Application deleted.</Notice>}
      <AdminHeader title="Volunteer applications" />
      <div className="mb-5 flex justify-end">
        <a href="/admin/applications/export" className="inline-flex h-10 items-center gap-2 rounded-lg border border-ink px-3 text-sm font-semibold text-ink no-underline">
          <Download size={16} aria-hidden="true" /> Export CSV
        </a>
      </div>
      <Table head={["Name", "Country", "Area of interest", "Status", "Received"]} empty={(rows ?? []).length === 0 ? <EmptyRow text="No volunteer applications yet." /> : null}>
        {(rows ?? []).map((r) => (
          <tr key={r.id}>
            <td className="px-4 py-3"><Link href={`/admin/applications/${r.id}`} className="font-semibold">{r.full_name}</Link></td>
            <td className="px-4 py-3">{r.country}</td>
            <td className="px-4 py-3">{r.area_of_interest}</td>
            <td className="px-4 py-3"><Pill value={r.application_status} /></td>
            <td className="px-4 py-3 text-muted">{formatDateTime(r.created_at)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}
