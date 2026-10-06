import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getRespostas } from "@/lib/data";
import { getMateria, parseConcurso } from "@/lib/edital";
import { QUESTOES } from "@/lib/questoes";
import { empacotar, filtrar, parseSituacao, type Filtro } from "@/lib/questoes-logica";
import { Treino } from "./treino";

export const metadata: Metadata = { title: "Treino de questões" };

type Params = { concurso?: string; materia?: string; topico?: string; situacao?: string; ordem?: string };

const SITUACAO = { todas: null, nao_respondidas: "só as que você ainda não fez", erros: "caderno de erros" };

export default async function TreinoPage({ searchParams }: { searchParams: Promise<Params> }) {
  const p = await searchParams;
  const materia = getMateria(p.materia ?? "");
  const topico = materia?.topicos.find((t) => t.id === p.topico);
  const filtro: Filtro = {
    concurso: parseConcurso(p.concurso),
    materia: materia?.slug ?? null,
    topico: topico?.id ?? null,
    situacao: parseSituacao(p.situacao),
  };

  const respostas = await getRespostas();
  const lista = filtrar(QUESTOES, filtro, respostas);
  if (p.ordem === "aleatoria") {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
  }

  const descricao = [
    filtro.concurso,
    topico?.titulo ?? materia?.nome,
    SITUACAO[filtro.situacao],
    p.ordem === "aleatoria" ? "ordem aleatória" : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <>
      <Link
        href="/questoes"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Questões
      </Link>
      <Treino pacote={empacotar(lista)} descricao={descricao || "Todas as questões"} />
    </>
  );
}
