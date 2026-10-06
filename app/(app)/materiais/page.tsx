import { BookOpen, ExternalLink, FileText, FolderOpen, Highlighter, ListChecks, NotebookPen, Scale, Star } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ConcursoBadge } from "@/components/concurso-badge";
import { ConcursoFiltro } from "@/components/concurso-filtro";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAnotacoes, getArquivos, getMarcacoes } from "@/lib/data";
import { MATERIAS, materiasDoConcurso, parseConcurso } from "@/lib/edital";
import { getLeiMeta, GRUPOS, LEIS_META } from "@/lib/leis-meta";
import { REFERENCIAS } from "@/lib/materiais";
import { PROVAS, QUESTOES, validas } from "@/lib/questoes";
import { topicosComResumo } from "@/lib/resumos";

export const metadata: Metadata = { title: "Materiais" };

const OFICIAIS = [
  {
    titulo: "Edital PRF 2021 (abertura)",
    descricao: "Edital nº 1 do último concurso da PRF, pelo Cebraspe: conteúdo programático, etapas e regras.",
    url: "https://cdn.cebraspe.org.br/concursos/prf_21/arquivos/ED_1_PRF_2021_ABERTURA.PDF",
  },
  {
    titulo: "Edital INSS 2022 (abertura)",
    descricao: "Edital nº 1 do último concurso do INSS (Técnico do Seguro Social), pelo Cebraspe.",
    url: "https://cdn.cebraspe.org.br/concursos/inss_22/arquivos/ED_1_INSS_22_ABERTURA.PDF",
  },
  {
    titulo: "Manual de Redação da Presidência da República",
    descricao: "Base da redação oficial cobrada em Língua Portuguesa.",
    url: "https://www.gov.br/planalto/pt-br/centrais-de-conteudo/publicacoes/manual-de-redacao-da-presidencia-da-republica",
  },
];

export default async function MateriaisPage({ searchParams }: { searchParams: Promise<{ concurso?: string }> }) {
  const concurso = parseConcurso((await searchParams).concurso);
  const [comResumo, marcacoes, anotacoes, arquivos] = await Promise.all([
    topicosComResumo(),
    getMarcacoes(),
    getAnotacoes(),
    getArquivos(),
  ]);
  const topicos = new Map(MATERIAS.flatMap((m) => m.topicos.map((t) => [t.id, t.titulo] as const)));
  const topicosFavoritos = marcacoes
    .filter((m) => m.tipo === "favorito" && m.alvo.startsWith("topico:"))
    .map((m) => m.alvo.slice("topico:".length))
    .filter((id) => topicos.has(id));
  const topicosAnotados = [...anotacoes.keys()].filter((a) => a.startsWith("topico:")).map((a) => a.slice("topico:".length)).filter((id) => topicos.has(id));
  const grifosPorLei = new Map<string, number>();
  for (const m of marcacoes) {
    if (m.tipo !== "destaque" || !m.alvo.startsWith("lei:")) continue;
    const lei = m.alvo.split(":")[1];
    grifosPorLei.set(lei, (grifosPorLei.get(lei) ?? 0) + 1);
  }
  const questoesFavoritas = marcacoes.filter((m) => m.tipo === "favorito" && m.alvo.startsWith("questao:")).length;
  const idsAnotadas = [...anotacoes.keys()].filter((a) => a.startsWith("questao:")).map((a) => a.slice("questao:".length));
  const questoesAnotadas = idsAnotadas.length;
  const temPessoal = topicosFavoritos.length + topicosAnotados.length + grifosPorLei.size + questoesFavoritas + questoesAnotadas > 0;
  const porTopico = new Map<string, number>();
  for (const q of validas(QUESTOES)) if (q.topico) porTopico.set(q.topico, (porTopico.get(q.topico) ?? 0) + 1);

  return (
    <>
      <PageHeader title="Materiais" description="Resumos, videoaulas, lei seca e questões organizados por tópico do edital.">
        <ConcursoFiltro atual={concurso} basePath="/materiais" />
      </PageHeader>

      <div className="space-y-4">
        {temPessoal && (
          <Card>
            <CardHeader className="flex-row items-center gap-2">
              <Star className="size-4 fill-amber-400 text-amber-500" />
              <div>
                <CardTitle>Meus favoritos e anotações</CardTitle>
                <CardDescription>O que você marcou para voltar depois.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {[...new Set([...topicosFavoritos, ...topicosAnotados])].length > 0 && (
                <ul className="space-y-1.5">
                  {[...new Set([...topicosFavoritos, ...topicosAnotados])].map((id) => (
                    <li key={id} className="flex items-center gap-2">
                      {topicosFavoritos.includes(id) ? (
                        <Star className="size-3.5 shrink-0 fill-amber-400 text-amber-500" />
                      ) : (
                        <NotebookPen className="size-3.5 shrink-0 text-muted-foreground" />
                      )}
                      <Link href={`/topico/${id}`} className="truncate hover:underline">
                        {topicos.get(id)}
                      </Link>
                      {topicosAnotados.includes(id) && topicosFavoritos.includes(id) && (
                        <NotebookPen className="size-3.5 shrink-0 text-muted-foreground" aria-label="com anotação" />
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {grifosPorLei.size > 0 && (
                <div className="flex flex-wrap gap-2">
                  {[...grifosPorLei].map(([lei, n]) => (
                    <Link
                      key={lei}
                      href={`/lei/${lei}?grifos=1`}
                      className="inline-flex items-center gap-1.5 rounded-full border bg-amber-100/60 px-3 py-1.5 hover:bg-amber-100 dark:bg-amber-400/10"
                    >
                      <Highlighter className="size-3.5 text-amber-600" /> {getLeiMeta(lei)?.curto ?? lei} · {n}
                    </Link>
                  ))}
                </div>
              )}
              {(questoesFavoritas > 0 || questoesAnotadas > 0) && (
                <p className="text-muted-foreground">
                  {questoesFavoritas > 0 && (
                    <Link href="/questoes/treino?situacao=favoritas" className="text-primary hover:underline">
                      {questoesFavoritas} {questoesFavoritas === 1 ? "questão favorita" : "questões favoritas"}
                    </Link>
                  )}
                  {questoesFavoritas > 0 && questoesAnotadas > 0 && " · "}
                  {questoesAnotadas > 0 && (
                    <Link href={`/questoes/treino?ids=${idsAnotadas.join(",")}`} className="text-primary hover:underline">
                      {questoesAnotadas} {questoesAnotadas === 1 ? "questão com anotação" : "questões com anotação"}
                    </Link>
                  )}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="size-4 text-primary" />
              <div>
                <CardTitle>Arquivos</CardTitle>
                <CardDescription>
                  {arquivos.length === 0
                    ? "Envie apostilas em PDF ou fotos do caderno e acesse no celular e no computador."
                    : `${arquivos.length} ${arquivos.length === 1 ? "arquivo" : "arquivos"} (seus e compartilhados pela família).`}
                </CardDescription>
              </div>
            </div>
            <Button asChild size="sm">
              <Link href="/arquivos">{arquivos.length === 0 ? "Enviar arquivo" : "Ver arquivos"}</Link>
            </Button>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <Scale className="size-4 text-primary" />
            <div>
              <CardTitle>Lei seca</CardTitle>
              <CardDescription>Texto oficial compilado, com busca e os artigos que já caíram na prova.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {GRUPOS.map((g) => (
              <div key={g}>
                <p className="mb-1.5 text-xs font-semibold tracking-wide text-muted-foreground uppercase">{g}</p>
                <div className="flex flex-wrap gap-2">
                  {LEIS_META.filter((l) => l.grupo === g).map((l) => (
                    <Link
                      key={l.id}
                      href={`/lei/${l.id}`}
                      title={l.nome}
                      className="rounded-full border bg-card px-3 py-1.5 text-sm hover:bg-muted"
                    >
                      {l.curto}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {materiasDoConcurso(concurso).map((m) => (
          <Card key={m.slug}>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle>{m.nome}</CardTitle>
                {m.concursos.map((c) => (
                  <ConcursoBadge key={c} concurso={c} />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {m.topicos.map((t) => {
                  const nq = porTopico.get(t.id) ?? 0;
                  return (
                    <li key={t.id}>
                      <Link href={`/topico/${t.id}`} className="flex items-center gap-3 py-2.5 text-sm hover:text-primary">
                        <span className="min-w-0 flex-1">{t.titulo}</span>
                        <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                          {comResumo.has(t.id) && <BookOpen className="size-3.5" aria-label="tem resumo" />}
                          {REFERENCIAS[t.id] && <Scale className="size-3.5" aria-label="tem lei seca" />}
                          {nq > 0 && (
                            <span className="inline-flex items-center gap-0.5 text-xs tabular-nums">
                              <ListChecks className="size-3.5" aria-hidden /> {nq}
                            </span>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader className="flex-row items-center gap-2">
            <FileText className="size-4 text-primary" />
            <CardTitle>Documentos oficiais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {OFICIAIS.map((o) => (
              <a key={o.url} href={o.url} target="_blank" rel="noreferrer" className="block rounded-lg border p-3 hover:bg-muted/50">
                <span className="flex items-center gap-1 font-medium">
                  {o.titulo} <ExternalLink className="size-3" />
                </span>
                <span className="text-muted-foreground">{o.descricao}</span>
              </a>
            ))}
            {PROVAS.map((p) => (
              <div key={p.id} className="rounded-lg border p-3">
                <p className="font-medium">Prova e gabarito · {p.nome}</p>
                <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
                  {p.fontes.map((f) => (
                    <a key={f} href={f} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                      {f.includes("GAB_") ? "Gabarito" : "Caderno"} {f.split("/").pop()?.replace(/\.PDF$/i, "")}
                      <ExternalLink className="size-3" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
