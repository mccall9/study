"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const CHAVE_FONTE = "estudos:fonte";
const TAMANHOS = [87.5, 100, 112.5, 125, 137.5];

/** A− / A+ : muda o tamanho de todo o texto (font-size do <html>; o app usa rem). */
export function TamanhoLetra({ className }: { className?: string }) {
  const [tamanho, setTamanho] = useState(100);

  useEffect(() => {
    try {
      const salvo = Number(localStorage.getItem(CHAVE_FONTE));
      if (TAMANHOS.includes(salvo)) setTamanho(salvo);
    } catch {
      // sem armazenamento: fica no padrão
    }
  }, []);

  function mudar(delta: number) {
    const i = Math.min(TAMANHOS.length - 1, Math.max(0, TAMANHOS.indexOf(tamanho) + delta));
    const novo = TAMANHOS[i];
    setTamanho(novo);
    document.documentElement.style.fontSize = `${novo}%`;
    try {
      localStorage.setItem(CHAVE_FONTE, String(novo));
    } catch {
      // ignora
    }
  }

  const botao = "flex size-9 items-center justify-center rounded-md font-semibold hover:bg-muted disabled:opacity-40";
  return (
    <div className={cn("flex items-center", className)} role="group" aria-label="Tamanho da letra">
      <button type="button" className={cn(botao, "text-xs")} onClick={() => mudar(-1)} disabled={tamanho === TAMANHOS[0]} aria-label="Diminuir letra">
        A−
      </button>
      <button type="button" className={cn(botao, "text-base")} onClick={() => mudar(1)} disabled={tamanho === TAMANHOS.at(-1)} aria-label="Aumentar letra">
        A+
      </button>
    </div>
  );
}
