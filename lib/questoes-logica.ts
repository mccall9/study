// Regras das questões, sem acesso a banco: dá para usar no servidor, no cliente e nos testes.

import type { Concurso } from "./edital";

export type Gabarito = "C" | "E" | "X"; // X = item anulado
export type RespostaValor = "C" | "E" | "B"; // B = deixou em branco

export type Questao = {
  id: string;
  provaId: string;
  numero: number;
  concurso: Concurso;
  materia: string;
  topico: string | null;
  texto: string | null; // texto de apoio
  comando: string;
  enunciado: string;
  gabarito: Gabarito;
  observacao?: string;
};

/** Questão como vai para o navegador antes de ser respondida: sem gabarito. */
export type QuestaoAberta = Omit<Questao, "gabarito">;

export type Resposta = {
  questao_id: string;
  resposta: RespostaValor;
  correta: boolean | null;
  respondida_em: string;
  simulado_id: string | null;
};

export type Situacao = "todas" | "nao_respondidas" | "erros";

export type Filtro = {
  concurso: Concurso | null;
  materia: string | null;
  topico: string | null;
  situacao: Situacao;
};

export function abrir({ gabarito: _gabarito, ...resto }: Questao): QuestaoAberta {
  void _gabarito;
  return resto;
}

export type ItemAberto = Omit<QuestaoAberta, "texto"> & { texto: number | null };

/** Questões sem gabarito, com cada texto de apoio enviado uma vez só. */
export type Pacote = { textos: string[]; itens: ItemAberto[] };

export function empacotar(questoes: Questao[]): Pacote {
  const textos: string[] = [];
  const indice = new Map<string, number>();
  const itens = questoes.map((q) => {
    const { texto, ...resto } = abrir(q);
    let i: number | null = null;
    if (texto) {
      if (!indice.has(texto)) {
        indice.set(texto, textos.length);
        textos.push(texto);
      }
      i = indice.get(texto)!;
    }
    return { ...resto, texto: i };
  });
  return { textos, itens };
}

/** Correção de um item: null quando deixado em branco. */
export function corrigir(gabarito: Gabarito, resposta: RespostaValor): boolean | null {
  if (resposta === "B") return null;
  return resposta === gabarito;
}

export function resumo(respostas: Pick<Resposta, "correta">[]) {
  let certas = 0;
  let erradas = 0;
  let brancos = 0;
  for (const r of respostas) {
    if (r.correta === true) certas++;
    else if (r.correta === false) erradas++;
    else brancos++;
  }
  const marcadas = certas + erradas;
  return {
    certas,
    erradas,
    brancos,
    total: certas + erradas + brancos,
    /** Nota no estilo Cebraspe: cada errada anula uma certa. */
    nota: certas - erradas,
    /** % de acerto entre as que foram marcadas (sem contar as em branco). */
    aproveitamento: marcadas === 0 ? 0 : Math.round((certas / marcadas) * 100),
  };
}

/** Resposta mais recente de cada questão. */
export function ultimaPorQuestao(respostas: Resposta[]): Map<string, Resposta> {
  const ultima = new Map<string, Resposta>();
  for (const r of respostas) {
    const atual = ultima.get(r.questao_id);
    if (!atual || r.respondida_em > atual.respondida_em) ultima.set(r.questao_id, r);
  }
  return ultima;
}

/** Caderno de erros: questões cuja resposta mais recente foi errada ou em branco. */
export function cadernoDeErros(respostas: Resposta[]): Set<string> {
  const ids = new Set<string>();
  for (const [id, r] of ultimaPorQuestao(respostas)) {
    if (r.correta !== true) ids.add(id);
  }
  return ids;
}

export function filtrar(questoes: Questao[], filtro: Filtro, respostas: Resposta[]): Questao[] {
  const ultima = ultimaPorQuestao(respostas);
  const erros = filtro.situacao === "erros" ? cadernoDeErros(respostas) : null;
  return questoes.filter(
    (q) =>
      q.gabarito !== "X" &&
      (!filtro.concurso || q.concurso === filtro.concurso) &&
      (!filtro.materia || q.materia === filtro.materia) &&
      (!filtro.topico || q.topico === filtro.topico) &&
      (filtro.situacao !== "nao_respondidas" || !ultima.has(q.id)) &&
      (!erros || erros.has(q.id)),
  );
}

/** Desempenho por matéria, considerando todas as respostas dadas. */
export function desempenhoPorMateria(respostas: Resposta[], questoes: Map<string, Questao>) {
  const porMateria = new Map<string, Resposta[]>();
  for (const r of respostas) {
    const q = questoes.get(r.questao_id);
    if (!q) continue;
    porMateria.set(q.materia, [...(porMateria.get(q.materia) ?? []), r]);
  }
  return [...porMateria.entries()]
    .map(([materia, rs]) => ({ materia, ...resumo(rs) }))
    .sort((a, b) => b.total - a.total);
}

/** Separa "Situação hipotética: ... Assertiva: ..." para exibir em duas partes. */
export function separarAssertiva(enunciado: string): { situacao: string | null; assertiva: string } {
  const m = enunciado.match(/^Situação hipotética:\s*([\s\S]+?)\s*Assertiva:\s*([\s\S]+)$/);
  return m ? { situacao: m[1], assertiva: m[2] } : { situacao: null, assertiva: enunciado };
}

export function parseSituacao(valor: string | undefined | null): Situacao {
  return valor === "nao_respondidas" || valor === "erros" ? valor : "todas";
}
