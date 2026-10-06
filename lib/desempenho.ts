import type { Questao, Resposta } from "./questoes-logica";
import { resumo } from "./questoes-logica";
import { diaLocal, inicioDaSemana, somarDias } from "./stats";

export type Semana = { inicio: string; total: number; certas: number; erradas: number; aproveitamento: number | null };

/** Respostas por semana (segunda a domingo, horário de Brasília), da mais antiga para a atual. */
export function evolucaoSemanal(respostas: Pick<Resposta, "correta" | "respondida_em">[], agora: Date, semanas = 8): Semana[] {
  const atual = inicioDaSemana(diaLocal(agora));
  const inicios = Array.from({ length: semanas }, (_, i) => somarDias(atual, -7 * (semanas - 1 - i)));
  const porSemana = new Map(inicios.map((s) => [s, [] as { correta: boolean | null }[]]));
  for (const r of respostas) {
    porSemana.get(inicioDaSemana(diaLocal(r.respondida_em)))?.push(r);
  }
  return inicios.map((inicio) => {
    const rs = porSemana.get(inicio)!;
    const t = resumo(rs);
    return {
      inicio,
      total: t.total,
      certas: t.certas,
      erradas: t.erradas,
      aproveitamento: t.certas + t.erradas > 0 ? t.aproveitamento : null,
    };
  });
}

export type DesempenhoTopico = { topico: string; materia: string; respondidas: number; aproveitamento: number; nota: number };

/**
 * Acerto por tópico, contando todas as respostas (treino e simulado). Só entram tópicos com
 * pelo menos `minimo` itens marcados (C ou E), para não tirar conclusão de uma questão só.
 */
export function desempenhoPorTopico(
  respostas: Pick<Resposta, "questao_id" | "correta">[],
  questoes: Map<string, Pick<Questao, "topico" | "materia">>,
  minimo = 3,
): DesempenhoTopico[] {
  const porTopico = new Map<string, { materia: string; rs: { correta: boolean | null }[] }>();
  for (const r of respostas) {
    const q = questoes.get(r.questao_id);
    if (!q?.topico) continue;
    const atual = porTopico.get(q.topico) ?? { materia: q.materia, rs: [] };
    atual.rs.push(r);
    porTopico.set(q.topico, atual);
  }
  return [...porTopico.entries()]
    .map(([topico, { materia, rs }]) => {
      const t = resumo(rs);
      return { topico, materia, respondidas: t.certas + t.erradas, aproveitamento: t.aproveitamento, nota: t.nota };
    })
    .filter((d) => d.respondidas >= minimo)
    .sort((a, b) => a.aproveitamento - b.aproveitamento || b.respondidas - a.respondidas);
}

/** Pontos fracos (menor acerto) e fortes (maior acerto), sem repetir tópico entre as listas. */
export function fortesEFracos(lista: DesempenhoTopico[], quantos = 5) {
  const fracos = lista.filter((d) => d.aproveitamento < 70).slice(0, quantos);
  const fortes = [...lista]
    .reverse()
    .filter((d) => d.aproveitamento >= 70 && !fracos.includes(d))
    .slice(0, quantos);
  return { fortes, fracos };
}

// ---- Sorteio do simulado personalizado ----

/** Gerador pseudoaleatório com semente (mulberry32): o mesmo simulado volta igual ao recarregar. */
export function aleatorio(semente: number): () => number {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Sorteia `quantidade` questões e devolve na ordem da prova (mesma prova e número crescente),
 * para os itens que dividem o texto de apoio ficarem juntos.
 */
export function sortear<T extends { id: string; provaId: string; numero: number }>(questoes: T[], quantidade: number, semente: number): T[] {
  const rnd = aleatorio(semente);
  const copia = [...questoes];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia
    .slice(0, Math.max(0, quantidade))
    .sort((a, b) => a.provaId.localeCompare(b.provaId) || a.numero - b.numero);
}
