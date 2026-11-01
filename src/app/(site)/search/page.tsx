import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { Container } from "@/components/ui";
import { getNews, getPrograms, getProjects, getPublications } from "@/lib/content";

export const metadata: Metadata = { title: "Search" };

type Props = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: Props) {
  const q = ((await searchParams).q ?? "").trim().slice(0, 100);
  const needle = q.toLowerCase();
  const match = (...parts: (string | null | undefined)[]) =>
    parts.some((p) => (p ?? "").toLowerCase().includes(needle));

  let results: { href: string; title: string; kind: string; text: string }[] = [];
  if (needle.length >= 2) {
    const [programs, projects, news, pubs] = await Promise.all([getPrograms(), getProjects(), getNews(), getPublications()]);
    results = [
      ...programs.filter((p) => match(p.title, p.summary, p.description)).map((p) => ({ href: `/programs/${p.slug}`, title: p.title, kind: "Program", text: p.summary })),
      ...projects.filter((p) => match(p.title, p.summary, p.location)).map((p) => ({ href: `/projects/${p.slug}`, title: p.title, kind: "Project", text: p.summary })),
      ...news.filter((n) => match(n.title, n.excerpt, n.content)).map((n) => ({ href: `/news/${n.slug}`, title: n.title, kind: "News", text: n.excerpt })),
      ...pubs.filter((p) => match(p.title, p.description)).map((p) => ({ href: p.documentUrl ?? "/publications", title: p.title, kind: "Publication", text: p.description })),
    ];
  }

  return (
    <section className="px-6 py-16">
      <Container className="flex max-w-3xl flex-col gap-8">
        <h1 className="font-display text-4xl font-bold text-ink">Search</h1>
        <form action="/search" role="search" className="flex gap-2.5">
          <label htmlFor="q" className="sr-only">Search the website</label>
          <input id="q" name="q" type="search" defaultValue={q} maxLength={100} placeholder="Search programs, projects, news" className="h-[52px] min-w-0 flex-1 rounded-[10px] border border-[#A9BAB4] px-4" />
          <button type="submit" className="inline-flex h-[52px] items-center gap-2 rounded-[10px] bg-ink px-5 font-bold text-white">
            <Search size={18} aria-hidden="true" /> Search
          </button>
        </form>
        {needle.length >= 2 && (
          <div className="flex flex-col gap-4">
            <p className="text-muted">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>
            <ul className="flex flex-col divide-y divide-line">
              {results.map((r) => (
                <li key={r.href + r.title} className="py-4">
                  <span className="text-sm font-semibold text-leaf">{r.kind}</span>
                  <h2 className="font-display text-lg font-semibold">
                    <Link href={r.href} className="text-ink no-underline hover:text-leaf">{r.title}</Link>
                  </h2>
                  <p className="text-[16px]">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </section>
  );
}
