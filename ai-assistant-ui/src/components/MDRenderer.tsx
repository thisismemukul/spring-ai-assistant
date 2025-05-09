import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './CodeBlock';
import { cn } from "@/utils/cn";

interface MDRendererProps {
  content: string;
  className?: string;
}

export const MDRenderer: React.FC<MDRendererProps> = ({ content, className }) => {
  return (
    <ReactMarkdown
      className={cn("prose dark:prose-invert max-w-none", className)}
      remarkPlugins={[remarkGfm]}
      components={{
        code({ inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '');
          const language = match ? match[1] : '';
          
          if (inline) {
            return (
              <code className="px-1.5 py-0.5 bg-muted text-foreground dark:text-primary-foreground rounded font-mono text-sm" {...props}>
                {children}
              </code>
            );
          }

          return (
            <CodeBlock 
              code={String(children).replace(/\n$/, '')} 
              language={language}
            />
          );
        },
        // Prevent any parent styling that might add backgrounds to code blocks
        pre: ({ children }) => (
          <div className="bg-transparent">{children}</div>
        ),
        // Enhanced styling for other markdown elements
        h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>,
        a: ({ href, children }) => (
          <a href={href} className="text-primary hover:text-primary/80 underline underline-offset-4" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="list-disc pl-6 my-3 space-y-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-6 my-3 space-y-2">{children}</ol>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-muted pl-4 py-3 my-3 bg-muted/30 text-muted-foreground rounded-r">
            {children}
          </blockquote>
        ),
        p: ({ children }) => <p className="leading-7 mb-4">{children}</p>,
        li: ({ children }) => <li className="mt-2">{children}</li>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}; 