"use client";

import { useActionState } from "react";
import { submitPartnership } from "@/app/actions/forms";
import { initialFormState, PARTNER_CATEGORIES } from "@/lib/validation";
import { Field, FormMessage, SpamGuard, SubmitButton } from "./fields";

export function PartnershipForm() {
  const [state, action] = useActionState(submitPartnership, initialFormState);
  return (
    <form key={state.key} action={action} className="relative flex flex-col gap-5">
      <FormMessage state={state} />
      {state.status !== "success" && (
        <>
          <SpamGuard />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="organization" label="Organization name" state={state} required maxLength={160} autoComplete="organization" />
            <Field name="full_name" label="Contact person" state={state} required maxLength={120} autoComplete="name" />
            <Field name="email" label="Official email" type="email" state={state} required maxLength={200} autoComplete="email" />
            <Field name="country" label="Country" state={state} required maxLength={80} autoComplete="country-name" />
            <Field name="website" label="Organization website" type="text" state={state} maxLength={300} autoComplete="url" placeholder="www.example.org" />
            <Field name="partnership_category" label="Partnership category" state={state} required options={PARTNER_CATEGORIES} />
          </div>
          <Field
            name="proposed_collaboration"
            label="Proposed collaboration"
            hint="What would you like to do together?"
            state={state}
            required
            multiline
            rows={4}
            minLength={10}
            maxLength={2000}
          />
          <Field name="message" label="Message" state={state} required multiline minLength={10} maxLength={5000} />
          <SubmitButton>Send application</SubmitButton>
        </>
      )}
    </form>
  );
}
