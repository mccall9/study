import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { getAnotacoes, getMarcacoes, getRespostas } from "@/lib/data";
import { getMateria, parseConcurso } from "@/lib/edital";
import { QUESTOES, QUESTOES_POR_ID } from "@/lib/questoes";
import { idsMarcados } from "@/lib/marcacoes";
import { empacotar, filtrar, parseSituacao, type Filtro } from "@/lib/questoes-logica";
import { agendaDeRevisao, revisoesDoDia } from "@/lib/revisao";
import { Treino } from "./treino";

export const metadata: Metadata = { title: "Treino de questões" };

type Params = { concurso?: string; materia?: string; topico?: string; situacao?: string; ordem?: string; ids?: string };

const SITUACAO = {
  todas: null,
  nao_respondidas: "só as que você ainda não fez",
  erros: "caderno de erros",
  revisao: "revisões de hoje",
  favoritas: "favoritas",
};

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

  const [respostas, marcacoes, anotacoes] = await Promise.all([
    getRespostas(),
    getMarcacoes("questao:"),
    getAnotacoes("questao:"),
  ]);
  const favoritas = idsMarcados(marcacoes, "favorito", "questao:");
  // ?ids=a,b,c: questões escolhidas (ex.: as que caíram sobre um artigo da lei seca).
  const escolhidas = p.ids
    ?.split(",")
    .map((id) => QUESTOES_POR_ID.get(id))
    .filter((q): q is NonNullable<typeof q> => !!q && q.gabarito !== "X");
  const lista = escolhidas ?? filtrar(QUESTOES, filtro, respostas, { favoritas });
  if (filtro.situacao === "revisao" && !escolhidas) {
    // Revisões mais atrasadas primeiro.
    const ordem = new Map(revisoesDoDia(agendaDeRevisao(respostas), new Date()).map((r, i) => [r.questao_id, i]));
    lista.sort((a, b) => (ordem.get(a.id) ?? 0) - (ordem.get(b.id) ?? 0));
  }
  if (p.ordem === "aleatoria") {
    for (let i = lista.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lista[i], lista[j]] = [lista[j], lista[i]];
    }
  }

  const descricao = escolhidas
    ? escolhidas.length === 1
      ? "Questão selecionada"
      : "Questões selecionadas"
    : [filtro.concurso, topico?.titulo ?? materia?.nome, SITUACAO[filtro.situacao], p.ordem === "aleatoria" ? "ordem aleatória" : null]
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
      <Treino
        pacote={empacotar(lista)}
        descricao={descricao || "Todas as questões"}
        favoritas={lista.filter((q) => favoritas.has(q.id)).map((q) => q.id)}
        reportadas={[...idsMarcados(marcacoes, "reportado", "questao:")].filter((id) => lista.some((q) => q.id === id))}
        anotacoes={Object.fromEntries(lista.flatMap((q) => (anotacoes.has(`questao:${q.id}`) ? [[q.id, anotacoes.get(`questao:${q.id}`)!]] : [])))}
      />
    </>
  );
}
