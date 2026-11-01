import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteEntity, setPublished } from "@/app/actions/admin";
import { ConfirmButton } from "@/components/admin/ConfirmButton";
import { AdminHeader, EmptyRow, Notice, Pill, Table, formatDateTime, formatDay } from "@/components/admin/ui";
import { getEntity } from "@/lib/admin/entities";
import { requireStaff } from "@/lib/auth";
import { createSessionClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ entity: string }>;
  searchParams: Promise<{ saved?: string; deleted?: string; error?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getEntity((await params).entity)?.label ?? "Not found" };
}

export default async function EntityListPage({ params, searchParams }: Props) {
  const entity = getEntity((await params).entity);
  if (!entity) notFound();
  await requireStaff(entity.roles);
  const flags = await searchParams;

  const db = await createSessionClient();
  const { data: rows, error } = await db
    .from(entity.table)
    .select("*")
    .order(entity.orderBy.column, { ascending: entity.orderBy.ascending })
    .limit(500);
  if (error) console.error(error.message);

  const show = (name: string, v: unknown) => {
    if (v === null || v === undefined || v === "") return "";
    if (name.endsWith("_at")) return formatDateTime(String(v));
    if (name.endsWith("_date")) return formatDay(String(v));
    return String(v);
  };

  return (
    <>
      {flags.saved && <Notice>Saved.</Notice>}
      {flags.deleted && <Notice>Deleted.</Notice>}
      {flags.error && <Notice kind="error">That action could not be completed.</Notice>}
      <AdminHeader title={entity.label} action={{ href: `/admin/${entity.key}/new`, label: `Add ${entity.singular}` }} />
      <Table
        head={[...entity.listColumns.map((c) => c.label), "Actions"]}
        empty={(rows ?? []).length === 0 ? <EmptyRow text={`No ${entity.label.toLowerCase()} yet. Use "Add ${entity.singular}" to create the first one.`} /> : null}
      >
        {(rows ?? []).map((row) => {
          const published = row[entity.statusField] === entity.publishedValue;
          const path = entity.publicPath(row);
          return (
            <tr key={row.id}>
              {entity.listColumns.map((c, i) => (
                <td key={c.name} className="px-4 py-3 align-top">
                  {i === 0 ? (
                    <Link href={`/admin/${entity.key}/${row.id}`} className="font-semibold">{show(c.name, row[c.name])}</Link>
                  ) : c.name === entity.statusField ? (
                    <Pill value={String(row[c.name])} />
                  ) : (
                    show(c.name, row[c.name])
                  )}
                </td>
              ))}
              <td className="px-4 py-3 align-top">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/${entity.key}/${row.id}`} className="inline-flex h-10 items-center rounded-lg border border-ink px-3 text-sm font-semibold text-ink no-underline">Edit</Link>
                  <form action={setPublished.bind(null, entity.key, row.id, !published)}>
                    <button type="submit" className="inline-flex h-10 items-center rounded-lg border border-line px-3 text-sm font-semibold text-ink hover:bg-mist">
                      {published ? (entity.publishedValue === "visible" ? "Hide" : "Unpublish") : entity.publishedValue === "visible" ? "Show" : "Publish"}
                    </button>
                  </form>
                  {published && path && (
                    <a href={path} target="_blank" rel="noopener noreferrer" className="inline-flex h-10 items-center px-2 text-sm font-semibold">View</a>
                  )}
                  <form action={deleteEntity.bind(null, entity.key, row.id)}>
                    <ConfirmButton message={`Delete this ${entity.singular}? This cannot be undone.`}>Delete</ConfirmButton>
                  </form>
                </div>
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
