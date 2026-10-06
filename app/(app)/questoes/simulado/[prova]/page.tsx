import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sortear } from "@/lib/desempenho";
import { getProva, QUESTOES, validas } from "@/lib/questoes";
import { empacotar } from "@/lib/questoes-logica";
import { descreverSimulado, lerConfig, SIMULADO_PERSONALIZADO } from "@/lib/simulado";
import { Simulado } from "./simulado";

type Props = {
  params: Promise<{ prova: string }>;
  searchParams: Promise<{ concurso?: string; materias?: string; itens?: string; minutos?: string; semente?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).prova;
  return { title: id === SIMULADO_PERSONALIZADO ? "Simulado personalizado" : `Simulado ${getProva(id)?.nome ?? ""}` };
}

export default async function SimuladoPage({ params, searchParams }: Props) {
  const id = (await params).prova;
  if (id === SIMULADO_PERSONALIZADO) {
    const config = lerConfig(await searchParams);
    if (!config) notFound();
    const banco = validas(QUESTOES).filter(
      (q) => (!config.concurso || q.concurso === config.concurso) && (config.materias.length === 0 || config.materias.includes(q.materia)),
    );
    const questoes = sortear(banco, config.itens, config.semente);
    if (questoes.length === 0) notFound();
    return (
      <>
        <Link
          href="/questoes"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Questões
        </Link>
        <Simulado
          provaId={SIMULADO_PERSONALIZADO}
          chave={`estudos:simulado:${SIMULADO_PERSONALIZADO}:${config.semente}`}
          nome="Simulado personalizado"
          pacote={empacotar(questoes)}
          ids={questoes.map((q) => q.id)}
          limiteSeg={config.minutos * 60 || undefined}
          observacao={`${questoes.length} itens sorteados das provas oficiais · ${descreverSimulado(config)}.`}
        />
      </>
    );
  }
  const prova = getProva(id);
  if (!prova) notFound();
  const questoes = validas(prova.questoes);
  const anulados = prova.questoes.length - questoes.length;

  return (
    <>
      <Link
        href="/questoes"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Questões
      </Link>
      <Simulado
        provaId={prova.id}
        nome={prova.nome}
        pacote={empacotar(questoes)}
        observacao={`${questoes.length} itens válidos${anulados ? ` (${anulados} anulados pela banca ficaram de fora)` : ""}.`}
      />
    </>
  );
}
