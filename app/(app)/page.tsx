import { CalendarClock, Flame, Play, Target } from "lucide-react";
import Link from "next/link";
import { ConcursoBadge } from "@/components/concurso-badge";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/form";
import { getMetaHoras, getProgresso, getSessoes } from "@/lib/data";
import { CONCURSOS, getMateria, MATERIAS } from "@/lib/edital";
import {
  diaLocal,
  formatarDuracao,
  materiaEsquecida,
  progressoConcurso,
  segundosNaSemana,
  segundosPorDia,
  segundosPorMateria,
  sequenciaDias,
  somarDias,
} from "@/lib/stats";
import { MetaForm } from "./meta-form";

const DIA_SEMANA = new Intl.DateTimeFormat("pt-BR", { weekday: "short", timeZone: "UTC" });

function rotuloDia(dia: string) {
  return DIA_SEMANA.format(new Date(`${dia}T12:00:00Z`)).replace(".", "");
}

function haQuanto(ultimaVez: string | null, agora: Date) {
  if (!ultimaVez) return "Ainda não estudada";
  const hoje = diaLocal(agora);
  const dia = diaLocal(ultimaVez);
  if (dia === hoje) return "Estudada hoje";
  if (dia === somarDias(hoje, -1)) return "Estudada ontem";
  const dias = Math.round(
    (Date.parse(`${hoje}T12:00:00Z`) - Date.parse(`${dia}T12:00:00Z`)) / 86_400_000,
  );
  return `Última vez há ${dias} dias`;
}

export default async function PainelPage() {
  const [sessoes, progresso, metaHoras] = await Promise.all([
    getSessoes(60),
    getProgresso(),
    getMetaHoras(),
  ]);
  const agora = new Date();

  const semanaSeg = segundosNaSemana(sessoes, agora);
  const metaPct = (semanaSeg / 3600 / metaHoras) * 100;
  const sequencia = sequenciaDias(sessoes, agora);
  const porDia = segundosPorDia(sessoes, agora, 7);
  const maxDia = Math.max(...porDia.map((d) => d.segundos), 1);
  const limite30 = somarDias(diaLocal(agora), -29);
  const porMateria = segundosPorMateria(sessoes.filter((s) => diaLocal(s.inicio) >= limite30));
  const maxMateria = Math.max(...porMateria.map((m) => m.segundos), 1);
  const sugestao = materiaEsquecida(MATERIAS, sessoes);

  return (
    <>
      <PageHeader title="Painel" description="Como está o ritmo de estudos." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardDescription>Esta semana</CardDescription>
            <Target className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-3xl font-bold">
              {formatarDuracao(semanaSeg)}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                de {metaHoras}h
              </span>
            </p>
            <Progress value={metaPct} />
            <MetaForm metaHoras={metaHoras} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardDescription>Sequência</CardDescription>
            <Flame className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {sequencia}
              <span className="ml-1 text-base font-normal text-muted-foreground">
                {sequencia === 1 ? "dia seguido" : "dias seguidos"}
              </span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {sequencia === 0
                ? "Uma sessão hoje já começa uma nova sequência."
                : "Estude hoje para não perder a sequência."}
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex-row items-center justify-between">
            <CardDescription>Sugestão de hoje</CardDescription>
            <CalendarClock className="size-4 text-muted-foreground" />
          </CardHeader>
          {sugestao && (
            <CardContent className="space-y-3">
              <div>
                <p className="font-semibold">{sugestao.materia.nome}</p>
                <p className="text-sm text-muted-foreground">{haQuanto(sugestao.ultimaVez, agora)}</p>
              </div>
              <Button asChild size="sm">
                <Link href={`/estudar?materia=${sugestao.materia.slug}`}>
                  <Play /> Estudar agora
                </Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Edital concluído</CardTitle>
            <CardDescription>Tópicos já estudados pelo menos uma vez.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {CONCURSOS.map((c) => {
              const p = progressoConcurso(MATERIAS, progresso, c);
              return (
                <Link key={c} href={`/edital?concurso=${c}`} className="block space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <ConcursoBadge concurso={c} />
                    <span className="text-muted-foreground">
                      <strong className="text-foreground">{p.percentual}%</strong> · {p.feitos} de{" "}
                      {p.total} tópicos
                    </span>
                  </div>
                  <Progress
                    value={p.percentual}
                    className="h-3"
                    barClassName={c === "PRF" ? "bg-prf" : "bg-inss"}
                  />
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos 7 dias</CardTitle>
            <CardDescription>Tempo de estudo por dia.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-36 items-end gap-2">
              {porDia.map((d) => (
                <div key={d.dia} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
                  <span className="text-[10px] text-muted-foreground">
                    {d.segundos > 0 ? formatarDuracao(d.segundos) : ""}
                  </span>
                  <div
                    className="w-full max-w-10 rounded-t-md bg-primary/80"
                    style={{ height: `${(d.segundos / maxDia) * 100}%`, minHeight: d.segundos ? 4 : 0 }}
                    title={formatarDuracao(d.segundos)}
                  />
                  <span className="text-xs capitalize text-muted-foreground">{rotuloDia(d.dia)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Horas por matéria</CardTitle>
          <CardDescription>Últimos 30 dias.</CardDescription>
        </CardHeader>
        <CardContent>
          {porMateria.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma sessão ainda. Vá em <Link href="/estudar" className="underline">Estudar</Link> e
              comece o cronômetro.
            </p>
          ) : (
            <ul className="space-y-3">
              {porMateria.map(({ materia_slug, segundos }) => (
                <li key={materia_slug} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 text-sm">
                  <span className="truncate">{getMateria(materia_slug)?.nome ?? materia_slug}</span>
                  <span className="text-muted-foreground tabular-nums">{formatarDuracao(segundos)}</span>
                  <Progress value={(segundos / maxMateria) * 100} className="col-span-2" />
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </>
  );
}
