import { Scale } from "lucide-react";
import Link from "next/link";
import type { Comentario } from "@/lib/comentarios";

/** Os comentários marcam ênfase como no Markdown (*palavra*). */
function comEnfase(texto: string) {
  return texto.split(/\*([^*]+)\*/g).map((parte, i) => (i % 2 ? <em key={i}>{parte}</em> : parte));
}

/** Explicação do gabarito com os artigos da lei (link para a lei seca). */
export function ComentarioQuestao({ comentario }: { comentario: Comentario }) {
  return (
    <div className="space-y-2 rounded-lg border bg-card p-4 text-sm">
      <p className="font-semibold">Por quê?</p>
      <p className="leading-relaxed whitespace-pre-line">{comEnfase(comentario.texto)}</p>
      {comentario.base.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {comentario.base.map((b) => (
            <Link
              key={`${b.lei}-${b.ancora}`}
              href={b.href}
              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/15"
            >
              <Scale className="size-3" /> {b.rotulo}
            </Link>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">Comentário escrito com apoio de IA. Confira sempre na lei.</p>
    </div>
  );
}
