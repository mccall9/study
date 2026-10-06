import Link from "next/link";
import type { Concurso } from "@/lib/edital";
import { cn } from "@/lib/utils";

const OPCOES: { valor: Concurso | null; rotulo: string }[] = [
  { valor: null, rotulo: "Todos" },
  { valor: "PRF", rotulo: "PRF" },
  { valor: "INSS", rotulo: "INSS" },
];

export function ConcursoFiltro({ atual, basePath }: { atual: Concurso | null; basePath: string }) {
  return (
    <div className="inline-flex rounded-lg border bg-card p-1">
      {OPCOES.map(({ valor, rotulo }) => (
        <Link
          key={rotulo}
          href={valor ? `${basePath}?concurso=${valor}` : basePath}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            atual === valor ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {rotulo}
        </Link>
      ))}
    </div>
  );
}
