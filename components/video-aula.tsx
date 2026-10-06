"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { BotaoMarcacao } from "@/components/marcacao";
import { alvoVideo } from "@/lib/marcacoes";
import type { Video } from "@/lib/videos";

/**
 * Videoaula do YouTube. Mostra só a miniatura e carrega o player (youtube-nocookie) ao tocar,
 * para a página abrir rápido no celular e não carregar rastreadores antes da hora.
 */
export function VideoAula({ video, assistida }: { video: Video; assistida: boolean }) {
  const [tocando, setTocando] = useState(false);
  return (
    <div className="space-y-2">
      <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
        {tocando ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0`}
            title={video.titulo}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setTocando(true)}
            className="group absolute inset-0 size-full"
            aria-label={`Assistir: ${video.titulo}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- miniatura externa do YouTube, sem otimização */}
            <img
              src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
              alt=""
              loading="lazy"
              className="size-full object-cover transition-opacity group-hover:opacity-90"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex size-14 items-center justify-center rounded-full bg-black/70 text-white shadow-lg transition-transform group-hover:scale-105">
                <Play className="ml-0.5 size-6 fill-current" />
              </span>
            </span>
            {video.duracao && (
              <span className="absolute right-2 bottom-2 rounded bg-black/75 px-1.5 py-0.5 text-xs font-medium text-white tabular-nums">
                {video.duracao}
              </span>
            )}
          </button>
        )}
      </div>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-medium leading-snug">{video.titulo}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{video.canal}</p>
        </div>
        <BotaoMarcacao alvo={alvoVideo(video.id)} tipo="assistido" inicial={assistida} compacto className="-mt-1 shrink-0" />
      </div>
    </div>
  );
}
