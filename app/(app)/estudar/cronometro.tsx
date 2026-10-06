"use client";

import { Pause, Play, Square } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { salvarSessao } from "@/app/actions";
import { MateriaSelect } from "@/components/materia-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label, Textarea } from "@/components/ui/form";
import { getMateria } from "@/lib/edital";

const CHAVE = "estudos:cronometro";

type Estado = {
  materiaSlug: string;
  topicoId: string;
  primeiroInicio: string | null; // ISO; null = parado
  rodandoDesde: number | null; // epoch ms; null = pausado
  acumuladoMs: number;
};

const VAZIO: Estado = { materiaSlug: "", topicoId: "", primeiroInicio: null, rodandoDesde: null, acumuladoMs: 0 };

function ler(): Estado | null {
  try {
    const raw = localStorage.getItem(CHAVE);
    return raw ? (JSON.parse(raw) as Estado) : null;
  } catch {
    return null;
  }
}

function gravar(estado: Estado) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(estado));
  } catch {
    // sem armazenamento (aba anônima): o cronômetro só não sobrevive ao recarregar
  }
}

function decorrido(e: Estado, agora: number) {
  return e.acumuladoMs + (e.rodandoDesde ? agora - e.rodandoDesde : 0);
}

function relogio(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s % 60)}`;
}

export function Cronometro({ materiaSugerida }: { materiaSugerida: string | null }) {
  const [estado, setEstado] = useState<Estado>(VAZIO);
  const [carregado, setCarregado] = useState(false);
  const [agora, setAgora] = useState(() => Date.now());
  const [encerrando, setEncerrando] = useState(false);
  const [anotacao, setAnotacao] = useState("");
  const [mensagem, setMensagem] = useState<{ tipo: "ok" | "erro"; texto: string } | null>(null);
  const [salvando, startSalvar] = useTransition();

  // Restaura uma sessão em andamento (ou aplica a matéria sugerida na URL).
  useEffect(() => {
    const salvo = ler();
    if (salvo?.primeiroInicio) setEstado(salvo);
    else if (materiaSugerida) setEstado({ ...VAZIO, materiaSlug: materiaSugerida });
    else if (salvo) setEstado({ ...VAZIO, materiaSlug: salvo.materiaSlug, topicoId: salvo.topicoId });
    setCarregado(true);
  }, [materiaSugerida]);

  useEffect(() => {
    if (carregado) gravar(estado);
  }, [estado, carregado]);

  const rodando = estado.rodandoDesde !== null;
  useEffect(() => {
    if (!rodando) return;
    const id = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(id);
  }, [rodando]);

  const ms = decorrido(estado, agora);
  const ativo = estado.primeiroInicio !== null;

  useEffect(() => {
    if (!ativo) return;
    const titulo = document.title;
    document.title = `${relogio(ms)} · ${getMateria(estado.materiaSlug)?.nome ?? "Estudando"}`;
    return () => {
      document.title = titulo;
    };
  }, [ativo, ms, estado.materiaSlug]);

  function iniciar() {
    const t = Date.now();
    setAgora(t);
    setMensagem(null);
    setEstado((e) => ({
      ...e,
      primeiroInicio: e.primeiroInicio ?? new Date(t).toISOString(),
      rodandoDesde: t,
    }));
  }

  function pausar() {
    const t = Date.now();
    setAgora(t);
    setEstado((e) => ({ ...e, acumuladoMs: decorrido(e, t), rodandoDesde: null }));
  }

  function encerrar() {
    pausar();
    setEncerrando(true);
  }

  function descartar() {
    setEstado((e) => ({ ...VAZIO, materiaSlug: e.materiaSlug, topicoId: e.topicoId }));
    setEncerrando(false);
    setAnotacao("");
  }

  function salvar() {
    startSalvar(async () => {
      const r = await salvarSessao({
        materiaSlug: estado.materiaSlug,
        topicoId: estado.topicoId || null,
        inicio: estado.primeiroInicio!,
        duracaoSeg: Math.round(estado.acumuladoMs / 1000),
        anotacao,
      });
      if (r.erro) {
        setMensagem({ tipo: "erro", texto: r.erro });
        return;
      }
      setMensagem({ tipo: "ok", texto: `Sessão de ${relogio(estado.acumuladoMs)} salva. Bom trabalho!` });
      descartar();
    });
  }

  return (
    <Card>
      <CardContent className="space-y-5 pt-4 sm:pt-5">
        <MateriaSelect
          materiaSlug={estado.materiaSlug}
          topicoId={estado.topicoId}
          disabled={ativo}
          onChange={(materiaSlug, topicoId) => setEstado((e) => ({ ...e, materiaSlug, topicoId }))}
        />

        <div className="py-2 text-center">
          <p
            className={`font-mono text-6xl font-semibold tabular-nums tracking-tight sm:text-7xl ${
              ativo && !rodando ? "text-muted-foreground" : ""
            }`}
          >
            {relogio(carregado ? ms : 0)}
          </p>
          <p className="mt-1 h-5 text-sm text-muted-foreground">
            {ativo && (rodando ? "Estudando…" : "Pausado")}
          </p>
        </div>

        {encerrando ? (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="anotacao">O que estudou? (opcional)</Label>
              <Textarea
                id="anotacao"
                value={anotacao}
                onChange={(e) => setAnotacao(e.target.value)}
                placeholder="Ex.: art. 5º até o inciso XX, fiz 20 questões e errei 4"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={() => setEncerrando(false)} disabled={salvando}>
                Voltar
              </Button>
              <Button onClick={salvar} disabled={salvando}>
                {salvando ? "Salvando…" : "Salvar sessão"}
              </Button>
            </div>
            <button
              type="button"
              onClick={descartar}
              className="w-full text-center text-xs text-muted-foreground hover:text-destructive"
            >
              Descartar esta sessão
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {rodando ? (
              <Button size="lg" variant="secondary" onClick={pausar}>
                <Pause /> Pausar
              </Button>
            ) : (
              <Button size="lg" onClick={iniciar} disabled={!carregado || !estado.materiaSlug}>
                <Play /> {ativo ? "Continuar" : "Iniciar"}
              </Button>
            )}
            <Button size="lg" variant="outline" onClick={encerrar} disabled={!ativo}>
              <Square /> Encerrar
            </Button>
          </div>
        )}

        {mensagem && (
          <p
            className={`rounded-md p-3 text-sm ${
              mensagem.tipo === "ok" ? "bg-status-questoes/15 text-foreground" : "bg-destructive/10 text-destructive"
            }`}
          >
            {mensagem.texto}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
