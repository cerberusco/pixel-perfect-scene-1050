import type { OptionVisual as V } from "@/lib/aula-data";
import { cn } from "@/lib/utils";
import { TONE } from "./tone";

const SHAPES: Record<string, string> = {
  circle: "M50 8a42 42 0 1 1 0 84a42 42 0 1 1 0-84z",
  square: "M14 14h72v72H14z",
  triangle: "M50 10L92 88H8z",
  star: "M50 6l12.6 27.4L92 36.6 70 57l6 30L50 72 24 87l6-30L8 36.6l29.4-3.2z",
  heart: "M50 88S10 62 10 34a20 20 0 0 1 40-6a20 20 0 0 1 40 6c0 28-40 54-40 54z",
};

const SHAPE_TONE: Record<string, string> = {
  circle: "text-sky",
  square: "text-leaf",
  triangle: "text-clay",
  star: "text-sun",
  heart: "text-berry",
};

export function OptionVisual({ visual, size = "lg" }: { visual: V; size?: "lg" | "md" }) {
  const big = size === "lg";
  switch (visual.kind) {
    case "emoji":
      return (
        <span className={cn("leading-none", big ? "text-6xl sm:text-7xl" : "text-4xl", visual.value.length > 2 && "text-4xl sm:text-5xl tracking-tighter")}>
          {visual.value}
        </span>
      );
    case "color":
      return <span className={cn("block rounded-full shadow-inner", TONE[visual.value].solid, big ? "size-24 sm:size-28" : "size-12")} />;
    case "shape":
      return (
        <svg viewBox="0 0 100 100" className={cn(SHAPE_TONE[visual.value], big ? "size-24 sm:size-28" : "size-12")} aria-hidden>
          <path d={SHAPES[visual.value]} fill="currentColor" />
        </svg>
      );
    case "number":
      return (
        <span className="flex flex-col items-center gap-2">
          <span className={cn("font-kid font-extrabold leading-none", big ? "text-7xl" : "text-4xl")}>{visual.value}</span>
          <span className="flex gap-1.5">
            {Array.from({ length: visual.value }).map((_, i) => (
              <span key={i} className="size-3 rounded-full bg-current opacity-60" />
            ))}
          </span>
        </span>
      );
    case "text":
      return <span className={cn("font-kid font-bold leading-tight", big ? "text-2xl sm:text-3xl" : "text-lg")}>{visual.value}</span>;
  }
}
