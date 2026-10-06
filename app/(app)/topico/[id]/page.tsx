import { ArrowLeft, BookOpen, FolderOpen, ListChecks, Play, Scale, Tv, Upload } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConcursoBadge } from "@/components/concurso-badge";
import { ArtigoLei } from "@/components/lei-texto";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { questoesPorArtigo } from "@/lib/comentarios";
import { ListaArquivos } from "@/components/lista-arquivos";
import { Anotacao, BotaoMarcacao } from "@/components/marcacao";
import { VideoAula } from "@/components/video-aula";
import { getAnotacoes, getArquivos, getMarcacoes, getProgresso, getRespostas, getUsuario } from "@/lib/data";
import { MATERIAS } from "@/lib/edital";
import { carregarLei } from "@/lib/leis";
import { filtrarDispositivos, resolverArtigos, type Artigo } from "@/lib/leis-logica";
import { getLeiMeta } from "@/lib/leis-meta";
import { alvoArtigo, alvoTopico, alvoVideo, type TipoMarcacao } from "@/lib/marcacoes";
import { LIMITE_ARTIGOS_NA_PAGINA, REFERENCIAS } from "@/lib/materiais";
import { QUESTOES, validas } from "@/lib/questoes";
import { resumo, ultimaPorQuestao } from "@/lib/questoes-logica";
import { getResumo } from "@/lib/resumos";
import { videosDoTopico } from "@/lib/videos";
import { StatusTopico } from "./status-topico";

type Props = { params: Promise<{ id: string }> };

function encontrar(id: string) {
  for (const materia of MATERIAS) {
    const i = materia.topicos.findIndex((t) => t.id === id);
    if (i >= 0) return { materia, topico: materia.topicos[i], indice: i };
  }
  return null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: encontrar((await params).id)?.topico.titulo ?? "Tópico" };
}

function faixa(artigos: Artigo[]): string {
  if (artigos.length === 1) return `art. ${artigos[0].num}`;
  return `arts. ${artigos[0].num} a ${artigos.at(-1)!.num}`;
}

export default async function TopicoPage({ params }: Props) {
  const achado = encontrar((await params).id);
  if (!achado) notFound();
  const { materia, topico, indice } = achado;

  const alvo = alvoTopico(topico.id);
  const [progresso, respostas, textoResumo, marcacoes, anotacoes, arquivos, usuario] = await Promise.all([
    getProgresso(),
    getRespostas(),
    getResumo(topico.id),
    getMarcacoes(),
    getAnotacoes(alvo),
    getArquivos(topico.id),
    getUsuario(),
  ]);
  const marcado = (a: string, tipo: TipoMarcacao) => marcacoes.some((m) => m.alvo === a && m.tipo === tipo);
  const videos = videosDoTopico(topico.id);
  const questoes = validas(QUESTOES).filter((q) => q.topico === topico.id);
  const ids = new Set(questoes.map((q) => q.id));
  const doTopico = respostas.filter((r) => ids.has(r.questao_id));
  const feitas = ultimaPorQuestao(doTopico).size;
  const desempenho = resumo(doTopico);

  const referencias = await Promise.all(
    (REFERENCIAS[topico.id] ?? []).map(async (ref) => {
      const lei = await carregarLei(ref.lei);
      if (!lei) return null;
      const artigos = resolverArtigos(lei, ref.artigos).map((a) => filtrarDispositivos(a, ref.dispositivos));
      const caiu = await questoesPorArtigo(ref.lei);
      return { ref, meta: getLeiMeta(ref.lei), artigos, inteira: !ref.artigos || ref.artigos.includes("*"), caiu };
    }),
  );

  const anterior = materia.topicos[indice - 1];
  const proximo = materia.topicos[indice + 1];

  return (
    <>
      <Link
        href={`/edital/${materia.slug}`}
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {materia.nome}
      </Link>
      <div className="mb-5 space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Tópico {indice + 1} de {materia.topicos.length}</p>
          <h1 className="text-2xl font-bold tracking-tight">{topico.titulo}</h1>
          <div className="mt-2 flex gap-1">
            {materia.concursos.map((c) => (
              <ConcursoBadge key={c} concurso={c} />
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusTopico topicoId={topico.id} status={progresso[topico.id] ?? "nao_iniciado"} />
          <BotaoMarcacao alvo={alvo} tipo="favorito" inicial={marcado(alvo, "favorito")} />
          <Anotacao alvo={alvo} inicial={anotacoes.get(alvo) ?? ""} placeholder="Dúvidas, macetes, o que revisar neste tópico…" />
          <Button asChild size="sm" variant="secondary">
            <Link href={`/estudar?materia=${materia.slug}`}>
              <Play /> Estudar com cronômetro
            </Link>
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {textoResumo && (
          <Card>
            <CardHeader className="flex-row items-center gap-2">
              <BookOpen className="size-4 text-primary" />
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Markdown>{textoResumo}</Markdown>
              <p className="border-t pt-3 text-xs text-muted-foreground">
                Resumo escrito com apoio de IA a partir da lei. Na dúvida, confira o texto da lei abaixo.
              </p>
            </CardContent>
          </Card>
        )}

        {videos.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Tv className="size-4 text-primary" />
                <CardTitle>Videoaulas</CardTitle>
              </div>
              <CardDescription>Aulas gratuitas de professores de cursinho no YouTube.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 sm:grid-cols-2">
              {videos.map((v) => (
                <VideoAula key={v.id} video={v} assistida={marcado(alvoVideo(v.id), "assistido")} />
              ))}
            </CardContent>
          </Card>
        )}

        {questoes.length > 0 && (
          <Card>
            <CardHeader className="flex-row items-center gap-2">
              <ListChecks className="size-4 text-primary" />
              <CardTitle>Questões deste tópico</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">
                {questoes.length} {questoes.length === 1 ? "questão oficial" : "questões oficiais"} ·{" "}
                {feitas === 0 ? "nenhuma feita ainda" : `${feitas} feitas · ${desempenho.aproveitamento}% de acerto`}
              </p>
              <Button asChild>
                <Link href={`/questoes/treino?topico=${topico.id}&materia=${materia.slug}`}>Treinar</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {referencias.map((r) =>
          r ? (
            <Card key={`${r.ref.lei}-${(r.ref.artigos ?? ["*"]).join(",")}`}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Scale className="size-4 text-primary" />
                  <CardTitle>
                    {r.meta?.curto}
                    {!r.inteira && `, ${faixa(r.artigos)}`}
                  </CardTitle>
                </div>
                <CardDescription>{r.ref.nota ?? r.meta?.nome}</CardDescription>
              </CardHeader>
              <CardContent>
                {r.inteira || r.artigos.length > LIMITE_ARTIGOS_NA_PAGINA ? (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-muted-foreground">
                      {r.artigos.length} artigos{" "}
                      {[...r.caiu.keys()].some((k) => r.artigos.some((a) => a.id === k)) && "· alguns já caíram na prova"}
                    </p>
                    <Button asChild variant="secondary">
                      <Link href={`/lei/${r.ref.lei}#${r.artigos[0].id}`}>Ler na lei seca</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {r.artigos.map((a) => (
                      <ArtigoLei
                        key={a.id}
                        artigo={a}
                        leiId={r.ref.lei}
                        caiu={r.caiu.get(a.id)}
                        compacto
                        grifado={marcado(alvoArtigo(r.ref.lei, a.id), "destaque")}
                      />
                    ))}
                    {r.ref.dispositivos && (
                      <Link href={`/lei/${r.ref.lei}#${r.artigos[0].id}`} className="block pt-3 text-sm text-primary hover:underline">
                        Ver o artigo completo na lei seca
                      </Link>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : null,
        )}

        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <FolderOpen className="size-4 text-primary" />
              <CardTitle>Meus arquivos do tópico</CardTitle>
            </div>
            <Button asChild size="sm" variant="secondary">
              <Link href={`/arquivos?materia=${materia.slug}&topico=${topico.id}`}>
                <Upload /> Enviar PDF ou foto
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ListaArquivos
              arquivos={arquivos}
              meuId={usuario?.id ?? ""}
              vazio="Apostilas, mapas mentais ou fotos do caderno sobre este tópico aparecem aqui."
            />
          </CardContent>
        </Card>

        {!textoResumo && referencias.length === 0 && questoes.length === 0 && videos.length === 0 && (
          <Card className="p-6 text-center text-sm text-muted-foreground">
            Ainda não há material para este tópico. Os resumos, vídeos e questões vão chegando aos poucos.
          </Card>
        )}

        <div className="flex justify-between gap-3 pt-2 text-sm">
          {anterior ? (
            <Link href={`/topico/${anterior.id}`} className="min-w-0 truncate text-primary hover:underline">
              ← {anterior.titulo}
            </Link>
          ) : (
            <span />
          )}
          {proximo && (
            <Link href={`/topico/${proximo.id}`} className="min-w-0 truncate text-right text-primary hover:underline">
              {proximo.titulo} →
            </Link>
          )}
        </div>
      </div>
    </>
  );
}
