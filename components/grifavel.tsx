"use client";

import { useState } from "react";
import { BotaoMarcacao } from "@/components/marcacao";
import { cn } from "@/lib/utils";

/** Artigo da lei seca que a usuária pode grifar (fundo amarelo, salvo na conta dela). */
export function Grifavel({ alvo, inicial, children }: { alvo: string; inicial: boolean; children: React.ReactNode }) {
  const [grifado, setGrifado] = useState(inicial);
  return (
    <div
      data-grifado={grifado || undefined}
      className={cn("relative -mx-2 rounded-md px-2 pr-10 transition-colors", grifado && "bg-amber-100/80 dark:bg-amber-400/15")}
    >
      <div className="absolute top-2 right-0">
        <BotaoMarcacao alvo={alvo} tipo="destaque" inicial={inicial} compacto onMudar={setGrifado} />
      </div>
      {children}
    </div>
  );
}
