import { Link } from "@tanstack/react-router";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)] ring-1 ring-inset ring-white/10"
      >
        {/* stylized "U" mark */}
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 4v9a6 6 0 0 0 12 0V4" />
          <circle cx="12" cy="19" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">Ustaad Finder</span>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">Local tutors · Pakistan</span>
      </span>
    </span>
  );
}

export function Navbar({ showActions = true }: { showActions?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:py-4">
        <Link to="/" className="min-w-0">
          <Logo />
        </Link>
        {showActions && (
          <div className="flex items-center gap-2">
            <Link to="/find-tutor">
              <Button size="sm" variant="outline" className="gap-1.5 border-primary/30 text-primary hover:bg-primary-soft hover:text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Find My Tutor</span>
                <span className="sm:hidden">Find</span>
              </Button>
            </Link>
            <Link to="/add-tutor">
              <Button size="sm" className="gap-1.5">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Tutor</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
