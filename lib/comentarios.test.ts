import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import inssComentarios from "../data/questoes/comentarios/inss-2022.json";
import prfComentarios from "../data/questoes/comentarios/prf-2021.json";
import inss2022 from "../data/questoes/inss-2022.json";
import prf2021 from "../data/questoes/prf-2021.json";
import { artigosDaLei, type LeiTexto } from "./leis-logica";
import { LEIS_META } from "./leis-meta";

type C = Record<string, { t: string; b?: { lei: string; a: string }[] }>;

const leis = new Map<string, Set<string>>();
function ancoras(id: string): Set<string> {
  if (!leis.has(id)) {
    const lei: LeiTexto = JSON.parse(readFileSync(`data/leis/${id}.json`, "utf8"));
    leis.set(id, new Set(artigosDaLei(lei).flatMap((a) => a.d.map((d) => d.id))));
  }
  return leis.get(id)!;
}

describe.each([
  ["prf-2021", prf2021, prfComentarios as C],
  ["inss-2022", inss2022, inssComentarios as C],
])("comentários %s", (_, prova, comentarios) => {
  const validas = prova.itens.filter((i) => i.gabarito !== "X").map((i) => i.id);

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
