import { existsSync, readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MATERIAS } from "./edital";
import { artigosDaLei, type LeiTexto } from "./leis-logica";
import { LEIS_META } from "./leis-meta";

type C = Record<string, { t: string; b?: { lei: string; a: string }[] }>;
type Prova = {
  id: string;
  concurso: string;
  fontes: string[];
  textos: Record<string, string>;
  itens: { id: string; numero: number; materia: string; topico: string | null; texto: string | null; enunciado: string; gabarito: string }[];
};

const leis = new Map<string, Set<string>>();
function ancoras(id: string): Set<string> {
  if (!leis.has(id)) {
    const lei: LeiTexto = JSON.parse(readFileSync(`data/leis/${id}.json`, "utf8"));
    leis.set(id, new Set(artigosDaLei(lei).flatMap((a) => a.d.map((d) => d.id))));
  }
  return leis.get(id)!;
}

const PROVAS = readdirSync("data/questoes")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`data/questoes/${f}`, "utf8")) as Prova);
const TOPICOS = new Set(MATERIAS.flatMap((m) => m.topicos.map((t) => t.id)));
const MATERIAS_SLUGS = new Set(MATERIAS.map((m) => m.slug));

describe.each(PROVAS.map((p) => [p.id, p] as const))("prova %s", (provaId, prova) => {
  const arquivo = `data/questoes/comentarios/${provaId}.json`;
  const comentarios: C = existsSync(arquivo) ? JSON.parse(readFileSync(arquivo, "utf8")) : {};
  const validas = prova.itens.filter((i) => i.gabarito !== "X").map((i) => i.id);

  it("tem itens bem formados, com matéria e tópico do edital", () => {
    expect(["PRF", "INSS"]).toContain(prova.concurso);
    expect(prova.fontes.length).toBeGreaterThan(0);
    const ids = new Set<string>();
    for (const i of prova.itens) {
      expect(i.id, i.id).toBe(`${provaId}-${String(i.numero).padStart(3, "0")}`);
      expect(ids.has(i.id), i.id).toBe(false);
      ids.add(i.id);
      expect(["C", "E", "X"], i.id).toContain(i.gabarito);
      expect(MATERIAS_SLUGS.has(i.materia), `${i.id}: matéria ${i.materia}`).toBe(true);
      if (i.topico) expect(TOPICOS.has(i.topico) && i.topico.startsWith(`${i.materia}-`), `${i.id}: tópico ${i.topico}`).toBe(true);
      if (i.texto) expect(prova.textos[i.texto], `${i.id}: texto ${i.texto}`).toBeTruthy();
      expect(i.enunciado.length, i.id).toBeGreaterThan(15);
    }
  });

  it("só comenta questões que existem, com texto e base legal válida", () => {
    for (const [id, c] of Object.entries(comentarios)) {
      expect(validas, id).toContain(id);
      expect(c.t.length, id).toBeGreaterThan(40);
      for (const b of c.b ?? []) {
        expect(LEIS_META.some((l) => l.id === b.lei), `${id}: lei ${b.lei}`).toBe(true);
        expect(ancoras(b.lei).has(b.a), `${id}: ${b.lei} ${b.a}`).toBe(true);
      }
    }
  });

  it("tem comentário para toda questão válida", () => {
    const faltando = validas.filter((id) => !(id in comentarios));
    expect(faltando).toEqual([]);
  });
});
