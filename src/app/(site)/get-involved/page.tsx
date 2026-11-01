import type { Metadata } from "next";
import { VolunteerForm } from "@/components/forms/VolunteerForm";
import { ButtonLink, Container, PageHeader } from "@/components/ui";
import { getPrograms } from "@/lib/content";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Volunteer with ASEI or become a member and help bring solar energy to more communities.",
};

const ways = [
  { title: "Volunteer", text: "Engineers, trainers, researchers, communicators and organizers can share their skills with our programs.", href: "#volunteer", cta: "Apply to volunteer" },
  { title: "Become a member", text: "Join a growing network of people committed to clean energy in Africa. Membership opens soon: subscribe to hear first.", href: "/#newsletter", cta: "Get updates" },
  { title: "Partner with us", text: "Organizations can work with us on projects, training and research.", href: "/partners", cta: "Partnership options" },
];

export default async function GetInvolvedPage() {
  const programs = await getPrograms();
  return (
    <>
      <PageHeader
        title="Get Involved"
        intro="Support our mission with your time, skills or partnership."
      />
      <section className="px-6 py-20">
        <Container className="grid gap-6 md:grid-cols-3">
          {ways.map((w) => (
            <div key={w.title} className="flex flex-col gap-3 rounded-2xl border border-line p-6">
              <h2 className="font-display text-xl font-semibold text-ink">{w.title}</h2>
              <p className="flex-grow">{w.text}</p>
              {w.href && <ButtonLink href={w.href} variant="outline">{w.cta}</ButtonLink>}
            </div>
          ))}
        </Container>
      </section>
      <section id="volunteer" className="bg-mist px-6 py-20">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-3xl font-bold text-ink">Volunteer application</h2>
            <p>Tell us about your background and where you would like to help. You will get a confirmation as soon as you send the form.</p>
          </div>
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            <VolunteerForm areas={programs.map((p) => p.title)} />
          </div>
        </Container>
      </section>
    </>
  );
}
