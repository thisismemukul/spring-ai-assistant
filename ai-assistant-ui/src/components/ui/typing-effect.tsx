import * as React from "react";
import { cn } from "@/utils/cn";
import { MDRenderer } from "../../components/MDRenderer";
import remarkGfm from 'remark-gfm';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from "../../components/CodeBlock";

interface TypingEffectProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
}

export const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  speed = 30,
  onComplete,
  className
}) => {
  const [displayText, setDisplayText] = React.useState('');
  const [isComplete, setIsComplete] = React.useState(false);
  const [segments, setSegments] = React.useState<string[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = React.useState(0);
  const [charIndex, setCharIndex] = React.useState(0);
  const typingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Parse the text into markdown segments (code blocks, paragraphs, etc.)
  React.useEffect(() => {
    if (!text) {
      setSegments([]);
      return;
    }
    
    // Split by code blocks first
    const parts: string[] = [];
    let currentPart = '';
    let inCodeBlock = false;
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          currentPart += line + '\n';
          parts.push(currentPart);
          currentPart = '';
          inCodeBlock = false;
        } else {
          // Start of code block
          if (currentPart.trim()) {
            parts.push(currentPart);
          }
          currentPart = line + '\n';
          inCodeBlock = true;
        }
      } else {
        currentPart += line + '\n';
        
        // If not in a code block and line ends with a double newline, split into a new segment
        if (!inCodeBlock && line === '' && currentPart.endsWith('\n\n')) {
          parts.push(currentPart);
          currentPart = '';
        }
      }
    }
    
    // Add the last part if there's anything left
    if (currentPart.trim()) {
      parts.push(currentPart);
    }
    
    setSegments(parts);
    setCurrentSegmentIndex(0);
    setCharIndex(0);
  }, [text]);
  
  // Typing animation logic
  React.useEffect(() => {
    if (!segments.length || isComplete) return;
    
    // Start typing animation
    const currentSegment = segments[currentSegmentIndex];
    
    const startTyping = () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      
      typingIntervalRef.current = setInterval(() => {
        setCharIndex(prevCharIndex => {
          // If we've reached the end of the current segment
          if (prevCharIndex >= currentSegment.length) {
            clearInterval(typingIntervalRef.current!);
            
            // Move to the next segment or complete if done
            if (currentSegmentIndex < segments.length - 1) {
              setCurrentSegmentIndex(prev => prev + 1);
              return 0; // Start the next segment from 0
            } else {
              setIsComplete(true);
              onComplete?.();
              return prevCharIndex;
            }
          }
          return prevCharIndex + 1;
        });
      }, speed);
    };
    
    startTyping();
    
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [segments, currentSegmentIndex, speed, isComplete, onComplete]);
  
  // Build display text from segments as they're being typed
  React.useEffect(() => {
    if (!segments.length) {
      setDisplayText('');
      return;
    }
    
    let result = '';
    
    // Add completed segments
    for (let i = 0; i < currentSegmentIndex; i++) {
      result += segments[i];
    }
    
    // Add the current segment (in progress)
    if (currentSegmentIndex < segments.length) {
      result += segments[currentSegmentIndex].substring(0, charIndex);
    }
    
    setDisplayText(result);
  }, [segments, currentSegmentIndex, charIndex]);
  
  // Code highlighting component for the typing effect
  const TypingRenderer = React.useMemo(() => {
    return ({ content }: { content: string }) => (
      <ReactMarkdown
        className="prose dark:prose-invert prose-sm sm:prose-base max-w-none"
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
          pre: ({ children }) => (
            <div className="bg-transparent">{children}</div>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    );
  }, []);
  
  return (
    <div className={cn(className)}>
      {isComplete ? (
        <MDRenderer content={text} />
      ) : (
        <div className="relative">
          <TypingRenderer content={displayText} />
          <div className="absolute bottom-0 right-0">
            <span className="animate-pulse inline-block w-1.5 h-4 bg-primary/70 rounded-sm -mb-0.5"></span>
          </div>
        </div>
      )}
    </div>
  );
};

export function BlinkingCursor() {
  return <span className="animate-pulse inline-block w-1.5 h-4 bg-primary/70 rounded-sm -mb-0.5 ml-0.5"></span>;
} 