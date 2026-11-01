"use client";

import { useActionState } from "react";
import type { FormState } from "@/lib/validation";
import { FormMessage, SubmitButton } from "@/components/forms/fields";

type Select = { name: string; label: string; value: string; options: { value: string; label: string }[] };

/** Status, category and internal notes for inquiries and volunteer applications. */
export function StatusForm({
  action,
  selects,
  notes,
}: {
  action: (s: FormState, d: FormData) => Promise<FormState>;
  selects: Select[];
  notes: string;
}) {
  const [state, formAction] = useActionState(action, { status: "idle" } as FormState);
  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-xl border border-line bg-white p-5">
      <FormMessage state={state} />
      {selects.map((s) => (
        <div key={s.name} className="flex flex-col gap-1.5">
          <label htmlFor={`s-${s.name}`} className="font-semibold text-ink">{s.label}</label>
          <select id={`s-${s.name}`} name={s.name} defaultValue={s.value} className="rounded-lg border border-[#A9BAB4] bg-white px-3 py-2.5">
            {s.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="s-notes" className="font-semibold text-ink">Internal notes</label>
        <span className="text-sm text-muted">Only staff can see these notes.</span>
        <textarea id="s-notes" name="internal_notes" defaultValue={notes} rows={6} maxLength={5000} className="rounded-lg border border-[#A9BAB4] px-3 py-2.5" />
      </div>
      <SubmitButton pendingText="Saving...">Save</SubmitButton>
    </form>
  );
}
