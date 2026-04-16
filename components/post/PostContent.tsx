import ReactMarkdown from "react-markdown";

type PostContentProps = {
  content: string;
};

export function PostContent({ content }: PostContentProps) {
  return (
    <div className="prose-none max-w-none">
      <ReactMarkdown
        components={{
          h2: ({ children }) => (
            <h2 className="mb-4 mt-10 border-b border-slate-100 pb-2 text-xl font-bold text-slate-900 sm:text-2xl">
              {children}
            </h2>
          ),
          h3: ({ children }) => <h3 className="mb-3 mt-8 text-lg font-semibold text-slate-800 sm:text-xl">{children}</h3>,
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
        {content}
      </ReactMarkdown>
    </div>
  );
}
