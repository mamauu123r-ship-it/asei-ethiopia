"use client";

import { useActionState } from "react";
import { subscribeNewsletter } from "@/app/actions/forms";
import { initialFormState } from "@/lib/validation";
import { FormMessage, SpamGuard, SubmitButton } from "./forms/fields";

export function NewsletterForm() {
  const [state, action] = useActionState(subscribeNewsletter, initialFormState);
  const err = state.errors ?? {};
  return (
    <form key={state.key} action={action} className="relative flex flex-col gap-3">
      <FormMessage state={state} />
      {state.status !== "success" && (
        <>
          <SpamGuard />
          <label htmlFor="nl-email" className="font-semibold text-ink">
            Email address
          </label>
          <div className="flex flex-wrap gap-2.5">
            <input
              id="nl-email"
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              defaultValue={state.values?.email ?? ""}
              placeholder="you@example.org"
              aria-invalid={err.email ? true : undefined}
              aria-describedby={err.email ? "nl-email-err" : undefined}
              className="h-[52px] min-w-0 flex-[1_1_240px] rounded-[10px] border border-[#A9BAB4] bg-white px-4"
            />
            <SubmitButton pendingText="Subscribing...">Subscribe</SubmitButton>
          </div>
          {err.email && <span id="nl-email-err" className="text-[15px] font-semibold text-[#A3271F]">{err.email}</span>}
          <label className="flex items-start gap-2.5 text-[15px]">
            <input name="consent" type="checkbox" required defaultChecked={state.values?.consent === "on"} className="mt-1 h-5 w-5 accent-leaf" />
            <span>
              I agree to receive email updates from ASEI and accept the{" "}
              <a href="/privacy-policy">Privacy Policy</a>.
            </span>
          </label>
          {err.consent && <span className="text-[15px] font-semibold text-[#A3271F]">{err.consent}</span>}
        </>
      )}
    </form>
  );
}
