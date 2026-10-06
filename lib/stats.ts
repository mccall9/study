import type { Concurso, Materia } from "./edital";
import type { Progresso, Sessao } from "./types";

export const FUSO = "America/Sao_Paulo";

const fmtDia = new Intl.DateTimeFormat("en-CA", {
  timeZone: FUSO,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Dia local (Brasília) no formato YYYY-MM-DD. */
export function diaLocal(date: Date | string): string {
  return fmtDia.format(typeof date === "string" ? new Date(date) : date);
}

/** Soma (ou subtrai) dias de um dia YYYY-MM-DD. */
export function somarDias(dia: string, n: number): string {
  const d = new Date(`${dia}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Segunda-feira da semana do dia informado. */
export function inicioDaSemana(dia: string): string {
  const semana = new Date(`${dia}T12:00:00Z`).getUTCDay(); // 0 = domingo
  return somarDias(dia, -((semana + 6) % 7));
}

export function segundosNaSemana(sessoes: Sessao[], agora: Date): number {
  const inicio = inicioDaSemana(diaLocal(agora));
  return sessoes
    .filter((s) => diaLocal(s.inicio) >= inicio)
    .reduce((total, s) => total + s.duracao_seg, 0);
}

/** Dias seguidos com estudo, terminando hoje (ou ontem, se hoje ainda não teve estudo). */
export function sequenciaDias(sessoes: Sessao[], agora: Date): number {
  const dias = new Set(sessoes.filter((s) => s.duracao_seg > 0).map((s) => diaLocal(s.inicio)));
  let dia = diaLocal(agora);
  if (!dias.has(dia)) dia = somarDias(dia, -1);
  let total = 0;
  while (dias.has(dia)) {
    total++;
    dia = somarDias(dia, -1);
  }
  return total;
}

/** Segundos estudados em cada um dos últimos `n` dias (do mais antigo para hoje). */
export function segundosPorDia(sessoes: Sessao[], agora: Date, n = 7) {
  const hoje = diaLocal(agora);
  const dias = Array.from({ length: n }, (_, i) => somarDias(hoje, i - n + 1));
  const totais = new Map(dias.map((d) => [d, 0]));
  for (const s of sessoes) {
    const d = diaLocal(s.inicio);
    if (totais.has(d)) totais.set(d, totais.get(d)! + s.duracao_seg);
  }
  return dias.map((dia) => ({ dia, segundos: totais.get(dia)! }));
}

/** Segundos por matéria, ordenado do maior para o menor. */
export function segundosPorMateria(sessoes: Sessao[]) {
  const totais = new Map<string, number>();
  for (const s of sessoes) {
    totais.set(s.materia_slug, (totais.get(s.materia_slug) ?? 0) + s.duracao_seg);
  }
  return [...totais.entries()]
    .map(([materia_slug, segundos]) => ({ materia_slug, segundos }))
    .sort((a, b) => b.segundos - a.segundos);
}

/** Tópicos já estudados (qualquer status além de "não iniciado") sobre o total. */
export function progressoMaterias(materias: Materia[], progresso: Progresso) {
  let feitos = 0;
  let total = 0;
  for (const m of materias) {
    for (const t of m.topicos) {
      total++;
      const status = progresso[t.id];
      if (status && status !== "nao_iniciado") feitos++;
    }
  }
  return { feitos, total, percentual: total === 0 ? 0 : Math.round((feitos / total) * 100) };
}

export function progressoConcurso(materias: Materia[], progresso: Progresso, concurso: Concurso) {
  return progressoMaterias(
    materias.filter((m) => m.concursos.includes(concurso)),
    progresso,
  );
}

/**
 * Matéria há mais tempo sem estudo (nunca estudada vem primeiro). Em empate,
 * prioriza a que vale para mais concursos, depois a ordem do edital.
 */
export function materiaEsquecida(materias: Materia[], sessoes: Sessao[]) {
  const ultima = new Map<string, string>();
  for (const s of sessoes) {
    const atual = ultima.get(s.materia_slug);
    if (!atual || s.inicio > atual) ultima.set(s.materia_slug, s.inicio);
  }
  let escolhida: { materia: Materia; ultimaVez: string | null } | null = null;
  for (const materia of materias) {
    const ultimaVez = ultima.get(materia.slug) ?? null;
    if (
      !escolhida ||
      (ultimaVez ?? "") < (escolhida.ultimaVez ?? "") ||
      ((ultimaVez ?? "") === (escolhida.ultimaVez ?? "") &&
        materia.concursos.length > escolhida.materia.concursos.length)
    ) {
      escolhida = { materia, ultimaVez };
    }
  }
  return escolhida;
}

export function formatarDuracao(segundos: number): string {
  const h = Math.floor(segundos / 3600);
  const m = Math.floor((segundos % 3600) / 60);
  if (h === 0) return `${m}min`;
  return m === 0 ? `${h}h` : `${h}h${String(m).padStart(2, "0")}`;
}
