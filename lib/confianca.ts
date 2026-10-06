export const CONFIANCAS = ["certeza", "duvida", "chute"] as const;
export type Confianca = (typeof CONFIANCAS)[number];

export const CONFIANCA_LABEL: Record<Confianca, string> = {
  certeza: "Certeza",
  duvida: "Dúvida",
  chute: "Chute",
};

export function isConfianca(valor: unknown): valor is Confianca {
  return typeof valor === "string" && (CONFIANCAS as readonly string[]).includes(valor);
}

export type DesempenhoConfianca = {
  confianca: Confianca;
  certas: number;
  erradas: number;
  /** % de acerto entre as marcadas (C ou E). */
  acerto: number;
  /**
   * Pontos esperados por item marcado na regra Cebraspe (+1 certo, −1 errado, 0 em branco): 2p − 1.
   * Positivo: compensa marcar. Negativo: deixar em branco seria melhor.
   */
  saldo: number;
  vale: "marcar" | "branco" | "empate";
};

/** Acerto por nível de confiança, para saber quando arriscar e quando deixar em branco. */
export function desempenhoPorConfianca(
  respostas: { correta: boolean | null; confianca?: Confianca | null }[],
): DesempenhoConfianca[] {
  return CONFIANCAS.flatMap((confianca) => {
    const marcadas = respostas.filter((r) => r.confianca === confianca && r.correta !== null);
    if (marcadas.length === 0) return [];
    const certas = marcadas.filter((r) => r.correta).length;
    const erradas = marcadas.length - certas;
    const p = certas / marcadas.length;
    const saldo = Math.round((2 * p - 1) * 100) / 100;
    return [{ confianca, certas, erradas, acerto: Math.round(p * 100), saldo, vale: saldo > 0 ? "marcar" : saldo < 0 ? "branco" : "empate" }];
  });
}
