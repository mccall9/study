import "server-only";
import inss2016 from "@/data/questoes/inss-2016.json";
import inss2022 from "@/data/questoes/inss-2022.json";
import prf2021 from "@/data/questoes/prf-2021.json";
import type { Concurso } from "./edital";
import type { Gabarito, Questao } from "./questoes-logica";

type ProvaJson = {
  id: string;
  nome: string;
  concurso: string;
  banca: string;
  ano: number;
  fontes: string[];
  textos: Record<string, string>;
  itens: {
    id: string;
    numero: number;
    materia: string;
    topico: string | null;
    texto: string | null;
    comando: string;
    enunciado: string;
    gabarito: string;
    observacao?: string;
  }[];
};

export type Prova = {
  id: string;
  nome: string;
  concurso: Concurso;
  banca: string;
  ano: number;
  fontes: string[];
  questoes: Questao[];
};

function carregar(json: ProvaJson): Prova {
  const concurso = json.concurso as Concurso;
  return {
    id: json.id,
    nome: json.nome,
    concurso,
    banca: json.banca,
    ano: json.ano,
    fontes: json.fontes,
    questoes: json.itens.map((i) => ({
      id: i.id,
      provaId: json.id,
      numero: i.numero,
      concurso,
      materia: i.materia,
      topico: i.topico,
      texto: i.texto ? json.textos[i.texto] : null,
      comando: i.comando,
      enunciado: i.enunciado,
      gabarito: i.gabarito as Gabarito,
      ...(i.observacao ? { observacao: i.observacao } : {}),
    })),
  };
}

export const PROVAS: Prova[] = [carregar(prf2021), carregar(inss2022), carregar(inss2016)];

export const QUESTOES: Questao[] = PROVAS.flatMap((p) => p.questoes);

export const QUESTOES_POR_ID = new Map(QUESTOES.map((q) => [q.id, q]));

export function getProva(id: string): Prova | undefined {
  return PROVAS.find((p) => p.id === id);
}

/** Itens válidos (sem os anulados). */
export function validas(questoes: Questao[]): Questao[] {
  return questoes.filter((q) => q.gabarito !== "X");
}
