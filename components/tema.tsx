"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const CHAVE = "estudos:tema";
type Tema = "claro" | "escuro" | "auto";
const PROXIMO: Record<Tema, Tema> = { claro: "escuro", escuro: "auto", auto: "claro" };
const ROTULO: Record<Tema, string> = { claro: "Tema claro", escuro: "Tema escuro", auto: "Tema automático (segue o aparelho)" };
const ICONE = { claro: Sun, escuro: Moon, auto: Monitor };

function aplicar(tema: Tema) {
  const escuro = tema === "escuro" || (tema === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.dataset.tema = escuro ? "escuro" : "claro";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", escuro ? "#1a1b1f" : "#fbfcfd");
}

/** Alterna claro → escuro → automático. Claro é o padrão; a escolha fica salva no aparelho. */
export function BotaoTema({ className }: { className?: string }) {
  const [tema, setTema] = useState<Tema>("claro");

  useEffect(() => {
    try {
      const salvo = localStorage.getItem(CHAVE);
      if (salvo === "escuro" || salvo === "auto") setTema(salvo);
    } catch {
      // sem armazenamento: fica no claro
    }
  }, []);

  // No automático, acompanha o aparelho quando ele muda de claro para escuro (e vice-versa).
  useEffect(() => {
    if (tema !== "auto") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const mudou = () => aplicar("auto");
    mq.addEventListener("change", mudou);
    return () => mq.removeEventListener("change", mudou);
  }, [tema]);

  function alternar() {
    const novo = PROXIMO[tema];
    setTema(novo);
    aplicar(novo);
    try {
      localStorage.setItem(CHAVE, novo);
    } catch {
      // vale só até fechar a página
    }
  }

  const Icone = ICONE[tema];
  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={`${ROTULO[tema]}. Toque para trocar.`}
      title={ROTULO[tema]}
      className={cn("flex size-9 items-center justify-center rounded-md hover:bg-muted", className)}
    >
      <Icone className="size-4" />
    </button>
  );
}
