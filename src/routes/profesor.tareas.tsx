import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Send, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageTransition } from "@/components/aula/page-transition";
import { TONE } from "@/components/aula/tone";
import { Button } from "@/components/ui/button";
import { ACTIVITY_LIBRARY, LEVEL_LABEL, STUDENTS, SUBJECTS, SUBJECT_LIST, type LevelGroup, type SubjectId } from "@/lib/aula-data";
import { sendTask, useAula } from "@/lib/aula-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profesor/tareas")({
  head: () => ({
    meta: [
      { title: "Enviar tareas personalizadas · Aula Raíz" },
      { name: "description", content: "Elige un tema y Aula Raíz lo adapta automáticamente a la edad y nivel de cada alumno del aula multinivel." },
      { property: "og:title", content: "Enviar tareas personalizadas · Aula Raíz" },
      { property: "og:description", content: "Un tema, tantas versiones como niveles: tareas adaptadas a cada alumno." },
    ],
  }),
  component: TasksPage,
});

const LEVELS: LevelGroup[] = ["infantil", "primaria-baja", "primaria-alta"];

function TasksPage() {
  const tasks = useAula((s) => s.tasks);
  const [subject, setSubject] = useState<SubjectId>("naturaleza");
  const [selected, setSelected] = useState<string[]>(STUDENTS.map((s) => s.id));

  const toggle = (id: string) => setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  const selectLevel = (lvl: LevelGroup) => setSelected(STUDENTS.filter((s) => s.level === lvl).map((s) => s.id));

  const preview = useMemo(
    () => STUDENTS.filter((s) => selected.includes(s.id)).map((s) => ({ student: s, activity: ACTIVITY_LIBRARY[subject][s.level] })),
    [selected, subject],
  );

  const onSend = () => {
    if (!selected.length) return;
    const created = sendTask(subject, selected);
    toast.success(`${created.length} tareas enviadas`, {
      description: `${SUBJECTS[subject].name}: cada alumno recibe la versión de su nivel.`,
    });
  };

  return (
    <PageTransition className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold sm:text-4xl">Enviar una tarea</h1>
        <p className="mt-1 text-muted-foreground">Elige el tema una vez. Aula Raíz prepara una versión para cada edad.</p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_1fr]">
        <section className="glass space-y-6 rounded-3xl p-5 sm:p-6">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">1 · Asignatura</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
              {SUBJECT_LIST.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSubject(s.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl p-3 ring-2 ring-transparent transition-all hover:-translate-y-0.5",
                    TONE[s.tone].soft,
                    subject === s.id && cn("shadow-lift", TONE[s.tone].ring),
                  )}
                >
                  <span className="text-3xl">{s.kidSymbol}</span>
                  <span className={cn("text-xs font-bold", TONE[s.tone].ink)}>{s.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground">2 · Alumnos</p>
              <div className="flex flex-wrap gap-1.5">
                <Chip onClick={() => setSelected(STUDENTS.map((s) => s.id))}>Toda la clase</Chip>
                {LEVELS.map((l) => (
                  <Chip key={l} onClick={() => selectLevel(l)}>
                    {LEVEL_LABEL[l]}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {STUDENTS.map((s) => {
                const on = selected.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggle(s.id)}
                    className={cn(
                      "relative flex items-center gap-3 rounded-2xl border-2 bg-card p-3 text-left transition-all",
                      on ? "border-primary shadow-soft" : "border-transparent opacity-60 hover:opacity-100",
                    )}
                  >
                    <span className={cn("grid size-10 place-items-center rounded-xl text-2xl", TONE[s.tone].soft)}>{s.avatar}</span>
                    <span className="min-w-0">
                      <span className="block font-bold">{s.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">{s.age} años</span>
                    </span>
                    {on && (
                      <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
                        <Check className="size-3" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <Button variant="hero" size="xl" className="w-full" disabled={!selected.length} onClick={onSend}>
            <Send /> Enviar a {selected.length} {selected.length === 1 ? "alumno" : "alumnos"}
          </Button>
        </section>

        <section className="glass rounded-3xl p-5 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Wand2 className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Así lo recibirá cada uno</h2>
          </div>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {preview.map(({ student, activity }) => (
                <motion.div
                  layout
                  key={student.id + subject}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-soft"
                >
                  <span className="text-4xl">{activity.cover}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-muted-foreground">
                      {student.avatar} {student.name} · {student.course}
                    </p>
                    <p className="font-bold">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.adaptation}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-bold">
                    <Clock className="size-3" /> {activity.minutes}′
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
            {!preview.length && <p className="py-10 text-center text-muted-foreground">Selecciona al menos un alumno.</p>}
          </div>
        </section>
      </div>

      <section className="glass rounded-3xl p-5 sm:p-6">
        <h2 className="mb-4 text-lg font-semibold">Tareas en curso</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STUDENTS.map((s) => {
            const mine = tasks.filter((t) => t.studentId === s.id);
            const done = mine.filter((t) => t.status === "hecha").length;
            return (
              <div key={s.id} className="rounded-2xl bg-card p-4 shadow-soft">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{s.avatar}</span>
                  <p className="font-bold">{s.name}</p>
                  <span className="ml-auto text-xs font-bold text-muted-foreground">
                    {done}/{mine.length}
                  </span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {mine.slice(0, 5).map((t) => (
                    <li key={t.id} className="flex items-center gap-2 text-sm">
                      <span>{t.cover}</span>
                      <span className={cn("flex-1 truncate", t.status === "hecha" && "text-muted-foreground line-through")}>{t.title}</span>
                      {t.assignedAt === "Hoy" && <span className="rounded-full bg-primary-soft px-1.5 text-[10px] font-bold text-clay-ink">NUEVA</span>}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </PageTransition>
  );
}

function Chip({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground transition-colors hover:bg-primary-soft hover:text-clay-ink">
      {children}
    </button>
  );
}
