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

export async function fetchTutors(): Promise<Tutor[]> {
  const { data, error } = await supabase
    .from("tutors" as never)
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Tutor[];
}

export async function fetchTutorById(id: string): Promise<Tutor | null> {
  const { data, error } = await supabase
    .from("tutors" as never)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as unknown as Tutor) ?? null;
}
