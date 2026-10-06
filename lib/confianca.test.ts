import { describe, expect, it } from "vitest";
import { desempenhoPorConfianca, isConfianca } from "./confianca";

describe("desempenhoPorConfianca", () => {
  it("calcula acerto e saldo esperado 2p − 1 por nível, ignorando brancos e respostas sem nível", () => {
    const rs = [
      ...Array(9).fill({ correta: true, confianca: "certeza" }),
      { correta: false, confianca: "certeza" },
      { correta: true, confianca: "chute" },
      { correta: false, confianca: "chute" },
      { correta: false, confianca: "chute" },
      { correta: null, confianca: "chute" },
      { correta: true, confianca: "duvida" },
      { correta: false, confianca: "duvida" },
      { correta: true, confianca: null },
    ] as const;
    expect(desempenhoPorConfianca([...rs])).toEqual([
      { confianca: "certeza", certas: 9, erradas: 1, acerto: 90, saldo: 0.8, vale: "marcar" },
      { confianca: "duvida", certas: 1, erradas: 1, acerto: 50, saldo: 0, vale: "empate" },
      { confianca: "chute", certas: 1, erradas: 2, acerto: 33, saldo: -0.33, vale: "branco" },
    ]);
  });

  it("omite níveis sem respostas", () => {
    expect(desempenhoPorConfianca([{ correta: true, confianca: "certeza" }]).map((d) => d.confianca)).toEqual(["certeza"]);
  });

  it("valida os níveis", () => {
    expect(isConfianca("duvida")).toBe(true);
    expect(isConfianca("talvez")).toBe(false);
  });
});
