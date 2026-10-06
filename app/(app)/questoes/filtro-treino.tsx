"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label, Select } from "@/components/ui/form";
import { getMateria, MATERIAS } from "@/lib/edital";
import type { Situacao } from "@/lib/questoes-logica";
import { cn } from "@/lib/utils";

const SITUACOES: { valor: Situacao; rotulo: string }[] = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "nao_respondidas", rotulo: "Só as que não fiz" },
  { valor: "erros", rotulo: "Caderno de erros" },
  { valor: "revisao", rotulo: "Revisões de hoje" },
  { valor: "favoritas", rotulo: "Favoritas" },
];

const CONCURSOS_FILTRO = [
  { valor: "", rotulo: "Os dois" },
  { valor: "PRF", rotulo: "PRF" },
  { valor: "INSS", rotulo: "INSS" },
];

/** Monta a URL do treino a partir dos filtros. `porTopico` diz quantas questões há em cada tópico. */
export function FiltroTreino({ porTopico, porMateria }: { porTopico: Record<string, number>; porMateria: Record<string, number> }) {
  const router = useRouter();
  const [concurso, setConcurso] = useState("");
  const [materia, setMateria] = useState("");
  const [topico, setTopico] = useState("");
  const [situacao, setSituacao] = useState<Situacao>("todas");
  const [aleatoria, setAleatoria] = useState(false);

  const materias = MATERIAS.filter(
    (m) => porMateria[m.slug] && (!concurso || m.concursos.includes(concurso as "PRF" | "INSS")),
  );
  const topicos = getMateria(materia)?.topicos.filter((t) => porTopico[t.id]) ?? [];

  function treinar() {
    const p = new URLSearchParams();
    if (concurso) p.set("concurso", concurso);
    if (materia) p.set("materia", materia);
    if (topico) p.set("topico", topico);
    if (situacao !== "todas") p.set("situacao", situacao);
    if (aleatoria) p.set("ordem", "aleatoria");
    router.push(`/questoes/treino${p.size ? `?${p}` : ""}`);
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label id="f-concurso">Concurso</Label>
          <div role="group" aria-labelledby="f-concurso" className="grid h-11 grid-cols-3 rounded-lg border bg-muted/50 p-1">
            {CONCURSOS_FILTRO.map((c) => (
              <button
                key={c.valor}
                type="button"
                aria-pressed={concurso === c.valor}
                onClick={() => {
                  setConcurso(c.valor);
                  setMateria("");
                  setTopico("");
                }}
                className={cn(
                  "rounded-md text-sm font-medium transition-colors",
                  concurso === c.valor
                    ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {c.rotulo}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-materia">Matéria</Label>
          <Select
            id="f-materia"
            value={materia}
            onChange={(e) => {
              setMateria(e.target.value);
              setTopico("");
            }}
          >
            <option value="">Todas</option>
            {materias.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.nome} ({porMateria[m.slug]})
              </option>
            ))}
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-topico">Tópico</Label>
          <Select id="f-topico" value={topico} disabled={!materia} onChange={(e) => setTopico(e.target.value)}>
            <option value="">Todos</option>
            {topicos.map((t) => (
              <option key={t.id} value={t.id}>
                {t.titulo} ({porTopico[t.id]})
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {SITUACOES.map((s) => (
          <button
            key={s.valor}
            type="button"
            onClick={() => setSituacao(s.valor)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              situacao === s.valor ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted",
            )}
          >
            {s.rotulo}
          </button>
        ))}
        <label className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={aleatoria} onChange={(e) => setAleatoria(e.target.checked)} className="size-4" />
          Embaralhar
        </label>
      </div>

      <Button size="lg" className="w-full sm:w-auto" onClick={treinar}>
        <Play /> Começar treino
      </Button>
    </div>
  );
}
