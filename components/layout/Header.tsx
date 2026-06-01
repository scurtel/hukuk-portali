"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Container } from "@/components/layout/Container";
import { TopBar } from "@/components/layout/TopBar";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function isNavActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 shadow-sm">
      <TopBar />
      <div className="border-b border-slate-200 bg-white">
        <Container wide className="py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              onClick={closeMenu}
              className="inline-flex shrink-0 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
            >
              <Image
                src="/images/logo.png"
                alt="Hukuk Portalı"
                width={360}
                height={120}
                priority
                sizes="(max-width: 640px) 200px, 260px"
                className="h-14 w-auto max-w-[200px] object-contain sm:h-16 sm:max-w-[260px]"
              />
            </Link>

            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center border border-slate-300 text-brand-900 lg:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                {isMenuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>

            <Link
              href="/arama"
              className="hidden min-h-11 items-center gap-1.5 rounded-sm border border-slate-200 px-3 text-sm font-semibold text-ink-muted transition hover:border-brand-500 hover:text-brand-900 lg:inline-flex"
              aria-label="Site içinde ara"
            >
              <svg aria-hidden className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
              <span className="hidden xl:inline">Ara</span>
            </Link>

            <nav className="hidden items-stretch gap-0 lg:flex" aria-label="Ana menü">
              {navItems.map((item) => {
                const active = isNavActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "inline-flex min-h-11 items-center border-b-2 px-3 text-sm font-semibold uppercase tracking-wide transition",
                      active
                        ? "border-accent-red text-brand-900"
                        : "border-transparent text-ink-muted hover:border-brand-500 hover:text-brand-900"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div
            id="mobile-navigation"
            className={cn(
              "grid overflow-hidden transition-all duration-300 lg:hidden",
              isMenuOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}
          >
            <nav className="min-h-0 space-y-0 border border-slate-200 bg-slate-50" aria-label="Mobil menü">
              <Link
                href="/arama"
                onClick={closeMenu}
                className="flex min-h-12 items-center gap-2 border-b border-slate-200 px-4 text-sm font-semibold uppercase tracking-wide text-brand-700"
              >
                Ara
              </Link>
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex min-h-12 items-center border-b border-slate-200 px-4 text-sm font-semibold uppercase tracking-wide last:border-0",
                    isNavActive(item.href) ? "bg-white text-accent-red" : "text-ink hover:bg-white"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </div>
    </header>
  );
}
