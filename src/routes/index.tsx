import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Clock, MessageCircleHeart, Sprout, Users } from "lucide-react";
import heroImg from "@/assets/hero-aula.jpg";
import { Logo } from "@/components/aula/logo";
import { rise, stagger } from "@/components/aula/page-transition";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aula Raíz · El aula multinivel de la escuela rural" },
      {
        name: "description",
        content:
          "Aula Raíz personaliza tareas para alumnos de 3 a 12 años en la misma clase, analiza dónde fallan y ayuda a las familias con un asistente paso a paso.",
      },
      { property: "og:title", content: "Aula Raíz · El aula multinivel de la escuela rural" },
      {
        property: "og:description",
        content: "Tareas adaptadas a cada edad, panel analítico para el profesorado y un asistente para las familias.",
      },
    ],
  }),
  component: Landing,
});

const MODES = [
  {
    to: "/profesor" as const,
    title: "Profesorado",
    kicker: "Panel de control",
    text: "Envía una tarea y se adapta sola a cada edad. Mira en qué fallan y por qué.",
    emoji: "👩‍🏫",
    icon: BarChart3,
    tone: "bg-clay-soft text-clay-ink",
  },
  {
    to: "/alumno" as const,
    title: "Alumnado",
    kicker: "Para niños desde 3 años",
    text: "Sin leer: dibujos grandes, voz y estrellas al terminar cada ejercicio.",
    emoji: "🦊",
    icon: Sprout,
    tone: "bg-sun-soft text-sun-ink",
  },
  {
    to: "/familia" as const,
    title: "Familias",
    kicker: "Desde el móvil",
    text: "Cómo va tu hijo en un vistazo y Raíz, que te explica cómo ayudarle.",
    emoji: "👨‍🌾",
    icon: MessageCircleHeart,
    tone: "bg-leaf-soft text-leaf-ink",
  },
];

function Landing() {
  return (
    <div className="bg-field min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <Logo />
        <span className="glass hidden rounded-full px-4 py-1.5 text-xs font-semibold text-muted-foreground sm:inline-flex">
          CRA Los Olivos · Curso 2026-27
        </span>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-16">
        <section className="grid items-center gap-10 pt-4 lg:grid-cols-[1.05fr_1fr] lg:pt-10">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={rise} className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-clay-ink">
              <Users className="size-3.5" /> Una clase, cinco edades
            </motion.p>
            <motion.h1 variants={rise} className="text-5xl font-semibold leading-[1.02] sm:text-6xl lg:text-7xl">
              Cada niño, <span className="text-warm italic">a su ritmo</span>, en la misma aula.
            </motion.h1>
            <motion.p variants={rise} className="mt-6 max-w-lg text-lg text-muted-foreground">
              En la escuela rural una maestra atiende a la vez a niños de 3 y de 10 años. Aula Raíz prepara, corrige y explica por ella,
              para que pueda estar con quien más la necesita.
            </motion.p>
            <motion.div variants={rise} className="mt-8 flex flex-wrap gap-3 text-sm">
              {[
                { icon: Clock, label: "4,5 h ahorradas a la semana" },
                { icon: Sprout, label: "3 niveles en una sola tarea" },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 font-semibold">
                  <Icon className="size-4 text-primary" /> {label}
                </span>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, rotate: 1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-4xl shadow-lift ring-1 ring-border">
              <img src={heroImg} alt="Maestra con alumnos de distintas edades en un aula rural" width={1536} height={1024} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="glass-strong animate-float absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl px-4 py-3 sm:-left-6">
              <span className="text-3xl">⭐</span>
              <div>
                <p className="text-sm font-bold">Lucía ha terminado</p>
                <p className="text-xs text-muted-foreground">Contamos manzanas · 3/3</p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="mt-20">
          <h2 className="mb-6 text-2xl font-semibold sm:text-3xl">¿Quién entra hoy?</h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid gap-5 md:grid-cols-3">
            {MODES.map((m) => (
              <motion.div key={m.to} variants={rise}>
                <Link to={m.to} className="glass card-hover group flex h-full flex-col rounded-3xl p-6">
                  <div className="flex items-start justify-between">
                    <span className={cn("grid size-16 place-items-center rounded-2xl text-4xl", m.tone)}>{m.emoji}</span>
                    <m.icon className="size-5 text-muted-foreground" />
                  </div>
                  <p className="mt-6 text-xs font-bold uppercase tracking-wider text-muted-foreground">{m.kicker}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{m.title}</h3>
                  <p className="mt-2 flex-1 text-muted-foreground">{m.text}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-bold text-primary">
                    Entrar <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
