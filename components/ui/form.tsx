import { ChevronDown } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const campo =
  "w-full rounded-lg border border-border bg-card px-3 text-base shadow-xs transition-colors placeholder:text-muted-foreground hover:border-foreground/25 focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-primary/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-border sm:text-sm";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(campo, "h-10", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(campo, "min-h-20 py-2", className)} {...props} />;
}

/** Select nativo (no celular abre o seletor do próprio aparelho), com visual e seta do app. */
export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <div className={cn("relative", className)}>
      <select className={cn(campo, "h-11 cursor-pointer appearance-none truncate pr-10")} {...props} />
      <ChevronDown
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
    </div>
  );
}

export function Label({ className, ...props }: React.ComponentProps<"label">) {
  return <label className={cn("text-sm font-medium", className)} {...props} />;
}

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("h-2 w-full overflow-hidden rounded-full bg-muted", className)}
    >
      <div
        className={cn("h-full rounded-full bg-primary transition-all", barClassName)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
