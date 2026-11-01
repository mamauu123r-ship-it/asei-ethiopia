"use client";

import { useActionState } from "react";
import { changeOwnPassword } from "@/app/actions/admin";
import { FormMessage, SubmitButton } from "@/components/forms/fields";
import { initialFormState } from "@/lib/validation";

const box = "w-full rounded-lg border border-[#A9BAB4] bg-white px-3 py-2.5";

export function PasswordForm() {
  const [state, action] = useActionState(changeOwnPassword, initialFormState);
  return (
    <form key={state.key} action={action} className="flex max-w-md flex-col gap-4 rounded-xl border border-line bg-white p-5">
      <FormMessage state={state} />
      <label className="flex flex-col gap-1.5 font-semibold text-ink">New password<input name="password" type="password" required minLength={12} autoComplete="new-password" className={box} /></label>
      <label className="flex flex-col gap-1.5 font-semibold text-ink">Repeat new password<input name="confirm" type="password" required minLength={12} autoComplete="new-password" className={box} /></label>
      <span className="text-sm text-muted">At least 12 characters.</span>
      <SubmitButton pendingText="Saving...">Change password</SubmitButton>
    </form>
  );
}
