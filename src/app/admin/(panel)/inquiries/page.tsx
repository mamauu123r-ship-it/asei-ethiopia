import type { Metadata } from "next";
import Link from "next/link";
import { Download } from "lucide-react";
import { AdminHeader, EmptyRow, Notice, Pill, Table, formatDateTime } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Inquiries" };

const STATUSES = ["all", "new", "pending", "resolved"];
const TYPES = ["all", "general", "partnership", "project", "media", "other"];

type Props = { searchParams: Promise<{ status?: string; type?: string; deleted?: string }> };

export default async function InquiriesPage({ searchParams }: Props) {
  await requireStaff(["super_admin", "project_manager"]);
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status ?? "") ? sp.status! : "all";
  const type = TYPES.includes(sp.type ?? "") ? sp.type! : "all";

  const db = await createSessionClient();
  let q = db.from("inquiries").select("id, full_name, organization, subject, inquiry_type, inquiry_status, created_at").order("created_at", { ascending: false }).limit(500);
  if (status !== "all") q = q.eq("inquiry_status", status);
  if (type !== "all") q = q.eq("inquiry_type", type);
  const { data: rows } = await q;

  const link = (s: string, t: string) => `/admin/inquiries?status=${s}&type=${t}`;
  const exportHref = `/admin/inquiries/export?status=${status}&type=${type}`;

  return (
    <>
      {sp.deleted && <Notice>Inquiry deleted.</Notice>}
      <AdminHeader title="Inquiries">Messages from the contact form and partnership applications.</AdminHeader>
      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <FilterGroup label="Status" items={STATUSES.map((s) => ({ label: s, href: link(s, type), active: s === status }))} />
        <FilterGroup label="Type" items={TYPES.map((t) => ({ label: t, href: link(status, t), active: t === type }))} />
        <a href={exportHref} className="ml-auto inline-flex h-10 items-center gap-2 rounded-lg border border-ink px-3 text-sm font-semibold text-ink no-underline">
          <Download size={16} aria-hidden="true" /> Export CSV
        </a>
      </div>
      <Table head={["From", "Subject", "Type", "Status", "Received"]} empty={(rows ?? []).length === 0 ? <EmptyRow text="No inquiries match these filters." /> : null}>
        {(rows ?? []).map((r) => (
          <tr key={r.id}>
            <td className="px-4 py-3">
              <Link href={`/admin/inquiries/${r.id}`} className="font-semibold">{r.full_name}</Link>
              {r.organization && <div className="text-sm text-muted">{r.organization}</div>}
            </td>
            <td className="px-4 py-3">{r.subject}</td>
            <td className="px-4 py-3 capitalize">{r.inquiry_type}</td>
            <td className="px-4 py-3"><Pill value={r.inquiry_status} /></td>
            <td className="px-4 py-3 text-muted">{formatDateTime(r.created_at)}</td>
          </tr>
        ))}
      </Table>
    </>
  );
}

function FilterGroup({ label, items }: { label: string; items: { label: string; href: string; active: boolean }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5 text-sm">
      <span className="font-semibold text-muted">{label}:</span>
      {items.map((i) => (
        <Link key={i.label} href={i.href} aria-current={i.active ? "true" : undefined} className={`rounded-full px-3 py-1.5 capitalize no-underline ${i.active ? "bg-ink text-white" : "bg-white text-ink"}`}>
          {i.label}
        </Link>
      ))}
    </div>
  );
}
