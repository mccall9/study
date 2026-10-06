"use client";

import { Check, CheckCheck, Circle, CircleDot } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { definirStatus } from "@/app/actions";
import { Card } from "@/components/ui/card";
import type { Topico } from "@/lib/edital";
import { proximoStatus, STATUS_LABEL, type Progresso, type Status } from "@/lib/types";
import { cn } from "@/lib/utils";

const ESTILO: Record<Status, { icon: typeof Circle; cor: string }> = {
  nao_iniciado: { icon: Circle, cor: "text-muted-foreground" },
  estudado: { icon: CircleDot, cor: "text-status-estudado" },
  revisado: { icon: Check, cor: "text-status-revisado" },
  questoes_ok: { icon: CheckCheck, cor: "text-status-questoes" },
};

export function TopicoChecklist({ topicos, progresso }: { topicos: Topico[]; progresso: Progresso }) {
  const [otimista, aplicar] = useOptimistic(
    progresso,
    (atual, { id, status }: { id: string; status: Status }) => ({ ...atual, [id]: status }),
  );
  const [, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function avancar(id: string) {
    const status = proximoStatus(otimista[id] ?? "nao_iniciado");
    startTransition(async () => {
      aplicar({ id, status });
      const r = await definirStatus(id, status);
      setErro(r.erro ?? null);
    });
  }

  return (
    <>
      {erro && <p className="mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}
      <Card className="divide-y overflow-hidden">
        {topicos.map((t, i) => {
          const status = otimista[t.id] ?? "nao_iniciado";
          const { icon: Icon, cor } = ESTILO[status];
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => avancar(t.id)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 active:bg-muted"
            >
              <Icon className={cn("size-5 shrink-0", cor)} />
              <span className="min-w-0 flex-1">
                <span className="mr-1 text-muted-foreground tabular-nums">{i + 1}.</span>
                {t.titulo}
              </span>
              <span className={cn("hidden shrink-0 text-xs font-medium sm:inline", cor)}>
                {STATUS_LABEL[status]}
              </span>
            </button>
          );
        })}
      </Card>
    </>
  );
}
