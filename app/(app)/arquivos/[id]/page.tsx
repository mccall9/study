import { ArrowLeft, Download, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BUCKET, formatarTamanho } from "@/lib/arquivos";
import { getMateria, MATERIAS } from "@/lib/edital";
import { createClient, MODO_DEMO } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Arquivo" };

const UMA_HORA = 60 * 60;

export default async function ArquivoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (MODO_DEMO || !/^[0-9a-f-]{36}$/.test(id)) notFound();
  const supabase = await createClient();
  // A RLS só devolve o arquivo se for da usuária ou compartilhado com a família.
  const { data: arquivo } = await supabase
    .from("arquivos")
    .select("id, nome, caminho, tipo, bytes, materia_slug, topico_id")
    .eq("id", id)
    .maybeSingle();
  if (!arquivo) notFound();

  const extensao = arquivo.caminho.split(".").pop();
  const [ver, baixar] = await Promise.all([
    supabase.storage.from(BUCKET).createSignedUrl(arquivo.caminho, UMA_HORA),
    supabase.storage.from(BUCKET).createSignedUrl(arquivo.caminho, UMA_HORA, { download: `${arquivo.nome}.${extensao}` }),
  ]);
  if (!ver.data || !baixar.data) notFound();
  const topico = MATERIAS.flatMap((m) => m.topicos).find((t) => t.id === arquivo.topico_id);
  const ehPdf = arquivo.tipo === "application/pdf";

  return (
    <>
      <Link href="/arquivos" className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Arquivos
      </Link>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight break-words">{arquivo.nome}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {formatarTamanho(arquivo.bytes)}
            {arquivo.materia_slug && ` · ${getMateria(arquivo.materia_slug)?.nome ?? ""}`}
            {topico && (
              <>
                {" · "}
                <Link href={`/topico/${topico.id}`} className="text-primary hover:underline">
                  {topico.titulo}
                </Link>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <a href={ver.data.signedUrl} target="_blank" rel="noreferrer">
              <ExternalLink /> Abrir
            </a>
          </Button>
          <Button asChild variant="secondary">
            <a href={baixar.data.signedUrl}>
              <Download /> Baixar
            </a>
          </Button>
        </div>
      </div>
      {ehPdf ? (
        <>
          {/* No celular o PDF abre melhor no leitor do aparelho (botão Abrir). */}
          <iframe src={ver.data.signedUrl} title={arquivo.nome} className="hidden h-[80dvh] w-full rounded-lg border md:block" />
          <p className="text-sm text-muted-foreground md:hidden">Toque em Abrir para ler o PDF no leitor do celular.</p>
        </>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- URL assinada temporária do Storage
        <img src={ver.data.signedUrl} alt={arquivo.nome} className="max-h-[80dvh] w-auto rounded-lg border" />
      )}
    </>
  );
}
