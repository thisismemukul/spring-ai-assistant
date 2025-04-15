import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from "@/utils/cn";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language, className }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("relative group my-4", className)}>
      <div className="absolute top-0 right-0 m-2 z-10">
        <button
          onClick={handleCopy}
          className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-primary/10 p-1 text-primary hover:bg-primary/20 transition-colors"
          aria-label="Copy code"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      
      {language && (
        <div className="absolute top-0 left-0 px-3 py-1.5 text-xs font-medium text-muted-foreground rounded-tl-md rounded-br-md bg-muted">
          {language}
        </div>
      )}
      
      <pre className="mt-0 pt-10 pb-5 px-5 rounded-lg bg-muted dark:bg-card text-sm overflow-x-auto shadow-sm">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
    </div>
  );
}; 