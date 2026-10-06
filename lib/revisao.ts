import type { Resposta } from "./questoes-logica";
import { diaLocal, somarDias } from "./stats";

/** Depois de um erro, a questão volta em 1 dia; cada acerto na revisão empurra para o próximo intervalo. */
export const INTERVALOS_DIAS = [1, 3, 7, 15, 30] as const;

export type Revisao = {
  questao_id: string;
  /** Índice em INTERVALOS_DIAS: quantas revisões seguidas já acertou desde o último erro. */
  etapa: number;
  /** Dia (fuso de Brasília, AAAA-MM-DD) em que a questão volta para revisão. */
  vence: string;
};

/**
 * Agenda de revisão espaçada calculada só a partir do histórico de respostas.
 * - Errar ou deixar em branco (re)começa a agenda: volta em 1 dia.
 * - Acertar no dia da revisão ou depois avança um intervalo (3, 7, 15, 30 dias).
 * - Acertar antes do vencimento não muda nada (a revisão ainda não chegou).
 * - Acertar a revisão de 30 dias tira a questão da agenda (dominada), até o próximo erro.
 */
export function agendaDeRevisao(respostas: Pick<Resposta, "questao_id" | "correta" | "respondida_em">[]): Map<string, Revisao> {
  const porQuestao = new Map<string, typeof respostas>();
  for (const r of respostas) porQuestao.set(r.questao_id, [...(porQuestao.get(r.questao_id) ?? []), r]);

  const agenda = new Map<string, Revisao>();
  for (const [questao_id, lista] of porQuestao) {
    let atual: Revisao | null = null;
    for (const r of [...lista].sort((a, b) => a.respondida_em.localeCompare(b.respondida_em))) {
      const dia = diaLocal(r.respondida_em);
      if (r.correta !== true) {
        atual = { questao_id, etapa: 0, vence: somarDias(dia, INTERVALOS_DIAS[0]) };
      } else if (atual && dia >= atual.vence) {
        const etapa: number = atual.etapa + 1;
        atual = etapa < INTERVALOS_DIAS.length ? { questao_id, etapa, vence: somarDias(dia, INTERVALOS_DIAS[etapa]) } : null;
      }
    }
    if (atual) agenda.set(questao_id, atual);
  }
  return agenda;
}

/** Questões cuja revisão vence hoje ou já venceu, das mais atrasadas para as mais recentes. */
export function revisoesDoDia(agenda: Map<string, Revisao>, agora: Date): Revisao[] {
  const hoje = diaLocal(agora);
  return [...agenda.values()].filter((r) => r.vence <= hoje).sort((a, b) => a.vence.localeCompare(b.vence) || a.questao_id.localeCompare(b.questao_id));
}

/** Quantas revisões vencem em cada um dos próximos dias (para mostrar o que vem pela frente). */
export function proximasRevisoes(agenda: Map<string, Revisao>, agora: Date, dias = 7): { dia: string; total: number }[] {
  const hoje = diaLocal(agora);
  return Array.from({ length: dias }, (_, i) => {
    const dia = somarDias(hoje, i + 1);
    return { dia, total: [...agenda.values()].filter((r) => r.vence === dia).length };
  });
}
