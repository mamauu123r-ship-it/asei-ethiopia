import type { Metadata } from "next";
import { AdminHeader } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { SettingsForm } from "./SettingsForm";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  await requireStaff(["super_admin"]);
  const db = await createSessionClient();
  const [{ data: settings }, { data: impact }] = await Promise.all([
    db.from("site_settings").select("*").eq("id", 1).maybeSingle(),
    db.from("impact_stats").select("*").order("sort_order"),
  ]);
  const social: Record<string, string> = {};
  for (const s of (settings?.social_links ?? []) as { label: string; href: string }[]) social[s.label] = s.href;

  return (
    <>
      <AdminHeader title="Website settings">Contact details, social media links and impact figures shown on the website.</AdminHeader>
      <SettingsForm
        settings={{
          official_email: settings?.official_email ?? "",
          telephone: settings?.telephone ?? "",
          address: settings?.address ?? "",
          impact_is_pilot: Boolean(settings?.impact_is_pilot ?? true),
        }}
        social={social}
        impact={(impact ?? []).map((i) => ({ id: i.id, label: i.label, value: String(i.value), unit: i.unit ?? "" }))}
      />
    </>
  );
}
