"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions/forms";
import { initialFormState } from "@/lib/validation";
import { Field, FormMessage, SpamGuard, SubmitButton } from "./fields";

const types = [
  { value: "general", label: "General question" },
  { value: "project", label: "A project" },
  { value: "media", label: "Media or press" },
  { value: "other", label: "Something else" },
];

export function ContactForm() {
  const [state, action] = useActionState(submitContact, initialFormState);
  return (
    <form key={state.key} action={action} className="relative flex flex-col gap-5">
      <FormMessage state={state} />
      {state.status !== "success" && (
        <>
          <SpamGuard />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="full_name" label="Full name" state={state} required maxLength={120} autoComplete="name" />
            <Field name="email" label="Email" type="email" state={state} required maxLength={200} autoComplete="email" />
            <Field name="organization" label="Organization" state={state} maxLength={160} autoComplete="organization" />
            <Field name="country" label="Country" state={state} maxLength={80} autoComplete="country-name" />
          </div>
          <Field name="inquiry_type" label="What is it about?" state={state} options={types} />
          <Field name="subject" label="Subject" state={state} required maxLength={160} />
          <Field name="message" label="Message" state={state} required multiline minLength={10} maxLength={5000} />
          <SubmitButton>Send message</SubmitButton>
        </>
      )}
    </form>
  );
}
