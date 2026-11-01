import type { Entity, Field } from "./entities";
import { optionValues } from "./entities";

// Converts submitted admin form text into database values and checks them.

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120);
}

// Dates and times in the admin are East Africa Time (UTC+3).
const EAT_OFFSET = "+03:00";

export function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(new Date(iso).getTime() + 3 * 60 * 60 * 1000);
  return d.toISOString().slice(0, 16);
}

export function parseFields(entity: Entity, data: FormData) {
  const values: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const f of entity.fields) {
    if (f.type === "image" || f.type === "document") continue; // handled by uploads
    const raw = String(data.get(f.name) ?? "").trim();
    const err = check(f, raw);
    if (err) {
      errors[f.name] = err;
      continue;
    }
    values[f.name] = convert(f, raw);
  }

  if ("slug" in values || entity.fields.some((f) => f.type === "slug")) {
    const title = String(data.get(entity.titleField) ?? "");
    if (!values.slug) values.slug = slugify(title);
    if (!values.slug && !errors.slug) errors.slug = "Enter a web address.";
  }
  if (values.start_date && values.end_date && String(values.end_date) < String(values.start_date)) {
    errors.end_date = "The end date must be after the start date.";
  }
  return { values, errors };
}

function check(f: Field, raw: string): string | null {
  if (!raw) return f.required ? `${f.label} is required.` : null;
  if (f.max && raw.length > f.max) return `${f.label} must be ${f.max} characters or fewer.`;
  switch (f.type) {
    case "slug":
      return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(raw) ? null : "Use lowercase letters, numbers and hyphens only.";
    case "url":
      return /^https?:\/\/[^\s]+\.[^\s]+$/i.test(raw) ? null : "Enter a full address starting with https://";
    case "select":
      return optionValues(f).includes(raw) ? null : `Choose a valid ${f.label.toLowerCase()}.`;
    case "date":
      return /^\d{4}-\d{2}-\d{2}$/.test(raw) && !isNaN(Date.parse(raw)) ? null : "Enter a valid date.";
    case "datetime":
      return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw) ? null : "Enter a valid date and time.";
    case "number":
      return /^\d+(\.\d{1,2})?$/.test(raw.replace(/,/g, "")) ? null : "Enter a number, like 25000 or 25000.50.";
    case "int":
      return /^-?\d{1,6}$/.test(raw) ? null : "Enter a whole number.";
    default:
      return null;
  }
}

function convert(f: Field, raw: string): unknown {
  if (!raw) {
    if (f.type === "tags") return [];
    if (["text", "textarea", "markdown"].includes(f.type)) return "";
    if (f.type === "int") return 0;
    return null;
  }
  switch (f.type) {
    case "number": return Number(raw.replace(/,/g, ""));
    case "int": return parseInt(raw, 10);
    case "datetime": return new Date(`${raw}:00${EAT_OFFSET}`).toISOString();
    case "tags": return raw.split("\n").map((s) => s.trim()).filter(Boolean).slice(0, 30);
    default: return raw;
  }
}
