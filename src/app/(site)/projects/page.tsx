import type { Metadata } from "next";
import { ProjectCard } from "@/components/cards";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { getProjects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects",
  description: "ASEI's solar energy project portfolio, starting in Ethiopia.",
};

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHeader
        title="Project Portfolio"
        intro="Solar projects we are planning, funding and delivering with our partners. Each project shows its current status."
      />
      <section className="px-6 py-20">
        <Container>
          {projects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Our first projects are being prepared"
              action={{ href: "/partners", label: "Work with us on a project" }}
            >
              Approved projects will be listed here with their location and status. If you would
              like to fund, host or support a solar project, get in touch.
            </EmptyState>
          )}
        </Container>
      </section>
    </>
  );
}
