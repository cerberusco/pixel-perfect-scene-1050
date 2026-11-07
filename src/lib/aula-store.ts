import { useSyncExternalStore } from "react";
import { SEED_TASKS, STUDENTS, buildTask, type SubjectId, type Task } from "./aula-data";

// Tiny in-memory store shared by the three modes, so a task sent by the
// teacher appears instantly in the student's screen (prototype, no backend).

interface AulaState {
  tasks: Task[];
  stars: Record<string, number>;
  reportsSent: Record<string, string>; // studentId -> time label
  licenses: Record<string, string[]>; // bookId -> assigned student ids
}

const initialState = (): AulaState => ({
  tasks: SEED_TASKS,
  stars: Object.fromEntries(STUDENTS.map((s) => [s.id, s.stars])),
  reportsSent: { nora: "Vie 30 oct" },
  licenses: {},
});

let state: AulaState = initialState();
const serverState = initialState();
const listeners = new Set<() => void>();

function setState(updater: (s: AulaState) => AulaState) {
  state = updater(state);
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useAula<T>(selector: (s: AulaState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(serverState),
  );
}

export function getAulaState() {
  return state;
}

export function resetAula() {
  state = initialState();
  listeners.forEach((l) => l());
}

let counter = 100;

/** Sends one topic to several students; each receives the version for their level. */
export function sendTask(subject: SubjectId, studentIds: string[]): Task[] {
  const created = studentIds.map((id) => buildTask(id, subject, { id: `t${++counter}`, assignedAt: "Hoy" }));
  setState((s) => ({ ...s, tasks: [...created, ...s.tasks] }));
  return created;
}

/** Marks a task as done and rewards the child with one star per correct answer. */
export function completeTask(taskId: string, correct: number) {
  setState((s) => {
    const task = s.tasks.find((t) => t.id === taskId);
    if (!task || task.status === "hecha") return s;
    return {
      ...s,
      tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status: "hecha" } : t)),
      stars: { ...s.stars, [task.studentId]: (s.stars[task.studentId] ?? 0) + correct },
    };
  });
}

export function markReportSent(studentIds: string[]) {
  setState((s) => ({
    ...s,
    reportsSent: { ...s.reportsSent, ...Object.fromEntries(studentIds.map((id) => [id, "Hoy"])) },
  }));
}

export function setLicenseAssignment(bookId: string, studentIds: string[]) {
  setState((s) => ({ ...s, licenses: { ...s.licenses, [bookId]: studentIds } }));
}
