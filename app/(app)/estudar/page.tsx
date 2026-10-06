import type { Metadata } from "next";
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
      <PageHeader title="Estudar" description="Escolha a matéria e solte o cronômetro." />
      <div className="mx-auto max-w-xl space-y-4">
        <Cronometro materiaSugerida={sugerida} />
        <SessaoManual />
      </div>
    </>
  );
}
