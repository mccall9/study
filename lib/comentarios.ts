import "server-only";
import inss2016 from "@/data/questoes/comentarios/inss-2016.json";
import inss2022 from "@/data/questoes/comentarios/inss-2022.json";
import prf2021 from "@/data/questoes/comentarios/prf-2021.json";
import { carregarLei } from "./leis";
import { artigoDaAncora, artigosDaLei, rotularAncora } from "./leis-logica";
import { getLeiMeta } from "./leis-meta";
import { QUESTOES_POR_ID } from "./questoes";

// Comentários escritos à mão (com apoio de IA) justificando o gabarito com a lei.
// Formato: { "<questao_id>": { "t": "texto", "b": [{ "lei": "cf", "a": "art5-lxxii" }] } }
type ComentarioJson = { t: string; b?: { lei: string; a: string }[] };

const COMENTARIOS: Record<string, ComentarioJson> = {
  ...(prf2021 as Record<string, ComentarioJson>),
  ...(inss2022 as Record<string, ComentarioJson>),
  ...(inss2016 as Record<string, ComentarioJson>),
};

export type BaseLegal = { lei: string; ancora: string; rotulo: string; href: string };
export type Comentario = { texto: string; base: BaseLegal[] };

export function temComentario(questaoId: string): boolean {
  return questaoId in COMENTARIOS;
}

export async function getComentario(questaoId: string): Promise<Comentario | null> {
  const c = COMENTARIOS[questaoId];
  if (!c) return null;
  const base: BaseLegal[] = [];
  for (const b of c.b ?? []) {
    const lei = await carregarLei(b.lei);
    if (!lei) continue;
    const ids = new Set(artigosDaLei(lei).map((a) => a.id));
    base.push({
      lei: b.lei,
      ancora: b.a,
      rotulo: `${getLeiMeta(b.lei)?.curto ?? b.lei}, ${rotularAncora(b.a, ids).replace(/^Art\./, "art.")}`,
      href: `/lei/${b.lei}#${b.a}`,
    });
  }
  return { texto: c.t, base };
}

export function rotuloDaQuestao(questaoId: string): string {
  const q = QUESTOES_POR_ID.get(questaoId);
  return q ? `${q.concurso} ${q.provaId.split("-")[1]}, item ${q.numero}` : questaoId;
}

/** Para cada artigo da lei, as questões cujo comentário o cita. */
export async function questoesPorArtigo(leiId: string): Promise<Map<string, { id: string; rotulo: string }[]>> {
  const mapa = new Map<string, { id: string; rotulo: string }[]>();
  const lei = await carregarLei(leiId);
  if (!lei) return mapa;
  for (const [questaoId, c] of Object.entries(COMENTARIOS)) {
    const q = QUESTOES_POR_ID.get(questaoId);
    if (!q || q.gabarito === "X") continue;
    for (const b of c.b ?? []) {
      if (b.lei !== leiId) continue;
      const artigo = artigoDaAncora(lei, b.a);
      if (!artigo) continue;
      const lista = mapa.get(artigo.id) ?? [];
      if (!lista.some((x) => x.id === questaoId)) lista.push({ id: questaoId, rotulo: rotuloDaQuestao(questaoId) });
      mapa.set(artigo.id, lista);
    }
  }
  return mapa;
}
