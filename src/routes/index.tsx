import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, MapPin, Clock, Trophy, Users } from "lucide-react";
import { fetchTutors, type TutorWithRating } from "@/lib/tutors";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";
import { RatingStars } from "@/components/RatingStars";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "Ustaad Finder — Find Trusted Local Tutors in Pakistan" },
      { name: "description", content: "Browse verified local tutors across Pakistan. Search by subject and area, read reviews, and message the right ustaad for your child." },
      { property: "og:title", content: "Ustaad Finder — Find Trusted Local Tutors in Pakistan" },
      { property: "og:description", content: "Browse verified local tutors across Pakistan. Search by subject and area, read reviews, and message the right ustaad for your child." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function Home() {
  const { data: tutors = [], isLoading } = useQuery({
    queryKey: ["tutors"],
    queryFn: fetchTutors,
  });

  const [q, setQ] = useState("");
  const [subject, setSubject] = useState<string>("all");
  const [area, setArea] = useState<string>("all");

  const subjects = useMemo(() => {
    const s = new Set<string>();
    tutors.forEach((t) => t.subjects.forEach((x) => s.add(x)));
    return Array.from(s).sort();
  }, [tutors]);

  const areas = useMemo(() => {
    const s = new Set<string>();
    tutors.forEach((t) => s.add(`${t.area}, ${t.city}`));
    return Array.from(s).sort();
  }, [tutors]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return tutors.filter((t) => {
      if (subject !== "all" && !t.subjects.includes(subject)) return false;
      if (area !== "all" && `${t.area}, ${t.city}` !== area) return false;
      if (!query) return true;
      return (
        t.name.toLowerCase().includes(query) ||
        t.subjects.some((s) => s.toLowerCase().includes(query)) ||
        t.area.toLowerCase().includes(query) ||
        t.city.toLowerCase().includes(query)
      );
    });
  }, [tutors, q, subject, area]);

  const topRated = useMemo(() => {
    return [...tutors]
      .filter((t) => t.review_count > 0)
      .sort((a, b) => {
        if (b.avg_rating !== a.avg_rating) return b.avg_rating - a.avg_rating;
        return b.review_count - a.review_count;
      })
      .slice(0, 3);
  }, [tutors]);

  const hasFilters = q.trim() !== "" || subject !== "all" || area !== "all";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="border-b border-border/60 bg-hero">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/15">
            <Users className="h-3.5 w-3.5" />
            {tutors.length} tutors listed across Pakistan
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
            Find the right <span className="text-primary">ustaad</span>, near you.
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground sm:text-lg">
            Browse trusted local tutors, read student reviews, and reach out in one tap.
          </p>

          <div className="mt-8 grid gap-3 rounded-2xl border border-border/70 bg-card p-3 shadow-[var(--shadow-card)] sm:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, subject, or area…"
                className="border-transparent bg-secondary/50 pl-9 focus-visible:bg-background"
              />
            </div>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="border-transparent bg-secondary/50"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger className="border-transparent bg-secondary/50"><SelectValue placeholder="Area" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All areas</SelectItem>
                {areas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:py-12">
        {!hasFilters && topRated.length > 0 && (
          <section className="mb-12">
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold-foreground ring-1 ring-inset ring-gold/40">
                  <Trophy className="h-3.5 w-3.5" />
                  Top rated
                </div>
                <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  Highest rated tutors this week
                </h2>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {topRated.map((t) => <TutorCard key={t.id} tutor={t} featured />)}
            </div>
          </section>
        )}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
            All tutors
          </h2>
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${filtered.length} result${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {!isLoading && filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/70 bg-card p-10 text-center text-muted-foreground">
            No tutors match your filters yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => <TutorCard key={t.id} tutor={t} />)}
          </div>
        )}
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        Made with care for students & parents in Pakistan.
      </footer>
    </div>
  );
}

function TutorCard({ tutor, featured = false }: { tutor: TutorWithRating; featured?: boolean }) {
  return (
    <Link to="/tutors/$id" params={{ id: tutor.id }} className="group block">
      <Card
        className={`relative h-full overflow-hidden border-border/70 bg-card transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-primary/40 group-hover:shadow-[var(--shadow-elegant)] ${
          featured ? "ring-1 ring-inset ring-gold/30" : ""
        }`}
      >
        {featured && (
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-gold via-primary to-gold"
          />
        )}
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate font-display text-lg font-semibold leading-tight">{tutor.name}</h3>
                {tutor.verified && <VerifiedBadge />}
              </div>
              <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
                <RatingStars value={tutor.avg_rating} size={14} />
                {tutor.review_count > 0 ? (
                  <span>{tutor.avg_rating.toFixed(1)} · {tutor.review_count} review{tutor.review_count === 1 ? "" : "s"}</span>
                ) : (
                  <span>No reviews yet</span>
                )}
              </div>
            </div>
            <div className="shrink-0 rounded-lg bg-primary-soft px-2.5 py-1.5 text-right">
              <div className="text-sm font-semibold text-primary">Rs {tutor.rate_per_hour}</div>
              <div className="text-[10px] uppercase tracking-wide text-primary/70">per hour</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            {tutor.subjects.slice(0, 4).map((s) => (
              <Badge key={s} variant="secondary" className="rounded-md bg-secondary font-normal">
                {s}
              </Badge>
            ))}
            {tutor.subjects.length > 4 && (
              <Badge variant="secondary" className="rounded-md font-normal">
                +{tutor.subjects.length - 4}
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/60" /> {tutor.area}, {tutor.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 shrink-0 text-primary/60" /> {tutor.experience_years} yr{tutor.experience_years === 1 ? "" : "s"} experience
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
