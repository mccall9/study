import type { Materia } from "@/lib/edital";
import type { Progresso, Status } from "@/lib/types";

const CORES: Partial<Record<Status, string>> = {
  questoes_ok: "bg-status-questoes",
  revisado: "bg-status-revisado",
  estudado: "bg-status-estudado",
};

/** Barra empilhada com a proporção de tópicos em cada status. */
export function StatusBar({ materia, progresso }: { materia: Materia; progresso: Progresso }) {
  const total = materia.topicos.length;
  const contagem = { questoes_ok: 0, revisado: 0, estudado: 0 };
  for (const t of materia.topicos) {
    const s = progresso[t.id];
    if (s && s !== "nao_iniciado") contagem[s]++;
  }
  return (
    <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
      {(["questoes_ok", "revisado", "estudado"] as const).map((s) =>
        contagem[s] ? (
          <div key={s} className={CORES[s]} style={{ width: `${(contagem[s] / total) * 100}%` }} />
        ) : null,
      )}
    </div>
  );
}

export function StatusLegenda() {
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-status-estudado" />Estudado</span>
      <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-status-revisado" />Revisado</span>
      <span className="flex items-center gap-1.5"><i className="size-2.5 rounded-full bg-status-questoes" />Questões feitas</span>
    </div>
  );
}
