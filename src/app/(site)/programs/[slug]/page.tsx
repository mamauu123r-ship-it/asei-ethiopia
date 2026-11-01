import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ProgramVisual } from "@/components/cards";
import { Markdown } from "@/components/Markdown";
import { ButtonLink, Container, Prose } from "@/components/ui";
import { getProgram, getPrograms } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getPrograms()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const program = await getProgram((await params).slug);
  return program ? { title: program.title, description: program.summary } : {};
}

export default async function ProgramPage({ params }: Props) {
  const program = await getProgram((await params).slug);
  if (!program) notFound();

  return (
    <>
      <section className="bg-ink px-6 py-16 text-white">
        <Container className="flex flex-col gap-4">
          <Link href="/programs" className="inline-flex items-center gap-1 text-haze no-underline hover:text-white">
            <ChevronLeft size={18} aria-hidden="true" /> All programs
          </Link>
          <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">{program.title}</h1>
          <p className="max-w-2xl text-xl text-haze">{program.summary}</p>
        </Container>
      </section>
      <section className="px-6 py-20">
        <Container className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <Prose>
            <Markdown>{program.description}</Markdown>
            {program.focusAreas.length > 0 && (
              <>
                <h2>Focus areas</h2>
                <ul>
                  {program.focusAreas.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </>
            )}
          </Prose>
          <aside className="flex flex-col gap-5">
            <ProgramVisual program={program} className="h-56 rounded-2xl" />
            <div className="rounded-2xl bg-sun-pale p-6">
              <h2 className="font-display text-lg font-semibold text-ink">Support this program</h2>
              <p className="mt-2">Partner with us, volunteer your skills, or ask how to get involved.</p>
              <div className="mt-4">
                <ButtonLink href="/partners" variant="ink">Partner with us</ButtonLink>
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
