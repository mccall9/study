import { BookOpen, ExternalLink, FileText, ListChecks, Scale } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ConcursoBadge } from "@/components/concurso-badge";
import { ConcursoFiltro } from "@/components/concurso-filtro";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { materiasDoConcurso, parseConcurso } from "@/lib/edital";
import { GRUPOS, LEIS_META } from "@/lib/leis-meta";
import { REFERENCIAS } from "@/lib/materiais";
import { PROVAS, QUESTOES, validas } from "@/lib/questoes";
import { topicosComResumo } from "@/lib/resumos";

export const metadata: Metadata = { title: "Materiais" };

const OFICIAIS = [
  {
    titulo: "Manual de Redação da Presidência da República",
    descricao: "Base da redação oficial cobrada em Língua Portuguesa.",
    url: "https://www.gov.br/planalto/pt-br/centrais-de-conteudo/publicacoes/manual-de-redacao-da-presidencia-da-republica",
  },
];

export default async function MateriaisPage({ searchParams }: { searchParams: Promise<{ concurso?: string }> }) {
  const concurso = parseConcurso((await searchParams).concurso);
  const comResumo = await topicosComResumo();
  const porTopico = new Map<string, number>();
  for (const q of validas(QUESTOES)) if (q.topico) porTopico.set(q.topico, (porTopico.get(q.topico) ?? 0) + 1);

  return (
    <>
      <PageHeader title="Materiais" description="Resumos, lei seca e questões organizados por tópico do edital.">
        <ConcursoFiltro atual={concurso} basePath="/materiais" />
      </PageHeader>

      <div className="space-y-4">
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
