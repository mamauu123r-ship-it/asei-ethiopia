import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm";
import { Container, PageHeader } from "@/components/ui";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact ASEI",
  description: "Contact Africa Solar Energy Initiative.",
};

export default async function ContactPage() {
  const site = await getSettings();
  const items = [
    { Icon: MapPin, label: "Address", value: site.address },
    { Icon: Mail, label: "Email", value: site.email },
    { Icon: Phone, label: "Telephone", value: site.phone },
  ];
  return (
    <>
      <PageHeader title="Contact ASEI" intro="Questions, partnership ideas or media requests: we would like to hear from you." />
      <section className="px-6 py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <ul className="flex flex-col gap-6">
            {items.map(({ Icon, label, value }) => (
              <li key={label} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-sage text-leaf">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-sm text-muted">{label}</span>
                  <span className="font-semibold text-ink">{value}</span>
                </span>
              </li>
            ))}
          </ul>
          <div className="rounded-2xl border border-line p-6 sm:p-8">
            <h2 className="mb-6 font-display text-2xl font-bold text-ink">Send us a message</h2>
            <ContactForm />
          </div>
        </Container>
      </section>
    </>
  );
}
