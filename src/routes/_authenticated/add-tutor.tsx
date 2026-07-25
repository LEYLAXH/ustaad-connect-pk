import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navbar } from "@/components/Navbar";


export const Route = createFileRoute("/add-tutor")({
  component: AddTutor,
  head: () => ({
    meta: [
      { title: "List Yourself as a Tutor — Ustaad Finder" },
      { name: "description", content: "Add your tutor profile to Ustaad Finder and reach students across Pakistan." },
      { property: "og:title", content: "Add a Tutor — Ustaad Finder" },
      { property: "og:description", content: "List yourself as a tutor on Ustaad Finder." },
    ],
  }),
});

const schema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  subjects: z.string().trim().min(1, "Add at least one subject").max(300),
  area: z.string().trim().min(1, "Area is required").max(100),
  city: z.string().trim().min(1, "City is required").max(100),
  rate_per_hour: z.coerce.number().int().min(0).max(100000),
  experience_years: z.coerce.number().int().min(0).max(80),
  contact_phone: z.string().trim().max(30).optional().or(z.literal("")),
  contact_email: z.string().trim().email("Invalid email").max(255).optional().or(z.literal("")),
  bio: z.string().trim().max(1000).optional().or(z.literal("")),
}).refine((v) => v.contact_phone || v.contact_email, {
  message: "Provide a phone or email",
  path: ["contact_phone"],
});

function AddTutor() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    const v = parsed.data;
    const subjects = v.subjects.split(",").map((s) => s.trim()).filter(Boolean);
    if (subjects.length === 0) {
      toast.error("Add at least one subject");
      return;
    }
    setSubmitting(true);
    const { data, error } = await supabase
      .from("tutors" as never)
      .insert({
        name: v.name,
        subjects,
        area: v.area,
        city: v.city,
        rate_per_hour: v.rate_per_hour,
        experience_years: v.experience_years,
        contact_phone: v.contact_phone || null,
        contact_email: v.contact_email || null,
        bio: v.bio || null,
      } as never)
      .select("id")
      .single();
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Tutor added!");
    const id = (data as unknown as { id: string } | null)?.id;
    if (id) navigate({ to: "/tutors/$id", params: { id } });
    else navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-2xl px-4 py-10">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Add a tutor</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fill in the details below. Your listing will appear on the directory immediately.
        </p>


        <form onSubmit={onSubmit} className="mt-6 grid gap-4">
          <Field label="Full name" name="name" required placeholder="e.g. Ayesha Khan" />
          <Field label="Subjects (comma separated)" name="subjects" required placeholder="e.g. Mathematics, Physics" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Area" name="area" required placeholder="e.g. DHA Phase 5" />
            <Field label="City" name="city" required placeholder="e.g. Karachi" defaultValue="Karachi" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Rate per hour (PKR)" name="rate_per_hour" type="number" min="0" required placeholder="1500" />
            <Field label="Years of experience" name="experience_years" type="number" min="0" required placeholder="3" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Phone" name="contact_phone" placeholder="+92 300 1234567" />
            <Field label="Email" name="contact_email" type="email" placeholder="you@example.com" />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="bio">About (optional)</Label>
            <Textarea id="bio" name="bio" rows={4} placeholder="Qualifications, teaching style, boards you cover…" />
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add tutor"}
            </Button>
            <Link to="/"><Button type="button" variant="outline">Cancel</Button></Link>
          </div>
        </form>
      </main>
    </div>
  );
}

function Field({
  label, name, ...rest
}: { label: string; name: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...rest} />
    </div>
  );
}
