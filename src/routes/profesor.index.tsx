import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertTriangle, Check, CheckCircle2, Clock, Loader2, Mail, Send, Target, TrendingUp } from "lucide-react";
import { useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { PageTransition, rise, stagger } from "@/components/aula/page-transition";
import { TONE } from "@/components/aula/tone";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { ACCURACY_TREND, ERROR_CAUSES, INSIGHTS, ISSUE_LABEL, STUDENTS, SUBJECT_STRUGGLES, WEEKLY_ACTIVITY } from "@/lib/aula-data";
import { markReportSent, useAula } from "@/lib/aula-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profesor/")({
  head: () => ({
    meta: [
      { title: "Panel del profesorado · Aula Raíz" },
      { name: "description", content: "Estadísticas semanales del aula multinivel: qué fallan tus alumnos y por qué, con informes a familias en un clic." },
      { property: "og:title", content: "Panel del profesorado · Aula Raíz" },
      { property: "og:description", content: "Estadísticas semanales del aula multinivel e informes a familias en un clic." },
    ],
  }),
  component: TeacherDashboard,
});

const weeklyConfig = {
  entregadas: { label: "Entregadas", color: "var(--chart-2)" },
  pendientes: { label: "Sin hacer", color: "var(--chart-3)" },
} satisfies ChartConfig;

const causesConfig = {
  comprension: { label: "Falta de comprensión", color: "var(--chart-1)" },
  noentrega: { label: "No hace la tarea", color: "var(--chart-3)" },
  atencion: { label: "Atención", color: "var(--chart-4)" },
  tiempo: { label: "Falta de tiempo", color: "var(--chart-2)" },
  otros: { label: "Otros", color: "var(--chart-5)" },
} satisfies ChartConfig;

const trendConfig = {
  infantil: { label: "Infantil", color: "var(--chart-3)" },
  primaria: { label: "Primaria", color: "var(--chart-1)" },
} satisfies ChartConfig;

const subjectConfig = { fallos: { label: "Fallos", color: "var(--chart-1)" } } satisfies ChartConfig;

function TeacherDashboard() {
  const tasks = useAula((s) => s.tasks);
  const reportsSent = useAula((s) => s.reportsSent);
  const [sending, setSending] = useState<string | null>(null);

  const done = tasks.filter((t) => t.status === "hecha").length;

  const sendReports = (ids: string[]) => {
    setSending(ids.length > 1 ? "all" : (ids[0] ?? null));
    setTimeout(() => {
      markReportSent(ids);
      setSending(null);
      const names = STUDENTS.filter((s) => ids.includes(s.id));
      toast.success(ids.length > 1 ? `Informes enviados a ${names.length} familias` : `Informe de ${names[0]?.name ?? ""} enviado`, {
        description: ids.length > 1 ? "Por WhatsApp y correo, con resumen y consejos para casa." : `A ${names[0]?.tutor ?? ""} · ${names[0]?.tutorContact ?? ""}`,
      });
    }, 1100);
  };

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold text-muted-foreground">Semana del 2 al 6 de noviembre</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Buenos días, Carmen</h1>
          <p className="mt-1 text-muted-foreground">Tres alumnos necesitan hoy tu atención presencial.</p>
        </div>
        <Button variant="hero" size="lg" onClick={() => sendReports(STUDENTS.map((s) => s.id))} disabled={sending !== null}>
          {sending === "all" ? <Loader2 className="animate-spin" /> : <Mail />}
          Enviar informes a todas las familias
        </Button>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi icon={CheckCircle2} label="Tareas entregadas" value={`${71 + done}`} sub="+12% que la semana pasada" tone="leaf" />
        <Kpi icon={Target} label="Aciertos medios" value="76%" sub="Infantil 81% · Primaria 70%" tone="sun" />
        <Kpi icon={Clock} label="Tiempo ahorrado" value="4,5 h" sub="Corrección automática" tone="clay" />
        <Kpi icon={AlertTriangle} label="Alertas" value="3" sub="Comprensión y entregas" tone="berry" />
      </motion.div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title="Actividad de la semana" subtitle="Tareas entregadas y sin hacer por día" className="xl:col-span-2">
          <ChartContainer config={weeklyConfig} className="h-[260px] w-full">
            <BarChart data={WEEKLY_ACTIVITY} barGap={6}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="entregadas" stackId="a" fill="var(--color-entregadas)" radius={[0, 0, 8, 8]} />
              <Bar dataKey="pendientes" stackId="a" fill="var(--color-pendientes)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </Panel>

        <Panel title="¿Por qué fallan?" subtitle="Causa principal de los errores">
          <ChartContainer config={causesConfig} className="mx-auto h-[200px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="key" hideLabel />} />
              <Pie data={ERROR_CAUSES} dataKey="value" nameKey="key" innerRadius={52} outerRadius={84} paddingAngle={3} strokeWidth={0}>
                {ERROR_CAUSES.map((c) => (
                  <Cell key={c.key} fill={`var(--color-${c.key})`} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
          <ul className="mt-2 space-y-1.5 text-sm">
            {ERROR_CAUSES.map((c) => (
              <li key={c.key} className="flex items-center gap-2">
                <span className="size-2.5 rounded-full" style={{ background: causesConfig[c.key as keyof typeof causesConfig].color }} />
                <span className="flex-1 text-muted-foreground">{c.cause}</span>
                <span className="font-bold">{c.value}%</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title="Evolución de aciertos" subtitle="Últimas 5 semanas por etapa" icon={TrendingUp}>
          <ChartContainer config={trendConfig} className="h-[220px] w-full">
            <AreaChart data={ACCURACY_TREND}>
              <defs>
                <linearGradient id="gInf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-infantil)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--color-infantil)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gPri" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primaria)" stopOpacity={0.45} />
                  <stop offset="100%" stopColor="var(--color-primaria)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="4 4" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} />
              <YAxis domain={[50, 90]} tickLine={false} axisLine={false} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Area type="monotone" dataKey="infantil" stroke="var(--color-infantil)" strokeWidth={3} fill="url(#gInf)" />
              <Area type="monotone" dataKey="primaria" stroke="var(--color-primaria)" strokeWidth={3} fill="url(#gPri)" />
            </AreaChart>
          </ChartContainer>
        </Panel>

        <Panel title="Fallos por asignatura" subtitle="Respuestas incorrectas esta semana">
          <ChartContainer config={subjectConfig} className="h-[220px] w-full">
            <BarChart data={SUBJECT_STRUGGLES} layout="vertical" margin={{ left: 8 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="subject" tickLine={false} axisLine={false} width={92} />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="fallos" fill="var(--color-fallos)" radius={10} barSize={22} />
            </BarChart>
          </ChartContainer>
        </Panel>
      </div>

      <section>
        <h2 className="mb-3 text-xl font-semibold">Lo que Aula Raíz ha detectado</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {INSIGHTS.map((ins) => {
            const st = STUDENTS.find((s) => s.id === ins.studentId)!;
            return (
              <div key={ins.studentId} className="glass card-hover flex flex-col rounded-3xl p-5">
                <div className="flex items-center gap-3">
                  <span className={cn("grid size-12 place-items-center rounded-2xl text-2xl", TONE[ins.tone].soft)}>{st.avatar}</span>
                  <div>
                    <p className="font-bold leading-tight">{ins.title}</p>
                    <p className="text-xs text-muted-foreground">{st.course}</p>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{ins.detail}</p>
                <Button
                  variant="soft"
                  className="mt-4 justify-start rounded-xl"
                  onClick={() => toast.success("Hecho", { description: `${ins.action} para ${st.name}.` })}
                >
                  <Send /> {ins.action}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <Panel title="Alumnos" subtitle="Rendimiento semanal e informe a la familia">
        <div className="-mx-2 divide-y divide-border">
          {STUDENTS.map((s) => {
            const sent = reportsSent[s.id];
            const isSending = sending === s.id || sending === "all";
            return (
              <div key={s.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-2 py-3 md:grid-cols-[auto_1.2fr_1fr_1fr_1.2fr_auto]">
                <span className={cn("grid size-11 place-items-center rounded-2xl text-2xl", TONE[s.tone].soft)}>{s.avatar}</span>
                <div className="min-w-0">
                  <p className="font-bold">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.age} años · {s.course}</p>
                </div>
                <Meter label="Entrega" value={s.completion} className="hidden md:block" />
                <Meter label="Aciertos" value={s.accuracy} className="hidden md:block" />
                <span className={cn("hidden w-fit rounded-full px-3 py-1 text-xs font-bold md:inline-block", s.mainIssue === "comprension" ? "bg-clay-soft text-clay-ink" : s.mainIssue === "no-entrega" ? "bg-sun-soft text-sun-ink" : "bg-sky-soft text-sky-ink")}>
                  {ISSUE_LABEL[s.mainIssue]}
                </span>
                <Button size="sm" variant={sent === "Hoy" ? "secondary" : "outline"} className="rounded-full" disabled={isSending} onClick={() => sendReports([s.id])}>
                  {isSending ? <Loader2 className="animate-spin" /> : sent === "Hoy" ? <Check /> : <Mail />}
                  <span className="hidden sm:inline">{sent === "Hoy" ? "Enviado hoy" : "Informe"}</span>
                </Button>
              </div>
            );
          })}
        </div>
      </Panel>
    </PageTransition>
  );
}

function Kpi({ icon: Icon, label, value, sub, tone }: { icon: typeof Clock; label: string; value: string; sub: string; tone: keyof typeof TONE }) {
  return (
    <motion.div variants={rise} className="glass card-hover rounded-3xl p-5">
      <span className={cn("grid size-10 place-items-center rounded-xl", TONE[tone].soft, TONE[tone].ink)}>
        <Icon className="size-5" />
      </span>
      <p className="mt-4 text-sm font-semibold text-muted-foreground">{label}</p>
      <p className="font-display text-3xl font-semibold sm:text-4xl">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
    </motion.div>
  );
}

function Panel({ title, subtitle, children, className, icon: Icon }: { title: string; subtitle?: string; children: React.ReactNode; className?: string; icon?: typeof Clock }) {
  return (
    <section className={cn("glass rounded-3xl p-5 sm:p-6", className)}>
      <div className="mb-4 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {Icon && <Icon className="size-5 text-primary" />}
      </div>
      {children}
    </section>
  );
}

function Meter({ label, value, className }: { label: string; value: number; className?: string }) {
  const tone = value >= 80 ? "bg-success" : value >= 65 ? "bg-warning" : "bg-destructive";
  return (
    <div className={className}>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-bold">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div className={cn("h-full rounded-full", tone)} initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 0.9, ease: "easeOut" }} />
      </div>
    </div>
  );
}
