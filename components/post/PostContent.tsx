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
            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4 pb-2 border-b border-slate-100">
              {children}
            </h2>
          ),
          h3: ({ children }) => <h3 className="text-xl font-semibold text-slate-800 mt-8 mb-3">{children}</h3>,
          p: ({ children }) => <p className="text-slate-600 leading-relaxed mb-6">{children}</p>,
          ul: ({ children }) => <ul className="list-disc pl-6 mb-6 text-slate-700 space-y-2">{children}</ul>,
          li: ({ children }) => <li className="marker:text-slate-700">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
