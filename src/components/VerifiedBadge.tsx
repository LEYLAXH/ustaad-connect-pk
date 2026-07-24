import { BadgeCheck } from "lucide-react";

export function VerifiedBadge({
  size = "sm",
  className = "",
}: {
  size?: "sm" | "md";
  className?: string;
}) {
  const pad = size === "md" ? "px-2.5 py-1 text-xs" : "px-2 py-0.5 text-[11px]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-verified/10 font-medium text-verified ring-1 ring-inset ring-verified/30 ${pad} ${className}`}
      title="Verified: 3+ reviews with average rating above 4.0"
    >
      <BadgeCheck className={size === "md" ? "h-4 w-4" : "h-3.5 w-3.5"} />
      Verified
    </span>
  );
}
