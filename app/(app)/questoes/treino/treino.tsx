"use client";

import { Check, CheckCircle2, Circle, CircleSlash, RotateCcw, X, XCircle } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useTransition } from "react";
import { ComentarioQuestao } from "@/components/comentario";
import { Anotacao, BotaoMarcacao } from "@/components/marcacao";
import { ModoFoco } from "@/components/modo-foco";
import { Placar } from "@/components/placar";
import { Enunciado, TextoDeApoio } from "@/components/questao";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/form";
import { CONFIANCA_LABEL, CONFIANCAS, type Confianca } from "@/lib/confianca";
import { getMateria } from "@/lib/edital";
import { alvoQuestao } from "@/lib/marcacoes";
import { resumo, type Pacote, type RespostaValor } from "@/lib/questoes-logica";
import { cn } from "@/lib/utils";
import { responder, type Correcao } from "../actions";

const NOME_RESPOSTA: Record<"C" | "E", string> = { C: "Certo", E: "Errado" };

const COR_CONFIANCA: Record<Confianca, string> = {
  certeza: "border-status-questoes bg-status-questoes/15 text-foreground",
  duvida: "border-amber-500 bg-amber-500/15 text-foreground",
  chute: "border-muted-foreground bg-muted text-foreground",
};

type Props = {
  pacote: Pacote;
  descricao: string;
  favoritas: string[];
  reportadas: string[];
  anotacoes: Record<string, string>;
};

export function Treino({ pacote, descricao, favoritas, reportadas, anotacoes }: Props) {
  const { itens, textos } = pacote;
  const [indice, setIndice] = useState(0);
  const [marcada, setMarcada] = useState<RespostaValor | null>(null);
  // O nível de confiança fica escolhido de uma questão para a outra; um toque no mesmo nível desmarca.
  const [confianca, setConfianca] = useState<Confianca | null>(null);
  const [correcao, setCorrecao] = useState<Correcao | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [placar, setPlacar] = useState<{ correta: boolean | null }[]>([]);
  const [enviando, startEnvio] = useTransition();
  const resultadoRef = useRef<HTMLDivElement>(null);

  const item = itens[indice];
  const fim = indice >= itens.length;

  const marcar = useCallback(
    (resposta: RespostaValor) => {
      if (!item || correcao || enviando) return;
      setMarcada(resposta);
      setErro(null);
      startEnvio(async () => {
        const r = await responder(item.id, resposta, confianca);
        if ("gabarito" in r) {
          setCorrecao(r);
          setPlacar((p) => [...p, { correta: r.correta }]);
          if (r.erro) setErro(r.erro);
        } else {
          setMarcada(null);
          setErro(r.erro);
        }
      });
    },
    [item, correcao, enviando, confianca],
  );

  const proxima = useCallback(() => {
    setIndice((i) => i + 1);
    setMarcada(null);
    setCorrecao(null);
    setErro(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Depois de corrigir, traz o resultado para a vista (no celular ele pode ficar atrás dos botões).
  useEffect(() => {
    if (correcao) resultadoRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [correcao]);

  // Atalhos no computador: C, E, B para responder; 1, 2, 3 para a confiança; Enter para a próxima.
  // O listener é registrado uma vez e lê o estado atual pela ref, para não perder tecla logo após mudar de questão.
  const atalho = useRef<(e: KeyboardEvent) => void>(() => {});
  useLayoutEffect(() => {
    atalho.current = (e) => {
      const alvo = e.target as HTMLElement | null;
      if (e.ctrlKey || e.metaKey || e.altKey || alvo?.closest("input, textarea, select")) return;
      const k = e.key.toLowerCase();
      if (!correcao && (k === "c" || k === "e" || k === "b")) marcar(k.toUpperCase() as RespostaValor);
      else if (!correcao && (k === "1" || k === "2" || k === "3")) {
        const nivel = CONFIANCAS[Number(k) - 1];
        setConfianca((atual) => (atual === nivel ? null : nivel));
      }
      // Enter num botão focado já dispara o clique dele; não avança duas vezes.
      else if (correcao && k === "enter" && !alvo?.closest("button, a")) proxima();
    };
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => atalho.current(e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const r = resumo(placar);

  if (itens.length === 0) {
    return (
      <Card className="p-6 text-center">
        <p className="font-medium">Nenhuma questão com esse filtro.</p>
        <p className="mt-1 text-sm text-muted-foreground">{descricao}</p>
        <Button asChild className="mt-4">
          <Link href="/questoes">Escolher outro filtro</Link>
        </Button>
      </Card>
    );
  }

  if (fim) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardContent className="space-y-5 pt-5 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Treino concluído · {descricao}</p>
            <p className="mt-2 text-5xl font-bold tabular-nums">{r.nota}</p>
            <p className="text-sm text-muted-foreground">nota líquida (certas − erradas)</p>
          </div>
          <Placar certas={r.certas} erradas={r.erradas} brancos={r.brancos} />
          <p className="text-sm text-muted-foreground">
            Aproveitamento de <strong className="text-foreground">{r.aproveitamento}%</strong> nas que você marcou.
            {r.erradas + r.brancos > 0 && " As que você errou ou deixou em branco voltam na revisão de amanhã."}
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button asChild variant="outline">
              <Link href="/questoes">Voltar</Link>
            </Button>
            <Button asChild>
              <Link href="/questoes/treino?situacao=erros">
                <RotateCcw /> Refazer os erros
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const textoAnterior = indice > 0 ? itens[indice - 1].texto : null;
  const materia = getMateria(item.materia);
  const comTexto = item.texto !== null;
  const alvo = alvoQuestao(item.id);

  return (
    <div className={cn("mx-auto space-y-4", comTexto ? "max-w-2xl lg:max-w-6xl" : "max-w-2xl")}>
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3 text-sm">
          <span className="truncate text-muted-foreground">{descricao}</span>
          <span className="flex shrink-0 items-center gap-1">
            <ModoFoco />
            <span className="tabular-nums text-muted-foreground">
              {indice + 1} de {itens.length}
            </span>
          </span>
        </div>
        <Progress value={(indice / itens.length) * 100} />
        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="min-w-0 truncate">
            {materia?.nome} · {item.concurso} {item.provaId.split("-")[1]}, item {item.numero}
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {placar.length > 0 && (
              <span className="tabular-nums">
                <span className="text-status-questoes">{r.certas}✓</span>{" "}
                <span className="text-destructive">{r.erradas}✗</span> · nota {r.nota}
              </span>
            )}
            <BotaoMarcacao
              key={`fav-${item.id}`}
              alvo={alvo}
              tipo="favorito"
              inicial={favoritas.includes(item.id)}
              compacto
              className="-my-2 -mr-2"
            />
          </span>
        </div>
      </div>

      {/* No computador, texto à esquerda (com rolagem própria) e questão fixa à direita. */}
      <div className={cn("space-y-4", comTexto && "lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:space-y-0")}>
        {item.texto !== null && (
          <div className="lg:sticky lg:top-4 lg:max-h-[calc(100dvh-2rem)] lg:overflow-y-auto">
            <TextoDeApoio key={item.id} texto={textos[item.texto]} aberto={item.texto !== textoAnterior} />
          </div>
        )}

        <Card className={cn(comTexto && "lg:sticky lg:top-4")}>
          <CardContent className="space-y-5 pt-4 sm:pt-5">
            <Enunciado comando={item.comando} enunciado={item.enunciado} />

            {/* Celular: barra fixa embaixo, ao alcance do polegar. Computador: dentro do cartão. */}
            <div
              className={cn(
                "fixed inset-x-0 bottom-0 z-20 space-y-2 border-t bg-card/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur md:static md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none",
                // No computador, depois de corrigir, o botão "Próxima" fica no fim do cartão (abaixo).
                correcao && "md:hidden",
              )}
            >
              {!correcao ? (
                <>
                  <div className="flex items-center gap-2" role="group" aria-label="Nível de confiança">
                    <span className="text-xs text-muted-foreground">Confiança:</span>
                    {CONFIANCAS.map((nivel) => (
                      <button
                        key={nivel}
                        type="button"
                        aria-pressed={confianca === nivel}
                        onClick={() => setConfianca((atual) => (atual === nivel ? null : nivel))}
                        className={cn(
                          "h-8 flex-1 rounded-full border px-2 text-xs font-medium text-muted-foreground transition-colors md:flex-none md:px-3",
                          confianca === nivel && COR_CONFIANCA[nivel],
                        )}
                      >
                        {CONFIANCA_LABEL[nivel]}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    {(["C", "E"] as const).map((v) => (
                      <Button
                        key={v}
                        size="lg"
                        variant="outline"
                        disabled={enviando}
                        onClick={() => marcar(v)}
                        className={cn("h-14 text-base", marcada === v && "border-primary bg-accent")}
                      >
                        {v === "C" ? <Check /> : <X />} {NOME_RESPOSTA[v]}
                      </Button>
                    ))}
                    <Button
                      variant="ghost"
                      className="h-14 flex-col gap-0.5 px-3 text-xs text-muted-foreground"
                      disabled={enviando}
                      onClick={() => marcar("B")}
                      aria-label="Deixar em branco"
                    >
                      <Circle /> Branco
                    </Button>
                  </div>
                </>
              ) : (
                <Button size="lg" className="h-12 w-full" onClick={proxima}>
                  {indice + 1 < itens.length ? "Próxima questão" : "Ver resultado"}
                </Button>
              )}
            </div>

            {correcao && (
              <div ref={resultadoRef} className="scroll-mb-28 space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {(["C", "E"] as const).map((v) => (
                    <div
                      key={v}
                      className={cn(
                        "flex h-11 items-center justify-center gap-2 rounded-md border text-sm font-medium text-muted-foreground",
                        correcao.gabarito === v && "border-status-questoes bg-status-questoes/15 text-foreground",
                        marcada === v && correcao.correta === false && "border-destructive bg-destructive/10 text-foreground",
                      )}
                    >
                      {v === "C" ? <Check className="size-4" /> : <X className="size-4" />} {NOME_RESPOSTA[v]}
                      {marcada === v && <span className="text-xs font-normal">(sua)</span>}
                    </div>
                  ))}
                </div>
                <div
                  className={cn(
                    "space-y-2 rounded-lg p-4",
                    correcao.correta === true && "bg-status-questoes/15",
                    correcao.correta === false && "bg-destructive/10",
                    correcao.correta === null && "bg-muted",
                  )}
                >
                  <p className="flex items-center gap-2 font-semibold">
                    {correcao.correta === true && <CheckCircle2 className="size-5 text-status-questoes" />}
                    {correcao.correta === false && <XCircle className="size-5 text-destructive" />}
                    {correcao.correta === null && <CircleSlash className="size-5 text-muted-foreground" />}
                    {correcao.correta === true ? "Você acertou!" : correcao.correta === false ? "Você errou." : "Em branco."}{" "}
                    Gabarito: {correcao.gabarito === "C" ? "CERTO" : "ERRADO"}
                  </p>
                  {correcao.correta === null && (
                    <p className="text-sm text-muted-foreground">Em branco não ganha nem perde ponto.</p>
                  )}
                  {correcao.correta !== null && confianca && (
                    <p className="text-sm text-muted-foreground">Você marcou com {CONFIANCA_LABEL[confianca].toLowerCase()}.</p>
                  )}
                  {correcao.observacao && <p className="text-sm text-muted-foreground">{correcao.observacao}</p>}
                  {correcao.aviso && <p className="text-xs text-muted-foreground">{correcao.aviso}</p>}
                </div>
                {correcao.comentario && <ComentarioQuestao comentario={correcao.comentario} />}
                <div className="flex flex-wrap items-start gap-1 border-t pt-3">
                  <Anotacao key={`nota-${item.id}`} alvo={alvo} inicial={anotacoes[item.id] ?? ""} />
                  <BotaoMarcacao
                    key={`rep-${item.id}`}
                    alvo={alvo}
                    tipo="reportado"
                    inicial={reportadas.includes(item.id)}
                    className="ml-auto"
                  />
                </div>
              </div>
            )}
            {erro && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}
            {correcao && (
              <Button size="lg" className="hidden w-full md:inline-flex" onClick={proxima}>
                {indice + 1 < itens.length ? "Próxima questão" : "Ver resultado"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Espaço para a barra fixa de respostas no celular. */}
      <div className="h-10 md:hidden" aria-hidden />
      <p className="hidden text-center text-xs text-muted-foreground md:block">
        Atalhos: <kbd>C</kbd> certo · <kbd>E</kbd> errado · <kbd>B</kbd> em branco · <kbd>1</kbd> <kbd>2</kbd>{" "}
        <kbd>3</kbd> confiança · <kbd>Enter</kbd> próxima
      </p>
    </div>
  );
}
