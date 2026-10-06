import { describe, expect, it } from "vitest";
import { caminhoDoArquivo, caminhoValido, formatarTamanho, nomeSugerido, validarArquivo } from "./arquivos";

const USER = "6f1c2a3b-0000-4000-8000-000000000001";
const ID = "0b8f6c2e-1111-4222-8333-444455556666";

describe("arquivos", () => {
  it("aceita PDF e fotos de até 50 MB", () => {
    expect(validarArquivo({ type: "application/pdf", size: 1000 })).toBeNull();
    expect(validarArquivo({ type: "image/jpeg", size: 1000 })).toBeNull();
    expect(validarArquivo({ type: "application/zip", size: 1000 })).toMatch(/PDF/);
    expect(validarArquivo({ type: "application/pdf", size: 51 * 1024 * 1024 })).toMatch(/50 MB/);
    expect(validarArquivo({ type: "application/pdf", size: 0 })).toMatch(/vazio/);
  });

  it("monta e valida o caminho dentro da pasta da usuária", () => {
    const caminho = caminhoDoArquivo(USER, ID, "application/pdf");
    expect(caminho).toBe(`${USER}/${ID}.pdf`);
    expect(caminhoValido(caminho, USER)).toBe(true);
    expect(caminhoValido(`outra/${ID}.pdf`, USER)).toBe(false);
    expect(caminhoValido(`${USER}/../${ID}.pdf`, USER)).toBe(false);
  });

  it("sugere nome e formata tamanho", () => {
    expect(nomeSugerido("apostila_direito-penal.pdf")).toBe("apostila direito penal");
    expect(formatarTamanho(2048)).toBe("2 KB");
    expect(formatarTamanho(3.5 * 1024 * 1024)).toBe("3,5 MB");
  });
});
