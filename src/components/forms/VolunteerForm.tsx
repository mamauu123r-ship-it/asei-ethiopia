"use client";

import { useActionState } from "react";
import { submitVolunteer } from "@/app/actions/forms";
import { initialFormState } from "@/lib/validation";
import { Field, FormMessage, SpamGuard, SubmitButton } from "./fields";

export function VolunteerForm({ areas }: { areas: string[] }) {
  const [state, action] = useActionState(submitVolunteer, initialFormState);
  return (
    <form key={state.key} action={action} className="relative flex flex-col gap-5">
      <FormMessage state={state} />
      {state.status !== "success" && (
        <>
          <SpamGuard />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="full_name" label="Full name" state={state} required maxLength={120} autoComplete="name" />
            <Field name="email" label="Email" type="email" state={state} required maxLength={200} autoComplete="email" />
            <Field name="country" label="Country" state={state} required maxLength={80} autoComplete="country-name" />
            <Field name="area_of_interest" label="Area of interest" state={state} required options={[...areas, "Communications and fundraising", "Other"]} />
          </div>
          <Field name="education" label="Education" hint="Your highest qualification and field of study." state={state} required maxLength={500} />
          <Field name="professional_background" label="Professional background" state={state} required multiline rows={3} maxLength={1000} />
          <Field name="skills" label="Skills" hint="For example: solar installation, teaching, research, design." state={state} required multiline rows={3} maxLength={1000} />
          <Field name="experience" label="Relevant experience" state={state} required multiline rows={4} maxLength={3000} />
          <SubmitButton>Send application</SubmitButton>
        </>
      )}
    </form>
  );
}
