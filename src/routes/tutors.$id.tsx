import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, MapPin, Clock, Mail, Phone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { fetchTutorById, fetchReviews, addReview } from "@/lib/tutors";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";
import { RatingStars, StarRatingInput } from "@/components/RatingStars";
import { VerifiedBadge } from "@/components/VerifiedBadge";

export const Route = createFileRoute("/tutors/$id")({
  component: TutorProfile,
  head: ({ params }) => ({
    meta: [
      { title: `Tutor Profile — Ustaad Finder` },
      { name: "description", content: `View tutor details, reviews, and contact options on Ustaad Finder (${params.id}).` },
      { property: "og:title", content: "Tutor Profile — Ustaad Finder" },
      { property: "og:description", content: "See ratings, reviews, and contact this tutor on Ustaad Finder." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
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
  const qc = useQueryClient();
  const { data: tutor, isLoading } = useQuery({
    queryKey: ["tutor", id],
    queryFn: () => fetchTutorById(id),
  });
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => fetchReviews(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl p-8 text-muted-foreground">Loading…</div>
      </div>
    );
  }
  if (!tutor) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-2xl p-8 text-center">
          <p className="text-muted-foreground">Tutor not found.</p>
          <Link to="/" className="mt-4 inline-block"><Button variant="outline">Back to directory</Button></Link>
        </div>
      </div>
    );
  }

  const contactHref =
    tutor.contact_phone ? `tel:${tutor.contact_phone.replace(/\s+/g, "")}` :
    tutor.contact_email ? `mailto:${tutor.contact_email}` : undefined;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to directory
        </Link>

        <div className="mt-6 rounded-3xl border border-border/70 bg-hero p-6 sm:p-8">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{tutor.name}</h1>
                {tutor.verified && <VerifiedBadge size="md" />}
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <RatingStars value={tutor.avg_rating} size={16} />
                {tutor.review_count > 0 ? (
                  <span>{tutor.avg_rating.toFixed(1)} · {tutor.review_count} review{tutor.review_count === 1 ? "" : "s"}</span>
                ) : (
                  <span>No reviews yet — be the first</span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tutor.subjects.map((s) => (
                  <Badge key={s} variant="secondary" className="rounded-md font-normal">{s}</Badge>
                ))}
              </div>
            </div>
            <div className="shrink-0 rounded-2xl bg-card px-4 py-3 text-right shadow-[var(--shadow-card)] ring-1 ring-inset ring-border/60">
              <div className="font-display text-2xl font-semibold text-primary">Rs {tutor.rate_per_hour}</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">per hour</div>
            </div>
          </div>
        </div>

        <Card className="mt-6 border-border/70">
          <CardContent className="grid gap-4 py-6 sm:grid-cols-2">
            <InfoRow icon={<MapPin className="h-4 w-4" />} label="Location" value={`${tutor.area}, ${tutor.city}`} />
            <InfoRow icon={<Clock className="h-4 w-4" />} label="Experience" value={`${tutor.experience_years} year${tutor.experience_years === 1 ? "" : "s"}`} />
            {tutor.contact_phone && <InfoRow icon={<Phone className="h-4 w-4" />} label="Phone" value={tutor.contact_phone} />}
            {tutor.contact_email && <InfoRow icon={<Mail className="h-4 w-4" />} label="Email" value={tutor.contact_email} />}
          </CardContent>
        </Card>

        {tutor.bio && (
          <section className="mt-8">
            <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">About</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed">{tutor.bio}</p>
          </section>
        )}

        {contactHref && (
          <div className="mt-8">
            <a href={contactHref}>
              <Button size="lg" className="w-full gap-2 sm:w-auto">
                <MessageCircle className="h-4 w-4" />
                Contact {tutor.name.split(" ")[0]}
              </Button>
            </a>
          </div>
        )}

        <section className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-semibold tracking-tight">Reviews & rating</h2>
            <span className="text-sm text-muted-foreground">
              {tutor.review_count > 0 ? `${tutor.avg_rating.toFixed(1)} average` : "No reviews yet"}
            </span>
          </div>

          <ReviewForm
            tutorId={tutor.id}
            onDone={() => {
              qc.invalidateQueries({ queryKey: ["tutor", id] });
              qc.invalidateQueries({ queryKey: ["reviews", id] });
              qc.invalidateQueries({ queryKey: ["tutors"] });
            }}
          />

          <div className="mt-6 space-y-3">
            {reviews.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/70 p-6 text-center text-sm text-muted-foreground">
                No reviews yet. Share your experience above.
              </p>
            ) : (
              reviews.map((r) => (
                <Card key={r.id} className="border-border/70">
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <RatingStars value={r.rating} size={14} />
                        <span className="text-sm font-medium">{r.reviewer_name?.trim() || "Anonymous"}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {r.comment && (
                      <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                        {r.comment}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

function ReviewForm({ tutorId, onDone }: { tutorId: string; onDone: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      toast.error("Please pick a star rating");
      return;
    }
    setSubmitting(true);
    try {
      await addReview({
        tutor_id: tutorId,
        rating,
        comment: comment.trim() || null,
        reviewer_name: name.trim() || null,
      });
      toast.success("Thanks for your review!");
      setRating(0);
      setComment("");
      setName("");
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not submit review");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-4 rounded-2xl border border-border/70 bg-card p-5 shadow-[var(--shadow-card)]"
    >
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label>Your rating</Label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="reviewer_name">Your name (optional)</Label>
          <Input
            id="reviewer_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            placeholder="e.g. Ali's mother"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="comment">Comment (optional)</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder="How was your experience?"
          />
        </div>
        <div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Post review"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
        <div className="truncate font-medium">{value}</div>
      </div>
    </div>
  );
}
