"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { TopBar } from "@/components/layout/TopBar";
import { navItems } from "@/lib/site";
import { cn } from "@/lib/utils";

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function isNavActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50">
      <TopBar />
      <div className="border-b border-navy-light/80 bg-navy shadow-editorial">
        <div className="mx-auto flex max-w-portal items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-3">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-w-0 flex-1 items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Image
              src="/images/logo.png"
              alt="Hukuk Portalı"
              width={400}
              height={120}
              priority
              sizes="(max-width: 1024px) 220px, 280px"
              className="h-10 w-auto max-w-[min(58vw,220px)] object-contain brightness-0 invert sm:h-11 sm:max-w-[280px] lg:h-12"
            />
          </Link>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              href="/arama"
              className="touch-target rounded-sm text-white transition active:bg-white/10 active:text-gold lg:hidden"
              aria-label="Ara"
            >
              <SearchIcon className="h-5 w-5" />
            </Link>

            <button
              type="button"
              className="touch-target rounded-sm text-white transition active:bg-white/10 active:text-gold lg:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
                {isMenuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>

            <Link
              href="/arama"
              className="hidden min-h-11 items-center gap-2 rounded-sm border border-white/20 px-3 text-sm font-semibold text-white transition hover:border-gold hover:text-gold lg:inline-flex"
              aria-label="Site içinde ara"
            >
              <SearchIcon className="h-4 w-4" />
              <span className="hidden xl:inline">Ara</span>
            </Link>
          </div>
        </div>

        <nav className="hidden border-t border-white/10 lg:block" aria-label="Ana menü">
          <div className="mx-auto flex max-w-portal flex-wrap items-stretch gap-0 px-6">
            {navItems.map((item) => {
              const active = isNavActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center border-b-2 px-3 text-xs font-bold uppercase tracking-wider transition",
                    active
                      ? "border-gold text-gold"
                      : "border-transparent text-white/75 hover:border-gold/50 hover:text-white"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

      {isMenuOpen ? (
        <div className="fixed inset-0 top-[52px] z-50 flex flex-col bg-navy lg:hidden sm:top-[56px]" id="mobile-navigation">
          <nav className="flex-1 overflow-y-auto px-4 py-4" aria-label="Mobil menü">
            <Link
              href="/arama"
              onClick={closeMenu}
              className="mb-4 flex min-h-12 items-center gap-3 rounded-sm border border-gold/40 bg-navy-light px-4 text-sm font-bold uppercase tracking-wide text-gold"
            >
              <SearchIcon className="h-5 w-5" />
              İçerikte ara
            </Link>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex min-h-12 items-center border-l-2 px-4 text-base font-semibold tracking-tight transition active:bg-navy-light",
                      isNavActive(item.href)
                        ? "border-gold bg-navy-light text-gold"
                        : "border-transparent text-white/90"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="border-t border-white/10 px-4 py-3 text-center text-[11px] text-white/50">
            Bağımsız hukuk &amp; LegalTech yayını
          </p>
        </div>
      ) : null}
    </header>
  );
}
