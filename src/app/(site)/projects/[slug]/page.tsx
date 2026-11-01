import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";
import { StatusBadge } from "@/components/cards";
import { Markdown } from "@/components/Markdown";
import { ButtonLink, Container } from "@/components/ui";
import { formatDate, getProject, getProjects } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProject((await params).slug);
  if (!project) notFound();

  return (
    <>
      <section className="bg-ink px-6 py-16 text-white">
        <Container className="flex flex-col gap-4">
          <Link href="/projects" className="inline-flex items-center gap-1 text-haze no-underline hover:text-white">
            <ChevronLeft size={18} aria-hidden="true" /> All projects
          </Link>
          <StatusBadge status={project.status} />
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">{project.title}</h1>
          <span className="flex items-center gap-1.5 text-haze">
            <MapPin size={18} aria-hidden="true" /> {project.country}, {project.location}
          </span>
        </Container>
      </section>
      {project.imageUrl && (
        <div className="relative mx-auto mt-10 h-72 max-w-site overflow-hidden rounded-2xl sm:h-96">
          <Image src={project.imageUrl} alt="" fill className="object-cover" sizes="100vw" priority />
        </div>
      )}
      <section className="px-6 py-20">
        <Container className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="flex flex-col gap-10">
            <Markdown>{project.description}</Markdown>
            {project.objectives.trim() && (
              <div>
                <h2 className="mb-4 font-display text-2xl font-bold text-ink">Objectives</h2>
                <Markdown>{project.objectives}</Markdown>
              </div>
            )}
            {project.technicalInfo.trim() && (
              <div>
                <h2 className="mb-4 font-display text-2xl font-bold text-ink">Technical information</h2>
                <Markdown>{project.technicalInfo}</Markdown>
              </div>
            )}
          </div>
          <aside className="flex flex-col gap-4 self-start rounded-2xl border border-line p-6">
            <dl className="flex flex-col gap-3">
              <div><dt className="text-sm text-muted">Status</dt><dd className="font-semibold text-ink">{project.status}</dd></div>
              <div><dt className="text-sm text-muted">Funding</dt><dd className="font-semibold text-ink">{project.fundingStatus}</dd></div>
              <div><dt className="text-sm text-muted">Location</dt><dd className="font-semibold text-ink">{project.location}, {project.country}</dd></div>
              {project.startDate && (
                <div><dt className="text-sm text-muted">Start date</dt><dd className="font-semibold text-ink">{formatDate(project.startDate)}</dd></div>
              )}
              {project.endDate && (
                <div><dt className="text-sm text-muted">End date</dt><dd className="font-semibold text-ink">{formatDate(project.endDate)}</dd></div>
              )}
            </dl>
            <ButtonLink href="/partners" variant="ink">Support this project</ButtonLink>
          </aside>
        </Container>
      </section>
    </>
  );
}
