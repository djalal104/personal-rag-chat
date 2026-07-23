import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css'; // or any highlight style

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline ? (
              <div className="relative rounded-md my-4 bg-[#0d1117] border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border text-xs text-muted-foreground">
                  <span>{match ? match[1] : 'text'}</span>
                </div>
                <div className="p-4 overflow-x-auto text-sm">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </div>
              </div>
            ) : (
              <code className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono text-primary" {...props}>
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-4">
              <table className="min-w-full border-collapse border border-border text-sm">
                {children}
              </table>
            </div>
          ),
          th: ({ children }) => <th className="border border-border px-4 py-2 bg-muted font-medium text-left">{children}</th>,
          td: ({ children }) => <td className="border border-border px-4 py-2">{children}</td>,
          a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{children}</a>
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
