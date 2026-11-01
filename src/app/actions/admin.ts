"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { logActivity, requireStaff, type Role } from "@/lib/auth";
import { getEntity } from "@/lib/admin/entities";
import { parseFields } from "@/lib/admin/parse";
import { uploadFile, UPLOAD_RULES } from "@/lib/admin/uploads";
import { createServiceClient } from "@/lib/supabase/admin";
import { createSessionClient } from "@/lib/supabase/server";
import type { FormState } from "@/lib/validation";

const refreshSite = () => revalidatePath("/", "layout");
const idSchema = z.uuid();

/* ------------------------------ Login ------------------------------ */

export async function signIn(_: FormState, data: FormData): Promise<FormState> {
  const email = String(data.get("email") ?? "").trim().toLowerCase();
  const password = String(data.get("password") ?? "");
  if (!email || !password) {
    return { status: "error", message: "Enter your email and password.", values: { email } };
  }
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    // Same message for every failure, so attackers cannot learn which emails exist.
    return { status: "error", message: "The email or password is not correct.", values: { email } };
  }
  redirect("/admin/dashboard");
}

export async function signOut() {
  const supabase = await createSessionClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* --------------------------- Content items --------------------------- */

export async function saveEntity(
  entityKey: string,
  id: string | null,
  _: FormState,
  data: FormData,
): Promise<FormState> {
  const entity = getEntity(entityKey);
  if (!entity) return { status: "error", message: "Unknown content type." };
  const staff = await requireStaff(entity.roles);
  if (id && !idSchema.safeParse(id).success) return { status: "error", message: "Invalid item." };

  const { values, errors } = parseFields(entity, data);
  const supabase = await createSessionClient();

  // Files: keep the current one, remove it, or upload a new one.
  for (const f of entity.fields) {
    if (f.type !== "image" && f.type !== "document") continue;
    const file = data.get(`${f.name}__file`);
    if (data.get(`${f.name}__remove`) === "on") {
      values[f.name] = null;
    } else if (file instanceof File && file.size > 0) {
      const result = await uploadFile(supabase, f.type, file, entity.key);
      if ("error" in result) errors[f.name] = result.error;
      else values[f.name] = result.url;
    } else {
      const current = String(data.get(f.name) ?? "");
      values[f.name] = current || null;
    }
  }

  const echo: Record<string, string> = {};
  data.forEach((v, k) => {
    if (typeof v === "string" && !k.startsWith("$")) echo[k] = v;
  });

  if (Object.keys(errors).length) {
    return { status: "error", message: "Please correct the highlighted fields.", errors, values: echo, key: Date.now() };
  }

  const query = id
    ? supabase.from(entity.table).update(values).eq("id", id).select("id").single()
    : supabase.from(entity.table).insert(values).select("id").single();
  const { data: row, error } = await query;

  if (error) {
    console.error(`save ${entity.key} failed`, error.code, error.message);
    const message =
      error.code === "23505"
        ? "Another item already uses this web address. Change the web address and save again."
        : error.code === "42501"
          ? "You do not have permission to do this."
          : "The item could not be saved. Check the fields and try again.";
    return {
      status: "error",
      message,
      errors: error.code === "23505" ? { slug: "Already in use." } : undefined,
      values: echo,
      key: Date.now(),
    };
  }

  await logActivity(staff, id ? "updated" : "created", entity.singular, row.id);
  refreshSite();
  redirect(`/admin/${entity.key}?saved=1`);
}

export async function deleteEntity(entityKey: string, id: string) {
  const entity = getEntity(entityKey);
  if (!entity || !idSchema.safeParse(id).success) return;
  const staff = await requireStaff(entity.roles);
  const supabase = await createSessionClient();
  const { error } = await supabase.from(entity.table).delete().eq("id", id);
  if (error) {
    console.error(`delete ${entity.key} failed`, error.message);
    redirect(`/admin/${entity.key}?error=delete`);
  }
  await logActivity(staff, "deleted", entity.singular, id);
  refreshSite();
  redirect(`/admin/${entity.key}?deleted=1`);
}

export async function setPublished(entityKey: string, id: string, publish: boolean) {
  const entity = getEntity(entityKey);
  if (!entity || !idSchema.safeParse(id).success) return;
  const staff = await requireStaff(entity.roles);
  const supabase = await createSessionClient();
  const { error } = await supabase
    .from(entity.table)
    .update({ [entity.statusField]: publish ? entity.publishedValue : entity.draftValue })
    .eq("id", id);
  if (error) console.error("publish toggle failed", error.message);
  else await logActivity(staff, publish ? "published" : "unpublished", entity.singular, id);
  refreshSite();
  revalidatePath(`/admin/${entity.key}`);
}

/* ----------------------------- Inquiries ----------------------------- */

const inquiryUpdate = z.object({
  inquiry_status: z.enum(["new", "pending", "resolved"]),
  inquiry_type: z.enum(["general", "partnership", "project", "media", "other"]),
  internal_notes: z.string().trim().max(5000),
});

export async function updateInquiry(id: string, _: FormState, data: FormData): Promise<FormState> {
  const staff = await requireStaff(["super_admin", "project_manager"]);
  if (!idSchema.safeParse(id).success) return { status: "error", message: "Invalid item." };
  const parsed = inquiryUpdate.safeParse(Object.fromEntries(data));
  if (!parsed.success) return { status: "error", message: "Check the status, category and notes." };
  const supabase = await createSessionClient();
  const { error } = await supabase.from("inquiries").update(parsed.data).eq("id", id);
  if (error) return { status: "error", message: "The inquiry could not be updated." };
  await logActivity(staff, `marked ${parsed.data.inquiry_status}`, "inquiry", id);
  revalidatePath("/admin/inquiries");
  return { status: "success", message: "Saved.", key: Date.now() };
}

export async function deleteInquiry(id: string) {
  const staff = await requireStaff(["super_admin"]);
  if (!idSchema.safeParse(id).success) return;
  const supabase = await createSessionClient();
  await supabase.from("inquiries").delete().eq("id", id);
  await logActivity(staff, "deleted", "inquiry", id);
  redirect("/admin/inquiries?deleted=1");
}

/* ---------------------- Volunteer applications ---------------------- */

const applicationUpdate = z.object({
  application_status: z.enum(["new", "reviewing", "accepted", "declined"]),
  internal_notes: z.string().trim().max(5000),
});

export async function updateApplication(id: string, _: FormState, data: FormData): Promise<FormState> {
  const staff = await requireStaff(["super_admin"]);
  if (!idSchema.safeParse(id).success) return { status: "error", message: "Invalid item." };
  const parsed = applicationUpdate.safeParse(Object.fromEntries(data));
  if (!parsed.success) return { status: "error", message: "Check the status and notes." };
  const supabase = await createSessionClient();
  const { error } = await supabase.from("volunteer_applications").update(parsed.data).eq("id", id);
  if (error) return { status: "error", message: "The application could not be updated." };
  await logActivity(staff, `marked ${parsed.data.application_status}`, "volunteer application", id);
  revalidatePath("/admin/applications");
  return { status: "success", message: "Saved.", key: Date.now() };
}

export async function deleteApplication(id: string) {
  const staff = await requireStaff(["super_admin"]);
  if (!idSchema.safeParse(id).success) return;
  const supabase = await createSessionClient();
  await supabase.from("volunteer_applications").delete().eq("id", id);
  await logActivity(staff, "deleted", "volunteer application", id);
  redirect("/admin/applications?deleted=1");
}

export async function deleteSubscriber(id: string) {
  const staff = await requireStaff(["super_admin"]);
  if (!idSchema.safeParse(id).success) return;
  const supabase = await createSessionClient();
  await supabase.from("newsletter_subscribers").delete().eq("id", id);
  await logActivity(staff, "deleted", "subscriber", id);
  revalidatePath("/admin/subscribers");
}

/* ------------------------------- Media ------------------------------- */

export async function uploadMedia(_: FormState, data: FormData): Promise<FormState> {
  const staff = await requireStaff();
  const file = data.get("file");
  if (!(file instanceof File) || file.size === 0) return { status: "error", message: "Choose a file to upload." };
  const kind = file.type === "application/pdf" ? "document" : "image";
  const supabase = await createSessionClient();
  const result = await uploadFile(supabase, kind, file, "library");
  if ("error" in result) return { status: "error", message: result.error, key: Date.now() };
  await logActivity(staff, "uploaded", "file");
  revalidatePath("/admin/media");
  return { status: "success", message: "File uploaded.", key: Date.now() };
}

export async function deleteMedia(bucket: string, path: string) {
  const staff = await requireStaff();
  if (!Object.values(UPLOAD_RULES).some((r) => r.bucket === bucket)) return;
  if (!/^[a-z]+\/[0-9a-f-]{36}\.(jpg|png|webp|pdf)$/.test(path)) return;
  const supabase = await createSessionClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.error("delete file failed", error.message);
  else await logActivity(staff, "deleted", "file");
  revalidatePath("/admin/media");
}

/* ------------------------------- Users ------------------------------- */

const ROLES = ["super_admin", "editor", "project_manager"] as const;

const newUser = z.object({
  full_name: z.string().trim().min(2, "Enter the full name.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  role: z.enum(ROLES, { message: "Choose a role." }),
  password: z
    .string()
    .min(12, "The temporary password must be at least 12 characters.")
    .max(72),
});

export async function createUser(_: FormState, data: FormData): Promise<FormState> {
  const staff = await requireStaff(["super_admin"]);
  const parsed = newUser.safeParse(Object.fromEntries(data));
  const echo = { full_name: String(data.get("full_name") ?? ""), email: String(data.get("email") ?? ""), role: String(data.get("role") ?? "") };
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    parsed.error.issues.forEach((i) => (errors[String(i.path[0])] ??= i.message));
    return { status: "error", message: "Please correct the highlighted fields.", errors, values: echo, key: Date.now() };
  }
  const v = parsed.data;
  // Creating login accounts needs the service key. We only reach this line
  // after confirming the current user is a super admin.
  const admin = createServiceClient();
  const { data: created, error } = await admin.auth.admin.createUser({
    email: v.email,
    password: v.password,
    email_confirm: true,
  });
  if (error || !created.user) {
    return { status: "error", message: error?.message ?? "The account could not be created.", values: echo, key: Date.now() };
  }
  const { error: pErr } = await admin.from("profiles").insert({
    id: created.user.id,
    full_name: v.full_name,
    email: v.email,
    role: v.role,
  });
  if (pErr) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { status: "error", message: "The account could not be created.", values: echo, key: Date.now() };
  }
  await logActivity(staff, `added ${v.role.replace("_", " ")}`, "user", created.user.id);
  revalidatePath("/admin/users");
  return {
    status: "success",
    message: `${v.full_name} can now log in at /admin/login with the temporary password. Ask them to keep it private.`,
    key: Date.now(),
  };
}

export async function changeRole(userId: string, data: FormData) {
  const staff = await requireStaff(["super_admin"]);
  const role = String(data.get("role") ?? "") as Role;
  if (!idSchema.safeParse(userId).success || !ROLES.includes(role as (typeof ROLES)[number])) return;
  if (userId === staff.id) return; // cannot change your own role
  const supabase = await createSessionClient();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  await logActivity(staff, `changed role to ${role.replace("_", " ")}`, "user", userId);
  revalidatePath("/admin/users");
}

export async function removeUser(userId: string) {
  const staff = await requireStaff(["super_admin"]);
  if (!idSchema.safeParse(userId).success || userId === staff.id) return;
  const admin = createServiceClient();
  await admin.from("profiles").delete().eq("id", userId);
  await admin.auth.admin.deleteUser(userId);
  await logActivity(staff, "removed", "user", userId);
  revalidatePath("/admin/users");
}

export async function changeOwnPassword(_: FormState, data: FormData): Promise<FormState> {
  await requireStaff();
  const password = String(data.get("password") ?? "");
  if (password.length < 12) return { status: "error", message: "Use at least 12 characters." };
  if (password !== String(data.get("confirm") ?? "")) return { status: "error", message: "The two passwords do not match." };
  const supabase = await createSessionClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { status: "error", message: error.message };
  return { status: "success", message: "Your password has been changed.", key: Date.now() };
}

/* ------------------------------ Settings ------------------------------ */

const settingsSchema = z.object({
  official_email: z.union([z.literal(""), z.string().trim().email("Enter a valid email address.")]),
  telephone: z.string().trim().max(60),
  address: z.string().trim().max(300),
  impact_is_pilot: z.string().optional(),
});

export async function saveSettings(_: FormState, data: FormData): Promise<FormState> {
  const staff = await requireStaff(["super_admin"]);
  const parsed = settingsSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Check the fields.", key: Date.now() };
  }

  const social: { label: string; href: string }[] = [];
  for (const label of ["Facebook", "LinkedIn", "X", "YouTube", "Instagram", "Telegram"]) {
    const href = String(data.get(`social_${label}`) ?? "").trim();
    if (href && !/^https:\/\/[^\s]+$/.test(href)) {
      return { status: "error", message: `The ${label} link must start with https://`, key: Date.now() };
    }
    social.push({ label, href });
  }

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("site_settings")
    .update({
      official_email: parsed.data.official_email,
      telephone: parsed.data.telephone,
      address: parsed.data.address,
      social_links: social,
      impact_is_pilot: parsed.data.impact_is_pilot === "on",
    })
    .eq("id", 1);
  if (error) return { status: "error", message: "Settings could not be saved.", key: Date.now() };

  // Impact figures
  const ids = data.getAll("impact_id").map(String);
  for (const id of ids) {
    if (!idSchema.safeParse(id).success) continue;
    const label = String(data.get(`impact_label_${id}`) ?? "").trim().slice(0, 80);
    const value = Number(String(data.get(`impact_value_${id}`) ?? "0").replace(/,/g, ""));
    const unit = String(data.get(`impact_unit_${id}`) ?? "").trim().slice(0, 20) || null;
    if (!label || !Number.isFinite(value) || value < 0) {
      return { status: "error", message: "Each impact figure needs a label and a number of 0 or more.", key: Date.now() };
    }
    await supabase.from("impact_stats").update({ label, value, unit }).eq("id", id);
  }

  await logActivity(staff, "updated", "website settings");
  refreshSite();
  return { status: "success", message: "Settings saved. The website now shows the new details.", key: Date.now() };
}
