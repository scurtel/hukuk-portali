import ReactMarkdown from "react-markdown";
import type { ReactNode } from "react";
import rehypeRaw from "rehype-raw";

type PostContentProps = {
  content: string;
};

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(value: string): string {
  return value
    .toLocaleLowerCase("tr")
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, "-");
}

function extractText(children: ReactNode): string {
  if (children === null || children === undefined) return "";
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map((item) => extractText(item)).join(" ").trim();
  if (typeof children === "object" && "props" in children) {
    return extractText((children as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
}

function buildToc(content: string): TocItem[] {
  const lines = content.split(/\r?\n/);
  const usedIds = new Map<string, number>();
  const items: TocItem[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim();
    const match = line.match(/^(##|###)\s+(.+)$/);
    if (!match) continue;

    const level = match[1] === "##" ? 2 : 3;
    const text = match[2].trim();
    if (!text) continue;

    const baseId = slugify(text);
    const seen = usedIds.get(baseId) ?? 0;
    usedIds.set(baseId, seen + 1);
    const id = seen === 0 ? baseId : `${baseId}-${seen + 1}`;

    items.push({ id, text, level });
  }

  return items;
}

function normalizeContentForRender(content: string): string {
  let normalized = content.trim();

  // Prevent duplicate H1 because page header already renders title.
  normalized = normalized.replace(/^\s*#\s+.+?(?:\r?\n){1,2}/, "");
  normalized = normalized.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, "");

  // Some generated items may include escaped newline sequences.
  normalized = normalized.replace(/\\n/g, "\n");

  return normalized;
}

export function PostContent({ content }: PostContentProps) {
  const normalizedContent = normalizeContentForRender(content);
  const toc = buildToc(normalizedContent);
  const headingIds = new Map<string, number>();

  const resolveHeadingId = (title: string): string => {
    const baseId = slugify(title);
    const seen = headingIds.get(baseId) ?? 0;
    headingIds.set(baseId, seen + 1);
    return seen === 0 ? baseId : `${baseId}-${seen + 1}`;
  };

  return (
    <div className="prose-none max-w-none">
      {toc.length > 1 ? (
        <nav className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:p-5 lg:hidden" aria-label="İçindekiler">
          <p className="mb-3 text-sm font-semibold text-slate-900 sm:text-base">İçindekiler</p>
          <ul className="space-y-2 text-sm text-slate-700">
            {toc.map((item) => (
              <li key={`mobile-${item.id}`} className={item.level === 3 ? "ml-4" : ""}>
                <a href={`#${item.id}`} className="hover:text-slate-900 hover:underline">
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}

      <div className={toc.length > 1 ? "lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start lg:gap-8" : ""}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          components={{
            h2: ({ children }) => {
              const text = extractText(children);
              const id = resolveHeadingId(text);
              return (
                <h2 id={id} className="mb-4 mt-10 scroll-mt-24 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900 sm:text-2xl">
                  <a href={`#${id}`} className="hover:underline">
                    {children}
                  </a>
                </h2>
              );
            },
            h3: ({ children }) => {
              const text = extractText(children);
              const id = resolveHeadingId(text);
              return (
                <h3 id={id} className="mb-3 mt-8 scroll-mt-24 text-lg font-semibold text-slate-800 sm:text-xl">
                  <a href={`#${id}`} className="hover:underline">
                    {children}
                  </a>
                </h3>
              );
            },
            p: ({ children }) => <p className="mb-6 text-sm leading-relaxed text-slate-600 sm:text-base">{children}</p>,
            blockquote: ({ children }) => (
              <blockquote className="my-8 rounded-xl border border-slate-200 bg-slate-50 p-5 text-slate-800 shadow-sm">
                <div className="text-sm leading-relaxed sm:text-base">{children}</div>
              </blockquote>
            ),
            ul: ({ children }) => <ul className="mb-6 list-disc space-y-2 pl-6 text-sm text-slate-700 sm:text-base">{children}</ul>,
            li: ({ children }) => <li className="marker:text-slate-700">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>
          }}
        >
          {normalizedContent}
        </ReactMarkdown>

        {toc.length > 1 ? (
          <aside className="sticky top-24 hidden lg:block">
            <nav className="rounded-xl border border-slate-200 bg-slate-50 p-4" aria-label="İçindekiler (Masaüstü)">
              <p className="mb-3 text-sm font-semibold text-slate-900">İçindekiler</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {toc.map((item) => (
                  <li key={`desktop-${item.id}`} className={item.level === 3 ? "ml-3" : ""}>
                    <a href={`#${item.id}`} className="hover:text-slate-900 hover:underline">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
