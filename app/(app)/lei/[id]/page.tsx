import { ArrowLeft, ExternalLink, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArtigoLei } from "@/components/lei-texto";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/form";
import { questoesPorArtigo } from "@/lib/comentarios";
import { carregarLei } from "@/lib/leis";
import { artigosDaLei, buscar, normalizar, rotularAncora } from "@/lib/leis-logica";
import { getLeiMeta } from "@/lib/leis-meta";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ q?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getLeiMeta((await params).id)?.curto ?? "Lei" };
}

const DATA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });

function Destacado({ texto, termo }: { texto: string; termo: string }) {
  // Marca o termo buscado ignorando acentos: acha a posição no texto normalizado (mesmo tamanho).
  const alvo = normalizar(termo.trim());
  const base = normalizar(texto);
  const partes: React.ReactNode[] = [];
  let i = 0;
  let j = base.indexOf(alvo);
  while (alvo && j >= 0) {
    partes.push(texto.slice(i, j), <mark key={j} className="rounded-sm bg-status-estudado/40 px-0.5 text-foreground">{texto.slice(j, j + alvo.length)}</mark>);
    i = j + alvo.length;
    j = base.indexOf(alvo, i);
  }
  partes.push(texto.slice(i));
  return <>{partes}</>;
}

export default async function LeiPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { q } = await searchParams;
  const [lei, caiu] = await Promise.all([carregarLei(id), questoesPorArtigo(id)]);
  if (!lei) notFound();
  const meta = getLeiMeta(id);
  const ids = new Set(artigosDaLei(lei).map((a) => a.id));
  const termo = q?.trim() ?? "";
  const resultados = termo ? buscar(lei, termo) : null;
  const cabecalhos = lei.blocos.filter((b) => b.t === "h" && b.n <= 3);

  return (
    <>
      <Link
        href="/materiais"
        className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> Materiais
      </Link>
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight">{meta?.curto ?? lei.curto}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{meta?.nome ?? lei.nome}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
          <span>Texto compilado do Planalto, importado em {DATA.format(new Date(lei.importado_em))}</span>
          <a href={lei.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
            Ver no Planalto <ExternalLink className="size-3" />
          </a>
        </p>
      </div>

      <form className="mb-4 flex gap-2" action={`/lei/${id}`}>
        <Input name="q" defaultValue={termo} placeholder="Buscar na lei (ex.: habeas data)" aria-label="Buscar na lei" />
        <Button type="submit" variant="secondary" aria-label="Buscar">
          <Search />
        </Button>
      </form>

      {resultados ? (
        <Card className="divide-y">
          <p className="px-4 py-3 text-sm text-muted-foreground">
            {resultados.length === 0
              ? `Nada encontrado para "${termo}".`
              : `${resultados.length}${resultados.length === 80 ? "+" : ""} trechos com "${termo}"`}
            {" · "}
            <Link href={`/lei/${id}`} className="text-primary hover:underline">
              ver a lei inteira
            </Link>
          </p>
          {resultados.map(({ artigo, dispositivo }) => (
            <Link key={dispositivo.id} href={`/lei/${id}#${dispositivo.id}`} className="block px-4 py-3 hover:bg-muted/50">
              <p className="text-xs font-medium text-primary">{rotularAncora(dispositivo.id, ids)}</p>
              <p className="mt-1 text-sm leading-relaxed">
                <Destacado texto={dispositivo.x} termo={termo} />
              </p>
              {artigo.rotulo && <p className="mt-1 text-xs text-muted-foreground">{artigo.rotulo}</p>}
            </Link>
          ))}
        </Card>
      ) : (
        <>
          {cabecalhos.length > 0 && (
            <details className="mb-4 rounded-lg border bg-card">
              <summary className="cursor-pointer px-4 py-3 text-sm font-medium select-none">Sumário</summary>
              <nav className="max-h-[60vh] space-y-1 overflow-y-auto px-4 pb-4 text-sm">
                {lei.blocos.map((b, i) =>
                  b.t === "h" && b.n <= 3 ? (
                    <a
                      key={i}
                      href={`#h${i}`}
                      className={`block rounded px-2 py-1 hover:bg-muted ${b.n === 3 ? "pl-6 text-muted-foreground" : "font-medium"}`}
                    >
                      {b.x}
                      {b.s && <span className="font-normal"> · {b.s}</span>}
                    </a>
                  ) : null,
                )}
              </nav>
            </details>
          )}
          <Card className="px-4 sm:px-6">
            <div className="divide-y [content-visibility:auto]">
              {lei.blocos.map((b, i) =>
                b.t === "h" ? (
                  <div key={i} id={`h${i}`} className="scroll-mt-20 pt-5 pb-2 text-center">
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{b.x}</p>
                    {b.s && <p className="text-sm font-semibold">{b.s}</p>}
                  </div>
                ) : (
                  <ArtigoLei key={b.id} artigo={b} leiId={id} caiu={caiu.get(b.id)} />
                ),
              )}
            </div>
          </Card>
        </>
      )}
    </>
  );
}
