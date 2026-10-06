import { BookX, CalendarClock, FileCheck2, Gauge, Star, Target, Trophy } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ConcursoBadge } from "@/components/concurso-badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/form";
import { CONFIANCA_LABEL, desempenhoPorConfianca } from "@/lib/confianca";
import { getMarcacoes, getRespostas, getSimulados } from "@/lib/data";
import { getMateria } from "@/lib/edital";
import { getProva, PROVAS, QUESTOES, QUESTOES_POR_ID, validas } from "@/lib/questoes";
import { cadernoDeErros, desempenhoPorMateria, resumo, ultimaPorQuestao } from "@/lib/questoes-logica";
import { idsMarcados } from "@/lib/marcacoes";
import { agendaDeRevisao, proximasRevisoes, revisoesDoDia } from "@/lib/revisao";
import { formatarDuracao } from "@/lib/stats";
import { FiltroTreino } from "./filtro-treino";
import { MontarSimulado } from "./montar-simulado";

export const metadata: Metadata = { title: "Questões" };

const DATA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "America/Sao_Paulo" });

export default async function QuestoesPage() {
  const [respostas, simulados, marcacoes] = await Promise.all([getRespostas(), getSimulados(), getMarcacoes("questao:")]);
  const banco = validas(QUESTOES);
  const feitas = ultimaPorQuestao(respostas).size;
  const geral = resumo(respostas);
  const caderno = cadernoDeErros(respostas).size;
  const desempenho = desempenhoPorMateria(respostas, QUESTOES_POR_ID);
  const agora = new Date();
  const agenda = agendaDeRevisao(respostas);
  const revisoesHoje = revisoesDoDia(agenda, agora).length;
  const amanha = proximasRevisoes(agenda, agora, 1)[0].total;
  const favoritas = idsMarcados(marcacoes, "favorito", "questao:").size;
  const porConfianca = desempenhoPorConfianca(respostas);

  const porMateria: Record<string, number> = {};
  const porTopico: Record<string, number> = {};
  const porMateriaConcurso: Record<string, Partial<Record<"PRF" | "INSS", number>>> = {};
  for (const q of banco) {
    porMateria[q.materia] = (porMateria[q.materia] ?? 0) + 1;
    if (q.topico) porTopico[q.topico] = (porTopico[q.topico] ?? 0) + 1;
    const c = (porMateriaConcurso[q.materia] ??= {});
    c[q.concurso] = (c[q.concurso] ?? 0) + 1;
  }

  return (
    <>
      <PageHeader
        title="Questões"
        description={`${banco.length} itens oficiais do Cebraspe: ${new Intl.ListFormat("pt-BR").format([...PROVAS].sort((a, b) => b.ano - a.ano).map((p) => p.nome.split(" · ")[0]))}.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardDescription>Já feitas</CardDescription>
            <FileCheck2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold tabular-nums">
              {feitas}
              <span className="ml-1 text-base font-normal text-muted-foreground">de {banco.length}</span>
            </p>
            <Progress value={(feitas / banco.length) * 100} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardDescription>Aproveitamento</CardDescription>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tabular-nums">{geral.aproveitamento}%</p>
            <p className="mt-2 text-sm text-muted-foreground tabular-nums">
              {geral.certas} {geral.certas === 1 ? "certa" : "certas"} · {geral.erradas} {geral.erradas === 1 ? "errada" : "erradas"} ·{" "}
              {geral.brancos} em branco
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardDescription>Caderno de erros</CardDescription>
            <BookX className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold tabular-nums">
              {caderno}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                {caderno === 1 ? "questão" : "questões"}
              </span>
            </p>
            {caderno > 0 ? (
              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link href="/questoes/treino?situacao=erros">Refazer</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/questoes/erros">Ver lista</Link>
                </Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Questões erradas ou em branco aparecem aqui.</p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardDescription>Revisões de hoje</CardDescription>
            <CalendarClock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold tabular-nums">
              {revisoesHoje}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                {revisoesHoje === 1 ? "questão" : "questões"}
              </span>
            </p>
            {revisoesHoje > 0 ? (
              <Button asChild size="sm">
                <Link href="/questoes/treino?situacao=revisao">Revisar agora</Link>
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                {amanha > 0 ? `Amanhã: ${amanha} ${amanha === 1 ? "questão" : "questões"}.` : "Os erros voltam em 1, 3, 7, 15 e 30 dias."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {favoritas > 0 && (
        <p className="mt-3 text-sm">
          <Link href="/questoes/treino?situacao=favoritas" className="inline-flex items-center gap-1.5 text-primary hover:underline">
            <Star className="size-4 fill-amber-400 text-amber-500" /> Treinar as favoritas ({favoritas})
          </Link>
        </p>
      )}

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Treinar</CardTitle>
          <CardDescription>Uma questão por vez, com a correção na hora.</CardDescription>
        </CardHeader>
        <CardContent>
          <FiltroTreino porMateria={porMateria} porTopico={porTopico} />
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Simulados</CardTitle>
          <CardDescription>A prova inteira, com cronômetro e a nota no estilo Cebraspe.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {PROVAS.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 rounded-lg border p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <ConcursoBadge concurso={p.concurso} />
                    <span className="truncate text-sm font-medium">{p.nome.split(" · ")[1]}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {p.ano} · {validas(p.questoes).length} itens
                  </p>
                </div>
                <Button asChild size="sm">
                  <Link href={`/questoes/simulado/${p.id}`}>Fazer</Link>
                </Button>
              </div>
            ))}
          </div>
          <details className="rounded-lg border">
            <summary className="cursor-pointer px-3 py-2.5 text-sm font-medium select-none">
              Montar simulado personalizado (escolha matérias, quantidade e tempo)
            </summary>
            <div className="border-t p-3">
              <MontarSimulado contagem={porMateriaConcurso} />
            </div>
          </details>
          {simulados.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-medium">
                <Trophy className="size-4 text-muted-foreground" /> Seus simulados
              </p>
              <div className="divide-y rounded-lg border text-sm">
                {simulados.map((s) => (
                  <div key={s.id} className="flex items-center justify-between gap-3 px-3 py-2">
                    <span className="min-w-0 truncate">
                      {DATA.format(new Date(s.finalizado_em))} ·{" "}
                      {s.prova_id === "personalizado" ? "Personalizado" : (getProva(s.prova_id)?.nome.split(" · ")[0] ?? s.prova_id)}
                    </span>
                    <span className="shrink-0 tabular-nums text-muted-foreground">
                      <span className="text-status-questoes">{s.certas}✓</span>{" "}
                      <span className="text-destructive">{s.erradas}✗</span> · nota{" "}
                      <strong className="text-foreground">{s.certas - s.erradas}</strong> · {formatarDuracao(s.duracao_seg)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {porConfianca.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Gauge className="size-4 text-primary" />
              <CardTitle>Quando arriscar</CardTitle>
            </div>
            <CardDescription>
              No Cebraspe, cada erro anula um acerto: só compensa marcar quando você acerta mais da metade das vezes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="divide-y text-sm">
              {porConfianca.map((c) => (
                <li key={c.confianca} className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 py-2">
                  <span className="font-medium">{CONFIANCA_LABEL[c.confianca]}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {c.acerto}% de acerto em {c.certas + c.erradas} · saldo {c.saldo > 0 ? "+" : ""}
                    {c.saldo.toLocaleString("pt-BR")} por item
                  </span>
                  <span
                    className={
                      c.vale === "marcar"
                        ? "w-full text-xs text-status-questoes"
                        : c.vale === "branco"
                          ? "w-full text-xs text-destructive"
                          : "w-full text-xs text-muted-foreground"
                    }
                  >
                    {c.vale === "marcar"
                      ? "Vale marcar."
                      : c.vale === "branco"
                        ? "Melhor deixar em branco quando estiver assim."
                        : "Empate: marcar ou deixar em branco dá no mesmo."}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Conta só as respostas em que você escolheu o nível de confiança no treino.
            </p>
          </CardContent>
        </Card>
      )}

      {desempenho.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>Desempenho por matéria</CardTitle>
              <Button asChild size="sm" variant="ghost">
                <Link href="/questoes/desempenho">Semanas e tópicos →</Link>
              </Button>
            </div>
            <CardDescription>Todas as respostas, do treino e dos simulados.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {desempenho.map((d) => (
                <li key={d.materia} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-sm">
                  <Link href={`/questoes/treino?materia=${d.materia}`} className="truncate hover:underline">
                    {getMateria(d.materia)?.nome ?? d.materia}
                  </Link>
                  <span className="text-muted-foreground tabular-nums">
                    {d.certas + d.erradas > 0 ? `${d.aproveitamento}%` : "só em branco"} · {d.total}{" "}
                    {d.total === 1 ? "resposta" : "respostas"}
                  </span>
                  <Progress
                    value={d.certas + d.erradas > 0 ? d.aproveitamento : 0}
                    className="col-span-2"
                    barClassName={d.aproveitamento >= 70 ? "bg-status-questoes" : d.aproveitamento >= 50 ? "bg-status-estudado" : "bg-destructive"}
                  />
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </>
  );
}
