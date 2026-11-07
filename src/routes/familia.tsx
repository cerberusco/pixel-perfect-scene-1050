import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Home, MessageCircleHeart, Repeat } from "lucide-react";
import { Logo } from "@/components/aula/logo";

export const Route = createFileRoute("/familia")({
  component: FamilyLayout,
});

function FamilyLayout() {
  return (
    <div className="bg-field min-h-dvh">
      <header className="glass sticky top-0 z-30 rounded-none border-x-0 border-t-0">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <Logo />
          <Link to="/" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:bg-card">
            <Repeat className="size-4" /> Modo
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 pb-28 pt-4">
        <Outlet />
      </main>
      <nav className="glass-strong fixed inset-x-3 bottom-3 z-40 mx-auto flex max-w-md justify-around rounded-full p-2" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
        <Tab to="/familia" exact icon={Home} label="Inicio" />
        <Tab to="/familia/asistente" icon={MessageCircleHeart} label="Pregunta a Raíz" />
      </nav>
    </div>
  );
}

function Tab({ to, icon: Icon, label, exact }: { to: "/familia" | "/familia/asistente"; icon: typeof Home; label: string; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className="flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-base font-bold text-muted-foreground transition-all data-[status=active]:bg-primary data-[status=active]:text-primary-foreground data-[status=active]:shadow-glow"
    >
      <Icon className="size-5" /> {label}
    </Link>
  );
}
