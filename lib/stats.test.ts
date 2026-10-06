import { describe, expect, it } from "vitest";
import { MATERIAS, type Materia } from "./edital";
import {
  diaLocal,
  formatarDuracao,
  inicioDaSemana,
  materiaEsquecida,
  progressoConcurso,
  segundosNaSemana,
  segundosPorDia,
  segundosPorMateria,
  sequenciaDias,
} from "./stats";
import type { Sessao } from "./types";

let n = 0;
function sessao(inicio: string, duracao_seg = 3600, materia_slug = "portugues"): Sessao {
  return { id: String(n++), materia_slug, topico_id: null, inicio, duracao_seg, anotacao: null };
}

// Terça-feira, 06/10/2026, 15h em Brasília
const agora = new Date("2026-10-06T18:00:00Z");

describe("diaLocal", () => {
  it("usa o fuso de Brasília", () => {
    // 01h UTC do dia 7 ainda é dia 6 em Brasília
    expect(diaLocal("2026-10-07T01:00:00Z")).toBe("2026-10-06");
    expect(diaLocal("2026-10-07T03:30:00Z")).toBe("2026-10-07");
  });
});

describe("inicioDaSemana", () => {
  it("começa na segunda-feira", () => {
    expect(inicioDaSemana("2026-10-06")).toBe("2026-10-05");
    expect(inicioDaSemana("2026-10-05")).toBe("2026-10-05");
    expect(inicioDaSemana("2026-10-11")).toBe("2026-10-05"); // domingo
  });
});

describe("segundosNaSemana", () => {
  it("soma só as sessões desde segunda", () => {
    const s = [
      sessao("2026-10-04T15:00:00Z", 1000), // domingo anterior
      sessao("2026-10-05T15:00:00Z", 1800),
      sessao("2026-10-06T12:00:00Z", 600),
    ];
    expect(segundosNaSemana(s, agora)).toBe(2400);
  });
});

describe("sequenciaDias", () => {
  it("conta dias seguidos até hoje", () => {
    const s = [
      sessao("2026-10-06T12:00:00Z"),
      sessao("2026-10-05T12:00:00Z"),
      sessao("2026-10-04T12:00:00Z"),
      sessao("2026-10-02T12:00:00Z"),
    ];
    expect(sequenciaDias(s, agora)).toBe(3);
  });

  it("não zera se hoje ainda não estudou", () => {
    const s = [sessao("2026-10-05T12:00:00Z"), sessao("2026-10-04T12:00:00Z")];
    expect(sequenciaDias(s, agora)).toBe(2);
  });

  it("zera quando pulou ontem", () => {
    expect(sequenciaDias([sessao("2026-10-04T12:00:00Z")], agora)).toBe(0);
    expect(sequenciaDias([], agora)).toBe(0);
  });
});

describe("segundosPorDia", () => {
  it("retorna os últimos 7 dias, inclusive os vazios", () => {
    const r = segundosPorDia([sessao("2026-10-06T12:00:00Z", 900)], agora);
    expect(r).toHaveLength(7);
    expect(r[0].dia).toBe("2026-09-30");
    expect(r[6]).toEqual({ dia: "2026-10-06", segundos: 900 });
  });
});

describe("segundosPorMateria", () => {
  it("agrupa e ordena", () => {
    const r = segundosPorMateria([
      sessao("2026-10-06T12:00:00Z", 100, "fisica"),
      sessao("2026-10-06T12:00:00Z", 300, "portugues"),
      sessao("2026-10-06T13:00:00Z", 100, "fisica"),
    ]);
    expect(r).toEqual([
      { materia_slug: "portugues", segundos: 300 },
      { materia_slug: "fisica", segundos: 200 },
    ]);
  });
});

describe("progressoConcurso", () => {
  const materias: Materia[] = [
    { slug: "a", nome: "A", concursos: ["PRF", "INSS"], topicos: [{ id: "a-1", titulo: "" }, { id: "a-2", titulo: "" }] },
    { slug: "b", nome: "B", concursos: ["PRF"], topicos: [{ id: "b-1", titulo: "" }, { id: "b-2", titulo: "" }] },
  ];

  it("conta tópicos de matérias compartilhadas para os dois concursos", () => {
    const progresso = { "a-1": "revisado", "b-1": "estudado", "b-2": "nao_iniciado" } as const;
    expect(progressoConcurso(materias, progresso, "PRF")).toEqual({ feitos: 2, total: 4, percentual: 50 });
    expect(progressoConcurso(materias, progresso, "INSS")).toEqual({ feitos: 1, total: 2, percentual: 50 });
  });
});

describe("materiaEsquecida", () => {
  it("prefere matéria nunca estudada que vale para os dois concursos", () => {
    const r = materiaEsquecida(MATERIAS, []);
    expect(r?.materia.concursos).toEqual(["PRF", "INSS"]);
    expect(r?.ultimaVez).toBeNull();
  });

  it("escolhe a estudada há mais tempo quando todas já foram vistas", () => {
    const materias = MATERIAS.slice(0, 3);
    const s = [
      sessao("2026-10-06T12:00:00Z", 60, materias[0].slug),
      sessao("2026-10-01T12:00:00Z", 60, materias[1].slug),
      sessao("2026-10-05T12:00:00Z", 60, materias[1].slug),
      sessao("2026-10-03T12:00:00Z", 60, materias[2].slug),
    ];
    expect(materiaEsquecida(materias, s)?.materia.slug).toBe(materias[2].slug);
  });
});

describe("formatarDuracao", () => {
  it("formata horas e minutos", () => {
    expect(formatarDuracao(59)).toBe("0min");
    expect(formatarDuracao(45 * 60)).toBe("45min");
    expect(formatarDuracao(3600)).toBe("1h");
    expect(formatarDuracao(3600 + 5 * 60)).toBe("1h05");
  });
});

describe("edital", () => {
  it("não tem ids de tópico repetidos", () => {
    const ids = MATERIAS.flatMap((m) => m.topicos.map((t) => t.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});
