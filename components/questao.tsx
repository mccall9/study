import { separarAssertiva } from "@/lib/questoes-logica";
import { cn } from "@/lib/utils";

/** Texto de apoio recolhível; os parágrafos vêm separados por \n. */
export function TextoDeApoio({ texto, aberto }: { texto: string; aberto: boolean }) {
  const [primeira, ...resto] = texto.split("\n");
  const titulo = /^Texto\s+\S+$/.test(primeira) ? primeira : "Texto de apoio";
  const paragrafos = titulo === primeira ? resto : [primeira, ...resto];
  return (
    <details open={aberto} className="group rounded-lg border bg-muted/40">
      <summary className="cursor-pointer list-none px-4 py-2.5 text-sm font-medium text-muted-foreground select-none">
        <span className="group-open:hidden">▸ Mostrar {titulo.toLowerCase()}</span>
        <span className="hidden group-open:inline">▾ {titulo}</span>
      </summary>
      <div className="space-y-3 px-4 pb-4 text-[15px] leading-relaxed">
        {paragrafos.map((p, i) => (
          <p key={i} className={cn(/\(com adaptações\)|Internet:|^</.test(p) && "text-right text-xs text-muted-foreground")}>
            {p}
          </p>
        ))}
      </div>
    </details>
  );
}

export function Enunciado({ comando, enunciado, numero }: { comando: string; enunciado: string; numero?: number }) {
  const { situacao, assertiva } = separarAssertiva(enunciado);
  return (
    <div className="space-y-3">
      {comando && <p className="text-sm text-muted-foreground">{comando}</p>}
      {situacao && (
        <p className="text-[15px] leading-relaxed">
          <span className="font-semibold">Situação hipotética: </span>
          {situacao}
        </p>
      )}
      <p className="text-base leading-relaxed font-medium">
        {numero !== undefined && <span className="mr-1.5 text-muted-foreground tabular-nums">{numero}.</span>}
        {situacao && <span className="font-semibold">Assertiva: </span>}
        {assertiva}
      </p>
    </div>
  );
}
