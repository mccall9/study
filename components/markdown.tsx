import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Markdown dos resumos, com o estilo do app. Links internos (/lei/...) abrem no próprio app. */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="space-y-3 text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h2 className="pt-2 text-lg font-semibold">{children}</h2>,
          h2: ({ children }) => <h3 className="pt-2 text-base font-semibold">{children}</h3>,
          h3: ({ children }) => <h4 className="pt-1 font-semibold">{children}</h4>,
          p: ({ children }) => <p>{children}</p>,
          ul: ({ children }) => <ul className="list-disc space-y-1 pl-5">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal space-y-1 pl-5">{children}</ol>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/40 bg-accent/50 px-3 py-2 text-sm">{children}</blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-primary underline underline-offset-2"
              {...(href?.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">{children}</table>
            </div>
          ),
          th: ({ children }) => <th className="border-b px-2 py-1.5 text-left font-semibold">{children}</th>,
          td: ({ children }) => <td className="border-b px-2 py-1.5 align-top">{children}</td>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
