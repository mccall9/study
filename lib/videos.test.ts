import { describe, expect, it } from "vitest";
import videos from "../data/materiais/videos.json";
import { MATERIAS } from "./edital";

describe("videoaulas", () => {
  const topicos = new Set(MATERIAS.flatMap((m) => m.topicos.map((t) => t.id)));

  it("só aponta para tópicos do edital, com ids do YouTube válidos", () => {
    for (const [topico, lista] of Object.entries(videos as Record<string, { id: string; titulo: string; canal: string }[]>)) {
      expect(topicos.has(topico), topico).toBe(true);
      expect(lista.length, topico).toBeLessThanOrEqual(3);
      for (const v of lista) {
        expect(v.id, topico).toMatch(/^[A-Za-z0-9_-]{11}$/);
        expect(v.titulo.length, v.id).toBeGreaterThan(5);
        expect(v.canal.length, v.id).toBeGreaterThan(1);
      }
    }
  });

  it("tem pelo menos uma aula para cada tópico do edital", () => {
    const sem = [...topicos].filter((t) => !(videos as Record<string, unknown[]>)[t]?.length);
    expect(sem).toEqual([]);
  });
});
