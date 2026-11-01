import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { deleteMedia } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { AdminHeader, formatDateTime } from "@/components/admin/ui";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";
import { CopyLink, UploadForm } from "./MediaClient";

export const metadata: Metadata = { title: "Media" };

const FOLDERS = ["library", "programs", "projects", "news", "partners", "publications"];

export default async function MediaPage() {
  await requireStaff();
  const db = await createSessionClient();

  const files: { bucket: string; path: string; url: string; created: string; isImage: boolean }[] = [];
  for (const bucket of ["media", "documents"]) {
    for (const folder of FOLDERS) {
      const { data } = await db.storage.from(bucket).list(folder, { limit: 200, sortBy: { column: "created_at", order: "desc" } });
      for (const f of data ?? []) {
        if (!f.id) continue; // skip sub-folders
        const path = `${folder}/${f.name}`;
        files.push({
          bucket,
          path,
          url: db.storage.from(bucket).getPublicUrl(path).data.publicUrl,
          created: f.created_at ?? "",
          isImage: bucket === "media",
        });
      }
    }
  }
  files.sort((a, b) => b.created.localeCompare(a.created));

  return (
    <>
      <AdminHeader title="Media">Photos and documents used on the website. Photos added while editing content also appear here.</AdminHeader>
      <UploadForm />
      {files.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-[#A9BAB4] bg-white p-8 text-center text-muted">No files yet. Upload a photo or PDF to start your library.</p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {files.map((f) => (
            <li key={f.bucket + f.path} className="flex flex-col overflow-hidden rounded-xl border border-line bg-white">
              {f.isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt="" loading="lazy" className="h-40 w-full object-cover" />
              ) : (
                <div className="flex h-40 items-center justify-center bg-mist text-muted"><FileText size={40} aria-hidden="true" /></div>
              )}
              <div className="flex flex-col gap-2 p-3 text-sm">
                <span className="truncate text-muted" title={f.path}>{f.path}</span>
                <span className="text-muted">{formatDateTime(f.created)}</span>
                <div className="flex flex-wrap gap-2">
                  <CopyLink url={f.url} />
                  <form action={deleteMedia.bind(null, f.bucket, f.path)}>
                    <ConfirmButton message="Delete this file? Pages that use it will show a broken image.">Delete</ConfirmButton>
                  </form>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
