"use client";

import { Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/form";
import { MATERIAS, type Concurso } from "@/lib/edital";
import { OPCOES_ITENS, OPCOES_MINUTOS, urlDoSimulado } from "@/lib/simulado";
import { cn } from "@/lib/utils";

type Contagem = Record<string, Partial<Record<Concurso, number>>>;

const CONCURSOS = [
  { valor: null, rotulo: "Os dois" },
  { valor: "PRF", rotulo: "PRF" },
  { valor: "INSS", rotulo: "INSS" },
] as const;

/** Monta um simulado sorteando itens das provas oficiais, com matérias, quantidade e tempo escolhidos. */
export function MontarSimulado({ contagem }: { contagem: Contagem }) {
  const router = useRouter();
  const [concurso, setConcurso] = useState<Concurso | null>(null);
  const [materias, setMaterias] = useState<string[]>([]);
  const [itens, setItens] = useState<number>(40);
  const [minutos, setMinutos] = useState<number>(60);

  const disponiveis = MATERIAS.filter((m) => total(m.slug) > 0);
  function total(slug: string) {
    const c = contagem[slug] ?? {};
    return concurso ? (c[concurso] ?? 0) : (c.PRF ?? 0) + (c.INSS ?? 0);
  }
  const noBanco = (materias.length ? materias : disponiveis.map((m) => m.slug)).reduce((s, m) => s + total(m), 0);

  function alternar(slug: string) {
    setMaterias((ms) => (ms.includes(slug) ? ms.filter((m) => m !== slug) : [...ms, slug]));
  }

  function montar() {
    const semente = 1 + Math.floor(Math.random() * 2_000_000_000);
    router.push(urlDoSimulado({ concurso, materias, itens, minutos, semente }));
  }

  const chip = (ativo: boolean) =>
    cn(
      "rounded-full border px-3 py-1.5 text-sm transition-colors",
      ativo ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
    );

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label id="ms-concurso">Concurso</Label>
        <div role="group" aria-labelledby="ms-concurso" className="grid h-11 max-w-sm grid-cols-3 rounded-lg border bg-muted/50 p-1">
          {CONCURSOS.map((c) => (
            <button
              key={c.rotulo}
              type="button"
              aria-pressed={concurso === c.valor}
              onClick={() => {
                setConcurso(c.valor);
                setMaterias([]);
              }}
              className={cn(
                "rounded-md text-sm font-medium transition-colors",
                concurso === c.valor ? "bg-card text-foreground shadow-sm ring-1 ring-border" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {c.rotulo}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <p className="text-sm font-medium">
          Matérias <span className="font-normal text-muted-foreground">(nenhuma marcada = todas)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {disponiveis.map((m) => (
            <button key={m.slug} type="button" aria-pressed={materias.includes(m.slug)} onClick={() => alternar(m.slug)} className={chip(materias.includes(m.slug))}>
              {m.nome} <span className="opacity-70">({total(m.slug)})</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-sm font-medium">Quantidade de itens</p>
          <div className="flex flex-wrap gap-2">
            {OPCOES_ITENS.map((n) => (
              <button key={n} type="button" aria-pressed={itens === n} onClick={() => setItens(n)} className={chip(itens === n)}>
                {n}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ms-tempo">Tempo</Label>
          <Select id="ms-tempo" value={minutos} onChange={(e) => setMinutos(Number(e.target.value))}>
            {OPCOES_MINUTOS.map((m) => (
              <option key={m} value={m}>
                {m === 0 ? "Sem limite" : m < 60 ? `${m} minutos` : `${m / 60} ${m === 60 ? "hora" : "horas"}`.replace(".5", " e meia")}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button size="lg" onClick={montar} disabled={noBanco === 0}>
          <Shuffle /> Montar simulado
        </Button>
        <p className="text-sm text-muted-foreground">
          {noBanco < itens ? `Só há ${noBanco} itens com esse filtro; o simulado terá todos.` : `Sorteia ${itens} de ${noBanco} itens.`}
        </p>
      </div>
    </div>
  );
}
