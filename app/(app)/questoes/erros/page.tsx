import { ArrowLeft, RotateCcw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getRespostas } from "@/lib/data";
import { getMateria } from "@/lib/edital";
import { QUESTOES } from "@/lib/questoes";
import { cadernoDeErros, separarAssertiva, ultimaPorQuestao, type Questao } from "@/lib/questoes-logica";

export const metadata: Metadata = { title: "Caderno de erros" };

const DATA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });

export default async function CadernoPage() {
  const respostas = await getRespostas();
  const ids = cadernoDeErros(respostas);
  const ultima = ultimaPorQuestao(respostas);
  const porMateria = new Map<string, Questao[]>();
  for (const q of QUESTOES) {
    if (ids.has(q.id)) porMateria.set(q.materia, [...(porMateria.get(q.materia) ?? []), q]);
  }

  return (
    <>
      <Link
        href="/questoes"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Questões
      </Link>
      <PageHeader
        title="Caderno de erros"
        description="Questões cuja última resposta foi errada ou em branco. Acertou ao refazer? Ela sai daqui."
      >
        {ids.size > 0 && (
          <Button asChild>
            <Link href="/questoes/treino?situacao=erros">
              <RotateCcw /> Refazer tudo
            </Link>
          </Button>
        )}
      </PageHeader>

      {ids.size === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          Nenhuma questão no caderno. Continue treinando!
        </Card>
      ) : (
        <div className="space-y-6">
          {[...porMateria.entries()].map(([materia, questoes]) => (
            <section key={materia}>
              <div className="mb-2 flex items-center justify-between gap-3 px-1">
                <h2 className="text-sm font-semibold">
                  {getMateria(materia)?.nome ?? materia} · {questoes.length}
                </h2>
                <Link
                  href={`/questoes/treino?situacao=erros&materia=${materia}`}
                  className="text-sm text-primary hover:underline"
                >
                  Refazer esta matéria
                </Link>
              </div>
              <Card className="divide-y">
                {questoes.map((q) => {
                  const r = ultima.get(q.id)!;
                  return (
                    <div key={q.id} className="space-y-1 p-4">
                      <p className="line-clamp-3 text-sm">{separarAssertiva(q.enunciado).assertiva}</p>
                      <p className="text-xs text-muted-foreground">
                        {q.concurso} {q.provaId.split("-")[1]}, item {q.numero} ·{" "}
                        {r.correta === false ? "errou" : "deixou em branco"} em{" "}
                        {DATA.format(new Date(r.respondida_em))}
                      </p>
                    </div>
                  );
                })}
              </Card>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
