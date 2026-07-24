import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Sparkles, Copy, Check, MapPin } from "lucide-react";
import { toast } from "sonner";
import { matchTutor, type MatchResult } from "@/lib/match-tutor.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Navbar } from "@/components/Navbar";


export const Route = createFileRoute("/find-tutor")({
  component: FindTutor,
  head: () => ({
    meta: [
      { title: "Find My Tutor — Ustaad Finder" },
      { name: "description", content: "Tell us what you need and get AI-matched to the best local tutors in Pakistan." },
      { property: "og:title", content: "Find My Tutor — Ustaad Finder" },
      { property: "og:description", content: "Get AI-matched to the right ustaad for your subject, level, and budget." },
    ],
  }),
});

const LEVELS = ["School", "Matric", "O-Level", "A-Level", "University"];

function FindTutor() {
  const navigate = useNavigate();
  const runMatch = useServerFn(matchTutor);
  const [level, setLevel] = useState<string>("Matric");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MatchResult | null>(null);
  const [copied, setCopied] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const subject = String(fd.get("subject") ?? "").trim();
    const weakTopics = String(fd.get("weakTopics") ?? "").trim();
    const budget = String(fd.get("budget") ?? "").trim();
    const area = String(fd.get("area") ?? "").trim();

    if (!subject) return toast.error("Enter the subject you need");
    if (!area) return toast.error("Enter your preferred area or city");
    if (!budget) return toast.error("Enter your budget per hour");

    setLoading(true);
    setResult(null);
    try {
      const res = await runMatch({
        data: { subject, level, weakTopics, budget, area },
      });
      setResult(res);
      if (res.matches.length === 0) toast.info("No matching tutors found yet.");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function copyMessage() {
    if (!result?.message) return;
    try {
      await navigator.clipboard.writeText(result.message);
      setCopied(true);
      toast.success("Message copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — please select and copy manually.");
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-soft text-primary ring-1 ring-inset ring-primary/20">
            <Sparkles className="h-5 w-5" />
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Find My Tutor</h1>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Tell us what you're studying and we'll match you with the best tutors from our directory.
        </p>


        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="subject">Subject needed</Label>
            <Input id="subject" name="subject" placeholder="e.g. Mathematics, Physics, Accounting" required />
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="level">Student's level</Label>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger id="level"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-1.5">
            <Label htmlFor="weakTopics">Weak topics</Label>
            <Textarea
              id="weakTopics"
              name="weakTopics"
              rows={3}
              placeholder="e.g. Calculus, trigonometry word problems, mechanics chapter"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="budget">Budget per hour (PKR)</Label>
              <Input id="budget" name="budget" type="number" min="0" placeholder="1500" required />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="area">Preferred area / city</Label>
              <Input id="area" name="area" placeholder="e.g. DHA, Karachi" required />
            </div>
          </div>

          <div className="mt-2">
            <Button type="submit" disabled={loading} className="gap-2">
              <Sparkles className="h-4 w-4" />
              {loading ? "Finding matches…" : "Find my tutor"}
            </Button>
          </div>
        </form>

        {result && (
          <section className="mt-10 space-y-6">
            <div>
              <h2 className="text-lg font-semibold">Top matches</h2>
              {result.matches.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  No tutors in the directory fit yet. Try widening your area or budget.
                </p>
              ) : (
                <div className="mt-3 grid gap-3">
                  {result.matches.map((m, i) => (
                    <Card key={m.tutor_id} className="transition hover:border-primary">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-medium text-primary">
                              #{i + 1} best match
                            </div>
                            <h3 className="mt-0.5 text-lg font-semibold leading-tight">{m.name}</h3>
                          </div>
                          <Link to="/tutors/$id" params={{ id: m.tutor_id }}>
                            <Button size="sm" variant="outline">View profile</Button>
                          </Link>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="flex items-start gap-1.5 text-sm text-muted-foreground">
                          <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                          {m.reason}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {result.message && (
              <div>
                <h2 className="text-lg font-semibold">Ready-to-send message</h2>
                <Card className="mt-3">
                  <CardContent className="pt-6">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{result.message}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button size="sm" onClick={copyMessage} className="gap-1.5">
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        {copied ? "Copied" : "Copy message"}
                      </Button>
                      {result.matches[0] && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate({ to: "/tutors/$id", params: { id: result.matches[0].tutor_id } })}
                        >
                          Open top match
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
