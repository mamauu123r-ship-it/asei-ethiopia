import Link from "next/link";
import { LogoMark } from "./Logo";
import { organizationLinks, site } from "@/lib/site";
import { getPrograms, getSettings } from "@/lib/content";

export async function Footer() {
  const [programs, settings] = await Promise.all([getPrograms(), getSettings()]);
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-deep px-6 pb-8 pt-16 text-haze">
      <div className="mx-auto flex max-w-site flex-col gap-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-3.5">
            <span className="flex items-center gap-2.5 font-display text-xl font-bold text-white">
              <LogoMark variant="light" size={36} />
              {site.shortName}
            </span>
            <span className="font-semibold text-sun">{site.slogan}</span>
            <p className="text-[15px]">
              Promoting accessible, affordable and sustainable solar energy
              through engineering, education, research and partnerships.
            </p>
          </div>

          <nav aria-label="Organization" className="flex flex-col gap-2 text-[15px]">
            <h2 className="mb-1 font-bold text-white">Organization</h2>
            {organizationLinks.map((l) => (
              <Link key={l.href} href={l.href} className="text-haze no-underline hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>

          <nav aria-label="Programs" className="flex flex-col gap-2 text-[15px]">
            <h2 className="mb-1 font-bold text-white">Programs</h2>
            {programs.map((p) => (
              <Link
                key={p.slug}
                href={`/programs/${p.slug}`}
                className="text-haze no-underline hover:text-white"
              >
                {p.title}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2 text-[15px]">
            <h2 className="mb-1 font-bold text-white">Contact</h2>
            <span>{settings.address}</span>
            {settings.email && (
              <a href={`mailto:${settings.email}`} className="text-haze hover:text-white">
                {settings.email}
              </a>
            )}
            <span>{settings.phone}</span>
            <div className="mt-2 flex flex-wrap gap-3.5">
              {settings.social.filter((s) => s.href).map((s) => (
                <a key={s.label} href={s.href} className="text-white" rel="noopener noreferrer">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-4 border-t border-[#2A403A] pt-6 text-sm">
          <span>
            © {year} {site.name}. All rights reserved.
          </span>
          <span className="flex gap-5">
            <Link href="/privacy-policy" className="text-haze hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-haze hover:text-white">
              Terms and Conditions
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
