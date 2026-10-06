"use client";

import { Check, CircleCheck, Highlighter, Loader2, NotebookPen, Star, TriangleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { anotar, marcar } from "@/app/actions-marcacoes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/form";
import { LIMITE_ANOTACAO, type TipoMarcacao } from "@/lib/marcacoes";
import { cn } from "@/lib/utils";

const VISUAL: Record<TipoMarcacao, { icone: typeof Star; desligado: string; ligado: string; cor: string }> = {
  favorito: { icone: Star, desligado: "Favoritar", ligado: "Favorita", cor: "text-amber-500 [&_svg]:fill-amber-400" },
  destaque: { icone: Highlighter, desligado: "Grifar", ligado: "Grifado", cor: "text-amber-600" },
  reportado: { icone: TriangleAlert, desligado: "Reportar erro", ligado: "Erro reportado", cor: "text-destructive" },
  assistido: { icone: CircleCheck, desligado: "Marcar como assistida", ligado: "Assistida", cor: "text-status-questoes" },
};

/** Botão que liga/desliga uma marcação, com atualização otimista. */
export function BotaoMarcacao({
  alvo,
  tipo,
  inicial,
  compacto = false,
  onMudar,
  className,
}: {
  alvo: string;
  tipo: TipoMarcacao;
  inicial: boolean;
  compacto?: boolean;
  onMudar?: (ligado: boolean) => void;
  className?: string;
}) {
  const [ligado, setLigado] = useState(inicial);
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, start] = useTransition();
  const v = VISUAL[tipo];
  const Icone = v.icone;
  const rotulo = ligado ? v.ligado : v.desligado;

  function alternar() {
    const novo = !ligado;
    setLigado(novo);
    onMudar?.(novo);
    setErro(null);
    start(async () => {
      const r = await marcar(alvo, tipo, novo);
      if (r.erro) {
        setLigado(r.ligado);
        onMudar?.(r.ligado);
        setErro(r.erro);
      }
    });
  }

  return (
    <span className="inline-flex flex-col">
      <Button
        type="button"
        variant="ghost"
        size={compacto ? "icon" : "sm"}
        aria-pressed={ligado}
        aria-label={compacto ? rotulo : undefined}
        title={rotulo}
        disabled={pendente}
        onClick={alternar}
        className={cn("text-muted-foreground", ligado && v.cor, className)}
      >
        <Icone />
        {!compacto && rotulo}
      </Button>
      {erro && <span className="text-xs text-destructive">{erro}</span>}
    </span>
  );
}

/** Caixa de anotação pessoal: salva ao clicar em Salvar (texto vazio apaga). */
export function Anotacao({
  alvo,
  inicial,
  placeholder = "Escreva aqui o que quer lembrar…",
  aberta = false,
}: {
  alvo: string;
  inicial: string;
  placeholder?: string;
  aberta?: boolean;
}) {
  const [texto, setTexto] = useState(inicial);
  const [salvo, setSalvo] = useState(inicial);
  const [editando, setEditando] = useState(aberta || inicial !== "");
  const [erro, setErro] = useState<string | null>(null);
  const [pendente, start] = useTransition();
  const mudou = texto.trim() !== salvo.trim();

  if (!editando) {
    return (
      <Button type="button" variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setEditando(true)}>
        <NotebookPen /> Anotar
      </Button>
    );
  }

  function salvar() {
    setErro(null);
    start(async () => {
      const r = await anotar(alvo, texto);
      if (r.erro) setErro(r.erro);
      else setSalvo(texto.trim());
    });
  }

  return (
    <div className="w-full space-y-2">
      <label className="flex items-center gap-1.5 text-sm font-medium">
        <NotebookPen className="size-4 text-primary" /> Minha anotação
      </label>
      <Textarea
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder={placeholder}
        maxLength={LIMITE_ANOTACAO}
        rows={3}
        className="text-sm"
      />
      <div className="flex items-center gap-3">
        <Button type="button" size="sm" variant="secondary" disabled={!mudou || pendente} onClick={salvar}>
          {pendente ? <Loader2 className="animate-spin" /> : <Check />} Salvar
        </Button>
        {!mudou && salvo && <span className="text-xs text-muted-foreground">Salva</span>}
        {erro && <span className="text-xs text-destructive">{erro}</span>}
      </div>
    </div>
  );
}
