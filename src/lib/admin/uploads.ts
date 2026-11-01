import "server-only";
import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";

export const UPLOAD_RULES = {
  image: {
    bucket: "media",
    maxBytes: 5 * 1024 * 1024,
    types: { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" } as Record<string, string>,
    help: "JPG, PNG or WebP, up to 5 MB.",
  },
  document: {
    bucket: "documents",
    maxBytes: 20 * 1024 * 1024,
    types: { "application/pdf": "pdf" } as Record<string, string>,
    help: "PDF, up to 20 MB.",
  },
} as const;

/** Checks the first bytes of the file, so a renamed file cannot pretend to be an image or PDF. */
async function matchesSignature(file: File, mime: string): Promise<boolean> {
  const b = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const starts = (...bytes: number[]) => bytes.every((v, i) => b[i] === v);
  switch (mime) {
    case "image/jpeg": return starts(0xff, 0xd8, 0xff);
    case "image/png": return starts(0x89, 0x50, 0x4e, 0x47);
    case "image/webp": return starts(0x52, 0x49, 0x46, 0x46) && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50;
    case "application/pdf": return starts(0x25, 0x50, 0x44, 0x46);
    default: return false;
  }
}

export type UploadResult = { url: string } | { error: string };

export async function uploadFile(
  supabase: SupabaseClient,
  kind: keyof typeof UPLOAD_RULES,
  file: File,
  folder: string,
): Promise<UploadResult> {
  const rule = UPLOAD_RULES[kind];
  const ext = rule.types[file.type];
  if (!ext) return { error: `This file type is not allowed. Use ${rule.help}` };
  if (file.size > rule.maxBytes) return { error: `The file is too large. Use ${rule.help}` };
  if (!(await matchesSignature(file, file.type))) return { error: "The file content does not match its type." };

  const path = `${folder}/${randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(rule.bucket)
    .upload(path, file, { contentType: file.type, cacheControl: "31536000", upsert: false });
  if (error) {
    console.error("upload failed", error.message);
    return { error: "The file could not be uploaded. Please try again." };
  }
  return { url: supabase.storage.from(rule.bucket).getPublicUrl(path).data.publicUrl };
}
