// Regras dos arquivos enviados (PDFs e fotos), sem acesso a banco: vale no servidor, no cliente e nos testes.

export const BUCKET = "arquivos";
export const LIMITE_BYTES = 50 * 1024 * 1024;
export const TIPOS_ACEITOS = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;
export type TipoArquivo = keyof typeof TIPOS_ACEITOS;

export type Arquivo = {
  id: string;
  user_id: string;
  nome: string;
  caminho: string;
  tipo: TipoArquivo;
  bytes: number;
  materia_slug: string | null;
  topico_id: string | null;
  compartilhado: boolean;
  criado_em: string;
};

export function isTipoArquivo(tipo: unknown): tipo is TipoArquivo {
  return typeof tipo === "string" && tipo in TIPOS_ACEITOS;
}

/** Erro para mostrar à usuária, ou null se o arquivo pode ser enviado. */
export function validarArquivo(arquivo: { type: string; size: number }): string | null {
  if (!isTipoArquivo(arquivo.type)) return "Envie um PDF ou uma foto (JPG, PNG ou WEBP).";
  if (arquivo.size <= 0) return "O arquivo está vazio.";
  if (arquivo.size > LIMITE_BYTES) return "O arquivo passa de 50 MB.";
  return null;
}

/** Caminho no bucket: sempre dentro da pasta da usuária (é o que a política do Storage exige). */
export function caminhoDoArquivo(userId: string, id: string, tipo: TipoArquivo): string {
  return `${userId}/${id}.${TIPOS_ACEITOS[tipo]}`;
}

export function caminhoValido(caminho: string, userId: string): boolean {
  return new RegExp(`^${userId}/[0-9a-f-]{36}\\.(pdf|jpg|png|webp)$`).test(caminho);
}

/** Nome do arquivo sem a extensão, para sugerir como título. */
export function nomeSugerido(nomeDoArquivo: string): string {
  return nomeDoArquivo.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim().slice(0, 200);
}

export function formatarTamanho(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} MB`;
}
