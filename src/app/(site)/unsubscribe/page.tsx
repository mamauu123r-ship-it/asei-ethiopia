import type { Metadata } from "next";
import { Container } from "@/components/ui";
import { UnsubscribeForm } from "./UnsubscribeForm";

export const metadata: Metadata = { title: "Unsubscribe", robots: { index: false } };

type Props = { searchParams: Promise<{ token?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token = "" } = await searchParams;
  return (
    <section className="px-6 py-24">
      <Container className="flex max-w-xl flex-col gap-5">
        <h1 className="font-display text-4xl font-bold text-ink">Unsubscribe from updates</h1>
        <p>Press the button to stop receiving ASEI newsletters at this email address.</p>
        <UnsubscribeForm token={token} />
      </Container>
    </section>
  );
}
