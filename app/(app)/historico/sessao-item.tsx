"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { atualizarSessao, excluirSessao } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/form";
import { getMateria } from "@/lib/edital";
import { formatarDuracao, FUSO } from "@/lib/stats";
import type { Sessao } from "@/lib/types";

const HORA = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: FUSO });

export function SessaoItem({ sessao }: { sessao: Sessao }) {
  const materia = getMateria(sessao.materia_slug);
  const topico = materia?.topicos.find((t) => t.id === sessao.topico_id);
  const [editando, setEditando] = useState(false);
  const [minutos, setMinutos] = useState(String(Math.round(sessao.duracao_seg / 60)));
  const [anotacao, setAnotacao] = useState(sessao.anotacao ?? "");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, start] = useTransition();

  function salvar() {
    start(async () => {
      const r = await atualizarSessao(sessao.id, { duracaoSeg: Number(minutos) * 60, anotacao });
      setErro(r.erro ?? null);
      if (!r.erro) setEditando(false);
    });
  }

  function excluir() {
    if (!confirm("Excluir esta sessão?")) return;
    start(async () => {
      const r = await excluirSessao(sessao.id);
      setErro(r.erro ?? null);
    });
  }

  return (
    <div className="space-y-3 p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-medium leading-snug">{materia?.nome ?? sessao.materia_slug}</p>
          <p className="text-sm text-muted-foreground">
            {HORA.format(new Date(sessao.inicio))}
            {topico && <> · {topico.titulo}</>}
          </p>
          {!editando && sessao.anotacao && (
            <p className="mt-1 text-sm whitespace-pre-line">{sessao.anotacao}</p>
          )}
        </div>
        <span className="shrink-0 font-semibold tabular-nums">{formatarDuracao(sessao.duracao_seg)}</span>
      </div>

      {editando ? (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`min-${sessao.id}`}>Minutos</Label>
            <Input
              id={`min-${sessao.id}`}
              type="number"
              min={1}
              max={1440}
              value={minutos}
              onChange={(e) => setMinutos(e.target.value)}
              className="w-28"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`nota-${sessao.id}`}>Anotação</Label>
            <Textarea id={`nota-${sessao.id}`} value={anotacao} onChange={(e) => setAnotacao(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={salvar} disabled={pendente}>
              Salvar
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditando(false)} disabled={pendente}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="-ml-3 flex gap-1">
          <Button size="sm" variant="ghost" onClick={() => setEditando(true)}>
            <Pencil /> Editar
          </Button>
          <Button size="sm" variant="ghost" className="text-destructive" onClick={excluir} disabled={pendente}>
            <Trash2 /> Excluir
          </Button>
        </div>
      )}
      {erro && <p className="text-sm text-destructive">{erro}</p>}
    </div>
  );
}
