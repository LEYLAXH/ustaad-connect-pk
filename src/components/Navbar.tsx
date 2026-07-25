import { Link, useNavigate } from "@tanstack/react-router";
import { Plus, Sparkles, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, displayName, initials } from "@/hooks/use-auth";
import { toast } from "sonner";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        aria-hidden
        className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-card)] ring-1 ring-inset ring-white/10"
      >
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
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/", replace: true });
  }

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

            {!loading && !user && (
              <Link to="/auth">
                <Button size="sm" variant="ghost" className="gap-1.5">
                  <span className="hidden sm:inline">Sign in</span>
                  <span className="sm:hidden">Sign in</span>
                </Button>
              </Link>
            )}

            {!loading && user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="ml-1 grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-semibold text-primary ring-1 ring-inset ring-primary/25 transition hover:bg-primary/15"
                    aria-label="Account"
                  >
                    {initials(user) || <UserIcon className="h-4 w-4" />}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="truncate">
                    <div className="text-sm font-medium">{displayName(user)}</div>
                    <div className="truncate text-xs font-normal text-muted-foreground">{user.email}</div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="gap-2">
                    <LogOut className="h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
