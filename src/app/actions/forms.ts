"use server";

import { supabaseConfigured } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/admin";
import { checkSpam } from "@/lib/spam";
import { notifyAdmins, sendEmail } from "@/lib/email";
import { site } from "@/lib/site";
import {
  contactSchema,
  fieldErrors,
  formValues,
  newsletterSchema,
  partnershipSchema,
  volunteerSchema,
  type FormState,
} from "@/lib/validation";

const CONSENT_TEXT =
  "I agree to receive email updates from ASEI and accept the Privacy Policy.";

function invalid(data: FormData, errors: Record<string, string>): FormState {
  return {
    status: "error",
    message: "Please correct the highlighted fields.",
    errors,
    values: formValues(data),
    key: Date.now(),
  };
}

function failed(data: FormData, message: string): FormState {
  return { status: "error", message, values: formValues(data), key: Date.now() };
}

const NOT_CONNECTED =
  "Online forms are not connected yet. Please contact us by email instead.";

const SAVE_ERROR =
  "Your message could not be saved right now. Please try again in a few minutes.";

export async function submitContact(_: FormState, data: FormData): Promise<FormState> {
  const parsed = contactSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(data, fieldErrors(parsed.error));
  if (!supabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) return failed(data, NOT_CONNECTED);
  const spam = await checkSpam("contact", data);
  if (spam) return failed(data, spam);

  const v = parsed.data;
  const { error } = await createServiceClient().from("inquiries").insert(v);
  if (error) {
    console.error("contact insert failed", error.message);
    return failed(data, SAVE_ERROR);
  }
  await notifyAdmins(
    `New inquiry: ${v.subject}`,
    `From: ${v.full_name} <${v.email}>\nOrganization: ${v.organization ?? "-"}\nCountry: ${v.country ?? "-"}\nType: ${v.inquiry_type}\n\n${v.message}`,
  );
  return {
    status: "success",
    message: "Thank you. Your message has been sent, and our team will reply by email.",
    key: Date.now(),
  };
}

export async function submitPartnership(_: FormState, data: FormData): Promise<FormState> {
  const parsed = partnershipSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(data, fieldErrors(parsed.error));
  if (!supabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) return failed(data, NOT_CONNECTED);
  const spam = await checkSpam("partnership", data);
  if (spam) return failed(data, spam);

  const v = parsed.data;
  const { error } = await createServiceClient()
    .from("inquiries")
    .insert({ ...v, inquiry_type: "partnership", subject: `Partnership application: ${v.organization}` });
  if (error) {
    console.error("partnership insert failed", error.message);
    return failed(data, SAVE_ERROR);
  }
  await notifyAdmins(
    `New partnership application: ${v.organization}`,
    `Organization: ${v.organization}\nContact: ${v.full_name} <${v.email}>\nCountry: ${v.country}\nCategory: ${v.partnership_category}\nWebsite: ${v.website ?? "-"}\n\nProposed collaboration:\n${v.proposed_collaboration}\n\nMessage:\n${v.message}`,
  );
  return {
    status: "success",
    message: "Thank you. Your partnership application has been received. Our team will contact you by email.",
    key: Date.now(),
  };
}

export async function submitVolunteer(_: FormState, data: FormData): Promise<FormState> {
  const parsed = volunteerSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(data, fieldErrors(parsed.error));
  if (!supabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) return failed(data, NOT_CONNECTED);
  const spam = await checkSpam("volunteer", data);
  if (spam) return failed(data, spam);

  const v = parsed.data;
  const { error } = await createServiceClient().from("volunteer_applications").insert(v);
  if (error) {
    console.error("volunteer insert failed", error.message);
    return failed(data, SAVE_ERROR);
  }
  await sendEmail({
    to: v.email,
    subject: "We received your volunteer application",
    text: `Dear ${v.full_name},\n\nThank you for applying to volunteer with ${site.name}. We have received your application for "${v.area_of_interest}". Our team will review it and contact you by email.\n\n${site.slogan}\n${site.name}`,
  });
  await notifyAdmins(
    `New volunteer application: ${v.full_name}`,
    `${v.full_name} <${v.email}>, ${v.country}\nArea of interest: ${v.area_of_interest}\n\nEducation: ${v.education}\nBackground: ${v.professional_background}\nSkills: ${v.skills}\n\nExperience:\n${v.experience}`,
  );
  return {
    status: "success",
    message: `Thank you, ${v.full_name}. Your volunteer application has been received. We will review it and contact you at ${v.email}.`,
    key: Date.now(),
  };
}

export async function subscribeNewsletter(_: FormState, data: FormData): Promise<FormState> {
  const parsed = newsletterSchema.safeParse(Object.fromEntries(data));
  if (!parsed.success) return invalid(data, fieldErrors(parsed.error));
  if (!supabaseConfigured || !process.env.SUPABASE_SERVICE_ROLE_KEY) return failed(data, NOT_CONNECTED);
  const spam = await checkSpam("newsletter", data);
  if (spam) return failed(data, spam);

  const db = createServiceClient();
  const email = parsed.data.email;
  const { data: existing } = await db
    .from("newsletter_subscribers")
    .select("id, subscription_status")
    .eq("email", email)
    .maybeSingle();

  let token: string | null = null;
  if (existing?.subscription_status === "subscribed") {
    return { status: "success", message: "You are already subscribed. Thank you.", key: Date.now() };
  }
  if (existing) {
    const { data: row, error } = await db
      .from("newsletter_subscribers")
      .update({
        subscription_status: "subscribed",
        consent_text: CONSENT_TEXT,
        consent_at: new Date().toISOString(),
        subscribed_at: new Date().toISOString(),
        unsubscribed_at: null,
      })
      .eq("id", existing.id)
      .select("unsubscribe_token")
      .single();
    if (error) return failed(data, SAVE_ERROR);
    token = row.unsubscribe_token;
  } else {
    const { data: row, error } = await db
      .from("newsletter_subscribers")
      .insert({ email, consent_text: CONSENT_TEXT })
      .select("unsubscribe_token")
      .single();
    if (error) {
      console.error("newsletter insert failed", error.message);
      return failed(data, SAVE_ERROR);
    }
    token = row.unsubscribe_token;
  }

  await sendEmail({
    to: email,
    subject: `You are subscribed to ${site.shortName} updates`,
    text: `Thank you for subscribing to updates from ${site.name}.\n\nTo unsubscribe at any time, open this link:\n${site.url}/unsubscribe?token=${token}`,
  });
  return { status: "success", message: "You are subscribed. Thank you for following our work.", key: Date.now() };
}

export async function unsubscribe(_: FormState, data: FormData): Promise<FormState> {
  const token = String(data.get("token") ?? "");
  if (!/^[0-9a-f-]{36}$/i.test(token)) {
    return { status: "error", message: "This unsubscribe link is not valid." };
  }
  const { data: row, error } = await createServiceClient()
    .from("newsletter_subscribers")
    .update({ subscription_status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .select("id")
    .maybeSingle();
  if (error || !row) return { status: "error", message: "This unsubscribe link is not valid or has expired." };
  return { status: "success", message: "You have been unsubscribed. You will not receive more newsletters." };
}
