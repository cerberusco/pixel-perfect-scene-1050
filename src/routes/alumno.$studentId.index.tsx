import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { KidShell } from "@/components/aula/kid-shell";
import { TONE } from "@/components/aula/tone";
import { STUDENTS, SUBJECTS, type SubjectId } from "@/lib/aula-data";
import { useAula } from "@/lib/aula-store";
import { speak } from "@/lib/kid-fx";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alumno/$studentId/")({
  loader: ({ params }) => {
    const student = STUDENTS.find((s) => s.id === params.studentId);
    if (!student) throw notFound();
    return { student };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `Tareas de ${loaderData.student.name} · Aula Raíz` : "Tareas · Aula Raíz" },
      { name: "description", content: "Tus tareas de hoy, con dibujos grandes y estrellas al terminar." },
      { property: "og:title", content: "Mis tareas · Aula Raíz" },
      { property: "og:description", content: "Tareas visuales para niños, sin necesidad de leer." },
    ],
  }),
  component: StudentHome,
});

function StudentHome() {
  const { student } = Route.useLoaderData();
  const tasks = useAula((s) => s.tasks.filter((t) => t.studentId === student.id));
  const stars = useAula((s) => s.stars[student.id]);
  const [filter, setFilter] = useState<SubjectId | "all">("all");
  const reader = student.level !== "infantil";

  const subjects = Array.from(new Set(tasks.map((t) => t.subject)));
  const visible = tasks.filter((t) => filter === "all" || t.subject === filter).sort((a, b) => (a.status === b.status ? 0 : a.status === "pendiente" ? -1 : 1));
  const pending = tasks.filter((t) => t.status === "pendiente").length;

  return (
    <KidShell
      home={{ to: "/alumno" }}
      say={`Hola, ${student.name}. Tienes ${pending} tareas. Toca una para empezar.`}
      right={
        <motion.div key={stars} initial={{ scale: 1.3 }} animate={{ scale: 1 }} className="kid-press flex h-16 items-center gap-2 rounded-full bg-sun px-5 text-sun-ink sm:h-20">
          <span className="text-3xl">⭐</span>
          <span className="text-3xl font-extrabold">{stars}</span>
        </motion.div>
      }
    >
      <div className="mt-6 flex items-center gap-4">
        <span className={cn("grid size-20 place-items-center rounded-3xl text-6xl shadow-soft", TONE[student.tone].soft)}>{student.avatar}</span>
        <div>
          <h1 className="font-kid text-4xl font-extrabold">¡Hola, {student.name}!</h1>
          <p className="flex gap-1 text-3xl" aria-label={`${pending} tareas por hacer`}>
            {Array.from({ length: pending }).map((_, i) => (
              <span key={i}>🎒</span>
            ))}
            {pending === 0 && <span>🎉</span>}
          </p>
        </div>
      </div>

      <div className="no-scrollbar -mx-4 mt-6 flex gap-3 overflow-x-auto px-4 py-3">
        <FilterBtn active={filter === "all"} onClick={() => { setFilter("all"); speak("Todas"); }} className="bg-card">
          <span className="text-4xl">🌈</span>
        </FilterBtn>
        {subjects.map((id) => {
          const s = SUBJECTS[id];
          return (
            <FilterBtn key={id} active={filter === id} onClick={() => { setFilter(id); speak(s.name); }} className={cn(TONE[s.tone].soft, TONE[s.tone].ink)}>
              <span className="text-4xl">{s.kidSymbol}</span>
            </FilterBtn>
          );
        })}
      </div>

      <motion.div layout className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((t, i) => {
            const subj = SUBJECTS[t.subject];
            const done = t.status === "hecha";
            return (
              <motion.div layout key={t.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: i * 0.04 }}>
                <Link
                  to="/alumno/$studentId/tarea/$taskId"
                  params={{ studentId: student.id, taskId: t.id }}
                  onClick={() => speak(t.questions[0].prompt)}
                  className={cn("kid-press relative flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-4xl p-4 text-center", done ? "bg-muted text-muted-foreground" : cn(TONE[subj.tone].soft, TONE[subj.tone].ink))}
                >
                  <span className="absolute left-4 top-4 text-3xl">{subj.kidSymbol}</span>
                  {done ? (
                    <span className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-success text-success-foreground">
                      <Check className="size-6" strokeWidth={3} />
                    </span>
                  ) : (
                    t.assignedAt === "Hoy" && <span className="absolute right-3 top-3 animate-bounce text-3xl">✨</span>
                  )}
                  <motion.span animate={done ? {} : { y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.2 }} className={cn("text-7xl sm:text-8xl", done && "opacity-50 grayscale")}>
                    {t.cover}
                  </motion.span>
                  {reader && <span className="text-lg font-bold leading-tight">{t.title}</span>}
                  <span className="flex gap-1 text-xl">
                    {t.questions.map((q) => (
                      <span key={q.id}>{done ? "⭐" : "○"}</span>
                    ))}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </KidShell>
  );
}

function FilterBtn({ active, onClick, className, children }: { active: boolean; onClick: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("kid-press grid size-20 shrink-0 place-items-center rounded-3xl ring-4 transition-all", active ? "ring-primary" : "ring-transparent", className)}>
      {children}
    </button>
  );
}
