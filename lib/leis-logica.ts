// Regras sobre o texto das leis, sem acesso a arquivos: usadas no servidor e nos testes.

export type Dispositivo = { id: string; x: string };
export type Artigo = { t: "a"; id: string; num: string; rotulo?: string; d: Dispositivo[] };
export type Cabecalho = { t: "h"; n: number; x: string; s: string };
export type Bloco = Artigo | Cabecalho;

export type LeiTexto = {
  id: string;
  curto: string;
  nome: string;
  url: string;
  importado_em: string;
  blocos: Bloco[];
};

/** Referência a um trecho de lei. `artigos`: "5", "37:41" (intervalo), "67-A" ou "*" (lei inteira). */
/**
 * Referência a um trecho de lei. `artigos`: "5", "37:41" (intervalo), "67-A" ou "*" (lei inteira).
 * `dispositivos` (opcional) restringe aos dispositivos com esses ids (e os que estão dentro deles),
 * por exemplo ["art5-lxviii", "art5-lxix"]; o caput do artigo é sempre mantido.
 */
export type Referencia = { lei: string; artigos?: string[]; dispositivos?: string[]; nota?: string };

export function filtrarDispositivos(artigo: Artigo, dispositivos: string[] | undefined): Artigo {
  if (!dispositivos?.length) return artigo;
  return {
    ...artigo,
    d: artigo.d.filter((d) => d.id === artigo.id || dispositivos.some((p) => d.id === p || d.id.startsWith(`${p}-`))),
  };
}

export function artigosDaLei(lei: LeiTexto): Artigo[] {
  return lei.blocos.filter((b): b is Artigo => b.t === "a");
}

/** Número do artigo para comparar intervalos: "67-A" -> [67, 1]. */
function chave(num: string): [number, number] {
  const m = num.match(/^(\d+)(?:-([A-Z]))?$/i);
  if (!m) return [Number.NaN, 0];
  return [Number(m[1]), m[2] ? m[2].toUpperCase().charCodeAt(0) - 64 : 0];
}

function dentro(num: string, de: string, ate: string): boolean {
  const [n, l] = chave(num);
  const [a] = chave(de);
  const [b] = chave(ate);
  if (Number.isNaN(n)) return false;
  // "37:41" inclui 41-A, 41-B... (mesmo número base)
  return n >= a && n <= b && (n < b || l >= 0);
}

/** Artigos da lei cobertos pela referência, na ordem da lei. */
export function resolverArtigos(lei: LeiTexto, artigos: string[] | undefined): Artigo[] {
  const todos = artigosDaLei(lei);
  if (!artigos || artigos.includes("*")) return todos;
  return todos.filter((a) =>
    artigos.some((spec) => {
      if (spec.includes(":")) {
        const [de, ate] = spec.split(":");
        return dentro(a.num, de, ate);
      }
      return a.num.toUpperCase() === spec.toUpperCase();
    }),
  );
}

function ordinal(n: string): string {
  return /^\d$/.test(n) ? `${n}º` : n;
}

/**
 * Rótulo legível de uma âncora: "art5-lxxii-a" -> "Art. 5º, LXXII, a"; "art37-p6" -> "Art. 37, § 6º";
 * "anexo-xiv-a" -> "Anexo, XIV, a". Usa os ids de artigo da lei para separar "art67-a" (artigo 67-A)
 * de "art67-...-a" (alínea).
 */
export function rotularAncora(ancora: string, idsDeArtigo: Set<string>): string {
  let artigo = "";
  if (ancora.startsWith("anexo")) {
    artigo = "anexo";
  } else {
    for (const id of idsDeArtigo) {
      if ((ancora === id || ancora.startsWith(`${id}-`)) && id.length > artigo.length) artigo = id;
    }
  }
  if (!artigo) return ancora;
  const resto = ancora.slice(artigo.length).split("-").filter(Boolean);
  let rotulo: string;
  if (artigo === "anexo") {
    rotulo = "Anexo";
  } else {
    const m = artigo.match(/^art(\d+)(?:-([a-z]))?(?:-\d+)?$/);
    rotulo = m ? `Art. ${ordinal(m[1])}${m[2] ? `-${m[2].toUpperCase()}` : ""}` : artigo;
  }
  // Depois do artigo ou de um parágrafo vem inciso (romano); depois de inciso vem alínea (letra).
  let ultimo: "artigo" | "paragrafo" | "inciso" | "alinea" = "artigo";
  for (const parte of resto) {
    if (parte === "pu") {
      rotulo += ", parágrafo único";
      ultimo = "paragrafo";
    } else if (/^p\d+(_[a-z])?$/.test(parte)) {
      // "p1_a" = § 1º-A (parágrafo acrescentado depois)
      const [num, letra] = parte.slice(1).split("_");
      rotulo += `, § ${ordinal(num)}${letra ? `-${letra.toUpperCase()}` : ""}`;
      ultimo = "paragrafo";
    } else if (/^n\d+$/.test(parte)) {
      rotulo += `, item ${parte.slice(1)}`;
    } else if (parte === "txt" || /^\d+$/.test(parte)) {
      continue;
    } else if (/^[ivxlc]+(_[a-z])?$/.test(parte) && (ultimo === "artigo" || ultimo === "paragrafo")) {
      // "ii_a" = inciso II-A
      rotulo += `, ${parte.toUpperCase().replace("_", "-")}`;
      ultimo = "inciso";
    } else if (/^[a-z]$/.test(parte)) {
      rotulo += `, ${parte}`;
      ultimo = "alinea";
    } else {
      rotulo += `, ${parte}`;
    }
  }
  return rotulo;
}

/** Artigo que contém a âncora (ou o próprio artigo). */
export function artigoDaAncora(lei: LeiTexto, ancora: string): Artigo | undefined {
  let melhor: Artigo | undefined;
  for (const a of artigosDaLei(lei)) {
    if (a.d.some((d) => d.id === ancora) && (!melhor || a.id.length > melhor.id.length)) melhor = a;
  }
  return melhor;
}

/** Busca simples, sem acento e sem maiúsculas, nos dispositivos. */
export function normalizar(t: string): string {
  // Mantém o tamanho do texto (para destacar o trecho achado): acentos saem, hífen vira espaço.
  return t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-\u2010\u2011\u2013\u2014]/g, " ")
    .toLowerCase();
}

export function buscar(lei: LeiTexto, termo: string, limite = 80): { artigo: Artigo; dispositivo: Dispositivo }[] {
  const alvo = normalizar(termo.trim());
  if (alvo.length < 2) return [];
  const achados: { artigo: Artigo; dispositivo: Dispositivo }[] = [];
  for (const artigo of artigosDaLei(lei)) {
    for (const dispositivo of artigo.d) {
      if (normalizar(dispositivo.x).includes(alvo)) {
        achados.push({ artigo, dispositivo });
        if (achados.length >= limite) return achados;
      }
    }
  }
  return achados;
}
