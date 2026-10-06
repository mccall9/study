import { describe, expect, it } from "vitest";
import { alvoArtigo, alvoQuestao, alvoTopico, idsMarcados, isAlvo, isTipoMarcacao } from "./marcacoes";

describe("marcações", () => {
  it("monta alvos no formato aceito pelo banco", () => {
    for (const alvo of [alvoQuestao("prf-2021-009"), alvoTopico("direito-constitucional-2"), alvoArtigo("cf", "art5")]) {
      expect(isAlvo(alvo), alvo).toBe(true);
    }
    expect(isAlvo("lei:cf:art5; drop table")).toBe(false);
    expect(isAlvo("usuario:1")).toBe(false);
    expect(isTipoMarcacao("destaque")).toBe(true);
    expect(isTipoMarcacao("curtida")).toBe(false);
  });

  it("separa os ids marcados de um tipo e prefixo", () => {
    const marcacoes = [
      { alvo: "questao:a", tipo: "favorito" },
      { alvo: "questao:b", tipo: "reportado" },
      { alvo: "lei:cf:art5", tipo: "destaque" },
      { alvo: "lei:cp:art121", tipo: "destaque" },
    ] as const;
    expect([...idsMarcados([...marcacoes], "favorito", "questao:")]).toEqual(["a"]);
    expect([...idsMarcados([...marcacoes], "destaque", "lei:cf:")]).toEqual(["art5"]);
  });
});
