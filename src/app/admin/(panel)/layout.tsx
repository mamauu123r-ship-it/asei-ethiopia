import Link from "next/link";
import { LogOut } from "lucide-react";
import { signOut } from "@/app/actions/admin";
import { AdminNav } from "@/components/admin/AdminNav";
import { LogoMark } from "@/components/Logo";
import { requireStaff, roleLabels } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const staff = await requireStaff();
  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="flex flex-col gap-6 bg-ink p-4 text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto lg:p-5">
        <Link href="/admin/dashboard" className="flex items-center gap-3 text-white no-underline">
          <LogoMark variant="light" size={36} />
          <span className="font-display text-lg font-bold">ASEI Admin</span>
        </Link>
        <AdminNav role={staff.role} />
        <div className="mt-auto flex flex-col gap-2 border-t border-white/15 pt-4 text-sm">
          <span className="font-semibold">{staff.full_name}</span>
          <span className="text-haze">{roleLabels[staff.role]}</span>
          <div className="flex flex-wrap gap-2">
            <Link href="/" className="text-haze hover:text-white">View website</Link>
            <span aria-hidden="true">·</span>
            <Link href="/admin/settings/password" className="text-haze hover:text-white">Change password</Link>
          </div>
          <form action={signOut}>
            <button type="submit" className="mt-1 inline-flex h-10 items-center gap-2 rounded-lg border border-white/30 px-3 font-semibold text-white hover:bg-white/10">
              <LogOut size={16} aria-hidden="true" /> Log out
            </button>
          </form>
        </div>
      </aside>
      <main id="main" className="min-w-0 flex-1 p-5 sm:p-8">{children}</main>
    </div>
  );
}
