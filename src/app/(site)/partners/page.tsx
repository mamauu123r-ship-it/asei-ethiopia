import type { Metadata } from "next";
import Image from "next/image";
import { Building2, FlaskConical, Handshake, Landmark, Users } from "lucide-react";
import { PartnershipForm } from "@/components/forms/PartnershipForm";
import { Container, PageHeader, SectionTitle } from "@/components/ui";
import { getPartners } from "@/lib/content";

export const metadata: Metadata = {
  title: "Partnerships",
  description: "Partner with Africa Solar Energy Initiative on solar energy, training and research.",
};

const partnerTypes = [
  { Icon: FlaskConical, title: "Universities and research institutions", text: "Joint research, student placements and shared publications." },
  { Icon: Landmark, title: "Government", text: "Energy access programs, policy research and public institutions." },
  { Icon: Building2, title: "Renewable energy companies", text: "Technology, installation and training partnerships." },
  { Icon: Handshake, title: "Development organizations", text: "Funding and delivering community energy projects." },
  { Icon: Users, title: "Individuals", text: "Professionals and supporters who share our mission." },
];

export default async function PartnersPage() {
  const partners = await getPartners();
  return (
    <>
      <PageHeader
        title="Become a Partner in Africa's Energy Future"
        intro="ASEI welcomes collaboration with universities, governments, renewable energy companies, international development organizations, research institutions, and individuals committed to sustainable energy development."
      />
      <section className="px-6 py-20">
        <Container className="flex flex-col gap-10">
          <SectionTitle>Who we work with</SectionTitle>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partnerTypes.map(({ Icon, title, text }) => (
              <li key={title} className="flex flex-col gap-3 rounded-2xl border border-line p-6">
                <Icon size={32} strokeWidth={1.6} className="text-leaf" aria-hidden="true" />
                <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      {partners.length > 0 && (
        <section className="bg-mist px-6 py-20">
          <Container className="flex flex-col gap-8">
            <SectionTitle>Our partners</SectionTitle>
            <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {partners.map((p) => (
                <li key={p.name} className="flex h-28 items-center justify-center rounded-xl bg-white p-4">
                  {p.logoUrl ? (
                    <Image src={p.logoUrl} alt={p.name} width={160} height={80} className="object-contain" />
                  ) : (
                    <span className="text-center font-semibold text-ink">{p.name}</span>
                  )}
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}
      <section id="apply" className="px-6 pb-24">
        <Container className="grid gap-10 rounded-3xl bg-sun-pale px-6 py-12 sm:px-10 lg:grid-cols-[1fr_1.6fr]">
          <div className="flex flex-col gap-3">
            <h2 className="font-display text-3xl font-bold text-ink">Apply to partner with us</h2>
            <p>Tell us about your organization and how you would like to work together. We reply to every application.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 sm:p-8">
            <PartnershipForm />
          </div>
        </Container>
      </section>
    </>
  );
}
