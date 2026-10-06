// Favoritos, destaques e anotações apontam para um "alvo" em texto, o mesmo formato
// que o banco valida: questao:prf-2021-009 · lei:cf:art5 · topico:direito-constitucional-2

export const TIPOS_MARCACAO = ["favorito", "destaque", "reportado"] as const;
export type TipoMarcacao = (typeof TIPOS_MARCACAO)[number];

export type Marcacao = { alvo: string; tipo: TipoMarcacao };

const ALVO = /^(questao|lei|topico):[a-z0-9:-]+$/;

export const alvoQuestao = (id: string) => `questao:${id}`;
export const alvoTopico = (id: string) => `topico:${id}`;
export const alvoArtigo = (lei: string, artigo: string) => `lei:${lei}:${artigo}`;

export function isAlvo(valor: unknown): valor is string {
  return typeof valor === "string" && valor.length <= 120 && ALVO.test(valor);
}

export function isTipoMarcacao(valor: unknown): valor is TipoMarcacao {
  return typeof valor === "string" && (TIPOS_MARCACAO as readonly string[]).includes(valor);
}

/** Ids (sem o prefixo) dos alvos de um tipo, ex.: questões favoritas ou artigos grifados de uma lei. */
export function idsMarcados(marcacoes: Marcacao[], tipo: TipoMarcacao, prefixo: string): Set<string> {
  return new Set(
    marcacoes.filter((m) => m.tipo === tipo && m.alvo.startsWith(prefixo)).map((m) => m.alvo.slice(prefixo.length)),
  );
}

export const LIMITE_ANOTACAO = 5000;
