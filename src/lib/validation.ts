import { z } from "zod";

const text = (label: string, max: number, min = 1) =>
  z
    .string()
    .trim()
    .min(min, min <= 1 ? `Enter your ${label}.` : `${label[0].toUpperCase() + label.slice(1)} must be at least ${min} characters.`)
    .max(max, `${label[0].toUpperCase() + label.slice(1)} must be ${max} characters or fewer.`);

const optional = (max: number) =>
  z.string().trim().max(max, `Must be ${max} characters or fewer.`).optional().transform((v) => v || null);

const email = z.string().trim().toLowerCase().max(200).email("Enter a valid email address, like name@example.org.");

export const INQUIRY_TYPES = ["general", "project", "media", "other"] as const;
export const PARTNER_CATEGORIES = [
  "University or college",
  "Government",
  "Renewable energy company",
  "International development organization",
  "Research institution",
  "Individual",
  "Other",
] as const;

export const contactSchema = z.object({
  full_name: text("full name", 120, 2),
  email,
  organization: optional(160),
  country: optional(80),
  inquiry_type: z.enum(INQUIRY_TYPES).default("general"),
  subject: text("subject", 160, 2),
  message: text("message", 5000, 10),
});

export const partnershipSchema = z.object({
  organization: text("organization name", 160, 2),
  full_name: text("contact person", 120, 2),
  email,
  country: text("country", 80),
  website: z
    .string()
    .trim()
    .max(300)
    .optional()
    .transform((v) => (v ? (/^https?:\/\//i.test(v) ? v : `https://${v}`) : null))
    .refine((v) => v === null || z.url().safeParse(v).success, "Enter a valid website address."),
  partnership_category: z.enum(PARTNER_CATEGORIES, { message: "Choose a partnership category." }),
  proposed_collaboration: text("proposed collaboration", 2000, 10),
  message: text("message", 5000, 10),
});

export const volunteerSchema = z.object({
  full_name: text("full name", 120, 2),
  email,
  country: text("country", 80),
  education: text("education", 500),
  professional_background: text("professional background", 1000),
  skills: text("skills", 1000),
  area_of_interest: text("area of interest", 160),
  experience: text("relevant experience", 3000),
});

export const newsletterSchema = z.object({
  email,
  consent: z.literal("on", { message: "Tick the box to agree to receive email updates." }),
});

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
  key?: number;
};

export const initialFormState: FormState = { status: "idle" };

/** Turns zod errors into { field: "message" }. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const k = String(issue.path[0] ?? "form");
    if (!out[k]) out[k] = issue.message;
  }
  return out;
}

export function formValues(data: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  data.forEach((v, k) => {
    if (typeof v === "string" && !k.startsWith("$")) out[k] = v;
  });
  return out;
}
