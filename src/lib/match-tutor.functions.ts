import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  subject: z.string().trim().min(1).max(200),
  level: z.string().trim().min(1).max(50),
  weakTopics: z.string().trim().max(2000),
  budget: z.coerce.number().int().min(0).max(1000000),
  area: z.string().trim().min(1).max(200),
});

export type TutorMatch = {
  tutor_id: string;
  name: string;
  reason: string;
};

export type MatchResult = {
  matches: TutorMatch[];
  message: string;
};

const SYSTEM_PROMPT =
  "You are a tutor-matching assistant for students in Pakistan. Given a student's subject, level, weak topics, budget, and area, and a list of available tutors with their subjects, rates, and areas, recommend the top 2-3 best-fit tutors with a one-line reason each. Then write a short, natural, polite message (2-3 sentences) the student can send to their top match, mentioning their specific weak topics and needs. Keep the tone warm and respectful, suited to Pakistani parents and students.";

export const matchTutor = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<MatchResult> => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: tutorsData, error } = await supabaseAdmin
      .from("tutors")
      .select("id, name, subjects, area, city, rate_per_hour, experience_years, bio");
    if (error) throw new Error(error.message);
    const tutors = tutorsData ?? [];

    const tutorList = tutors
      .map(
        (t) =>
          `- id:${t.id} | ${t.name} | subjects:${(t.subjects ?? []).join(", ")} | area:${t.area}, ${t.city} | rate:PKR ${t.rate_per_hour}/hr | experience:${t.experience_years}y${t.bio ? ` | bio:${t.bio}` : ""}`,
      )
      .join("\n");

    const userPrompt = `Student request:
- Subject needed: ${data.subject}
- Level: ${data.level}
- Weak topics: ${data.weakTopics || "(none specified)"}
- Budget: PKR ${data.budget}/hr
- Preferred area/city: ${data.area}

Available tutors:
${tutorList || "(none)"}

Return ONLY strict JSON matching this schema (no markdown, no code fences):
{
  "matches": [
    { "tutor_id": "<id from list>", "name": "<tutor name>", "reason": "<one-line reason>" }
  ],
  "message": "<2-3 sentence warm message the student can copy>"
}
Include 2-3 matches, best first. If no tutors are available, return an empty matches array and a message explaining that.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: "application/json",
          },
        }),
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("[matchTutor] Gemini error", res.status, errText);
      throw new Error(`Gemini API failed (${res.status})`);
    }

    const json = (await res.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    let parsed: MatchResult;
    try {
      parsed = JSON.parse(text) as MatchResult;
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) throw new Error("AI returned invalid response");
      parsed = JSON.parse(m[0]) as MatchResult;
    }

    // Filter/validate matches to real tutor ids and enrich with fresh data
    const tutorMap = new Map(tutors.map((t) => [t.id, t]));
    const cleanedMatches = (parsed.matches ?? [])
      .filter((m) => tutorMap.has(m.tutor_id))
      .slice(0, 3)
      .map((m) => ({
        tutor_id: m.tutor_id,
        name: tutorMap.get(m.tutor_id)!.name,
        reason: m.reason,
      }));

    return {
      matches: cleanedMatches,
      message: parsed.message ?? "",
    };
  });
