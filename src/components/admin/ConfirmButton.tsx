"use client";

import type { ReactNode } from "react";
import { useFormStatus } from "react-dom";

/** A submit button that asks "Are you sure?" first. Put it inside a <form action={...}>. */
export function ConfirmButton({ message, children, className }: { message: string; children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
      className={className ?? "inline-flex h-10 items-center rounded-lg border border-[#A3271F] px-3 text-sm font-semibold text-[#A3271F] hover:bg-[#FBE4E2] disabled:opacity-60"}
    >
      {children}
    </button>
  );
}
