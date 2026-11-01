import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-site ${className}`}>{children}</div>;
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span className={`text-sm font-semibold ${light ? "text-sun" : "text-leaf"}`}>{children}</span>
  );
}

export function SectionTitle({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <h2
      className={`font-display text-3xl font-bold leading-tight sm:text-[2.4rem] ${
        light ? "text-white" : "text-ink"
      }`}
    >
      {children}
    </h2>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "sun" | "ink" | "outline-light" | "outline";
  arrow?: boolean;
};

const variants = {
  sun: "bg-sun text-ink hover:brightness-95",
  ink: "bg-ink text-white hover:bg-ink-deep",
  "outline-light": "border-[1.5px] border-white text-white hover:bg-white/10",
  outline: "border border-ink text-ink hover:bg-mist",
};

export function ButtonLink({ href, children, variant = "sun", arrow = false }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex h-[52px] items-center gap-2 rounded-[10px] px-6 font-bold no-underline ${variants[variant]}`}
    >
      {children}
      {arrow && <ArrowRight size={18} aria-hidden="true" />}
    </Link>
  );
}

export function TextLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-11 items-center gap-1.5 font-bold text-leaf no-underline hover:text-ink"
    >
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}

export function PageHeader({ title, intro }: { title: string; intro?: string }) {
  return (
    <section className="bg-ink px-6 py-16 text-white sm:py-20">
      <Container className="flex flex-col gap-4">
        <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight sm:text-5xl">{title}</h1>
        {intro && <p className="max-w-2xl text-lg text-haze sm:text-xl">{intro}</p>}
      </Container>
    </section>
  );
}

export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-[#A9BAB4] bg-white p-8">
      <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="max-w-xl">{children}</p>
      {action && <TextLink href={action.href}>{action.label}</TextLink>}
    </div>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="flex max-w-3xl flex-col gap-5 text-[18px] [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink [&_li]:ml-5 [&_li]:list-disc">
      {children}
    </div>
  );
}
