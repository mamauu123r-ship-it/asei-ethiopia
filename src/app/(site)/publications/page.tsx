import type { Metadata } from "next";
import { Download } from "lucide-react";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { formatDate, getPublications } from "@/lib/content";

export const metadata: Metadata = {
  title: "Publications",
  description: "Technical publications and research reports from ASEI.",
};

export default async function PublicationsPage() {
  const publications = await getPublications();
  return (
    <>
      <PageHeader title="Publications" intro="Technical publications and research reports from ASEI." />
      <section className="px-6 py-20">
        <Container>
          {publications.length > 0 ? (
            <ul className="flex flex-col divide-y divide-line border-y border-line">
              {publications.map((p) => (
                <li key={p.id} className="flex flex-wrap items-start justify-between gap-4 py-6">
                  <div className="max-w-2xl">
                    <span className="text-sm font-semibold text-leaf">
                      {p.category}, {formatDate(p.publishedAt)}
                    </span>
                    <h2 className="mt-1 font-display text-xl font-semibold text-ink">{p.title}</h2>
                    <p className="mt-1">{p.description}</p>
                  </div>
                  {p.documentUrl && (
                    <a
                      href={p.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center gap-2 rounded-lg border border-ink px-4 font-semibold text-ink no-underline hover:bg-mist"
                    >
                      <Download size={18} aria-hidden="true" /> Download PDF
                    </a>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="No publications yet" action={{ href: "/research", label: "See our research themes" }}>
              Our first technical publications and research reports will be shared here.
            </EmptyState>
          )}
        </Container>
      </section>
    </>
  );
}
