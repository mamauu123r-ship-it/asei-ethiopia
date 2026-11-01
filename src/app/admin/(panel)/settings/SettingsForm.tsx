"use client";

import { useActionState } from "react";
import { saveSettings } from "@/app/actions/admin";
import { FormMessage, SubmitButton } from "@/components/forms/fields";
import { initialFormState } from "@/lib/validation";

const box = "w-full rounded-lg border border-[#A9BAB4] bg-white px-3 py-2.5";
const NETWORKS = ["Facebook", "LinkedIn", "X", "YouTube", "Instagram", "Telegram"];

type Props = {
  settings: { official_email: string; telephone: string; address: string; impact_is_pilot: boolean };
  social: Record<string, string>;
  impact: { id: string; label: string; value: string; unit: string }[];
};

export function SettingsForm({ settings, social, impact }: Props) {
  const [state, action] = useActionState(saveSettings, initialFormState);
  return (
    <form action={action} className="flex max-w-3xl flex-col gap-6">
      <FormMessage state={state} />
      <fieldset className="grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-2">
        <legend className="px-1 font-display text-lg font-semibold text-ink">Contact details</legend>
        <label className="flex flex-col gap-1.5 font-semibold text-ink">Official email<input name="official_email" type="email" defaultValue={settings.official_email} className={box} /></label>
        <label className="flex flex-col gap-1.5 font-semibold text-ink">Telephone<input name="telephone" defaultValue={settings.telephone} maxLength={60} className={box} /></label>
        <label className="flex flex-col gap-1.5 font-semibold text-ink sm:col-span-2">Address<input name="address" defaultValue={settings.address} maxLength={300} className={box} /></label>
      </fieldset>

      <fieldset className="grid gap-4 rounded-xl border border-line bg-white p-5 sm:grid-cols-2">
        <legend className="px-1 font-display text-lg font-semibold text-ink">Social media links</legend>
        <p className="text-sm text-muted sm:col-span-2">Full addresses starting with https://. Leave empty to hide a network.</p>
        {NETWORKS.map((n) => (
          <label key={n} className="flex flex-col gap-1.5 font-semibold text-ink">{n}<input name={`social_${n}`} type="url" defaultValue={social[n] ?? ""} placeholder="https://" className={box} /></label>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-4 rounded-xl border border-line bg-white p-5">
        <legend className="px-1 font-display text-lg font-semibold text-ink">Impact figures</legend>
        <p className="text-sm text-muted">Only enter verified results. Keep the pilot-stage label on until figures are confirmed.</p>
        <label className="flex items-center gap-2.5 font-semibold text-ink">
          <input type="checkbox" name="impact_is_pilot" defaultChecked={settings.impact_is_pilot} className="h-5 w-5" />
          Show the “Pilot stage” label on the homepage
        </label>
        {impact.map((i) => (
          <div key={i.id} className="grid gap-3 sm:grid-cols-[2fr_1fr_1fr]">
            <input type="hidden" name="impact_id" value={i.id} />
            <label className="flex flex-col gap-1 text-sm font-semibold text-ink">Label<input name={`impact_label_${i.id}`} defaultValue={i.label} required maxLength={80} className={box} /></label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-ink">Number<input name={`impact_value_${i.id}`} defaultValue={i.value} required inputMode="decimal" className={box} /></label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-ink">Unit<input name={`impact_unit_${i.id}`} defaultValue={i.unit} maxLength={20} placeholder="e.g. kW" className={box} /></label>
          </div>
        ))}
      </fieldset>
      <SubmitButton pendingText="Saving...">Save settings</SubmitButton>
    </form>
  );
}
