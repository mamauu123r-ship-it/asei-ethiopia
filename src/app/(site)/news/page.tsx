import type { Metadata } from "next";
import { NewsCard } from "@/components/cards";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { getNews } from "@/lib/content";

export const metadata: Metadata = {
  title: "News and Updates",
  description: "Announcements, project updates and renewable energy news from ASEI.",
};

export default async function NewsPage() {
  const news = await getNews();
  return (
    <>
      <PageHeader title="News and Updates" intro="Announcements, project updates and renewable energy news." />
      <section className="px-6 py-20">
        <Container>
          {news.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {news.map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>
          ) : (
            <EmptyState title="News is on its way" action={{ href: "/#newsletter", label: "Get updates by email" }}>
              Our first announcements will be published here soon.
            </EmptyState>
          )}
        </Container>
      </section>
    </>
  );
}
