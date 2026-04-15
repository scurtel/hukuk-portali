import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { navItems, siteConfig } from "@/lib/site";

export function Header() {
  return (
    <header className="border-b bg-white">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-bold text-brand-700">
          {siteConfig.name}
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-slate-700 hover:text-brand-700">
              {item.label}
            </Link>
          ))}
        </nav>
      </Container>
    </header>
  );
}
