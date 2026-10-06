import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

// Resumos por tópico em data/resumos/<topicoId>.md, escritos com apoio de IA e citando a lei.
const PASTA = path.join(process.cwd(), "data", "resumos");

export async function getResumo(topicoId: string): Promise<string | null> {
  if (!/^[a-z0-9-]+$/.test(topicoId)) return null;
  try {
    return await readFile(path.join(PASTA, `${topicoId}.md`), "utf8");
  } catch {
    return null;
  }
}

export const topicosComResumo = cache(async (): Promise<Set<string>> => {
  try {
    const arquivos = await readdir(PASTA);
    return new Set(arquivos.filter((a) => a.endsWith(".md")).map((a) => a.slice(0, -3)));
  } catch {
    return new Set();
  }
});
