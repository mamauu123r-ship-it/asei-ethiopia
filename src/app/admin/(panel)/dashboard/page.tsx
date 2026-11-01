import type { Metadata } from "next";
import Link from "next/link";
import { AdminHeader, Notice, formatDateTime } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { PROJECT_STATUSES } from "@/lib/types";

export const metadata: Metadata = { title: "Dashboard" };

type Props = { searchParams: Promise<{ denied?: string }> };

export default async function DashboardPage({ searchParams }: Props) {
  const staff = await requireStaff();
  const { denied } = await searchParams;
  const db = await createSessionClient();
  const isSuper = staff.role === "super_admin";
  const seesProjects = isSuper || staff.role === "project_manager";
  const seesInquiries = seesProjects;

  const count = async (table: string, filter?: [string, string]) => {
    let q = db.from(table).select("id", { count: "exact", head: true });
    if (filter) q = q.eq(filter[0], filter[1]);
    const { count } = await q;
    return count ?? 0;
  };

  const [projects, programs, inquiries, volunteers, subscribers, projectRows, inquiryRows, activity] = await Promise.all([
    count("projects"),
    count("programs", ["status", "published"]),
    seesInquiries ? count("inquiries") : Promise.resolve(0),
    isSuper ? count("volunteer_applications") : Promise.resolve(0),
    isSuper ? count("newsletter_subscribers", ["subscription_status", "subscribed"]) : Promise.resolve(0),
    db.from("projects").select("project_status"),
    seesInquiries ? db.from("inquiries").select("inquiry_status, inquiry_type") : Promise.resolve({ data: [] as { inquiry_status: string; inquiry_type: string }[] }),
    db.from("activity_log").select("*").order("created_at", { ascending: false }).limit(10),
  ]);

  const cards = [
    { label: "Total projects", value: projects, href: "/admin/projects", show: true },
    { label: "Published programs", value: programs, href: "/admin/programs", show: true },
    { label: "Total inquiries", value: inquiries, href: "/admin/inquiries", show: seesInquiries },
    { label: "Volunteer applications", value: volunteers, href: "/admin/applications", show: isSuper },
    { label: "Newsletter subscribers", value: subscribers, href: "/admin/subscribers", show: isSuper },
  ].filter((c) => c.show);

  const byStatus = PROJECT_STATUSES.map((s) => ({
    label: s,
    value: (projectRows.data ?? []).filter((r: { project_status: string }) => r.project_status === s).length,
  }));
  const inq = inquiryRows.data ?? [];
  const byInquiry = ["new", "pending", "resolved"].map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: inq.filter((r) => r.inquiry_status === s).length }));
  const byType = ["general", "partnership", "project", "media", "other"].map((s) => ({ label: s[0].toUpperCase() + s.slice(1), value: inq.filter((r) => r.inquiry_type === s).length }));

  return (
    <>
      {denied && <Notice kind="error">You do not have permission to open that page.</Notice>}
      <AdminHeader title={`Welcome, ${staff.full_name.split(" ")[0]}`}>Here is an overview of the website.</AdminHeader>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className="flex flex-col gap-1 rounded-xl border border-line bg-white p-5 no-underline hover:border-leaf">
            <span className="font-display text-3xl font-bold text-ink">{c.value.toLocaleString("en")}</span>
            <span className="text-muted">{c.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        {seesProjects && <BarChart title="Projects by status" rows={byStatus} />}
        {seesInquiries && <BarChart title="Inquiries by status" rows={byInquiry} />}
        {seesInquiries && <BarChart title="Inquiries by type" rows={byType} />}

        <section className="rounded-xl border border-line bg-white p-5">
          <h2 className="mb-4 font-display text-lg font-semibold text-ink">Recent activity</h2>
          {(activity.data ?? []).length === 0 ? (
            <p className="text-muted">No activity yet. Changes made by administrators will appear here.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-line text-[15px]">
              {(activity.data ?? []).map((a) => (
                <li key={a.id} className="flex flex-wrap justify-between gap-2 py-2.5">
                  <span>
                    <strong className="text-ink">{a.user_name ?? "Someone"}</strong> {a.action} a {a.entity}
                  </span>
                  <span className="text-muted">{formatDateTime(a.created_at)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

function BarChart({ title, rows }: { title: string; rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section className="rounded-xl border border-line bg-white p-5">
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">{title}</h2>
      <dl className="flex flex-col gap-3">
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-[130px_1fr_40px] items-center gap-3 text-[15px]">
            <dt className="text-muted">{r.label}</dt>
            <dd className="h-3 overflow-hidden rounded-full bg-mist" aria-hidden="true">
              <div className="h-full rounded-full bg-leaf" style={{ width: `${(r.value / max) * 100}%` }} />
            </dd>
            <dd className="text-right font-semibold text-ink">{r.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
