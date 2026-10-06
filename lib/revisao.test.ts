import { describe, expect, it } from "vitest";
import { agendaDeRevisao, proximasRevisoes, revisoesDoDia } from "./revisao";

// Meio-dia em Brasília (15h UTC) para não cair na virada do dia.
const em = (dia: string) => `${dia}T15:00:00.000Z`;
const r = (questao_id: string, dia: string, correta: boolean | null) => ({ questao_id, respondida_em: em(dia), correta });

describe("agendaDeRevisao", () => {
  it("não agenda questões que nunca foram erradas", () => {
    expect(agendaDeRevisao([r("a", "2026-01-10", true), r("a", "2026-01-12", true)]).size).toBe(0);
  });

  it("erro ou branco agenda para o dia seguinte", () => {
    const agenda = agendaDeRevisao([r("a", "2026-01-10", false), r("b", "2026-01-10", null)]);
    expect(agenda.get("a")).toEqual({ questao_id: "a", etapa: 0, vence: "2026-01-11" });
    expect(agenda.get("b")?.vence).toBe("2026-01-11");
  });

  it("cada acerto na data da revisão avança para 3, 7, 15 e 30 dias, e depois sai da agenda", () => {
    const hist = [r("a", "2026-01-10", false)];
    const passos: [string, string][] = [
      ["2026-01-11", "2026-01-14"],
      ["2026-01-14", "2026-01-21"],
      ["2026-01-21", "2026-02-05"],
      ["2026-02-05", "2026-03-07"],
    ];
    for (const [dia, vence] of passos) {
      hist.push(r("a", dia, true));
      expect(agendaDeRevisao(hist).get("a")?.vence).toBe(vence);
    }
    hist.push(r("a", "2026-03-07", true));
    expect(agendaDeRevisao(hist).has("a")).toBe(false);
  });

  it("acertar antes do vencimento não avança; errar na revisão recomeça", () => {
    expect(agendaDeRevisao([r("a", "2026-01-10", false), r("a", "2026-01-10", true)]).get("a")?.vence).toBe("2026-01-11");
    const agenda = agendaDeRevisao([r("a", "2026-01-10", false), r("a", "2026-01-11", true), r("a", "2026-01-15", false)]);
    expect(agenda.get("a")).toEqual({ questao_id: "a", etapa: 0, vence: "2026-01-16" });
  });

  it("revisão atrasada conta a partir do dia em que foi feita", () => {
    const agenda = agendaDeRevisao([r("a", "2026-01-10", false), r("a", "2026-01-20", true)]);
    expect(agenda.get("a")?.vence).toBe("2026-01-23");
  });

  it("errar uma questão dominada coloca de volta na agenda", () => {
    const dias = ["2026-01-11", "2026-01-14", "2026-01-21", "2026-02-05", "2026-03-07"];
    const hist = [r("a", "2026-01-10", false), ...dias.map((d) => r("a", d, true)), r("a", "2026-05-01", false)];
    expect(agendaDeRevisao(hist).get("a")?.vence).toBe("2026-05-02");
  });

  it("usa o dia de Brasília: 23h de Brasília ainda é o mesmo dia", () => {
    const agenda = agendaDeRevisao([{ questao_id: "a", respondida_em: "2026-01-11T02:00:00.000Z", correta: false }]);
    expect(agenda.get("a")?.vence).toBe("2026-01-11"); // respondida em 10/01 às 23h
  });
});

describe("revisoesDoDia e proximasRevisoes", () => {
  const agenda = agendaDeRevisao([r("a", "2026-01-08", false), r("b", "2026-01-10", false), r("c", "2026-01-11", false)]);
  const agora = new Date(em("2026-01-11"));

  it("lista as vencidas e as de hoje, mais atrasadas primeiro", () => {
    expect(revisoesDoDia(agenda, agora).map((x) => x.questao_id)).toEqual(["a", "b"]);
  });

  it("conta as revisões dos próximos dias", () => {
    expect(proximasRevisoes(agenda, agora, 3)).toEqual([
      { dia: "2026-01-12", total: 1 },
      { dia: "2026-01-13", total: 0 },
      { dia: "2026-01-14", total: 0 },
    ]);
  });
});
