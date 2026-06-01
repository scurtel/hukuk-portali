"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

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
        active ? "text-gold" : "text-white/80 hover:text-white",
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
  const mobileBarRef = useRef<HTMLDivElement>(null);
  const [mobileMenuTop, setMobileMenuTop] = useState(80);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  useEffect(() => {
    function measure() {
      if (mobileBarRef.current) {
        setMobileMenuTop(mobileBarRef.current.getBoundingClientRect().bottom);
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  function isNavActive(href: string): boolean {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-50 bg-navy">
      <TopBar />

      <div ref={mobileBarRef} className="border-b border-navy-light">
        {/* Mobil */}
        <div className="mx-auto flex max-w-portal items-center justify-between gap-2 px-3 py-2 lg:hidden">
          <Link href="/" onClick={closeMenu} className="shrink-0">
            <Image
              src="/images/logo.png"
              alt="Hukuk Portalı"
              width={280}
              height={84}
              priority
              className="h-11 w-auto max-w-[200px] object-contain object-left brightness-0 invert"
            />
          </Link>
          <div className="flex items-center gap-0.5">
            <Link
              href="/arama"
              className="touch-target text-white/90 active:text-gold"
              aria-label="Ara"
            >
              <SearchIcon className="h-5 w-5" />
            </Link>
            <button
              type="button"
              className="touch-target text-white/90 active:text-gold"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
            >
              <svg aria-hidden viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.75">
                {isMenuOpen ? (
                  <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
                ) : (
                  <>
                    <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Masaüstü */}
        <div className="mx-auto hidden max-w-portal items-center gap-4 px-6 py-3 lg:flex">
          <Link href="/" className="shrink-0">
            <Image
              src="/images/logo.png"
              alt="Hukuk Portalı"
              width={240}
              height={72}
              priority
              className="h-10 w-auto max-w-[180px] object-contain brightness-0 invert"
            />
          </Link>
          <nav className="flex min-w-0 flex-1 flex-wrap items-center justify-center gap-x-0.5" aria-label="Ana menü">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                active={isNavActive(item.href)}
                className={cn(
                  "px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide xl:text-[11px]",
                  isNavActive(item.href) && "border-b border-gold"
                )}
              />
            ))}
          </nav>
          <Link
            href="/arama"
            className="inline-flex shrink-0 items-center gap-2 border border-white/20 px-3 py-2 text-sm text-white/90 transition hover:border-gold/50 hover:text-gold"
          >
            <SearchIcon className="h-4 w-4" />
            Ara
          </Link>
        </div>
      </div>

      {isMenuOpen ? (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 bottom-0 z-50 overflow-y-auto bg-navy lg:hidden"
          style={{ top: mobileMenuTop }}
        >
          <nav className="px-4 py-4" aria-label="Mobil menü">
            <Link
              href="/arama"
              onClick={closeMenu}
              className="mb-3 flex min-h-11 items-center gap-3 border border-gold/30 px-4 text-sm font-semibold text-gold"
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
                    className="flex min-h-11 items-center text-[15px] font-medium"
                  />
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
