import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { saveEntity } from "@/app/actions/admin";
import { EntityForm } from "@/components/admin/EntityForm";
import { AdminHeader } from "@/components/admin/ui";
import { getEntity } from "@/lib/admin/entities";
import { toLocalInput } from "@/lib/admin/parse";
import { requireStaff } from "@/lib/auth";

type Props = { params: Promise<{ entity: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const e = getEntity((await params).entity);
  return { title: e ? `Add ${e.singular}` : "Not found" };
}

export default async function NewEntityPage({ params }: Props) {
  const entity = getEntity((await params).entity);
  if (!entity) notFound();
  await requireStaff(entity.roles);

  const initial: Record<string, string> = {};
  for (const f of entity.fields) {
    if (f.defaultValue) initial[f.name] = f.defaultValue;
    if (f.type === "datetime") initial[f.name] = toLocalInput(new Date().toISOString());
    if (f.type === "date" && f.required) initial[f.name] = new Date().toISOString().slice(0, 10);
  }

  return (
    <>
      <AdminHeader title={`Add ${entity.singular}`}>New items start as drafts unless you choose to publish them.</AdminHeader>
      <EntityForm action={saveEntity.bind(null, entity.key, null)} fields={entity.fields} initial={initial} cancelHref={`/admin/${entity.key}`} />
    </>
  );
}
