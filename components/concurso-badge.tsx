import type { Concurso } from "@/lib/edital";
import { cn } from "@/lib/utils";

export function ConcursoBadge({ concurso, className }: { concurso: Concurso; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide",
        concurso === "PRF"
          ? "bg-prf/20 text-yellow-800 dark:text-yellow-200"
          : "bg-inss/20 text-emerald-800 dark:text-emerald-200",
        className,
      )}
    >
      {concurso}
    </span>
  );
}
