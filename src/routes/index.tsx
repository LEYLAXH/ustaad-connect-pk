import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, MapPin, GraduationCap, Clock, Plus, Sparkles } from "lucide-react";
import { fetchTutors, type Tutor } from "@/lib/tutors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({
  component: Home,
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight">Ustaad Finder</span>
          </Link>
          <Link to="/add-tutor">
            <Button size="sm" className="gap-1">
              <Plus className="h-4 w-4" /> Add Tutor
            </Button>
          </Link>
        </div>
      </header>

      <section className="border-b bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Find the right ustaad, near you.
          </h1>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Browse local tutors across Pakistan. Filter by subject and area to find your perfect match.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_180px_180px]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search name, subject, or area…"
                className="pl-9"
              />
            </div>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger><SelectValue placeholder="Area" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All areas</SelectItem>
                {areas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {isLoading ? "Loading…" : `${filtered.length} tutor${filtered.length === 1 ? "" : "s"}`}
          </p>
        </div>

        {!isLoading && filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed p-10 text-center text-muted-foreground">
            No tutors match your filters yet.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((t) => <TutorCard key={t.id} tutor={t} />)}
          </div>
        )}
      </main>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Made for students & parents in Pakistan.
      </footer>
    </div>
  );
}

function TutorCard({ tutor }: { tutor: Tutor }) {
  return (
    <Link to="/tutors/$id" params={{ id: tutor.id }} className="block">
      <Card className="h-full transition hover:border-primary hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold leading-tight">{tutor.name}</h3>
            <span className="whitespace-nowrap text-sm font-medium text-primary">
              Rs {tutor.rate_per_hour}/hr
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-1">
            {tutor.subjects.map((s) => (
              <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
            ))}
          </div>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> {tutor.area}, {tutor.city}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" /> {tutor.experience_years} yr{tutor.experience_years === 1 ? "" : "s"} experience
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
