import { describe, expect, it } from "vitest";
import inss2022 from "../data/questoes/inss-2022.json";
import prf2021 from "../data/questoes/prf-2021.json";
import { getMateria } from "./edital";
import {
  cadernoDeErros,
  corrigir,
  desempenhoPorMateria,
  filtrar,
  resumo,
  separarAssertiva,
  ultimaPorQuestao,
  type Questao,
  type Resposta,
} from "./questoes-logica";

function questao(id: string, extra: Partial<Questao> = {}): Questao {
  return {
    id,
    provaId: "p",
    numero: 1,
    concurso: "PRF",
    materia: "portugues",
    topico: "portugues-1",
    texto: null,
    comando: "",
    enunciado: "",
    gabarito: "C",
    ...extra,
  };
}

function resposta(questao_id: string, correta: boolean | null, respondida_em: string): Resposta {
  return { questao_id, resposta: correta === null ? "B" : "C", correta, respondida_em, simulado_id: null };
}

describe("corrigir", () => {
  it("compara com o gabarito e trata branco como null", () => {
    expect(corrigir("C", "C")).toBe(true);
    expect(corrigir("C", "E")).toBe(false);
    expect(corrigir("E", "E")).toBe(true);
    expect(corrigir("E", "B")).toBeNull();
  });
});

describe("resumo", () => {
  it("calcula a nota Cebraspe (certas − erradas) e o aproveitamento sem brancos", () => {
    const r = resumo([{ correta: true }, { correta: true }, { correta: true }, { correta: false }, { correta: null }]);
    expect(r).toEqual({ certas: 3, erradas: 1, brancos: 1, total: 5, nota: 2, aproveitamento: 75 });
  });

  it("aceita nota negativa e lista vazia", () => {
    expect(resumo([{ correta: false }, { correta: false }, { correta: true }]).nota).toBe(-1);
    expect(resumo([])).toEqual({ certas: 0, erradas: 0, brancos: 0, total: 0, nota: 0, aproveitamento: 0 });
  });
});

describe("caderno de erros", () => {
  const respostas = [
    resposta("a", false, "2026-10-01T10:00:00Z"),
    resposta("a", true, "2026-10-02T10:00:00Z"), // refez e acertou: sai do caderno
    resposta("b", true, "2026-10-01T10:00:00Z"),
    resposta("b", false, "2026-10-03T10:00:00Z"), // errou depois: entra
    resposta("c", null, "2026-10-01T10:00:00Z"), // em branco: entra
  ];

  it("usa só a resposta mais recente de cada questão", () => {
    expect(ultimaPorQuestao(respostas).get("a")?.correta).toBe(true);
    expect([...cadernoDeErros(respostas)].sort()).toEqual(["b", "c"]);
  });

  it("filtra por situação, concurso e matéria e ignora anulados", () => {
    const questoes = [
      questao("a"),
      questao("b", { concurso: "INSS" }),
      questao("c", { materia: "fisica", topico: "fisica-1" }),
      questao("d"),
      questao("x", { gabarito: "X" }),
    ];
    const base = { concurso: null, materia: null, topico: null } as const;
    expect(filtrar(questoes, { ...base, situacao: "todas" }, respostas).map((q) => q.id)).toEqual(["a", "b", "c", "d"]);
    expect(filtrar(questoes, { ...base, situacao: "nao_respondidas" }, respostas).map((q) => q.id)).toEqual(["d"]);
    expect(filtrar(questoes, { ...base, situacao: "erros" }, respostas).map((q) => q.id)).toEqual(["b", "c"]);
    expect(filtrar(questoes, { ...base, concurso: "PRF", situacao: "erros" }, respostas).map((q) => q.id)).toEqual(["c"]);
    expect(filtrar(questoes, { ...base, materia: "fisica", situacao: "todas" }, respostas).map((q) => q.id)).toEqual(["c"]);
  });

  it("agrupa o desempenho por matéria", () => {
    const mapa = new Map([questao("a"), questao("b"), questao("c", { materia: "fisica" })].map((q) => [q.id, q]));
    expect(desempenhoPorMateria(respostas, mapa)).toEqual([
      { materia: "portugues", certas: 2, erradas: 2, brancos: 0, total: 4, nota: 0, aproveitamento: 50 },
      { materia: "fisica", certas: 0, erradas: 0, brancos: 1, total: 1, nota: 0, aproveitamento: 0 },
    ]);
  });
});

describe("separarAssertiva", () => {
  it("divide situação hipotética e assertiva", () => {
    expect(separarAssertiva("Situação hipotética: Ana fez X. Assertiva: Nessa situação, Y.")).toEqual({
      situacao: "Ana fez X.",
      assertiva: "Nessa situação, Y.",
    });
    expect(separarAssertiva("Item comum.")).toEqual({ situacao: null, assertiva: "Item comum." });
  });
});

describe("banco de questões", () => {
  for (const prova of [prf2021, inss2022]) {
    it(`${prova.id}: itens consistentes com o edital`, () => {
      const ids = new Set<string>();
      for (const item of prova.itens) {
        expect(ids.has(item.id), item.id).toBe(false);
        ids.add(item.id);
        expect(["C", "E", "X"], item.id).toContain(item.gabarito);
        const materia = getMateria(item.materia);
        expect(materia, `${item.id}: matéria ${item.materia}`).toBeDefined();
        expect(materia!.concursos, item.id).toContain(prova.concurso);
        if (item.topico) {
          expect(materia!.topicos.map((t) => t.id), `${item.id}: tópico ${item.topico}`).toContain(item.topico);
        }
        if (item.texto) expect(prova.textos, item.id).toHaveProperty(item.texto);
        expect(item.enunciado.length, item.id).toBeGreaterThan(20);
        expect(item.comando.length, item.id).toBeGreaterThan(10);
      }
    });
  }
});
