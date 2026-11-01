import type { Metadata } from "next";
import { ProgramCard } from "@/components/cards";
import { Container, PageHeader } from "@/components/ui";
import { getPrograms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Programs",
  description: "ASEI's six programs in solar engineering, training, agriculture, research, community energy, schools and healthcare.",
};

export default async function ProgramsPage() {
  const programs = await getPrograms();
  return (
    <>
      <PageHeader
        title="Our Programs"
        intro="Six programs that bring solar energy, skills and research to communities and institutions."
      />
      <section className="bg-mist px-6 py-20">
        <Container className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <ProgramCard key={p.slug} program={p} />
          ))}
        </Container>
      </section>
    </>
  );
}
