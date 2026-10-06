import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProva, validas } from "@/lib/questoes";
import { empacotar } from "@/lib/questoes-logica";
import { Simulado } from "./simulado";

type Props = { params: Promise<{ prova: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: `Simulado ${getProva((await params).prova)?.nome ?? ""}` };
}

export default async function SimuladoPage({ params }: Props) {
  const prova = getProva((await params).prova);
  if (!prova) notFound();
  const questoes = validas(prova.questoes);
  const anulados = prova.questoes.length - questoes.length;

  return (
    <>
      <Link
        href="/questoes"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Questões
      </Link>
      <Simulado
        provaId={prova.id}
        nome={prova.nome}
        pacote={empacotar(questoes)}
        observacao={`${questoes.length} itens válidos${anulados ? ` (${anulados} anulados pela banca ficaram de fora)` : ""}.`}
      />
    </>
  );
}
