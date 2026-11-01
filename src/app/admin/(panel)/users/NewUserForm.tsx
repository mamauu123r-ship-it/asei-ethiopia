"use client";

import { useActionState } from "react";
import { createUser } from "@/app/actions/admin";
import { Field, FormMessage, SubmitButton } from "@/components/forms/fields";
import { initialFormState } from "@/lib/validation";

export function NewUserForm() {
  const [state, action] = useActionState(createUser, initialFormState);
  return (
    <form key={state.key} action={action} className="flex max-w-2xl flex-col gap-4 rounded-xl border border-line bg-white p-5">
      <FormMessage state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="full_name" label="Full name" state={state} required maxLength={120} />
        <Field name="email" label="Email" type="email" state={state} required />
        <Field
          name="role"
          label="Role"
          state={state}
          required
          options={[
            { value: "editor", label: "Editor" },
            { value: "project_manager", label: "Project Manager" },
            { value: "super_admin", label: "Super Admin" },
          ]}
        />
        <Field name="password" label="Temporary password" type="text" hint="At least 12 characters. Share it privately; they can change it after logging in." state={state} required minLength={12} maxLength={72} />
      </div>
      <SubmitButton pendingText="Adding...">Add administrator</SubmitButton>
    </form>
  );
}
