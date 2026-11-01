import type { Metadata } from "next";
import { ButtonLink, Container, PageHeader, Prose, SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Research and Innovation",
  description: "ASEI's applied research on solar energy in African conditions.",
};

const themes = [
  { title: "System performance", text: "How solar systems perform in local climate, dust and altitude conditions." },
  { title: "Energy storage", text: "Affordable, safe and long-lasting storage for homes, clinics and mini-grids." },
  { title: "Local technology", text: "Designs and components that can be made, repaired and improved locally." },
  { title: "Policy and markets", text: "What helps solar energy reach more people at fair prices." },
];

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        title="Research and Innovation"
        intro="Applied research that helps solar energy work better for African communities."
      />
      <section className="px-6 py-20">
        <Container>
          <Prose>
            <p>
              Good decisions need good evidence. Our research studies how solar technologies perform
              in real conditions and how they can be made more affordable and reliable.
            </p>
            <p>
              We work with universities and research institutions, and we publish our findings so
              others can learn from them.
            </p>
          </Prose>
        </Container>
      </section>
      <section className="bg-mist px-6 py-20">
        <Container className="flex flex-col gap-8">
          <SectionTitle>Research themes</SectionTitle>
          <ul className="grid gap-6 sm:grid-cols-2">
            {themes.map((t) => (
              <li key={t.title} className="rounded-2xl border border-line bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-ink">{t.title}</h3>
                <p className="mt-2">{t.text}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3.5">
            <ButtonLink href="/publications" variant="ink">Read our publications</ButtonLink>
            <ButtonLink href="/partners" variant="outline">Research partnerships</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
