import type { Metadata } from "next";
import { Container, PageHeader, Prose } from "@/components/ui";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/content";

export const metadata: Metadata = { title: "Privacy Policy" };

// Starter text only. Have it reviewed for Ethiopian law and any other
// countries you operate in before launch.
export default async function PrivacyPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader title="Privacy Policy" intro="Last updated: [date]" />
      <section className="px-6 py-16">
        <Container>
          <Prose>
            <p>
              {site.name} ({site.shortName}) respects your privacy. This policy explains what
              information we collect through this website and how we use it.
            </p>
            <h2>Information we collect</h2>
            <p>
              We collect the information you choose to send us through our forms, such as your name,
              email address, organization, country and message. If you subscribe to our newsletter,
              we store your email address and a record of your consent.
            </p>
            <h2>How we use it</h2>
            <p>
              We use your information only to reply to you, to process volunteer and partnership
              applications, and to send newsletters you asked for. We do not sell your information.
            </p>
            <h2>Storage and security</h2>
            <p>
              Information is stored with our database provider using access controls, so only
              authorized ASEI staff can see it.
            </p>
            <h2>Your choices</h2>
            <p>
              You can unsubscribe from our newsletter at any time, and you can ask us to see, correct
              or delete your information by contacting {settings.email}.
            </p>
          </Prose>
        </Container>
      </section>
    </>
  );
}
