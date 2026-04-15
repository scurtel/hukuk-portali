"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Container } from "@/components/layout/Container";
import { navItems, siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/90 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <Container className="py-2 sm:py-3">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            onClick={closeMenu}
            className="rounded-md px-1 py-2 text-base font-bold leading-tight text-brand-700 transition hover:text-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:text-lg"
          >
            {siteConfig.name}
          </Link>

          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-slate-200 text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            <span className="sr-only">Menü</span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className={cn("h-5 w-5 transition-transform duration-200", isMenuOpen && "rotate-90")}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {isMenuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>

          <nav className="hidden items-center gap-1 text-sm md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-md px-3 py-2 font-medium text-slate-700 transition hover:bg-slate-50 hover:text-brand-700",
                    isActive && "bg-brand-50 text-brand-700"
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
            "grid overflow-hidden transition-all duration-300 ease-out md:hidden",
            isMenuOpen ? "mt-2 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          )}
        >
          <nav className="min-h-0 space-y-1 rounded-lg border border-slate-200 bg-white p-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-brand-700",
                    isActive && "bg-brand-50 text-brand-700"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </Container>
    </header>
  );
}
