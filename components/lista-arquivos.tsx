"use client";

import { FileImage, FileText, Trash2, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { apagarArquivo, compartilharArquivo } from "@/app/actions-arquivos";
import { Button } from "@/components/ui/button";
import { formatarTamanho, type Arquivo } from "@/lib/arquivos";
import { cn } from "@/lib/utils";

const DATA = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit", timeZone: "America/Sao_Paulo" });

export function ListaArquivos({
  arquivos,
  meuId,
  topicos,
  vazio = "Nenhum arquivo ainda.",
}: {
  arquivos: Arquivo[];
  meuId: string;
  /** id do tópico → título, para mostrar a que tópico o arquivo pertence */
  topicos?: Record<string, string>;
  vazio?: string;
}) {
  if (arquivos.length === 0) return <p className="text-sm text-muted-foreground">{vazio}</p>;
  return (
    <ul className="divide-y rounded-lg border">
      {arquivos.map((a) => (
        <ItemArquivo key={a.id} arquivo={a} meu={a.user_id === meuId} topico={a.topico_id ? topicos?.[a.topico_id] : undefined} />
      ))}
    </ul>
  );
}

function ItemArquivo({ arquivo, meu, topico }: { arquivo: Arquivo; meu: boolean; topico?: string }) {
  const router = useRouter();
  const [compartilhado, setCompartilhado] = useState(arquivo.compartilhado);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, start] = useTransition();
  const Icone = arquivo.tipo === "application/pdf" ? FileText : FileImage;

  function alternarCompartilhado() {
    const novo = !compartilhado;
    setCompartilhado(novo);
    setErro(null);
    start(async () => {
      const r = await compartilharArquivo(arquivo.id, novo);
      if (r.erro) {
        setCompartilhado(!novo);
        setErro(r.erro);
      }
    });
  }

  function apagar() {
    if (!confirm(`Apagar "${arquivo.nome}"? Não dá para desfazer.`)) return;
    setErro(null);
    start(async () => {
      const r = await apagarArquivo(arquivo.id);
      if (r.erro) setErro(r.erro);
      else router.refresh();
    });
  }

  return (
    <li className="flex items-start gap-3 p-3">
      <Icone className="mt-0.5 size-5 shrink-0 text-primary" />
      <div className="min-w-0 flex-1">
        <Link href={`/arquivos/${arquivo.id}`} className="block truncate font-medium hover:underline">
          {arquivo.nome}
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatarTamanho(arquivo.bytes)} · {DATA.format(new Date(arquivo.criado_em))}
          {topico && ` · ${topico}`}
          {!meu && " · compartilhado com você"}
        </p>
        {erro && <p className="mt-1 text-xs text-destructive">{erro}</p>}
      </div>
      {meu && (
        <div className="flex shrink-0 items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-pressed={compartilhado}
            aria-label={compartilhado ? "Compartilhado com a família (toque para deixar só seu)" : "Compartilhar com a família"}
            title={compartilhado ? "Compartilhado com a família" : "Só você vê"}
            disabled={pendente}
            onClick={alternarCompartilhado}
            className={cn("text-muted-foreground", compartilhado && "text-primary")}
          >
            <Users />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`Apagar ${arquivo.nome}`}
            disabled={pendente}
            onClick={apagar}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 />
          </Button>
        </div>
      )}
    </li>
  );
}
