import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Markdown } from "@/components/Markdown";
import { Container } from "@/components/ui";
import { formatDate, getArticle, getNews } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getNews()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();

  return (
    <article>
      <section className="bg-ink px-6 py-16 text-white">
        <Container className="flex flex-col gap-4">
          <Link href="/news" className="inline-flex items-center gap-1 text-haze no-underline hover:text-white">
            <ChevronLeft size={18} aria-hidden="true" /> All news
          </Link>
          <span className="text-sm font-semibold text-sun">
            {article.category}, <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
          </span>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">{article.title}</h1>
        </Container>
      </section>
      {article.imageUrl && (
        <div className="relative mx-auto mt-10 h-72 max-w-site overflow-hidden rounded-2xl sm:h-96">
          <Image src={article.imageUrl} alt="" fill className="object-cover" sizes="100vw" priority />
        </div>
      )}
      <section className="px-6 py-16">
        <Container>
          <Markdown>{article.content}</Markdown>
        </Container>
      </section>
    </article>
  );
}
