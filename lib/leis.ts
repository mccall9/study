import "server-only";
import { cache } from "react";
import type { LeiTexto } from "./leis-logica";

// Um import por lei: o texto só é carregado quando a página precisa, e o arquivo entra no bundle do servidor.
const CARREGAR: Record<string, () => Promise<{ default: unknown }>> = {
  cf: () => import("@/data/leis/cf.json"),
  emc103: () => import("@/data/leis/emc103.json"),
  l8112: () => import("@/data/leis/l8112.json"),
  l9784: () => import("@/data/leis/l9784.json"),
  l8429: () => import("@/data/leis/l8429.json"),
  l14133: () => import("@/data/leis/l14133.json"),
  l12527: () => import("@/data/leis/l12527.json"),
  l9654: () => import("@/data/leis/l9654.json"),
  d1171: () => import("@/data/leis/d1171.json"),
  d6029: () => import("@/data/leis/d6029.json"),
  d9203: () => import("@/data/leis/d9203.json"),
  l12813: () => import("@/data/leis/l12813.json"),
  l8212: () => import("@/data/leis/l8212.json"),
  l8213: () => import("@/data/leis/l8213.json"),
  d3048: () => import("@/data/leis/d3048.json"),
  l8742: () => import("@/data/leis/l8742.json"),
  lcp142: () => import("@/data/leis/lcp142.json"),
  l10779: () => import("@/data/leis/l10779.json"),
  ctb: () => import("@/data/leis/ctb.json"),
  cp: () => import("@/data/leis/cp.json"),
  cpp: () => import("@/data/leis/cpp.json"),
  l11343: () => import("@/data/leis/l11343.json"),
  l10826: () => import("@/data/leis/l10826.json"),
  l13869: () => import("@/data/leis/l13869.json"),
  l8072: () => import("@/data/leis/l8072.json"),
  l11340: () => import("@/data/leis/l11340.json"),
  l8069: () => import("@/data/leis/l8069.json"),
  l9605: () => import("@/data/leis/l9605.json"),
  l12850: () => import("@/data/leis/l12850.json"),
  l9613: () => import("@/data/leis/l9613.json"),
  l9455: () => import("@/data/leis/l9455.json"),
  l7716: () => import("@/data/leis/l7716.json"),
  l9099: () => import("@/data/leis/l9099.json"),
  l12037: () => import("@/data/leis/l12037.json"),
  d678: () => import("@/data/leis/d678.json"),
};

export const carregarLei = cache(async (id: string): Promise<LeiTexto | null> => {
  const carregar = CARREGAR[id];
  if (!carregar) return null;
  return (await carregar()).default as LeiTexto;
});
