"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Globe, Menu, Search, X } from "lucide-react";
import { LogoMark } from "./Logo";
import { mainNav, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white">
      <div className="mx-auto flex max-w-site items-center gap-6 px-6 py-3.5">
        <Link href="/" className="flex items-center gap-3 text-ink no-underline">
          <LogoMark />
          <span className="flex flex-col leading-tight">
            <span className="font-display text-xl font-bold tracking-wide">
              {site.shortName}
            </span>
            <span className="hidden text-[13px] text-muted sm:block">
              {site.name}
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main"
          className="ml-auto hidden items-center gap-5 text-[15px] font-semibold lg:flex"
        >
          {mainNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`py-2 text-ink no-underline hover:text-leaf ${
                isActive(item.href) ? "border-b-2 border-sun" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Link
            href="/search"
            aria-label="Search the website"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-mist"
          >
            <Search size={20} aria-hidden="true" />
          </Link>
          <button
            type="button"
            aria-label="Language: English. Amharic is coming soon."
            title="Amharic coming soon"
            className="hidden h-11 items-center gap-1.5 rounded-lg border border-[#D3DDD9] bg-white px-3 text-sm font-semibold text-ink sm:inline-flex"
          >
            <Globe size={16} aria-hidden="true" />
            EN
          </button>
          <Link
            href="/contact"
            className="hidden h-11 items-center rounded-lg border border-ink px-4 text-[15px] font-semibold text-ink no-underline hover:bg-mist md:inline-flex"
          >
            Contact
          </Link>
          <Link
            href="/get-involved"
            className="hidden h-11 items-center rounded-lg bg-sun px-4 text-[15px] font-bold text-ink no-underline hover:brightness-95 sm:inline-flex"
          >
            Support Our Mission
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[#D3DDD9] bg-white text-ink lg:hidden"
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="flex flex-col border-t border-line px-6 pb-4 pt-2 font-semibold lg:hidden"
        >
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="py-3 text-ink no-underline">
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="py-3 text-ink no-underline">
            Contact
          </Link>
          <Link
            href="/get-involved"
            className="mt-2 inline-flex h-12 items-center justify-center rounded-lg bg-sun font-bold text-ink no-underline sm:hidden"
          >
            Support Our Mission
          </Link>
        </nav>
      )}
    </header>
  );
}
