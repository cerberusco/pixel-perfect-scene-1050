import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { BookOpenCheck, LayoutDashboard, Repeat, Send } from "lucide-react";
import { Logo } from "@/components/aula/logo";

export const Route = createFileRoute("/profesor")({
  component: TeacherLayout,
});

const NAV = [
  { to: "/profesor" as const, label: "Panel", icon: LayoutDashboard, exact: true },
  { to: "/profesor/tareas" as const, label: "Tareas", icon: Send, exact: false },
  { to: "/profesor/licencias" as const, label: "Licencias", icon: BookOpenCheck, exact: false },
];

function TeacherLayout() {
  return (
    <div className="bg-field min-h-screen lg:flex">
      <aside className="glass sticky top-0 hidden h-screen w-64 shrink-0 flex-col rounded-none border-y-0 border-l-0 p-5 lg:flex">
        <Logo />
        <nav className="mt-10 flex flex-col gap-1.5">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground data-[status=active]:shadow-glow"
            >
              <Icon className="size-4.5" /> {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-3">
          <div className="rounded-2xl bg-primary-soft p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-clay-ink">Esta semana</p>
            <p className="font-display mt-1 text-3xl font-semibold text-clay-ink">4,5 h</p>
            <p className="text-sm text-clay-ink/80">ahorradas en corrección y preparación</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl p-2">
            <span className="grid size-10 place-items-center rounded-full bg-leaf-soft text-xl">👩‍🏫</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">Maestra Carmen</p>
              <p className="truncate text-xs text-muted-foreground">Aula multinivel · 5 alumnos</p>
            </div>
            <Link to="/" title="Cambiar de modo" className="rounded-lg p-2 text-muted-foreground hover:bg-card hover:text-foreground">
              <Repeat className="size-4" />
            </Link>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="glass sticky top-0 z-30 flex items-center justify-between rounded-none border-x-0 border-t-0 px-4 py-3 lg:hidden">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-card">
            <Repeat className="size-4" /> Modo
          </Link>
        </header>
        <nav className="no-scrollbar sticky top-[61px] z-20 flex gap-2 overflow-x-auto px-4 pt-3 lg:hidden">
          {NAV.map(({ to, label, icon: Icon, exact }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact }}
              className="glass inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
            >
              <Icon className="size-4" /> {label}
            </Link>
          ))}
        </nav>
        <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
