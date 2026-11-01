"use client";

import { useActionState } from "react";
import { signIn } from "@/app/actions/admin";
import { FormMessage, SubmitButton } from "@/components/forms/fields";
import { initialFormState } from "@/lib/validation";

export function LoginForm() {
  const [state, action] = useActionState(signIn, initialFormState);
  return (
    <form action={action} className="flex flex-col gap-4">
      <FormMessage state={state} />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="font-semibold text-ink">Email</label>
        <input id="email" name="email" type="email" required autoComplete="username" defaultValue={state.values?.email} className="h-12 rounded-lg border border-[#A9BAB4] px-3" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="font-semibold text-ink">Password</label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="h-12 rounded-lg border border-[#A9BAB4] px-3" />
      </div>
      <SubmitButton pendingText="Logging in...">Log in</SubmitButton>
    </form>
  );
}
