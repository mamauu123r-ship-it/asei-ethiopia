"use client";

import { useActionState } from "react";
import { FileText } from "lucide-react";
import type { Field } from "@/lib/admin/entities";
import type { FormState } from "@/lib/validation";
import { FormMessage, SubmitButton } from "@/components/forms/fields";

type Props = {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  fields: Field[];
  initial: Record<string, string>;
  cancelHref: string;
};

const box = "w-full rounded-lg border border-[#A9BAB4] bg-white px-3 py-2.5 text-[16px] text-ink";

export function EntityForm({ action, fields, initial, cancelHref }: Props) {
  const [state, formAction] = useActionState(action, { status: "idle" } as FormState);
  const values = state.values ?? initial;

  return (
    <form key={state.key} action={formAction} className="flex flex-col gap-6">
      <FormMessage state={state} />
      <div className="grid gap-6 rounded-xl border border-line bg-white p-5 sm:p-7 md:grid-cols-2">
        {fields.map((f) => {
          const id = `e-${f.name}`;
          const error = state.errors?.[f.name];
          const value = values[f.name] ?? f.defaultValue ?? "";
          const wide = f.wide || ["markdown", "textarea", "tags", "image", "document"].includes(f.type);
          return (
            <div key={f.name} className={`flex flex-col gap-1.5 ${wide ? "md:col-span-2" : ""}`}>
              <label htmlFor={id} className="font-semibold text-ink">
                {f.label}
                {f.required && <span className="text-[#A3271F]"> *</span>}
              </label>
              {f.hint && <span id={`${id}-hint`} className="text-sm text-muted">{f.hint}</span>}
              {f.type === "markdown" && (
                <span className="text-sm text-muted">
                  Formatting: <code>## Heading</code>, <code>**bold**</code>, <code>- list item</code>, <code>[link text](https://...)</code>. Leave a blank line between paragraphs.
                </span>
              )}
              <Input field={f} id={id} value={value} />
              {error && <span className="text-sm font-semibold text-[#A3271F]">{error}</span>}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton pendingText="Saving...">Save</SubmitButton>
        <a href={cancelHref} className="inline-flex h-[52px] items-center px-4 font-semibold">Cancel</a>
      </div>
    </form>
  );
}

function Input({ field: f, id, value }: { field: Field; id: string; value: string }) {
  const describedBy = f.hint ? `${id}-hint` : undefined;
  switch (f.type) {
    case "textarea":
      return <textarea id={id} name={f.name} defaultValue={value} rows={3} maxLength={f.max} required={f.required} aria-describedby={describedBy} className={box} />;
    case "markdown":
      return <textarea id={id} name={f.name} defaultValue={value} rows={14} maxLength={f.max} required={f.required} aria-describedby={describedBy} className={`${box} font-mono text-[15px]`} />;
    case "tags":
      return <textarea id={id} name={f.name} defaultValue={value} rows={5} aria-describedby={describedBy} className={box} />;
    case "select":
      return (
        <select id={id} name={f.name} defaultValue={value} required={f.required} aria-describedby={describedBy} className={box}>
          {!f.required && <option value="">None</option>}
          {(f.options ?? []).map((o) =>
            typeof o === "string" ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>,
          )}
        </select>
      );
    case "date":
      return <input id={id} name={f.name} type="date" defaultValue={value} required={f.required} aria-describedby={describedBy} className={box} />;
    case "datetime":
      return <input id={id} name={f.name} type="datetime-local" defaultValue={value} required={f.required} aria-describedby={describedBy} className={box} />;
    case "number":
      return <input id={id} name={f.name} type="text" inputMode="decimal" defaultValue={value} aria-describedby={describedBy} className={box} />;
    case "int":
      return <input id={id} name={f.name} type="number" step={1} defaultValue={value} aria-describedby={describedBy} className={box} />;
    case "url":
      return <input id={id} name={f.name} type="url" defaultValue={value} maxLength={f.max} placeholder="https://" aria-describedby={describedBy} className={box} />;
    case "image":
    case "document":
      return (
        <div className="flex flex-col gap-3">
          <input type="hidden" name={f.name} value={value} />
          {value && (
            <div className="flex flex-wrap items-center gap-4">
              {f.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={value} alt="Current file" className="h-24 w-36 rounded-lg border border-line object-cover" />
              ) : (
                <a href={value} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-semibold">
                  <FileText size={18} aria-hidden="true" /> Open current PDF
                </a>
              )}
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name={`${f.name}__remove`} className="h-4 w-4" /> Remove
              </label>
            </div>
          )}
          <input
            id={id}
            name={`${f.name}__file`}
            type="file"
            accept={f.type === "image" ? "image/jpeg,image/png,image/webp" : "application/pdf"}
            className="text-[15px]"
          />
          <span className="text-sm text-muted">
            {f.type === "image" ? "JPG, PNG or WebP, up to 5 MB." : "PDF, up to 20 MB."} {value ? "Choosing a new file replaces the current one." : ""}
          </span>
        </div>
      );
    default:
      return <input id={id} name={f.name} type="text" defaultValue={value} maxLength={f.max} required={f.required} aria-describedby={describedBy} className={box} />;
  }
}
