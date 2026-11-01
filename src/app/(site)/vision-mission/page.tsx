import type { Metadata } from "next";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Vision and Mission",
  description: "The vision, mission and values of Africa Solar Energy Initiative.",
};

// Draft wording based on ASEI's purpose. Confirm or replace before launch.
const values = [
  { title: "Access", text: "Clean energy should reach the people and places that need it most." },
  { title: "Quality", text: "Systems must be safe, reliable and built to last." },
  { title: "Local skills", text: "Lasting change comes from people who can run and repair their own systems." },
  { title: "Honesty", text: "We report results only when they are verified." },
  { title: "Partnership", text: "We achieve more by working with others." },
];

export default function VisionMissionPage() {
  return (
    <>
      <PageHeader title="Vision and Mission" />
      <section className="px-6 py-20">
        <Container className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl bg-sun-pale p-8">
            <h2 className="font-display text-2xl font-bold text-ink">Our vision</h2>
            <p className="mt-3 text-lg">
              An Africa where every community, institution and business has access to clean,
              affordable and reliable energy.
            </p>
          </div>
          <div className="rounded-2xl bg-sage p-8">
            <h2 className="font-display text-2xl font-bold text-ink">Our mission</h2>
            <p className="mt-3 text-lg">
              To advance sustainable energy through solar engineering, research, innovation,
              education and community development, starting in Ethiopia.
            </p>
          </div>
        </Container>
      </section>
      <section className="bg-mist px-6 py-20">
        <Container className="flex flex-col gap-8">
          <h2 className="font-display text-3xl font-bold text-ink">Our values</h2>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <li key={v.title} className="rounded-2xl border border-line bg-white p-6">
                <h3 className="font-display text-lg font-semibold text-ink">{v.title}</h3>
                <p className="mt-2">{v.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
