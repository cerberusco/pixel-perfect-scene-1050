import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ChevronRight, MessageCircleHeart } from "lucide-react";
import { Bar, BarChart, XAxis } from "recharts";
import { ChildSwitcher } from "@/components/aula/child-switcher";
import { PageTransition, rise, stagger } from "@/components/aula/page-transition";
import { TONE } from "@/components/aula/tone";
import { ChartContainer, type ChartConfig } from "@/components/ui/chart";
import { FAMILY, FAMILY_ALERTS, FAMILY_WEEK, STUDENTS, SUBJECTS } from "@/lib/aula-data";
import { useAula } from "@/lib/aula-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/familia/")({
  head: () => ({
    meta: [
      { title: "Modo familia · Aula Raíz" },
      { name: "description", content: "Cómo va tu hijo esta semana, avisos sencillos de la maestra y ayuda para las tareas desde el móvil." },
      { property: "og:title", content: "Modo familia · Aula Raíz" },
      { property: "og:description", content: "El progreso de tu hijo en un vistazo, con avisos claros." },
    ],
  }),
  component: FamilyHome,
});

const weekConfig = { value: { label: "Tareas", color: "var(--chart-2)" } } satisfies ChartConfig;

function FamilyHome() {
  const childId = useAula((s) => s.familyChild);
  const tasks = useAula((s) => s.tasks.filter((t) => t.studentId === childId));
  const stars = useAula((s) => s.stars[childId]);
  const child = STUDENTS.find((s) => s.id === childId)!;
  const done = tasks.filter((t) => t.status === "hecha").length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;
  const mood = child.accuracy >= 75 ? { face: "😊", text: "Va muy bien" } : { face: "🙂", text: "Va bien, con algún tropiezo" };

  return (
    <PageTransition className="space-y-5">
      <div>
        <h1 className="text-3xl font-semibold">Hola, {FAMILY.tutor} 👋</h1>
        <p className="text-muted-foreground">Así va la semana en el cole.</p>
      </div>

      <ChildSwitcher />

      <motion.div key={childId} variants={stagger} initial="hidden" animate="show" className="space-y-5">
        <motion.section variants={rise} className="glass flex items-center gap-5 rounded-3xl p-5">
          <Ring value={pct} tone={child.tone} label={`${done}/${tasks.length}`} />
          <div className="min-w-0">
            <p className="text-sm font-bold text-muted-foreground">Esta semana {child.name}</p>
            <p className="font-display text-2xl font-semibold leading-tight">
              {mood.face} {mood.text}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Ha hecho {done} de {tasks.length} tareas.
            </p>
          </div>
        </motion.section>

        <motion.div variants={rise} className="grid grid-cols-3 gap-3">
          <Stat emoji="⭐" value={stars} label="Estrellas" />
          <Stat emoji="✅" value={`${child.completion}%`} label="Entrega" />
          <Stat emoji="🎯" value={`${child.accuracy}%`} label="Aciertos" />
        </motion.div>

        <motion.section variants={rise} className="glass rounded-3xl p-5">
          <p className="font-bold">Tareas hechas cada día</p>
          <ChartContainer config={weekConfig} className="mt-2 h-[130px] w-full">
            <BarChart data={FAMILY_WEEK[childId]}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <Bar dataKey="value" fill="var(--color-value)" radius={10} barSize={28} />
            </BarChart>
          </ChartContainer>
        </motion.section>

        <motion.section variants={rise} className="space-y-3">
          <h2 className="text-xl font-semibold">Avisos</h2>
          {FAMILY_ALERTS[childId].map((a, i) => (
            <div key={i} className={cn("glass flex items-start gap-3 rounded-2xl border-l-8 p-4", a.level === "warn" ? "border-l-warning" : a.level === "ok" ? "border-l-success" : "border-l-sky")}>
              <span className="text-3xl">{a.icon}</span>
              <div className="flex-1">
                <p className="font-semibold leading-snug">{a.text}</p>
                {a.level === "warn" && (
                  <Link to="/familia/asistente" className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
                    <MessageCircleHeart className="size-4" /> Pregúntale a Raíz
                  </Link>
                )}
              </div>
            </div>
          ))}
        </motion.section>

        <motion.section variants={rise} className="space-y-3">
          <h2 className="text-xl font-semibold">Tareas de {child.name}</h2>
          {tasks.map((t) => (
            <Link key={t.id} to="/familia/asistente" className="glass card-hover flex items-center gap-4 rounded-2xl p-4">
              <span className={cn("grid size-14 shrink-0 place-items-center rounded-2xl text-3xl", TONE[SUBJECTS[t.subject].tone].soft)}>{t.cover}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{t.title}</p>
                <p className="text-sm text-muted-foreground">
                  {SUBJECTS[t.subject].name} · {t.minutes} min
                </p>
              </div>
              {t.status === "hecha" ? (
                <span className="rounded-full bg-success px-3 py-1 text-xs font-bold text-success-foreground">Hecha</span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm font-bold text-primary">
                  Ayuda <ChevronRight className="size-4" />
                </span>
              )}
            </Link>
          ))}
        </motion.section>
      </motion.div>
    </PageTransition>
  );
}

function Stat({ emoji, value, label }: { emoji: string; value: string | number; label: string }) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <p className="text-2xl">{emoji}</p>
      <p className="font-display text-2xl font-semibold">{value}</p>
      <p className="text-xs font-bold text-muted-foreground">{label}</p>
    </div>
  );
}

function Ring({ value, tone, label }: { value: number; tone: keyof typeof TONE; label: string }) {
  const r = 42;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative size-28 shrink-0">
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle cx="50" cy="50" r={r} strokeWidth="12" className="fill-none stroke-muted" />
        <motion.circle
          cx="50"
          cy="50"
          r={r}
          strokeWidth="12"
          strokeLinecap="round"
          className={cn("fill-none stroke-current", TONE[tone].text)}
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: c - (value / 100) * c }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
      </svg>
      <span className="font-display absolute inset-0 grid place-items-center text-2xl font-semibold">{label}</span>
    </div>
  );
}
