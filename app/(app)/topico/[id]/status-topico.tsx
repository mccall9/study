"use client";

import { Check, CheckCheck, Circle, CircleDot } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { definirStatus } from "@/app/actions";
import { proximoStatus, STATUS_LABEL, type Status } from "@/lib/types";
import { cn } from "@/lib/utils";

const ESTILO: Record<Status, { icon: typeof Circle; cor: string }> = {
  nao_iniciado: { icon: Circle, cor: "text-muted-foreground" },
  estudado: { icon: CircleDot, cor: "text-status-estudado" },
  revisado: { icon: Check, cor: "text-status-revisado" },
  questoes_ok: { icon: CheckCheck, cor: "text-status-questoes" },
};

/** Botão que avança o status do tópico no edital (mesma regra do checklist). */
export function StatusTopico({ topicoId, status }: { topicoId: string; status: Status }) {
  const [atual, aplicar] = useOptimistic(status, (_: Status, novo: Status) => novo);
  const [, start] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const { icon: Icon, cor } = ESTILO[atual];

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          const novo = proximoStatus(atual);
          start(async () => {
            aplicar(novo);
            const r = await definirStatus(topicoId, novo);
            setErro(r.erro ?? null);
          });
        }}
        className="inline-flex items-center gap-2 rounded-full border bg-card px-3 py-1.5 text-sm font-medium hover:bg-muted"
      >
        <Icon className={cn("size-4", cor)} />
        {STATUS_LABEL[atual]}
        <span className="text-xs font-normal text-muted-foreground">· tocar para avançar</span>
      </button>
      {erro && <p className="mt-1 text-xs text-destructive">{erro}</p>}
    </div>
  );
}
