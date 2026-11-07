import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { KidShell } from "@/components/aula/kid-shell";
import { TONE } from "@/components/aula/tone";
import { STUDENTS } from "@/lib/aula-data";
import { useAula } from "@/lib/aula-store";
import { speak } from "@/lib/kid-fx";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alumno/")({
  head: () => ({
    meta: [
      { title: "Modo alumno · Aula Raíz" },
      { name: "description", content: "Entrada para niños: toca tu animal para ver tus tareas. Sin necesidad de leer." },
      { property: "og:title", content: "Modo alumno · Aula Raíz" },
      { property: "og:description", content: "Tareas con dibujos, voz y estrellas para niños desde 3 años." },
    ],
  }),
  component: WhoAreYou,
});

function WhoAreYou() {
  const stars = useAula((s) => s.stars);
  return (
    <KidShell say="¡Hola! ¿Quién eres? Toca tu animal.">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
        <p className="text-6xl">👋</p>
        <h1 className="font-kid mt-2 text-4xl font-extrabold sm:text-5xl">¿Quién eres?</h1>
      </motion.div>
      <div className="mt-10 grid flex-1 grid-cols-2 content-center gap-5 sm:grid-cols-3 sm:gap-7">
        {STUDENTS.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.08 * i, type: "spring", stiffness: 260, damping: 18 }}>
            <Link
              to="/alumno/$studentId"
              params={{ studentId: s.id }}
              onClick={() => speak(`¡Hola, ${s.name}!`)}
              className={cn("kid-press flex aspect-square flex-col items-center justify-center gap-2 rounded-4xl", TONE[s.tone].soft, TONE[s.tone].ink)}
            >
              <motion.span whileHover={{ rotate: [0, -8, 8, 0], scale: 1.1 }} className="text-7xl sm:text-8xl">
                {s.avatar}
              </motion.span>
              <span className="text-2xl font-extrabold sm:text-3xl">{s.name}</span>
              <span className="text-lg font-bold opacity-80">⭐ {stars[s.id]}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </KidShell>
  );
}
