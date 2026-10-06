import { ArrowLeft, ListChecks, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConcursoBadge } from "@/components/concurso-badge";
import { StatusLegenda } from "@/components/status-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProgresso, getRespostas } from "@/lib/data";
import { getMateria } from "@/lib/edital";
import { QUESTOES, validas } from "@/lib/questoes";
import { resumo, ultimaPorQuestao } from "@/lib/questoes-logica";
import { TopicoChecklist } from "./topico-checklist";

type Props = { params: Promise<{ materia: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getMateria((await params).materia)?.nome ?? "Matéria" };
}

export default async function MateriaPage({ params }: Props) {
  const materia = getMateria((await params).materia);
  if (!materia) notFound();
  const [progresso, respostas] = await Promise.all([getProgresso(), getRespostas()]);
  const questoes = validas(QUESTOES).filter((q) => q.materia === materia.slug);
  const ids = new Set(questoes.map((q) => q.id));
  const daMateria = respostas.filter((r) => ids.has(r.questao_id));
  const feitas = [...ultimaPorQuestao(daMateria).keys()].length;
  const desempenho = resumo(daMateria);
  const porTopico: Record<string, number> = {};
  for (const q of questoes) if (q.topico) porTopico[q.topico] = (porTopico[q.topico] ?? 0) + 1;

  return (
    <>
      <Link
        href="/edital"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Edital
      </Link>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{materia.nome}</h1>
          <div className="mt-2 flex gap-1">
            {materia.concursos.map((c) => (
              <ConcursoBadge key={c} concurso={c} />
            ))}
          </div>
        </div>
        <Button asChild>
          <Link href={`/estudar?materia=${materia.slug}`}>
            <Play /> Estudar esta matéria
          </Link>
        </Button>
      </div>
      {questoes.length > 0 && (
        <Card className="mb-5 flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="text-sm">
            <p className="font-medium">
              {questoes.length} {questoes.length === 1 ? "questão oficial" : "questões oficiais"} do Cebraspe
            </p>
            <p className="text-muted-foreground">
              {feitas === 0
                ? "Você ainda não fez nenhuma."
                : `Você já fez ${feitas} · ${desempenho.aproveitamento}% de acerto`}
            </p>
          </div>
          <Button asChild variant="secondary">
            <Link href={`/questoes/treino?materia=${materia.slug}`}>
              <ListChecks /> Treinar questões
            </Link>
          </Button>
        </Card>
      )}
      <p className="mb-2 text-sm text-muted-foreground">
        Toque no ícone para avançar o status (depois de &quot;questões feitas&quot; ele volta ao início). Toque
        no nome para abrir o tópico com resumo, lei seca e questões.
      </p>
      <div className="mb-4">
        <StatusLegenda />
      </div>
      <TopicoChecklist topicos={materia.topicos} progresso={progresso} questoesPorTopico={porTopico} />
    </>
  );
}
