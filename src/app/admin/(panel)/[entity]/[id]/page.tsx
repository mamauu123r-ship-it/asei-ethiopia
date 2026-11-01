import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveEntity } from "@/app/actions/admin";
import { EntityForm } from "@/components/admin/EntityForm";
import { AdminHeader, formatDateTime } from "@/components/admin/ui";
import { getEntity } from "@/lib/admin/entities";
import { toLocalInput } from "@/lib/admin/parse";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ entity: string; id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = getEntity((await params).entity);
  return { title: e ? `Edit ${e.singular}` : "Not found" };
}

export default async function EditEntityPage({ params }: Props) {
  const { entity: key, id } = await params;
  const entity = getEntity(key);
  if (!entity || !/^[0-9a-f-]{36}$/i.test(id)) notFound();
  await requireStaff(entity.roles);

  const db = await createSessionClient();
  const { data: row } = await db.from(entity.table).select("*").eq("id", id).maybeSingle();
  if (!row) notFound();

  const initial: Record<string, string> = {};
  for (const f of entity.fields) {
    const v = row[f.name];
    if (v === null || v === undefined) initial[f.name] = "";
    else if (f.type === "tags") initial[f.name] = (v as string[]).join("\n");
    else if (f.type === "datetime") initial[f.name] = toLocalInput(String(v));
    else initial[f.name] = String(v);
  }

  return (
    <>
      <AdminHeader title={`Edit ${entity.singular}`}>
        {row.updated_at ? `Last updated ${formatDateTime(row.updated_at)}` : null}
      </AdminHeader>
      <EntityForm action={saveEntity.bind(null, entity.key, id)} fields={entity.fields} initial={initial} cancelHref={`/admin/${entity.key}`} />
    </>
  );
}
