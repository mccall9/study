import { ArrowLeft, TrendingDown, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ConcursoBadge } from "@/components/concurso-badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/form";
import { getRespostas } from "@/lib/data";
import { desempenhoPorTopico, evolucaoSemanal, fortesEFracos, type DesempenhoTopico } from "@/lib/desempenho";
import { CONCURSOS, getMateria, MATERIAS } from "@/lib/edital";
import { QUESTOES_POR_ID } from "@/lib/questoes";
import { resumo } from "@/lib/questoes-logica";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Desempenho" };

const TOPICOS = new Map(MATERIAS.flatMap((m) => m.topicos.map((t) => [t.id, t.titulo] as const)));
const DIA_MES = (dia: string) => `${dia.slice(8, 10)}/${dia.slice(5, 7)}`;

function cor(aproveitamento: number) {
  return aproveitamento >= 70 ? "bg-status-questoes" : aproveitamento >= 50 ? "bg-status-estudado" : "bg-destructive";
}

export default async function DesempenhoPage() {
  const respostas = await getRespostas();
  const semanas = evolucaoSemanal(respostas, new Date(), 8);
  const maxSemana = Math.max(1, ...semanas.map((s) => s.total));
  const porTopico = desempenhoPorTopico(respostas, QUESTOES_POR_ID);
  const { fortes, fracos } = fortesEFracos(porTopico);
  const porConcurso = CONCURSOS.map((c) => ({
    concurso: c,
    ...resumo(respostas.filter((r) => QUESTOES_POR_ID.get(r.questao_id)?.concurso === c)),
  }));

  return (
    <>
      <Link href="/questoes" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Questões
      </Link>
      <PageHeader title="Desempenho" description="Como estão os acertos ao longo das semanas e em cada tópico." />

      {respostas.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          Responda algumas questões no treino ou num simulado para ver seu desempenho aqui.
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Últimas 8 semanas</CardTitle>
              <CardDescription>Altura da barra: questões respondidas. Número em cima: % de acerto nas marcadas.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-44 items-end gap-1.5 sm:gap-3" role="img" aria-label="Questões respondidas e acerto por semana">
                {semanas.map((s) => (
                  <div key={s.inicio} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
                    <span className="text-xs font-medium tabular-nums">{s.aproveitamento !== null ? `${s.aproveitamento}%` : ""}</span>
                    <div
                      className={cn("w-full max-w-10 rounded-t-md", s.aproveitamento !== null ? cor(s.aproveitamento) : "bg-muted")}
                      style={{ height: `${Math.max(s.total ? 6 : 2, (s.total / maxSemana) * 100)}%` }}
                      title={`${s.total} respondidas`}
                    />
                    <span className="text-[11px] text-muted-foreground tabular-nums">{DIA_MES(s.inicio)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Esta semana: {semanas.at(-1)!.total} {semanas.at(-1)!.total === 1 ? "questão" : "questões"}.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <ListaTopicos
              titulo="Pontos fracos"
              descricao="Tópicos com menos de 70% de acerto. Vale reler o resumo e treinar de novo."
              icone={<TrendingDown className="size-4 text-destructive" />}
              lista={fracos}
              vazio="Nenhum tópico abaixo de 70% (com pelo menos 3 itens marcados)."
            />
            <ListaTopicos
              titulo="Pontos fortes"
              descricao="Tópicos com 70% de acerto ou mais."
              icone={<TrendingUp className="size-4 text-status-questoes" />}
              lista={fortes}
              vazio="Ainda não há tópico com 70% ou mais (com pelo menos 3 itens marcados)."
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Por concurso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {porConcurso.map((c) => (
                <div key={c.concurso} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <ConcursoBadge concurso={c.concurso} />
                    <span className="text-muted-foreground tabular-nums">
                      {c.certas + c.erradas > 0 ? `${c.aproveitamento}% de acerto` : "sem itens marcados"} · {c.total}{" "}
                      {c.total === 1 ? "resposta" : "respostas"} · nota {c.nota}
                    </span>
                  </div>
                  <Progress value={c.certas + c.erradas > 0 ? c.aproveitamento : 0} barClassName={c.concurso === "PRF" ? "bg-prf" : "bg-inss"} />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

function ListaTopicos({
  titulo,
  descricao,
  icone,
  lista,
  vazio,
}: {
  titulo: string;
  descricao: string;
  icone: React.ReactNode;
  lista: DesempenhoTopico[];
  vazio: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {icone}
          <CardTitle>{titulo}</CardTitle>
        </div>
        <CardDescription>{descricao}</CardDescription>
      </CardHeader>
      <CardContent>
        {lista.length === 0 ? (
          <p className="text-sm text-muted-foreground">{vazio}</p>
        ) : (
          <ul className="divide-y">
            {lista.map((d) => (
              <li key={d.topico} className="space-y-2 py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/topico/${d.topico}`} className="font-medium hover:underline">
                      {TOPICOS.get(d.topico) ?? d.topico}
                    </Link>
                    <p className="text-xs text-muted-foreground">{getMateria(d.materia)?.nome}</p>
                  </div>
                  <span className="shrink-0 text-sm tabular-nums">
                    <strong>{d.aproveitamento}%</strong> <span className="text-muted-foreground">em {d.respondidas}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={d.aproveitamento} className="flex-1" barClassName={cor(d.aproveitamento)} />
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/questoes/treino?materia=${d.materia}&topico=${d.topico}`}>Treinar</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
