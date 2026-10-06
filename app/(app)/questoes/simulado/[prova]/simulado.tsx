"use client";

import { Check, Flag, Play, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { Placar } from "@/components/placar";
import { Enunciado, TextoDeApoio } from "@/components/questao";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getMateria } from "@/lib/edital";
import { resumo, type ItemAberto, type Pacote } from "@/lib/questoes-logica";
import { formatarDuracao } from "@/lib/stats";
import { cn } from "@/lib/utils";
import { finalizarSimulado, type ResultadoSimulado } from "../../actions";

type Salvo = { iniciadoEm: string; marcadas: Record<string, "C" | "E"> };

function ler(chave: string): Salvo | null {
  try {
    const raw = localStorage.getItem(chave);
    return raw ? (JSON.parse(raw) as Salvo) : null;
  } catch {
    return null;
  }
}

function gravar(chave: string, salvo: Salvo | null) {
  try {
    if (salvo) localStorage.setItem(chave, JSON.stringify(salvo));
    else localStorage.removeItem(chave);
  } catch {
    // sem armazenamento: o simulado só não sobrevive a recarregar a página
  }
}

function relogio(seg: number) {
  const h = Math.floor(seg / 3600);
  const m = Math.floor((seg % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${h}:${pad(m)}:${pad(seg % 60)}`;
}

/** Agrupa itens seguidos que compartilham texto de apoio e comando. */
function agrupar(itens: ItemAberto[]) {
  const grupos: { texto: number | null; comando: string; itens: ItemAberto[] }[] = [];
  for (const item of itens) {
    const ultimo = grupos.at(-1);
    if (ultimo && ultimo.texto === item.texto && ultimo.comando === item.comando) ultimo.itens.push(item);
    else grupos.push({ texto: item.texto, comando: item.comando, itens: [item] });
  }
  return grupos;
}

export function Simulado({
  provaId,
  nome,
  pacote,
  observacao,
}: {
  provaId: string;
  nome: string;
  pacote: Pacote;
  observacao: string;
}) {
  const chave = `estudos:simulado:${provaId}`;
  const [salvo, setSalvo] = useState<Salvo | null>(null);
  const [carregado, setCarregado] = useState(false);
  const [agora, setAgora] = useState(() => Date.now());
  const [resultado, setResultado] = useState<ResultadoSimulado | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, startEnvio] = useTransition();
  const grupos = useMemo(() => agrupar(pacote.itens), [pacote.itens]);

  useEffect(() => {
    setSalvo(ler(chave));
    setCarregado(true);
  }, [chave]);

  useEffect(() => {
    if (carregado && !resultado) gravar(chave, salvo);
  }, [chave, salvo, carregado, resultado]);

  const emAndamento = salvo !== null && !resultado;
  useEffect(() => {
    if (!emAndamento) return;
    const id = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(id);
  }, [emAndamento]);

  function iniciar() {
    setAgora(Date.now());
    setSalvo({ iniciadoEm: new Date().toISOString(), marcadas: {} });
  }

  function marcar(id: string, v: "C" | "E") {
    setSalvo((s) => {
      if (!s) return s;
      const marcadas = { ...s.marcadas };
      if (marcadas[id] === v) delete marcadas[id]; // tocar de novo desmarca (volta a ficar em branco)
      else marcadas[id] = v;
      return { ...s, marcadas };
    });
  }

  function finalizar() {
    if (!salvo) return;
    const brancos = pacote.itens.length - Object.keys(salvo.marcadas).length;
    const aviso = brancos > 0 ? `\n\n${brancos} ${brancos === 1 ? "item está" : "itens estão"} em branco.` : "";
    if (!confirm(`Finalizar o simulado e ver a correção?${aviso}`)) return;
    setErro(null);
    startEnvio(async () => {
      const r = await finalizarSimulado(provaId, salvo.marcadas, salvo.iniciadoEm);
      if ("correcao" in r && !r.erro) {
        setResultado(r);
        gravar(chave, null);
        window.scrollTo({ top: 0 });
      } else {
        setErro(r.erro ?? "Não foi possível finalizar.");
      }
    });
  }

  if (resultado) return <Resultado nome={nome} pacote={pacote} resultado={resultado} />;

  if (!carregado) return null;

  if (!salvo) {
    return (
      <Card className="mx-auto max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">Simulado · {nome}</CardTitle>
          <CardDescription>{observacao}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Marque Certo ou Errado em cada item. Se não tiver segurança, deixe em branco.</li>
            <li>Na correção, cada errada anula uma certa, como no Cebraspe.</li>
            <li>O cronômetro começa agora e continua se você fechar a página.</li>
          </ul>
          <Button size="lg" className="w-full" onClick={iniciar}>
            <Play /> Começar simulado
          </Button>
        </CardContent>
      </Card>
    );
  }

  const decorrido = Math.max(0, Math.floor((agora - Date.parse(salvo.iniciadoEm)) / 1000));
  const marcadas = Object.keys(salvo.marcadas).length;

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="sticky top-0 z-10 -mx-4 flex items-center justify-between gap-3 border-b bg-background/95 px-4 py-2.5 backdrop-blur md:top-0">
        <div className="text-sm">
          <p className="font-semibold tabular-nums">{relogio(decorrido)}</p>
          <p className="text-xs text-muted-foreground tabular-nums">
            {marcadas} de {pacote.itens.length} marcados
          </p>
        </div>
        <Button onClick={finalizar} disabled={enviando}>
          <Flag /> {enviando ? "Corrigindo…" : "Finalizar"}
        </Button>
      </div>
      {erro && <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{erro}</p>}

      {grupos.map((g) => (
        <section key={g.itens[0].id} className="space-y-3">
          {g.texto !== null && <TextoDeApoio texto={pacote.textos[g.texto]} aberto />}
          <p className="text-sm text-muted-foreground">{g.comando}</p>
          <Card className="divide-y">
            {g.itens.map((item) => (
              <div key={item.id} className="space-y-3 p-4">
                <Enunciado comando="" enunciado={item.enunciado} numero={item.numero} />
                <div className="flex gap-2">
                  {(["C", "E"] as const).map((v) => (
                    <Button
                      key={v}
                      variant="outline"
                      size="sm"
                      aria-pressed={salvo.marcadas[item.id] === v}
                      onClick={() => marcar(item.id, v)}
                      className={cn(
                        "w-24",
                        salvo.marcadas[item.id] === v && "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
                      )}
                    >
                      {v === "C" ? <Check /> : <X />} {v === "C" ? "Certo" : "Errado"}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </Card>
        </section>
      ))}

      <Button size="lg" className="w-full" onClick={finalizar} disabled={enviando}>
        <Flag /> {enviando ? "Corrigindo…" : "Finalizar simulado"}
      </Button>
    </div>
  );
}

function Resultado({ nome, pacote, resultado }: { nome: string; pacote: Pacote; resultado: ResultadoSimulado }) {
  const [soErros, setSoErros] = useState(true);
  const porMateria = useMemo(() => {
    const mapa = new Map<string, { correta: boolean | null }[]>();
    for (const item of pacote.itens) {
      const c = resultado.correcao[item.id];
      if (c) mapa.set(item.materia, [...(mapa.get(item.materia) ?? []), c]);
    }
    return [...mapa.entries()].map(([materia, cs]) => ({ materia, ...resumo(cs) }));
  }, [pacote.itens, resultado.correcao]);

  const revisao = pacote.itens.filter((i) => !soErros || resultado.correcao[i.id]?.correta !== true);

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <Card>
        <CardContent className="space-y-5 pt-5 text-center">
          <div>
            <p className="text-sm text-muted-foreground">Resultado · {nome}</p>
            <p className="mt-2 text-5xl font-bold tabular-nums">{resultado.nota}</p>
            <p className="text-sm text-muted-foreground">
              nota líquida de {resultado.total} itens · {formatarDuracao(resultado.duracaoSeg)} de prova
            </p>
          </div>
          <Placar certas={resultado.certas} erradas={resultado.erradas} brancos={resultado.brancos} />
          {resultado.aviso && <p className="text-xs text-muted-foreground">{resultado.aviso}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Por matéria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y text-sm">
            {porMateria.map((m) => (
              <div key={m.materia} className="flex items-center justify-between gap-3 py-2">
                <span className="min-w-0 truncate">{getMateria(m.materia)?.nome ?? m.materia}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  <span className="text-status-questoes">{m.certas}✓</span>{" "}
                  <span className="text-destructive">{m.erradas}✗</span> {m.brancos}○ ·{" "}
                  <strong className="text-foreground">{m.nota}</strong>
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Revisão</h2>
        <Button variant="ghost" size="sm" onClick={() => setSoErros((v) => !v)}>
          {soErros ? "Mostrar todos os itens" : "Só erros e brancos"}
        </Button>
      </div>
      <Card className="divide-y">
        {revisao.length === 0 && <p className="p-4 text-sm text-muted-foreground">Nenhum erro. Parabéns!</p>}
        {revisao.map((item) => {
          const c = resultado.correcao[item.id];
          return (
            <div key={item.id} className="space-y-2 p-4">
              <Enunciado comando="" enunciado={item.enunciado} numero={item.numero} />
              <p className="text-sm">
                Gabarito: <strong>{c.gabarito === "C" ? "Certo" : "Errado"}</strong> · Você:{" "}
                <strong
                  className={cn(c.correta === true && "text-status-questoes", c.correta === false && "text-destructive")}
                >
                  {c.resposta === "B" ? "em branco" : c.resposta === "C" ? "Certo" : "Errado"}
                </strong>
              </p>
              {item.observacao && <p className="text-xs text-muted-foreground">{item.observacao}</p>}
            </div>
          );
        })}
      </Card>

      <div className="grid gap-2 sm:grid-cols-2">
        <Button asChild variant="outline">
          <Link href="/questoes">Voltar</Link>
        </Button>
        <Button asChild>
          <Link href="/questoes/treino?situacao=erros">Treinar o caderno de erros</Link>
        </Button>
      </div>
    </div>
  );
}
