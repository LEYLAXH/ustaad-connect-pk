import { Star } from "lucide-react";

export function RatingStars({
  value,
  size = 16,
  className = "",
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const rounded = Math.max(0, Math.min(5, Math.round(value * 2) / 2));
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = rounded >= i;
        const half = !filled && rounded >= i - 0.5;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star
              className="absolute inset-0 text-gold/40"
              style={{ width: size, height: size }}
              strokeWidth={1.6}
            />
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? size / 2 : size, height: size }}
              >
                <Star
                  className="text-gold"
                  fill="currentColor"
                  style={{ width: size, height: size }}
                  strokeWidth={1.6}
                />
              </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

export function StarRatingInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="rounded p-0.5 transition hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label={`Rate ${i} star${i === 1 ? "" : "s"}`}
        >
          <Star
            className={i <= value ? "text-gold" : "text-gold/30"}
            fill={i <= value ? "currentColor" : "none"}
            strokeWidth={1.6}
            size={26}
          />
        </button>
      ))}
    </div>
  );
}
