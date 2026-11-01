import { HeroIllustration } from "@/components/HeroIllustration";
import { NewsletterForm } from "@/components/NewsletterForm";
import { NewsCard, ProgramCard, ProjectCard } from "@/components/cards";
import { ButtonLink, Container, EmptyState, Eyebrow, SectionTitle, TextLink } from "@/components/ui";
import {
  getImpact,
  getNews,
  getPrograms,
  getProjects,
  getPublications,
  getSettings,
} from "@/lib/content";
import { site } from "@/lib/site";

export default async function HomePage() {
  const [programs, projects, impact, news, publications, settings] = await Promise.all([
    getPrograms(),
    getProjects(),
    getImpact(),
    getNews(),
    getPublications(),
    getSettings(),
  ]);

  const featuredProjects = projects.slice(0, 3);
  const latestNews = news.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="overflow-hidden bg-ink text-white">
        <Container className="grid items-center gap-14 px-6 pb-24 pt-16 sm:pt-20 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <Eyebrow light>Starting in Ethiopia, growing across Africa</Eyebrow>
            <h1 className="font-display text-[2.6rem] font-bold leading-[1.08] tracking-tight sm:text-[3.4rem]">
              {site.slogan}
            </h1>
            <p className="max-w-xl text-xl leading-normal text-haze">{site.description}</p>
            <div className="mt-2 flex flex-wrap gap-3.5">
              <ButtonLink href="/programs" arrow>
                Explore Our Programs
              </ButtonLink>
              <ButtonLink href="/partners" variant="outline-light">
                Partner With Us
              </ButtonLink>
            </div>
          </div>
          <div className="relative min-h-[300px] overflow-hidden rounded-[20px] sm:min-h-[380px]">
            <div className="absolute inset-0">
              <HeroIllustration />
            </div>
          </div>
        </Container>
      </section>

      {/* Introduction */}
      <section className="px-6 py-24">
        <Container className="grid items-start gap-12 md:grid-cols-2">
          <div className="flex flex-col gap-3.5">
            <Eyebrow>Who we are</Eyebrow>
            <SectionTitle>Advancing Renewable Energy Across Africa</SectionTitle>
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[19px]">
              Africa Solar Energy Initiative (ASEI) is dedicated to promoting accessible,
              affordable, and sustainable energy solutions through engineering, education,
              research, innovation, and strategic partnerships.
            </p>
            <p>
              We aim to support communities, institutions, and businesses in adopting renewable
              energy technologies that contribute to sustainable development.
            </p>
            <TextLink href="/about">Read more about ASEI</TextLink>
          </div>
        </Container>
      </section>

      {/* Programs */}
      <section className="bg-mist px-6 py-24">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-col gap-3">
            <Eyebrow>What we do</Eyebrow>
            <SectionTitle>Our Main Programs</SectionTitle>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <ProgramCard key={p.slug} program={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* Projects */}
      <section className="px-6 py-24">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <Eyebrow>Project portfolio</Eyebrow>
              <SectionTitle>Featured Projects</SectionTitle>
            </div>
            <TextLink href="/projects">View all projects</TextLink>
          </div>
          {featuredProjects.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((p) => (
                <ProjectCard key={p.slug} project={p} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="Our first projects are being prepared"
              action={{ href: "/partners", label: "Work with us on a project" }}
            >
              Projects will appear here once they are approved. If you would like to fund,
              host or support a solar project, we would like to hear from you.
            </EmptyState>
          )}
        </Container>
      </section>

      {/* Impact */}
      <section className="bg-ink px-6 py-20 text-white">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle light>Our Impact</SectionTitle>
            {settings.impactIsPilot && (
              <span className="rounded-full border border-sun px-3 py-1.5 text-sm font-semibold text-sun">
                Pilot stage: figures are updated as results are verified
              </span>
            )}
          </div>
          <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {impact.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1.5 border-t-2 border-sun pt-5">
                <dt className="text-haze">{s.label}</dt>
                <dd className="font-display text-[2.6rem] font-bold">
                  {s.value.toLocaleString("en")}
                  {s.unit ? ` ${s.unit}` : ""}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* Partnership */}
      <section className="px-6 py-24">
        <Container className="grid items-center gap-8 rounded-3xl bg-sun-pale px-8 py-14 sm:px-10 md:grid-cols-2">
          <div className="flex flex-col gap-4">
            <SectionTitle>Become a Partner in Africa&apos;s Energy Future</SectionTitle>
            <p>
              ASEI welcomes collaboration with universities, governments, renewable energy
              companies, international development organizations, research institutions, and
              individuals committed to sustainable energy development.
            </p>
          </div>
          <div>
            <ButtonLink href="/partners" variant="ink" arrow>
              Explore Partnership Opportunities
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* News and publications */}
      <section className="px-6 pb-24">
        <Container className="flex flex-col gap-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-col gap-3">
              <Eyebrow>Latest</Eyebrow>
              <SectionTitle>News and Publications</SectionTitle>
            </div>
            <TextLink href="/news">All news</TextLink>
          </div>
          {latestNews.length > 0 || publications.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((a) => (
                <NewsCard key={a.slug} article={a} />
              ))}
            </div>
          ) : (
            <EmptyState title="News is on its way" action={{ href: "#newsletter", label: "Get updates by email" }}>
              Announcements, project updates and research reports will be published here.
            </EmptyState>
          )}
        </Container>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="bg-mist px-6 py-20">
        <Container className="grid items-center gap-8 md:grid-cols-2">
          <div className="flex flex-col gap-2.5">
            <h2 className="font-display text-3xl font-bold text-ink">Stay updated</h2>
            <p>Get news about ASEI projects, training and research. You can unsubscribe at any time.</p>
          </div>
          <NewsletterForm />
        </Container>
      </section>
    </>
  );
}
