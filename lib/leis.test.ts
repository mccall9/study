import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MATERIAS } from "./edital";
import { LEIS_META } from "./leis-meta";
import {
  artigoDaAncora,
  artigosDaLei,
  buscar,
  resolverArtigos,
  rotularAncora,
  type LeiTexto,
} from "./leis-logica";
import { REFERENCIAS } from "./materiais";

const cache = new Map<string, LeiTexto>();
function lei(id: string): LeiTexto {
  if (!cache.has(id)) cache.set(id, JSON.parse(readFileSync(`data/leis/${id}.json`, "utf8")));
  return cache.get(id)!;
}

describe("leis importadas", () => {
  it("tem um arquivo para cada lei do índice, com artigos e ids únicos", () => {
    for (const meta of LEIS_META) {
      const l = lei(meta.id);
      const artigos = artigosDaLei(l);
      expect(artigos.length, meta.id).toBeGreaterThan(2);
      const ids = artigos.flatMap((a) => a.d.map((d) => d.id));
      expect(new Set(ids).size, `${meta.id}: ids repetidos`).toBe(ids.length);
    }
  });

  it("não guarda texto revogado nem notas de alteração na CF", () => {
    const textos = artigosDaLei(lei("cf")).flatMap((a) => a.d.map((d) => d.x));
    expect(textos.some((t) => /Redação dada|Incluído pela/.test(t))).toBe(false);
  });

  it("tem o texto esperado em artigos conhecidos", () => {
    const art5 = artigosDaLei(lei("cf")).find((a) => a.id === "art5")!;
    expect(art5.d[0].x).toMatch(/^Art\. 5º Todos são iguais perante a lei/);
    expect(art5.d.find((d) => d.id === "art5-lxxii")?.x).toMatch(/habeas-data/);
    expect(artigosDaLei(lei("d1171")).flatMap((a) => a.d).find((d) => d.id === "anexo-xiv-a")?.x).toMatch(/^a\)/);
  });
});

describe("rotularAncora", () => {
  const ids = new Set(artigosDaLei(lei("cf")).map((a) => a.id));
  it("monta o rótulo legível", () => {
    expect(rotularAncora("art5", ids)).toBe("Art. 5º");
    expect(rotularAncora("art5-lxxii", ids)).toBe("Art. 5º, LXXII");
    expect(rotularAncora("art5-lxxii-a", ids)).toBe("Art. 5º, LXXII, a");
    expect(rotularAncora("art37-p6", ids)).toBe("Art. 37, § 6º");
    expect(rotularAncora("art37-xix", ids)).toBe("Art. 37, XIX");
    expect(rotularAncora("art14-p1-i", ids)).toBe("Art. 14, § 1º, I");
    expect(rotularAncora("art103-a", ids)).toBe("Art. 103-A");
    expect(rotularAncora("anexo-xiv-a", new Set())).toBe("Anexo, XIV, a");
  });

  it("acha o artigo de uma âncora", () => {
    expect(artigoDaAncora(lei("cf"), "art5-lxxii-a")?.id).toBe("art5");
  });
});

describe("resolverArtigos", () => {
  it("resolve intervalos, artigos com letra e a lei inteira", () => {
    const cf = lei("cf");
    expect(resolverArtigos(cf, ["1:4"]).map((a) => a.num)).toEqual(["1", "2", "3", "4"]);
    expect(resolverArtigos(cf, ["103:103"]).map((a) => a.num)).toEqual(expect.arrayContaining(["103", "103-A", "103-B"]));
    expect(resolverArtigos(cf, ["*"]).length).toBe(artigosDaLei(cf).length);
  });
});

describe("buscar", () => {
  it("ignora acentos e maiúsculas", () => {
    const r = buscar(lei("cf"), "HABEAS DATA");
    expect(r.some((x) => x.dispositivo.id === "art5-lxxii")).toBe(true); // no texto: "habeas-data"
    expect(buscar(lei("cf"), "x")).toEqual([]);
  });
});

describe("REFERENCIAS", () => {
  const topicos = new Set(MATERIAS.flatMap((m) => m.topicos.map((t) => t.id)));
  it("aponta para tópicos, leis e artigos que existem", () => {
    for (const [topico, refs] of Object.entries(REFERENCIAS)) {
      expect(topicos.has(topico), topico).toBe(true);
      for (const ref of refs) {
        expect(LEIS_META.some((l) => l.id === ref.lei), `${topico}: lei ${ref.lei}`).toBe(true);
        for (const spec of ref.artigos ?? ["*"]) {
          expect(resolverArtigos(lei(ref.lei), [spec]).length, `${topico}: ${ref.lei} ${spec}`).toBeGreaterThan(0);
        }
        const idsDisp = new Set(resolverArtigos(lei(ref.lei), ref.artigos).flatMap((a) => a.d.map((d) => d.id)));
        for (const d of ref.dispositivos ?? []) expect(idsDisp.has(d), `${topico}: dispositivo ${d}`).toBe(true);
      }
    }
  });
});
