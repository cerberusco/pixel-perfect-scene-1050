import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Home, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import { KidShell } from "@/components/aula/kid-shell";
import { OptionVisual } from "@/components/aula/option-visual";
import { TONE } from "@/components/aula/tone";
import { STUDENTS, SUBJECTS } from "@/lib/aula-data";
import { completeTask, getAulaState, useAula } from "@/lib/aula-store";
import { chimeSuccess, chimeTry, confettiBurst, confettiSmall, fanfare, speak } from "@/lib/kid-fx";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alumno/$studentId/tarea/$taskId")({
  loader: ({ params }) => {
    const student = STUDENTS.find((s) => s.id === params.studentId);
    const task = getAulaState().tasks.find((t) => t.id === params.taskId && t.studentId === params.studentId);
    if (!student || !task) throw notFound();
    return { student, taskId: task.id };
  },
  head: () => ({
    meta: [
      { title: "¡A jugar! · Aula Raíz" },
      { name: "description", content: "Ejercicio visual con voz para niños del aula multinivel." },
      { property: "og:title", content: "¡A jugar! · Aula Raíz" },
      { property: "og:description", content: "Ejercicio visual con voz para niños." },
    ],
  }),
  component: Exercise,
});

function Exercise() {
  const { student, taskId } = Route.useLoaderData();
  const task = useAula((s) => s.tasks.find((t) => t.id === taskId))!;
  const subj = SUBJECTS[task.subject];
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [firstTry, setFirstTry] = useState(true);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = task.questions[index];

  useEffect(() => {
    if (!finished) speak(q.prompt);
  }, [q.prompt, finished]);

  const choose = (id: string) => {
    if (picked) return;
    if (id === q.answer) {
      setPicked(id);
      chimeSuccess();
      void confettiSmall();
      const gained = firstTry ? 1 : 0;
      speak(["¡Muy bien!", "¡Genial!", "¡Lo has conseguido!"][index % 3]);
      setTimeout(() => {
        const newScore = score + gained;
        setScore(newScore);
        if (index + 1 < task.questions.length) {
          setIndex(index + 1);
          setPicked(null);
          setFirstTry(true);
        } else {
          completeTask(task.id, Math.max(newScore, 1));
          setFinished(true);
          fanfare();
          void confettiBurst();
          speak(`¡Fantástico, ${student.name}! Has ganado ${Math.max(newScore, 1)} estrellas.`);
        }
      }, 1300);
    } else {
      setWrong(id);
      setFirstTry(false);
      chimeTry();
      speak("¡Casi! Prueba otra vez.");
      setTimeout(() => setWrong(null), 600);
    }
  };

  if (finished) {
    const earned = Math.max(score, 1);
    return (
      <KidShell home={{ to: "/alumno/$studentId", studentId: student.id }}>
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <motion.div initial={{ scale: 0, rotate: -30 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 200, damping: 12 }} className="text-[9rem] leading-none sm:text-[12rem]">
            🏆
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="font-kid mt-4 text-5xl font-extrabold sm:text-6xl">
            ¡Muy bien, {student.name}!
          </motion.h1>
          <div className="mt-6 flex gap-3">
            {Array.from({ length: earned }).map((_, i) => (
              <motion.span key={i} initial={{ scale: 0, y: 40 }} animate={{ scale: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.2, type: "spring", stiffness: 300, damping: 10 }} className="text-6xl sm:text-7xl">
                ⭐
              </motion.span>
            ))}
          </div>
          <div className="mt-12 flex gap-5">
            <Link to="/alumno/$studentId" params={{ studentId: student.id }} aria-label="Volver a mis tareas" className="kid-press grid size-28 place-items-center rounded-full bg-leaf text-primary-foreground">
              <Home className="size-14" />
            </Link>
            <button
              aria-label="Jugar otra vez"
              onClick={() => {
                setIndex(0);
                setScore(0);
                setPicked(null);
                setFirstTry(true);
                setFinished(false);
              }}
              className="kid-press grid size-28 place-items-center rounded-full bg-sun text-sun-ink"
            >
              <RotateCcw className="size-12" />
            </button>
          </div>
        </div>
      </KidShell>
    );
  }

  return (
    <KidShell
      home={{ to: "/alumno/$studentId", studentId: student.id }}
      say={q.prompt}
      right={
        <div className="flex gap-1.5 text-3xl sm:text-4xl" aria-label={`Pregunta ${index + 1} de ${task.questions.length}`}>
          {task.questions.map((qq, i) => (
            <motion.span key={qq.id} animate={i === index ? { scale: [1, 1.2, 1] } : {}} transition={{ repeat: Infinity, duration: 1.6 }}>
              {i < index ? "⭐" : i === index ? "🌟" : "○"}
            </motion.span>
          ))}
        </div>
      }
    >
      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60 }} transition={{ duration: 0.35 }} className="flex flex-1 flex-col">
          <div className={cn("mt-6 flex flex-col items-center gap-3 rounded-4xl p-6 text-center shadow-soft", TONE[subj.tone].soft, TONE[subj.tone].ink)}>
            <span className="text-4xl">{subj.kidSymbol}</span>
            {q.scene && <span className="text-7xl tracking-widest sm:text-8xl">{q.scene}</span>}
            <button onClick={() => speak(q.prompt)} className="text-2xl font-extrabold leading-tight sm:text-3xl">
              {q.prompt}
            </button>
          </div>

          <div className={cn("mt-8 grid flex-1 content-start gap-5", q.options.length === 2 ? "grid-cols-2" : "grid-cols-1 sm:grid-cols-3")}>
            {q.options.map((o) => {
              const isRight = picked === o.id;
              const isWrong = wrong === o.id;
              return (
                <motion.button
                  key={o.id}
                  onClick={() => choose(o.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  animate={isRight ? { scale: [1, 1.12, 1.05], rotate: [0, -3, 3, 0] } : {}}
                  className={cn(
                    "kid-press flex min-h-36 items-center justify-center rounded-4xl bg-card p-6 text-foreground ring-8 transition-colors sm:min-h-52",
                    isRight ? "bg-success-foreground ring-success" : "ring-transparent",
                    isWrong && "animate-wiggle ring-destructive/60",
                    picked && !isRight && "opacity-40",
                  )}
                >
                  <OptionVisual visual={o.visual} />
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </KidShell>
  );
}
