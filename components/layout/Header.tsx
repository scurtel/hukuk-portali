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

function NavLink({
  item,
  active,
  onClick,
  className
}: {
  item: { label: string; href: string };
  active: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "transition",
        active ? "text-gold" : "text-white/75 hover:text-white",
        className
      )}
    >
      {item.label}
    </Link>
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

      <div className="border-b border-navy-light bg-navy shadow-sm">
        {/* Mobil */}
        <div className="mx-auto flex max-w-portal items-center gap-1 px-3 py-1 lg:hidden sm:px-6 sm:py-2">
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
              sizes="(max-width: 1024px) min(78vw, 340px)"
              className="h-20 w-auto max-w-[min(78vw, 340px)] object-contain object-left brightness-0 invert"
            />
          </Link>
          <div className="flex shrink-0 items-center">
            <Link
              href="/arama"
              className="touch-target rounded-full text-white/90 transition active:bg-white/10 active:text-gold"
              aria-label="Ara"
            >
              <SearchIcon className="h-[1.35rem] w-[1.35rem]" />
            </Link>
            <button
              type="button"
              className="touch-target rounded-full text-white/90 transition active:bg-white/10 active:text-gold"
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
          </div>
        </div>

        {/* Masaüstü — tek satır, kompakt */}
        <div className="mx-auto hidden max-w-portal items-center gap-6 px-6 py-3 lg:flex">
          <Link href="/" className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold">
            <Image
              src="/images/logo.png"
              alt="Hukuk Portalı"
              width={320}
              height={96}
              priority
              className="h-11 w-auto max-w-[200px] object-contain object-left brightness-0 invert"
            />
          </Link>

          <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-1 gap-y-1" aria-label="Ana menü">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isNavActive(item.href)}
                className={cn(
                  "inline-flex min-h-9 items-center px-2.5 text-[11px] font-semibold uppercase tracking-wide",
                  isNavActive(item.href) && "border-b border-gold"
                )}
              />
            ))}
          </nav>

          <Link
            href="/arama"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 border border-white/20 px-4 text-sm font-medium text-white/90 transition hover:border-gold/50 hover:text-gold"
            aria-label="Site içinde ara"
          >
            <SearchIcon className="h-4 w-4" />
            Ara
          </Link>
        </div>
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
                  <NavLink
                    item={item}
                    active={isNavActive(item.href)}
                    onClick={closeMenu}
                    className="flex min-h-12 items-center px-1 text-[15px] font-medium tracking-tight active:text-gold"
                  />
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
