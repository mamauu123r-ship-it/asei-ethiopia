import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <>
    <Header />
    <main id="main">
    <section className="px-6 py-28">
      <Container className="flex flex-col items-start gap-5">
        <h1 className="font-display text-4xl font-bold text-ink">Page not found</h1>
        <p className="max-w-xl">
          This page does not exist or has moved. Use the menu above, or go back to the homepage.
        </p>
        <ButtonLink href="/">Go to homepage</ButtonLink>
      </Container>
    </section>
    </main>
    <Footer />
    </>
  );
}
