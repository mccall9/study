import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { MATERIAS } from "./edital";
import { artigosDaLei, type LeiTexto } from "./leis-logica";
import { LEIS_META } from "./leis-meta";

const PASTA = "data/resumos";
const TOPICOS = new Set(MATERIAS.flatMap((m) => m.topicos.map((t) => t.id)));

const ancorasCache = new Map<string, Set<string>>();
function ancoras(lei: string): Set<string> {
  if (!ancorasCache.has(lei)) {
    const texto: LeiTexto = JSON.parse(readFileSync(`data/leis/${lei}.json`, "utf8"));
    ancorasCache.set(lei, new Set(artigosDaLei(texto).flatMap((a) => a.d.map((d) => d.id))));
  }
  return ancorasCache.get(lei)!;
}

const arquivos = readdirSync(PASTA).filter((a) => a.endsWith(".md"));

describe("resumos", () => {
  it.each(arquivos)("%s", (arquivo) => {
    const id = arquivo.slice(0, -3);
    expect(TOPICOS.has(id), `${id} não é tópico do edital`).toBe(true);
    const texto = readFileSync(`${PASTA}/${arquivo}`, "utf8");
    expect(texto.length, "resumo curto demais").toBeGreaterThan(600);
    expect(texto.startsWith("# "), "o título já aparece na página; comece por ## ou por texto").toBe(false);
    for (const [, lei, ancora] of texto.matchAll(/\]\(\/lei\/([a-z0-9]+)(?:#([a-z0-9-]+))?\)/g)) {
      expect(LEIS_META.some((l) => l.id === lei), `lei ${lei}`).toBe(true);
      if (ancora) expect(ancoras(lei).has(ancora), `${lei}#${ancora}`).toBe(true);
    }
    // Links internos só para páginas que existem.
    for (const [, href] of texto.matchAll(/\]\((\/[^)\s]*)\)/g)) {
      expect(/^\/(lei|topico|questoes|materiais)\b/.test(href), href).toBe(true);
    }
  });
});
