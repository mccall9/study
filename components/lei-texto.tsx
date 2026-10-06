import Link from "next/link";
import { Grifavel } from "@/components/grifavel";
import type { Artigo, Dispositivo } from "@/lib/leis-logica";
import { alvoArtigo } from "@/lib/marcacoes";
import { cn } from "@/lib/utils";

/** Recuo do dispositivo pelo tipo: caput e §, inciso, alínea. */
function recuo(d: Dispositivo, artigo: Artigo): string {
  if (d.id === artigo.id) return "";
  const ultima = d.id.split("-").at(-1) ?? "";
  if (/^(p\d+(_[a-z])?|pu|n\d+)$/.test(ultima) || ultima === "txt") return "";
  if (/^[a-z]$/.test(ultima) && /-[ivxlc]+(_[a-z])?-[a-z]$/.test(d.id)) return "pl-8";
  return "pl-4";
}

export type QuestaoQueCaiu = { id: string; rotulo: string };

export function ArtigoLei({
  artigo,
  leiId,
  caiu = [],
  destaque,
  compacto = false,
  grifado,
}: {
  artigo: Artigo;
  leiId: string;
  caiu?: QuestaoQueCaiu[];
  destaque?: string;
  compacto?: boolean;
  /** Se informado, mostra o botão de grifar (true = já grifado pela usuária). */
  grifado?: boolean;
}) {
  const conteudo = (
    <article id={artigo.id} className="scroll-mt-20 space-y-1.5 py-3">
      {artigo.rotulo && <p className="text-sm font-semibold">{artigo.rotulo}</p>}
      {artigo.d.map((d, i) => (
        <p
          key={d.id}
          id={d.id === artigo.id ? undefined : d.id}
          data-ancora={`${leiId}:${d.id}`}
          className={cn(
            "scroll-mt-20 rounded-sm leading-relaxed",
            compacto ? "text-sm" : "text-[15px]",
            recuo(d, artigo),
            i === 0 && !artigo.rotulo && "font-medium",
            destaque === d.id && "bg-status-estudado/25 ring-4 ring-status-estudado/25",
          )}
        >
          {d.x}
        </p>
      ))}
      {caiu.length > 0 && (
        <p className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">Caiu na prova</span>
          {caiu.map((q) => (
            <Link key={q.id} href={`/questoes/treino?ids=${q.id}`} className="text-primary underline-offset-2 hover:underline">
              {q.rotulo}
            </Link>
          ))}
        </p>
      )}
    </article>
  );
  if (grifado === undefined) return conteudo;
  return (
    <Grifavel alvo={alvoArtigo(leiId, artigo.id)} inicial={grifado}>
      {conteudo}
    </Grifavel>
  );
}
