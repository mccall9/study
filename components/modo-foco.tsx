"use client";

import { Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CHAVE = "estudos:foco";

function lerFoco(): boolean {
  try {
    return localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

/**
 * Durante o treino: no celular a barra de navegação some para dar lugar aos botões de
 * resposta (data-treino); no computador, o botão esconde a barra lateral (data-foco).
 */
export function ModoFoco() {
  const [foco, setFoco] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    html.dataset.treino = "1";
    setFoco(lerFoco());
    return () => {
      delete html.dataset.treino;
      delete html.dataset.foco;
    };
  }, []);

  useEffect(() => {
    if (foco) document.documentElement.dataset.foco = "1";
    else delete document.documentElement.dataset.foco;
  }, [foco]);

  function alternar() {
    const novo = !foco;
    setFoco(novo);
    try {
      localStorage.setItem(CHAVE, novo ? "1" : "0");
    } catch {
      // sem armazenamento: vale só nesta página
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="hidden text-muted-foreground md:inline-flex"
      onClick={alternar}
      aria-pressed={foco}
    >
      {foco ? <Minimize2 /> : <Maximize2 />} {foco ? "Sair do modo foco" : "Modo foco"}
    </Button>
  );
}
