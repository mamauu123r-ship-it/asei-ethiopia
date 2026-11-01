"use client";

import { useActionState, useState } from "react";
import { uploadMedia } from "@/app/actions/admin";
import { FormMessage, SubmitButton } from "@/components/forms/fields";
import { initialFormState } from "@/lib/validation";

export function UploadForm() {
  const [state, action] = useActionState(uploadMedia, initialFormState);
  return (
    <form key={state.key} action={action} className="flex flex-col gap-3 rounded-xl border border-line bg-white p-5">
      <FormMessage state={state} />
      <label htmlFor="file" className="font-semibold text-ink">Upload a file</label>
      <span className="text-sm text-muted">Photos: JPG, PNG or WebP up to 5 MB. Documents: PDF up to 20 MB.</span>
      <div className="flex flex-wrap items-center gap-3">
        <input id="file" name="file" type="file" required accept="image/jpeg,image/png,image/webp,application/pdf" />
        <SubmitButton pendingText="Uploading...">Upload</SubmitButton>
      </div>
    </form>
  );
}

export function CopyLink({ url }: { url: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(url);
        setDone(true);
        setTimeout(() => setDone(false), 2000);
      }}
      className="inline-flex h-10 items-center rounded-lg border border-line px-3 text-sm font-semibold text-ink hover:bg-mist"
    >
      {done ? "Link copied" : "Copy link"}
    </button>
  );
}
