import videos from "@/data/materiais/videos.json";

// Videoaulas gratuitas do YouTube por tópico do edital (escolhidas por busca e conferidas pelo oEmbed:
// existem e permitem ser incorporadas). Gerado a partir de scripts de busca; edite à mão se precisar.
export type Video = { id: string; titulo: string; canal: string; duracao: string };

const POR_TOPICO = videos as Record<string, Video[]>;

export function videosDoTopico(topicoId: string): Video[] {
  return POR_TOPICO[topicoId] ?? [];
}

export function topicosComVideo(): Set<string> {
  return new Set(Object.keys(POR_TOPICO).filter((id) => POR_TOPICO[id].length > 0));
}
