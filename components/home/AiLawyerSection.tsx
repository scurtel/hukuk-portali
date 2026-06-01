import Link from "next/link";

import { Container } from "@/components/layout/Container";
import { SafeImage } from "@/components/ui/SafeImage";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { AI_LAWYER_CARDS } from "@/lib/home";
import { getPostDisplayImage } from "@/lib/post-display";
import { getPostHref } from "@/lib/post-urls";
import { getPostBySlug } from "@/lib/posts";
import { truncatePostCardExcerpt } from "@/lib/utils";

export function AiLawyerSection() {
  const cards = AI_LAWYER_CARDS.map(({ slug, label }) => {
    const post = getPostBySlug(slug);
    return post ? { post, label } : null;
  }).filter((x): x is NonNullable<typeof x> => Boolean(x));

  if (!cards.length) return null;

  return (
    <section id="yapay-zeka" className="scroll-mt-28 portal-section-alt">
      <Container wide>
        <SectionTitle href="/konu/yapay-zeka" linkLabel="Tüm yapay zekâ içerikleri">
          Avukatlar İçin Yapay Zekâ
        </SectionTitle>
        <p className="-mt-3 mb-6 max-w-3xl text-sm leading-relaxed text-ink-muted sm:text-base">
          Hukuki çerçeve, dilekçe hazırlığı, mesleki sır ve kişisel veri koruma — yapay zekânın avukatlık
          pratiğindeki kritik başlıkları.
        </p>
        <div className="grid gap-5 md:grid-cols-3">
          {cards.map(({ post, label }) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-card transition hover:shadow-card-hover"
            >
              <Link href={getPostHref(post)} className="relative block aspect-[16/10] overflow-hidden bg-slate-100">
                <SafeImage
                  src={getPostDisplayImage(post)}
                  alt={post.title}
                  width={600}
                  height={375}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  fallbackSrc="/images/placeholder-post.jpg"
                />
                <span className="absolute left-0 top-0 bg-brand-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                  {label}
                </span>
              </Link>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="font-serif text-lg font-bold leading-snug text-ink">
                  <Link href={getPostHref(post)} className="hover:text-brand-500">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm text-ink-muted">{truncatePostCardExcerpt(post.excerpt, 140)}</p>
                <Link
                  href={getPostHref(post)}
                  className="mt-4 text-sm font-bold uppercase tracking-wide text-brand-700 hover:text-accent-red"
                >
                  İncele →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
