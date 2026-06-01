import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { footerNavGroups, siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-0 border-t-4 border-brand-900 bg-brand-900 text-white">
      <Container wide className="py-10 sm:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-2">
            <p className="font-serif text-2xl font-bold">{siteConfig.name}</p>
            <p className="mt-1 text-sm font-medium text-white/80">{siteConfig.tagline}</p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/75">{siteConfig.description}</p>
            <p className="mt-4 text-xs leading-relaxed text-white/60">
              Bağımsız dijital yayın ve teknoloji platformu. İçerikler genel bilgilendirme amaçlıdır; hukuki
              danışmanlık yerine geçmez.
            </p>
          </div>

          {footerNavGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">{group.title}</h2>
              <ul className="mt-4 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-white/90 transition hover:text-white hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-white/60">İletişim</h2>
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              <li>
                <a href="mailto:info@hukukportali.com" className="hover:underline">
                  info@hukukportali.com
                </a>
              </li>
              <li>
                <Link href="/iletisim" className="hover:underline">
                  İletişim formu
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/15 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. Tüm hakları saklıdır.
          </p>
          <p>Türkiye&apos;de yayınlanmaktadır · {siteConfig.url.replace(/^https?:\/\//, "")}</p>
        </div>
      </Container>
    </footer>
  );
}
