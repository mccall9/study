export const STATUS = ["nao_iniciado", "estudado", "revisado", "questoes_ok"] as const;

export type Status = (typeof STATUS)[number];

export const STATUS_LABEL: Record<Status, string> = {
  nao_iniciado: "Não iniciado",
  estudado: "Estudado",
  revisado: "Revisado",
  questoes_ok: "Questões feitas",
};

export function proximoStatus(status: Status): Status {
  return STATUS[(STATUS.indexOf(status) + 1) % STATUS.length];
}

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && (STATUS as readonly string[]).includes(value);
}

/** Mapa topico_id -> status. Tópicos ausentes estão "nao_iniciado". */
export type Progresso = Record<string, Status>;

export type Sessao = {
  id: string;
  materia_slug: string;
  topico_id: string | null;
  inicio: string; // ISO
  duracao_seg: number;
  anotacao: string | null;
};
