import Link from "next/link";
import type { ReactNode } from "react";
import { Plus } from "lucide-react";

export function AdminHeader({ title, action, children }: { title: string; action?: { href: string; label: string }; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h1>
        {children && <div className="mt-1 text-muted">{children}</div>}
      </div>
      {action && (
        <Link href={action.href} className="inline-flex h-11 items-center gap-2 rounded-lg bg-ink px-4 font-bold text-white no-underline hover:bg-ink-deep">
          <Plus size={18} aria-hidden="true" /> {action.label}
        </Link>
      )}
    </div>
  );
}

const pill: Record<string, string> = {
  published: "bg-sage text-leaf",
  visible: "bg-sage text-leaf",
  draft: "bg-[#ECECEC] text-[#444]",
  hidden: "bg-[#ECECEC] text-[#444]",
  new: "bg-sun-pale text-sun-dark",
  pending: "bg-sky-pale text-sky-dark",
  reviewing: "bg-sky-pale text-sky-dark",
  resolved: "bg-sage text-leaf",
  accepted: "bg-sage text-leaf",
  declined: "bg-[#ECECEC] text-[#444]",
  subscribed: "bg-sage text-leaf",
  unsubscribed: "bg-[#ECECEC] text-[#444]",
};

export function Pill({ value }: { value: string }) {
  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[13px] font-bold ${pill[value] ?? "bg-iris-pale text-iris-dark"}`}>
      {value}
    </span>
  );
}

export function Notice({ kind = "ok", children }: { kind?: "ok" | "error"; children: ReactNode }) {
  return (
    <p role="status" className={`mb-5 rounded-xl p-4 font-semibold ${kind === "ok" ? "bg-sage text-leaf" : "bg-[#FBE4E2] text-[#A3271F]"}`}>
      {children}
    </p>
  );
}

export function Table({ head, children, empty }: { head: string[]; children: ReactNode; empty?: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-white">
      <table className="w-full min-w-[640px] text-left text-[15px]">
        <thead className="bg-mist text-sm text-muted">
          <tr>{head.map((h) => <th key={h} scope="col" className="px-4 py-3 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
      {empty}
    </div>
  );
}

export function EmptyRow({ text }: { text: string }) {
  return <p className="px-4 py-8 text-center text-muted">{text}</p>;
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Africa/Addis_Ababa" });
}

export function formatDay(iso: string | null | undefined) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Africa/Addis_Ababa" });
}
