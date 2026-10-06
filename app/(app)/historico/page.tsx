import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { getSessoes } from "@/lib/data";
import { diaLocal, formatarDuracao } from "@/lib/stats";
import type { Sessao } from "@/lib/types";
import { SessaoItem } from "./sessao-item";

export const metadata: Metadata = { title: "Histórico" };

const DATA = new Intl.DateTimeFormat("pt-BR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});

export default async function HistoricoPage() {
  const sessoes = await getSessoes(60);
  const porDia = new Map<string, Sessao[]>();
  for (const s of sessoes) {
    const dia = diaLocal(s.inicio);
    porDia.set(dia, [...(porDia.get(dia) ?? []), s]);
  }

  return (
    <>
      <PageHeader title="Histórico" description="Sessões dos últimos 60 dias." />
      {sessoes.length === 0 ? (
        <Card className="p-6 text-center text-sm text-muted-foreground">
          Nenhuma sessão registrada ainda.{" "}
          <Link href="/estudar" className="underline">
            Começar a estudar
          </Link>
        </Card>
      ) : (
        <div className="space-y-6">
          {[...porDia.entries()].map(([dia, lista]) => (
            <section key={dia}>
              <div className="mb-2 flex items-baseline justify-between px-1">
                <h2 className="text-sm font-semibold capitalize">
                  {DATA.format(new Date(`${dia}T12:00:00Z`))}
                </h2>
                <span className="text-sm text-muted-foreground tabular-nums">
                  {formatarDuracao(lista.reduce((t, s) => t + s.duracao_seg, 0))}
                </span>
              </div>
              <Card className="divide-y">
                {lista.map((s) => (
                  <SessaoItem key={s.id} sessao={s} />
                ))}
              </Card>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
