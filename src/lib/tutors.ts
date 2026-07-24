import { supabase } from "@/integrations/supabase/client";

export type Tutor = {
  id: string;
  name: string;
  subjects: string[];
  area: string;
  city: string;
  rate_per_hour: number;
  experience_years: number;
  contact_phone: string | null;
  contact_email: string | null;
  bio: string | null;
  created_at: string;
};

export type Review = {
  id: string;
  tutor_id: string;
  rating: number;
  comment: string | null;
  reviewer_name: string | null;
  created_at: string;
};

export type TutorWithRating = Tutor & {
  avg_rating: number;
  review_count: number;
  verified: boolean;
};

export function computeVerified(avg: number, count: number): boolean {
  return count >= 3 && avg > 4.0;
}

export async function fetchTutors(): Promise<TutorWithRating[]> {
  const [tRes, rRes] = await Promise.all([
    supabase.from("tutors" as never).select("*").order("created_at", { ascending: false }),
    supabase.from("reviews" as never).select("tutor_id, rating"),
  ]);
  if (tRes.error) throw tRes.error;
  if (rRes.error) throw rRes.error;

  const tutors = (tRes.data ?? []) as unknown as Tutor[];
  const reviews = (rRes.data ?? []) as unknown as Array<{ tutor_id: string; rating: number }>;

  const map = new Map<string, { sum: number; count: number }>();
  for (const r of reviews) {
    const cur = map.get(r.tutor_id) ?? { sum: 0, count: 0 };
    cur.sum += r.rating;
    cur.count += 1;
    map.set(r.tutor_id, cur);
  }
  return tutors.map((t) => {
    const agg = map.get(t.id);
    const avg = agg && agg.count > 0 ? agg.sum / agg.count : 0;
    const count = agg?.count ?? 0;
    return { ...t, avg_rating: avg, review_count: count, verified: computeVerified(avg, count) };
  });
}

export async function fetchTutorById(id: string): Promise<TutorWithRating | null> {
  const { data, error } = await supabase
    .from("tutors" as never)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  const tutor = (data as unknown as Tutor) ?? null;
  if (!tutor) return null;
  const { data: reviews, error: rErr } = await supabase
    .from("reviews" as never)
    .select("rating")
    .eq("tutor_id", id);
  if (rErr) throw rErr;
  const list = (reviews ?? []) as unknown as Array<{ rating: number }>;
  const count = list.length;
  const avg = count > 0 ? list.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { ...tutor, avg_rating: avg, review_count: count, verified: computeVerified(avg, count) };
}

export async function fetchReviews(tutorId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("reviews" as never)
    .select("*")
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Review[];
}

export async function addReview(input: {
  tutor_id: string;
  rating: number;
  comment?: string | null;
  reviewer_name?: string | null;
}): Promise<void> {
  const { error } = await supabase.from("reviews" as never).insert(input as never);
  if (error) throw error;
}
