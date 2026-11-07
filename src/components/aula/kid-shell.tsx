import { Link } from "@tanstack/react-router";
import { Home, Volume2 } from "lucide-react";
import type { ReactNode } from "react";
import { speak } from "@/lib/kid-fx";
import { cn } from "@/lib/utils";

/** Distraction-free frame for the student mode: only big home + listen controls. */
export function KidShell({ children, homeTo, homeParams, say, right }: { children: ReactNode; homeTo?: "/alumno" | "/alumno/$studentId"; homeParams?: { studentId: string }; say?: string; right?: ReactNode }) {
  return (
    <div className="bg-kid font-kid min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 pb-8 pt-4 sm:px-8">
        <div className="flex items-center justify-between gap-3">
          {homeTo ? (
            homeTo === "/alumno" ? (
              <BigRound as="link" to="/alumno" label="Volver">
                <Home className="size-8" />
              </BigRound>
            ) : (
              <Link to="/alumno/$studentId" params={homeParams!} aria-label="Volver" className={roundCls}>
                <Home className="size-8" />
              </Link>
            )
          ) : (
            <Link to="/" aria-label="Salir del modo alumno" className="rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground/70 hover:text-foreground">
              Salir
            </Link>
          )}
          <div className="flex items-center gap-3">
            {right}
            {say && (
              <button aria-label="Escuchar" onClick={() => speak(say)} className={cn(roundCls, "bg-sky text-primary-foreground")}>
                <Volume2 className="size-8" />
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col">{children}</div>
      </div>
    </div>
  );
}

const roundCls = "kid-press grid size-16 place-items-center rounded-full bg-card text-foreground sm:size-20";

function BigRound({ children, label }: { children: ReactNode; label: string; as: "link"; to: "/alumno" }) {
  return (
    <Link to="/alumno" aria-label={label} className={roundCls}>
      {children}
    </Link>
  );
}
