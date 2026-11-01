import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { deleteInquiry, updateInquiry } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { StatusForm } from "@/components/admin/StatusForm";
import { formatDateTime } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Inquiry" };

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["super_admin", "project_manager"]);
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const db = await createSessionClient();
  const { data: r } = await db.from("inquiries").select("*").eq("id", id).maybeSingle();
  if (!r) notFound();

  const details: [string, string | null][] = [
    ["Name", r.full_name],
    ["Email", r.email],
    ["Organization", r.organization],
    ["Country", r.country],
    ["Website", r.website],
    ["Partnership category", r.partnership_category],
    ["Received", formatDateTime(r.created_at)],
  ];

  return (
    <>
      <Link href="/admin/inquiries" className="mb-4 inline-flex items-center gap-1 font-semibold"><ChevronLeft size={18} aria-hidden="true" /> All inquiries</Link>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink">{r.subject ?? "Inquiry"}</h1>
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="flex flex-col gap-5 rounded-xl border border-line bg-white p-6">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            {details.filter(([, v]) => v).map(([k, v]) => (
              <div key={k}>
                <dt className="text-sm text-muted">{k}</dt>
                <dd className="break-words font-semibold text-ink">{k === "Email" ? <a href={`mailto:${v}`}>{v}</a> : v}</dd>
              </div>
            ))}
          </dl>
          {r.proposed_collaboration && (
            <div>
              <h2 className="text-sm font-semibold text-muted">Proposed collaboration</h2>
              <p className="mt-1 whitespace-pre-wrap">{r.proposed_collaboration}</p>
            </div>
          )}
          <div>
            <h2 className="text-sm font-semibold text-muted">Message</h2>
            <p className="mt-1 whitespace-pre-wrap">{r.message}</p>
          </div>
          <a href={`mailto:${r.email}?subject=${encodeURIComponent("Re: " + (r.subject ?? "Your message to ASEI"))}`} className="inline-flex h-11 items-center self-start rounded-lg bg-ink px-4 font-bold text-white no-underline">Reply by email</a>
        </div>
        <div className="flex flex-col gap-4">
          <StatusForm
            action={updateInquiry.bind(null, r.id)}
            notes={r.internal_notes}
            selects={[
              { name: "inquiry_status", label: "Status", value: r.inquiry_status, options: [{ value: "new", label: "New" }, { value: "pending", label: "Pending" }, { value: "resolved", label: "Resolved" }] },
              { name: "inquiry_type", label: "Category", value: r.inquiry_type, options: ["general", "partnership", "project", "media", "other"].map((v) => ({ value: v, label: v[0].toUpperCase() + v.slice(1) })) },
            ]}
          />
          {staff.role === "super_admin" && (
            <form action={deleteInquiry.bind(null, r.id)}>
              <ConfirmButton message="Delete this inquiry permanently?">Delete inquiry</ConfirmButton>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
