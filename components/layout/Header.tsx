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
    <svg aria-hidden className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

const MOBILE_HEADER_PX = 88;

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
      <div className="border-b border-navy-light bg-navy shadow-sm">
        <div className="mx-auto flex max-w-portal items-center gap-1 px-3 py-1 sm:px-6 sm:py-2">
          <Link
            href="/"
            onClick={closeMenu}
            className="flex min-w-0 flex-1 items-center py-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <Image
              src="/images/logo.png"
              alt="Hukuk Portalı"
              width={480}
              height={144}
              priority
              sizes="(max-width: 1024px) min(72vw, 320px), 360px"
              className="h-20 w-auto max-w-[min(78vw,340px)] object-contain object-left brightness-0 invert sm:h-[4.5rem] sm:max-w-[380px] lg:h-[5rem]"
            />
          </Link>

          <div className="flex shrink-0 items-center">
            <Link
              href="/arama"
              className="touch-target rounded-full text-white/90 transition hover:text-gold active:bg-white/10 lg:hidden"
              aria-label="Ara"
            >
              <SearchIcon className="h-[1.35rem] w-[1.35rem]" />
            </Link>

            <button
              type="button"
              className="touch-target rounded-full text-white/90 transition hover:text-gold active:bg-white/10 lg:hidden"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.75">
                {isMenuOpen ? (
                  <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
                ) : (
                  <>
                    <path strokeLinecap="round" d="M4 8h16" />
                    <path strokeLinecap="round" d="M4 16h16" />
                  </>
                )}
              </svg>
            </button>

            <Link
              href="/arama"
              className="ml-2 hidden min-h-11 items-center gap-2 rounded-sm border border-white/15 px-3 text-sm font-medium text-white/90 transition hover:border-gold/60 hover:text-gold lg:inline-flex"
              aria-label="Site içinde ara"
            >
              <SearchIcon className="h-4 w-4" />
              <span className="hidden xl:inline">Ara</span>
            </Link>
          </div>
        </div>

        <nav className="hidden border-t border-white/10 lg:block" aria-label="Ana menü">
          <div className="mx-auto flex max-w-portal flex-wrap items-stretch px-6">
            {navItems.map((item) => {
              const active = isNavActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-10 items-center border-b-2 px-3 text-[11px] font-bold uppercase tracking-wider transition",
                    active
                      ? "border-gold text-gold"
                      : "border-transparent text-white/70 hover:border-gold/40 hover:text-white"
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
        <div
          className="fixed inset-x-0 bottom-0 z-50 flex flex-col bg-navy lg:hidden"
          style={{ top: MOBILE_HEADER_PX }}
          id="mobile-navigation"
        >
          <nav className="flex-1 overflow-y-auto px-4 py-3" aria-label="Mobil menü">
            <Link
              href="/arama"
              onClick={closeMenu}
              className="mb-3 flex min-h-12 items-center gap-3 border border-gold/30 bg-navy-light/80 px-4 text-sm font-semibold tracking-wide text-gold"
            >
              <SearchIcon className="h-5 w-5" />
              İçerikte ara
            </Link>
            <ul className="divide-y divide-white/10">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={closeMenu}
                    className={cn(
                      "flex min-h-12 items-center px-1 text-[15px] font-medium tracking-tight transition active:text-gold",
                      isNavActive(item.href) ? "text-gold" : "text-white/90"
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="border-t border-white/10 px-4 py-2.5 text-center text-[10px] uppercase tracking-widest text-white/45">
            Hukuk · LegalTech · Yapay Zekâ
          </p>
        </div>
      ) : null}
    </header>
  );
}
