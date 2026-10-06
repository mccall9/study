import { CONCURSOS, getMateria, type Concurso } from "./edital";

// Simulado personalizado: as escolhas viajam na URL (com uma semente para o sorteio), então
// recarregar a página ou voltar depois traz exatamente o mesmo simulado.

export const SIMULADO_PERSONALIZADO = "personalizado";
export const OPCOES_ITENS = [20, 40, 60, 120] as const;
/** Em minutos; 0 = sem limite de tempo. */
export const OPCOES_MINUTOS = [0, 30, 60, 120, 180, 270] as const;

export type ConfigSimulado = { concurso: Concurso | null; materias: string[]; itens: number; minutos: number; semente: number };

type Params = { concurso?: string; materias?: string; itens?: string; minutos?: string; semente?: string };

export function lerConfig(p: Params): ConfigSimulado | null {
  const semente = Number(p.semente);
  if (!Number.isInteger(semente) || semente <= 0) return null;
  const concurso = CONCURSOS.find((c) => c === p.concurso) ?? null;
  const materias = (p.materias ?? "").split(",").filter((m) => getMateria(m));
  const itens = Number(p.itens);
  const minutos = Number(p.minutos);
  return {
    concurso,
    materias,
    itens: (OPCOES_ITENS as readonly number[]).includes(itens) ? itens : 40,
    minutos: (OPCOES_MINUTOS as readonly number[]).includes(minutos) ? minutos : 0,
    semente,
  };
}

export function urlDoSimulado(c: ConfigSimulado): string {
  const p = new URLSearchParams();
  if (c.concurso) p.set("concurso", c.concurso);
  if (c.materias.length) p.set("materias", c.materias.join(","));
  p.set("itens", String(c.itens));
  p.set("minutos", String(c.minutos));
  p.set("semente", String(c.semente));
  return `/questoes/simulado/${SIMULADO_PERSONALIZADO}?${p}`;
}

export function descreverSimulado(c: ConfigSimulado): string {
  const materias =
    c.materias.length === 0
      ? "todas as matérias"
      : c.materias.length <= 2
        ? c.materias.map((m) => getMateria(m)?.nome ?? m).join(" e ")
        : `${c.materias.length} matérias`;
  return [c.concurso ?? "PRF e INSS", materias, c.minutos ? `${c.minutos} min` : "sem limite de tempo"].join(" · ");
}
