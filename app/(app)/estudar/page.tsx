import { History } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getMateria } from "@/lib/edital";
import { Cronometro } from "./cronometro";
import { SessaoManual } from "./sessao-manual";

export const metadata: Metadata = { title: "Estudar" };

export default async function EstudarPage({
  searchParams,
}: {
  searchParams: Promise<{ materia?: string }>;
}) {
  const sugerida = getMateria((await searchParams).materia ?? "")?.slug ?? null;
  return (
    <>
      <PageHeader title="Estudar" description="Escolha a matéria e solte o cronômetro.">
        <Link href="/historico" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <History className="size-4" /> Histórico de sessões
        </Link>
      </PageHeader>
      <div className="mx-auto max-w-xl space-y-4">
        <Cronometro materiaSugerida={sugerida} />
        <SessaoManual />
      </div>
    </>
  );
}
