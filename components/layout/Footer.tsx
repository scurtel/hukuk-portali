import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { footerNavGroups, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t-4 border-gold bg-navy text-white">
      <Container wide className="py-10 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="font-serif text-2xl font-bold text-white">{siteConfig.name}</p>
            <p className="mt-1 text-sm font-medium text-gold">{siteConfig.tagline}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">{siteConfig.description}</p>
          </div>

          {footerNavGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-gold">{group.title}</h2>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/85 transition active:text-gold">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-gold">İletişim</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>
                <a href="mailto:info@hukukportali.com" className="active:text-gold">
                  info@hukukportali.com
                </a>
              </li>
              <li>
                <Link href="/iletisim" className="active:text-gold">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.
          </p>
          <p>Genel bilgilendirme — hukuki danışmanlık yerine geçmez.</p>
        </div>
      </Container>
    </footer>
  );
}
