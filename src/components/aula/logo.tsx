import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link to="/" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="Aula Raíz, inicio">
      <img
        src="/icons/icon-192.png"
        alt=""
        width={36}
        height={36}
        className="size-9 rounded-xl shadow-soft transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105"
      />
      {!compact && (
        <span className="font-display text-xl font-semibold tracking-tight">
          Aula <span className="text-primary">Raíz</span>
        </span>
      )}
    </Link>
  );
}
