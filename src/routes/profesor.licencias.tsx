import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AlertCircle, BookOpen, RefreshCw, Settings2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageTransition, rise, stagger } from "@/components/aula/page-transition";
import { TONE } from "@/components/aula/tone";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BOOK_LICENSES, STUDENTS, SUBJECTS, type BookLicense } from "@/lib/aula-data";
import { setLicenseAssignment, useAula } from "@/lib/aula-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profesor/licencias")({
  head: () => ({
    meta: [
      { title: "Licencias de libros digitales · Aula Raíz" },
      { name: "description", content: "Gestiona y asigna las licencias de libros de texto digitales de tu aula multinivel." },
      { property: "og:title", content: "Licencias de libros digitales · Aula Raíz" },
      { property: "og:description", content: "Asigna y renueva licencias de libros de texto en un solo sitio." },
    ],
  }),
  component: LicensesPage,
});

function LicensesPage() {
  const overrides = useAula((s) => s.licenses);
  const [editing, setEditing] = useState<BookLicense | null>(null);
  const assignedFor = (b: BookLicense) => overrides[b.id] ?? b.assigned;

  const total = BOOK_LICENSES.reduce((a, b) => a + b.total, 0);
  const used = BOOK_LICENSES.reduce((a, b) => a + assignedFor(b).length, 0);

  return (
    <PageTransition className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold sm:text-4xl">Licencias de libros</h1>
          <p className="mt-1 text-muted-foreground">
            {used} de {total} licencias en uso · 1 caduca pronto
          </p>
        </div>
        <div className="glass flex items-center gap-4 rounded-2xl px-5 py-3">
          <BookOpen className="size-6 text-primary" />
          <div className="w-40">
            <div className="h-2.5 overflow-hidden rounded-full bg-muted">
              <motion.div className="bg-warm h-full rounded-full" initial={{ width: 0 }} animate={{ width: `${(used / total) * 100}%` }} transition={{ duration: 0.9 }} />
            </div>
            <p className="mt-1 text-xs font-bold text-muted-foreground">{Math.round((used / total) * 100)}% ocupadas</p>
          </div>
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {BOOK_LICENSES.map((b) => {
          const subj = SUBJECTS[b.subject];
          const assigned = assignedFor(b);
          const expiring = b.expires.includes("2026");
          return (
            <motion.article key={b.id} variants={rise} className="glass card-hover flex flex-col rounded-3xl p-5">
              <div className="flex gap-4">
                <div className={cn("grid h-24 w-18 shrink-0 place-items-center rounded-xl text-4xl shadow-soft", TONE[subj.tone].solid)}>{b.cover}</div>
                <div className="min-w-0">
                  <p className={cn("text-xs font-bold uppercase tracking-wider", TONE[subj.tone].ink)}>{subj.name}</p>
                  <h3 className="text-lg font-semibold leading-tight">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.publisher}</p>
                  <p className="text-xs text-muted-foreground">{b.levels}</p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm">
                <span className="font-bold">
                  {assigned.length}/{b.total} asignadas
                </span>
                <span className={cn("inline-flex items-center gap-1 text-xs font-bold", expiring ? "text-destructive" : "text-muted-foreground")}>
                  {expiring && <AlertCircle className="size-3.5" />} Caduca {b.expires}
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full transition-all", TONE[subj.tone].solid)} style={{ width: `${(assigned.length / b.total) * 100}%` }} />
              </div>
              <div className="mt-4 flex -space-x-2">
                {assigned.map((id) => {
                  const s = STUDENTS.find((x) => x.id === id)!;
                  return (
                    <span key={id} title={s.name} className={cn("grid size-9 place-items-center rounded-full text-lg ring-2 ring-card", TONE[s.tone].soft)}>
                      {s.avatar}
                    </span>
                  );
                })}
                {!assigned.length && <span className="text-sm text-muted-foreground">Sin asignar</span>}
              </div>
              <div className="mt-5 flex gap-2">
                <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setEditing(b)}>
                  <Settings2 /> Asignar
                </Button>
                {expiring && (
                  <Button variant="soft" className="rounded-xl" onClick={() => toast.success("Renovación solicitada", { description: `${b.title} · ${b.publisher}` })}>
                    <RefreshCw /> Renovar
                  </Button>
                )}
              </div>
            </motion.article>
          );
        })}
      </motion.div>

      {editing && <AssignDialog book={editing} current={assignedFor(editing)} onClose={() => setEditing(null)} />}
    </PageTransition>
  );
}

function AssignDialog({ book, current, onClose }: { book: BookLicense; current: string[]; onClose: () => void }) {
  const [sel, setSel] = useState<string[]>(current);
  const full = sel.length >= book.total;
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="glass-strong rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">{book.title}</DialogTitle>
          <DialogDescription>
            {sel.length} de {book.total} licencias usadas
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-2">
          {STUDENTS.map((s) => {
            const on = sel.includes(s.id);
            const disabled = !on && full;
            return (
              <button
                key={s.id}
                disabled={disabled}
                onClick={() => setSel((c) => (on ? c.filter((x) => x !== s.id) : [...c, s.id]))}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border-2 bg-card p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-40",
                  on ? "border-primary" : "border-transparent",
                )}
              >
                <span className="text-2xl">{s.avatar}</span>
                <span>
                  <span className="block font-bold">{s.name}</span>
                  <span className="block text-xs text-muted-foreground">{s.course}</span>
                </span>
              </button>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={() => {
              setLicenseAssignment(book.id, sel);
              toast.success("Licencias actualizadas");
              onClose();
            }}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
