"use client";

import { useActionState } from "react";
import { unsubscribe } from "@/app/actions/forms";
import { FormMessage, SubmitButton } from "@/components/forms/fields";
import { initialFormState } from "@/lib/validation";

export function UnsubscribeForm({ token }: { token: string }) {
  const [state, action] = useActionState(unsubscribe, initialFormState);
  return (
    <form action={action} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <FormMessage state={state} />
      {state.status !== "success" && <SubmitButton pendingText="Unsubscribing...">Unsubscribe</SubmitButton>}
    </form>
  );
}
