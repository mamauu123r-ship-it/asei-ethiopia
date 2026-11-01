import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { deleteApplication, updateApplication } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { StatusForm } from "@/components/admin/StatusForm";
import { formatDateTime } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Volunteer application" };

export default async function ApplicationPage({ params }: { params: Promise<{ id: string }> }) {
  await requireStaff(["super_admin"]);
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = await createSessionClient();
  const { data: r } = await db.from("volunteer_applications").select("*").eq("id", id).maybeSingle();
  if (!r) notFound();

  const sections: [string, string][] = [
    ["Education", r.education],
    ["Professional background", r.professional_background],
    ["Skills", r.skills],
    ["Relevant experience", r.experience],
  ];

  return (
    <>
      <Link href="/admin/applications" className="mb-4 inline-flex items-center gap-1 font-semibold"><ChevronLeft size={18} aria-hidden="true" /> All applications</Link>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">{r.full_name}</h1>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5 rounded-xl border border-line bg-white p-6">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <div><dt className="text-sm text-muted">Email</dt><dd className="break-words font-semibold"><a href={`mailto:${r.email}`}>{r.email}</a></dd></div>
            <div><dt className="text-sm text-muted">Country</dt><dd className="font-semibold text-ink">{r.country}</dd></div>
            <div><dt className="text-sm text-muted">Area of interest</dt><dd className="font-semibold text-ink">{r.area_of_interest}</dd></div>
            <div><dt className="text-sm text-muted">Received</dt><dd className="font-semibold text-ink">{formatDateTime(r.created_at)}</dd></div>
          </dl>
          {sections.map(([k, v]) => (
            <div key={k}>
              <h2 className="text-sm font-semibold text-muted">{k}</h2>
              <p className="mt-1 whitespace-pre-wrap">{v}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          <StatusForm
            action={updateApplication.bind(null, r.id)}
            notes={r.internal_notes}
            selects={[{ name: "application_status", label: "Status", value: r.application_status, options: ["new", "reviewing", "accepted", "declined"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })) }]}
          />
          <form action={deleteApplication.bind(null, r.id)}>
            <ConfirmButton message="Delete this application permanently?">Delete application</ConfirmButton>
          </form>
        </div>
      </div>
    </>
  );
}
