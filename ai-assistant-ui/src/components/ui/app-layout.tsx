import * as React from "react";
import { cn } from "@/utils/cn";
import { ThemeToggle } from "./theme-toggle";

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AppLayout({
  children,
  sidebar,
  header,
  footer,
  className,
}: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/90 flex flex-col">
      {header || (
        <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur-md">
          <div className="container flex h-16 items-center justify-between py-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground grid place-items-center text-lg font-semibold">A</div>
              <h1 className="text-xl font-semibold tracking-tight">AI Assistant</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </header>
      )}
      
      <div className="flex-1 flex container relative">
        {sidebar && (
          <aside className="w-64 hidden md:block p-4 sticky top-20 self-start h-[calc(100vh-5rem)]">
            <div className="h-full border rounded-xl bg-card/50 backdrop-blur-sm p-4 overflow-auto">
              {sidebar}
            </div>
          </aside>
        )}
        
        <main className={cn("flex-1 py-6 px-4 md:px-6", sidebar && "md:pl-6", className)}>
          {children}
        </main>
      </div>
      
      {footer && (
        <footer className="border-t bg-background/80 backdrop-blur-md py-6">
          <div className="container">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}

export function AppSidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-4", className)}>
      {children}
    </div>
  );
}

export function AppSidebarItem({
  children,
  active = false,
  onClick,
  className,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2 rounded-lg text-sm",
        "transition-colors duration-200",
        active 
          ? "bg-primary/10 text-primary dark:bg-primary/20 font-medium" 
          : "hover:bg-accent",
        className
      )}
    >
      {children}
    </button>
  );
}

export function AppSidebarSection({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium px-3">
        {title}
      </h3>
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
} 