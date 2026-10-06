import { ArrowLeft, Play } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConcursoBadge } from "@/components/concurso-badge";
import { StatusLegenda } from "@/components/status-bar";
import { Button } from "@/components/ui/button";
import { getProgresso } from "@/lib/data";
import { getMateria } from "@/lib/edital";
import { TopicoChecklist } from "./topico-checklist";

type Props = { params: Promise<{ materia: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getMateria((await params).materia)?.nome ?? "Matéria" };
}

export default async function MateriaPage({ params }: Props) {
  const materia = getMateria((await params).materia);
  if (!materia) notFound();
  const progresso = await getProgresso();

  return (
    <>
      <Link
        href="/edital"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Edital
      </Link>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{materia.nome}</h1>
          <div className="mt-2 flex gap-1">
            {materia.concursos.map((c) => (
              <ConcursoBadge key={c} concurso={c} />
            ))}
          </div>
        </div>
        <Button asChild>
          <Link href={`/estudar?materia=${materia.slug}`}>
            <Play /> Estudar esta matéria
          </Link>
        </Button>
      </div>
      <p className="mb-2 text-sm text-muted-foreground">
        Toque no tópico para avançar o status. Ele volta para &quot;não iniciado&quot; depois de
        &quot;questões feitas&quot;.
      </p>
      <div className="mb-4">
        <StatusLegenda />
      </div>
      <TopicoChecklist topicos={materia.topicos} progresso={progresso} />
    </>
  );
}
