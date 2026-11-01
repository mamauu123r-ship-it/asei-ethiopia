"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import type { FormState } from "@/lib/validation";

const inputClass =
  "w-full rounded-[10px] border bg-white px-4 py-3 text-[17px] text-ink placeholder:text-[#6B7A75] focus:border-leaf";

type FieldProps = {
  name: string;
  label: string;
  state: FormState;
  required?: boolean;
  hint?: string;
  type?: string;
  maxLength?: number;
  minLength?: number;
  autoComplete?: string;
  multiline?: boolean;
  rows?: number;
  options?: readonly string[] | { value: string; label: string }[];
  placeholder?: string;
};

export function Field({
  name,
  label,
  state,
  required,
  hint,
  type = "text",
  maxLength,
  minLength,
  autoComplete,
  multiline,
  rows = 5,
  options,
  placeholder,
}: FieldProps) {
  const error = state.errors?.[name];
  const id = `f-${name}`;
  const describedBy = [hint ? `${id}-hint` : "", error ? `${id}-err` : ""].filter(Boolean).join(" ") || undefined;
  const common = {
    id,
    name,
    required,
    defaultValue: state.values?.[name] ?? "",
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: `${inputClass} ${error ? "border-[#A3271F]" : "border-[#A9BAB4]"}`,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-semibold text-ink">
        {label}
        {!required && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {hint && (
        <span id={`${id}-hint`} className="text-[15px] text-muted">
          {hint}
        </span>
      )}
      {options ? (
        <select {...common}>
          <option value="">Choose one</option>
          {options.map((o) =>
            typeof o === "string" ? (
              <option key={o} value={o}>{o}</option>
            ) : (
              <option key={o.value} value={o.value}>{o.label}</option>
            ),
          )}
        </select>
      ) : multiline ? (
        <textarea {...common} rows={rows} maxLength={maxLength} minLength={minLength} placeholder={placeholder} />
      ) : (
        <input
          {...common}
          type={type}
          maxLength={maxLength}
          minLength={minLength}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
      )}
      {error && (
        <span id={`${id}-err`} className="text-[15px] font-semibold text-[#A3271F]">
          {error}
        </span>
      )}
    </div>
  );
}

/** Hidden fields used for spam protection. */
export function SpamGuard() {
  const [startedAt, setStartedAt] = useState("");
  useEffect(() => setStartedAt(String(Date.now())), []);
  return (
    <>
      <input type="hidden" name="started_at" value={startedAt} />
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="company_website">Leave this field empty</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
    </>
  );
}

export function SubmitButton({ children, pendingText = "Sending..." }: { children: ReactNode; pendingText?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="h-[52px] self-start rounded-[10px] bg-ink px-6 font-bold text-white hover:bg-ink-deep disabled:opacity-60"
    >
      {pending ? pendingText : children}
    </button>
  );
}

export function FormMessage({ state }: { state: FormState }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status !== "idle") ref.current?.focus();
  }, [state.key, state.status]);
  if (state.status === "idle" || !state.message) return null;
  const ok = state.status === "success";
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={ok ? "status" : "alert"}
      className={`flex items-start gap-3 rounded-xl p-4 font-semibold ${
        ok ? "bg-sage text-leaf" : "bg-[#FBE4E2] text-[#A3271F]"
      }`}
    >
      {ok ? <CheckCircle2 size={22} aria-hidden="true" className="shrink-0" /> : <AlertCircle size={22} aria-hidden="true" className="shrink-0" />}
      <span>{state.message}</span>
    </div>
  );
}
