import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Clock, Mail, Phone, GraduationCap } from "lucide-react";
import { fetchTutorById } from "@/lib/tutors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/tutors/$id")({
  component: TutorProfile,
  head: ({ params }) => ({
    meta: [
      { title: `Tutor Profile — Ustaad Finder` },
      { name: "description", content: `View tutor details on Ustaad Finder (${params.id}).` },
    ],
  }),
  errorComponent: ({ reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-2xl p-8 text-center">
        <p className="text-muted-foreground">Could not load this tutor.</p>
        <Button className="mt-4" onClick={() => { router.invalidate(); reset(); }}>Try again</Button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl p-8 text-center">
      <p className="text-muted-foreground">Tutor not found.</p>
      <Link to="/" className="mt-4 inline-block"><Button variant="outline">Back to directory</Button></Link>
    </div>
  ),
});

function TutorProfile() {
  const { id } = Route.useParams();
  const { data: tutor, isLoading } = useQuery({
    queryKey: ["tutor", id],
    queryFn: () => fetchTutorById(id),
  });

  if (isLoading) {
    return <div className="mx-auto max-w-3xl p-8 text-muted-foreground">Loading…</div>;
  }
  if (!tutor) {
    return (
      <div className="mx-auto max-w-2xl p-8 text-center">
        <p className="text-muted-foreground">Tutor not found.</p>
        <Link to="/" className="mt-4 inline-block"><Button variant="outline">Back to directory</Button></Link>
      </div>
    );
  }

  const contactHref =
    tutor.contact_phone ? `tel:${tutor.contact_phone.replace(/\s+/g, "")}` :
    tutor.contact_email ? `mailto:${tutor.contact_email}` : undefined;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <span className="font-semibold">Ustaad Finder</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{tutor.name}</h1>
            <div className="mt-2 flex flex-wrap gap-1">
              {tutor.subjects.map((s) => (
                <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
              ))}
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-primary">Rs {tutor.rate_per_hour}</div>
            <div className="text-xs text-muted-foreground">per hour</div>
          </div>
        </div>

        <Card className="mt-6">
          <CardContent className="grid gap-3 py-6 sm:grid-cols-2">
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={`${tutor.area}, ${tutor.city}`} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Experience" value={`${tutor.experience_years} year${tutor.experience_years === 1 ? "" : "s"}`} />
            {tutor.contact_phone && <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={tutor.contact_phone} />}
            {tutor.contact_email && <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={tutor.contact_email} />}
          </CardContent>
        </Card>

        {tutor.bio && (
          <section className="mt-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">About</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed">{tutor.bio}</p>
          </section>
        )}

        {contactHref && (
          <div className="mt-8">
            <a href={contactHref}>
              <Button size="lg" className="w-full sm:w-auto">Contact {tutor.name.split(" ")[0]}</Button>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="font-medium">{value}</div>
      </div>
    </div>
  );
}
