import type { Metadata } from "next";
import { Container, PageHeader, Prose } from "@/components/ui";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Terms and Conditions" };

// Starter text only. Have it reviewed before launch.
export default async function TermsPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader title="Terms and Conditions" intro="Last updated: [date]" />
      <section className="px-6 py-16">
        <Container>
          <Prose>
            <p>By using this website you agree to these terms.</p>
            <h2>Use of content</h2>
            <p>
              Content on this website belongs to {site.name} unless stated otherwise. You may share
              it for non-commercial purposes if you credit {site.shortName} and link to the source.
            </p>
            <h2>Accuracy</h2>
            <p>
              We work to keep information accurate and up to date, but we cannot guarantee that all
              content is complete or current. Project figures are published only after verification.
            </p>
            <h2>Links to other websites</h2>
            <p>We are not responsible for the content of external websites we link to.</p>
            <h2>Contact</h2>
            <p>Questions about these terms can be sent to {settings.email}.</p>
          </Prose>
        </Container>
      </section>
    </>
  );
}
