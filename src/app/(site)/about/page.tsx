import type { Metadata } from "next";
import { ButtonLink, Container, PageHeader, Prose, SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "About ASEI",
  description:
    "Africa Solar Energy Initiative promotes accessible, affordable and sustainable solar energy across Africa, starting in Ethiopia.",
};

const approach = [
  { title: "Engineering", text: "Well-designed, safe and lasting solar systems." },
  { title: "Education", text: "Practical training that builds local skills." },
  { title: "Research", text: "Evidence on what works in African conditions." },
  { title: "Partnerships", text: "Working with universities, government, business and communities." },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About ASEI"
        intro="Africa Solar Energy Initiative promotes accessible, affordable and sustainable energy across Africa."
      />
      <section className="px-6 py-20">
        <Container>
          <Prose>
            <p>
              Africa Solar Energy Initiative (ASEI) is dedicated to promoting accessible, affordable,
              and sustainable energy solutions through engineering, education, research, innovation,
              and strategic partnerships.
            </p>
            <p>
              We aim to support communities, institutions, and businesses in adopting renewable
              energy technologies that contribute to sustainable development.
            </p>
            <p>
              Our work begins in Ethiopia. As we grow, we plan to expand across Africa and to build
              international partnerships that bring knowledge, funding and technology together.
            </p>
          </Prose>
        </Container>
      </section>
      <section className="bg-mist px-6 py-20">
        <Container className="flex flex-col gap-10">
          <SectionTitle>How we work</SectionTitle>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {approach.map((a) => (
              <li key={a.title} className="rounded-2xl border border-line bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-ink">{a.title}</h3>
                <p className="mt-2">{a.text}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3.5">
            <ButtonLink href="/vision-mission" variant="ink">Our vision and mission</ButtonLink>
            <ButtonLink href="/programs" variant="outline">See our programs</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
