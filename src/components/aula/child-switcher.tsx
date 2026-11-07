import { motion } from "framer-motion";
import { FAMILY, STUDENTS } from "@/lib/aula-data";
import { setFamilyChild, useAula } from "@/lib/aula-store";
import { cn } from "@/lib/utils";
import { TONE } from "./tone";

export function ChildSwitcher() {
  const current = useAula((s) => s.familyChild);
  const kids = STUDENTS.filter((s) => FAMILY.children.includes(s.id));
  return (
    <div className="glass flex gap-1 rounded-full p-1.5" role="tablist" aria-label="Elegir hijo">
      {kids.map((k) => {
        const on = k.id === current;
        return (
          <button key={k.id} role="tab" aria-selected={on} onClick={() => setFamilyChild(k.id)} className="relative flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 font-bold">
            {on && <motion.span layoutId="child-pill" className={cn("absolute inset-0 rounded-full shadow-soft", TONE[k.tone].soft)} transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
            <span className="relative text-2xl">{k.avatar}</span>
            <span className={cn("relative", on ? TONE[k.tone].ink : "text-muted-foreground")}>
              {k.name} <span className="text-xs font-semibold opacity-70">· {k.age} años</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
