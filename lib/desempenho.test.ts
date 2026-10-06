import { describe, expect, it } from "vitest";
import { desempenhoPorTopico, evolucaoSemanal, fortesEFracos, sortear } from "./desempenho";

const r = (questao_id: string, correta: boolean | null, respondida_em = "2026-10-06T15:00:00Z") => ({ questao_id, correta, respondida_em });

describe("evolucaoSemanal", () => {
  it("agrupa por semana (segunda a domingo) e deixa semanas vazias sem aproveitamento", () => {
    // 06/10/2026 é terça; a semana começa na segunda, 05/10.
    const agora = new Date("2026-10-06T15:00:00Z");
    const semanas = evolucaoSemanal(
      [r("a", true), r("b", false), r("c", true, "2026-10-05T12:00:00Z"), r("d", null, "2026-09-30T12:00:00Z"), r("e", true, "2026-08-01T12:00:00Z")],
      agora,
      3,
    );
    expect(semanas).toEqual([
      { inicio: "2026-09-21", total: 0, certas: 0, erradas: 0, aproveitamento: null },
      { inicio: "2026-09-28", total: 1, certas: 0, erradas: 0, aproveitamento: null },
      { inicio: "2026-10-05", total: 3, certas: 2, erradas: 1, aproveitamento: 67 },
    ]);
  });
});

describe("desempenhoPorTopico", () => {
  const questoes = new Map([
    ["a1", { topico: "t-a", materia: "m" }],
    ["a2", { topico: "t-a", materia: "m" }],
    ["a3", { topico: "t-a", materia: "m" }],
    ["b1", { topico: "t-b", materia: "m" }],
    ["b2", { topico: "t-b", materia: "m" }],
    ["b3", { topico: "t-b", materia: "m" }],
    ["c1", { topico: "t-c", materia: "m" }],
  ]);
  const respostas = [r("a1", true), r("a2", true), r("a3", true), r("b1", false), r("b2", false), r("b3", true), r("b3", null), r("c1", false)];

  it("calcula o acerto por tópico com mínimo de itens marcados, do mais fraco ao mais forte", () => {
    expect(desempenhoPorTopico(respostas, questoes)).toEqual([
      { topico: "t-b", materia: "m", respondidas: 3, aproveitamento: 33, nota: -1 },
      { topico: "t-a", materia: "m", respondidas: 3, aproveitamento: 100, nota: 3 },
    ]);
  });

  it("separa fortes e fracos", () => {
    const { fortes, fracos } = fortesEFracos(desempenhoPorTopico(respostas, questoes));
    expect(fracos.map((d) => d.topico)).toEqual(["t-b"]);
    expect(fortes.map((d) => d.topico)).toEqual(["t-a"]);
  });
});

describe("sortear", () => {
  const questoes = Array.from({ length: 30 }, (_, i) => ({ id: `q${i}`, provaId: i < 15 ? "prf" : "inss", numero: (i % 15) + 1 }));

  it("é determinístico pela semente e devolve na ordem da prova", () => {
    const a = sortear(questoes, 10, 42);
    expect(sortear(questoes, 10, 42)).toEqual(a);
    expect(sortear(questoes, 10, 43)).not.toEqual(a);
    expect(a).toHaveLength(10);
    expect(new Set(a.map((q) => q.id)).size).toBe(10);
    const ordenada = [...a].sort((x, y) => x.provaId.localeCompare(y.provaId) || x.numero - y.numero);
    expect(a).toEqual(ordenada);
  });

  it("não passa do total disponível", () => {
    expect(sortear(questoes, 100, 1)).toHaveLength(30);
  });
});
