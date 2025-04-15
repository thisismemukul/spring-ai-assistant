import * as React from "react";
import { cn } from "@/utils/cn";
import { ModernCard } from "./modern-card";
import { StylishButton } from "./stylish-button";

interface ChatSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

export function ChatSuggestions({ 
  suggestions, 
  onSuggestionClick, 
  className 
}: ChatSuggestionsProps) {
  return (
    <div className={cn("my-4 space-y-2", className)}>
      <p className="text-sm font-medium text-muted-foreground mb-2">
        Try asking:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <div 
            key={suggestion} 
            className="animate-in fade-in zoom-in duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <StylishButton
              variant="outline"
              size="sm"
              className="text-left h-auto py-2 border-dashed hover:border-solid"
              onClick={() => onSuggestionClick(suggestion)}
            >
              {suggestion}
            </StylishButton>
          </div>
        ))}
      </div>
    </div>
  );
}

interface QuickActionsProps {
  actions: {
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
  }[];
  className?: string;
}

export function QuickActions({ actions, className }: QuickActionsProps) {
  return (
    <ModernCard className={cn("w-full bg-card/60", className)}>
      <div className="grid grid-cols-2 gap-2">
        {actions.map((action, index) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={cn(
              "flex flex-col items-center justify-center p-2 rounded-lg",
              "hover:bg-accent transition-colors duration-200",
              "animate-in fade-in slide-in-from-bottom-3 duration-300"
            )}
            style={{ animationDelay: `${index * 75}ms` }}
          >
            {action.icon && (
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mb-1">
                {action.icon}
              </div>
            )}
            <span className="text-xs font-medium text-center">{action.label}</span>
          </button>
        ))}
      </div>
    </ModernCard>
  );
} 