import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/Logo";
import { supabaseConfigured } from "@/lib/env";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = { title: "Log in" };

type Props = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="flex w-full max-w-md flex-col gap-6 rounded-2xl border border-line bg-white p-8">
        <Link href="/" className="flex items-center gap-3 text-ink no-underline">
          <LogoMark />
          <span className="font-display text-xl font-bold">ASEI Admin</span>
        </Link>
        <h1 className="font-display text-2xl font-bold text-ink">Log in</h1>
        {!supabaseConfigured && (
          <p className="rounded-xl bg-sun-pale p-4 font-semibold text-sun-dark">
            The database is not connected yet. Add the Supabase settings to .env.local (see the setup guide).
          </p>
        )}
        {error === "not-staff" && (
          <p role="alert" className="rounded-xl bg-[#FBE4E2] p-4 font-semibold text-[#A3271F]">
            This account does not have administrator access. Ask a super admin to add you.
          </p>
        )}
        <LoginForm />
        <p className="text-sm text-muted">Administrator accounts are created by a super admin. There is no public sign-up.</p>
      </div>
    </div>
  );
}
