import type { Tone } from "@/lib/aula-data";

// Literal class names so Tailwind generates them.
export const TONE: Record<Tone, { solid: string; soft: string; ink: string; ring: string; text: string }> = {
  sun: { solid: "bg-sun", soft: "bg-sun-soft", ink: "text-sun-ink", ring: "ring-sun", text: "text-sun" },
  leaf: { solid: "bg-leaf", soft: "bg-leaf-soft", ink: "text-leaf-ink", ring: "ring-leaf", text: "text-leaf" },
  sky: { solid: "bg-sky", soft: "bg-sky-soft", ink: "text-sky-ink", ring: "ring-sky", text: "text-sky" },
  clay: { solid: "bg-clay", soft: "bg-clay-soft", ink: "text-clay-ink", ring: "ring-clay", text: "text-clay" },
  berry: { solid: "bg-berry", soft: "bg-berry-soft", ink: "text-berry-ink", ring: "ring-berry", text: "text-berry" },
};
