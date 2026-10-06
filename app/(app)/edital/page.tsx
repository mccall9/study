import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ConcursoBadge } from "@/components/concurso-badge";
import { ConcursoFiltro } from "@/components/concurso-filtro";
import { PageHeader } from "@/components/page-header";
import { StatusBar, StatusLegenda } from "@/components/status-bar";
import { Card } from "@/components/ui/card";
import { getProgresso } from "@/lib/data";
import { materiasDoConcurso, parseConcurso } from "@/lib/edital";
import { progressoMaterias } from "@/lib/stats";

export const metadata: Metadata = { title: "Edital" };

export default async function EditalPage({
  searchParams,
}: {
  searchParams: Promise<{ concurso?: string }>;
}) {
  const concurso = parseConcurso((await searchParams).concurso);
  const materias = materiasDoConcurso(concurso);
  const progresso = await getProgresso();
  const geral = progressoMaterias(materias, progresso);

  return (
    <>
      <PageHeader
        title="Edital verticalizado"
        description={`${geral.feitos} de ${geral.total} tópicos estudados (${geral.percentual}%).`}
      >
        <ConcursoFiltro atual={concurso} basePath="/edital" />
      </PageHeader>
      <div className="mb-4">
        <StatusLegenda />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {materias.map((m) => {
          const p = progressoMaterias([m], progresso);
          return (
            <Link key={m.slug} href={`/edital/${m.slug}`}>
              <Card className="space-y-3 p-4 transition-colors hover:bg-muted/50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug">{m.nome}</p>
                    <div className="mt-1 flex gap-1">
                      {m.concursos.map((c) => (
                        <ConcursoBadge key={c} concurso={c} />
                      ))}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
                    <span className="tabular-nums">
                      {p.feitos}/{p.total}
                    </span>
                    <ChevronRight className="size-4" />
                  </div>
                </div>
                <StatusBar materia={m} progresso={progresso} />
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
