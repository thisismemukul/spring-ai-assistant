import * as React from "react"
import { cn } from "@/utils/cn"
import { ModernCard } from "./modern-card"
import { Avatar } from "@radix-ui/react-avatar"
import { TypingEffect } from "./typing-effect"
import { MDRenderer } from "../MDRenderer"

interface AIMessageProps {
  content: string
  thinking?: boolean
  avatar?: string
  className?: string
  timestamp?: string
  animateIn?: boolean
  useTypingEffect?: boolean
  onTypingComplete?: () => void
  isError?: boolean
}

export const AIMessage: React.FC<AIMessageProps> = ({
  content,
  thinking = false,
  avatar,
  className,
  timestamp,
  animateIn = true,
  useTypingEffect = false,
  onTypingComplete,
  isError = false,
}) => {
  return (
    <div 
      className={cn(
        "flex w-full items-start gap-3 my-4", 
        animateIn && "opacity-0 animate-in slide-in-from-bottom-3 fade-in duration-300",
        className
      )}
    >
      <div className="flex-shrink-0 mt-1">
        <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
          {avatar ? (
            <img src={avatar} alt="AI Avatar" className="modern-avatar aspect-square h-full w-full" />
          ) : (
            <div className={cn(
              "flex h-full w-full items-center justify-center text-white font-medium",
              isError ? "bg-destructive" : "bg-[hsl(var(--vibrant-blue))]"
            )}>
              AI
            </div>
          )}
        </Avatar>
      </div>
      
      <div className="flex-1">
        <ModernCard 
          className={cn(
            "ai-message-card max-w-full overflow-hidden text-sm",
            thinking && "thinking",
            isError && "border-destructive bg-destructive/10"
          )}
          gradient={false}
          glassEffect={false}
          hoverEffect={false}
        >
          <div className="p-4">
            {thinking ? (
              <div className="flex items-center">
                <div className="dot-flashing"></div>
                <span className="ml-2 text-muted-foreground">Thinking...</span>
              </div>
            ) : (
              <div className={cn(
                isError && "text-destructive font-medium"
              )}>
                {useTypingEffect ? (
                  <TypingEffect 
                    text={content} 
                    speed={30} 
                    onComplete={onTypingComplete}
                  />
                ) : (
                  <MDRenderer content={content} />
                )}
              </div>
            )}
            
            {timestamp && (
              <div className="mt-2 text-xs text-muted-foreground">
                {timestamp}
              </div>
            )}
          </div>
        </ModernCard>
      </div>
    </div>
  )
}

export const UserMessage: React.FC<Omit<AIMessageProps, 'thinking' | 'useTypingEffect' | 'onTypingComplete'>> = ({
  content,
  avatar,
  className,
  timestamp,
  animateIn = true,
}) => {
  return (
    <div 
      className={cn(
        "flex w-full items-start justify-end gap-3 my-4", 
        animateIn && "opacity-0 animate-in slide-in-from-bottom-3 fade-in duration-300",
        className
      )}
    >
      <div className="flex-grow-0 max-w-[70%]">
        <ModernCard className="user-message-card overflow-hidden text-sm">
          <div className="p-4">
            <MDRenderer content={content} />
            
            {timestamp && (
              <div className="mt-2 text-xs text-muted-foreground">
                {timestamp}
              </div>
            )}
          </div>
        </ModernCard>
      </div>
      
      <div className="flex-shrink-0 mt-1">
        <Avatar className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
          {avatar ? (
            <img src={avatar} alt="User Avatar" className="modern-avatar aspect-square h-full w-full" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[hsl(var(--vibrant-black))] text-[hsl(var(--vibrant-yellow))] font-medium">
              U
            </div>
          )}
        </Avatar>
      </div>
    </div>
  )
} 