"use client";

import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { registrarArquivo } from "@/app/actions-arquivos";
import { MateriaSelect } from "@/components/materia-select";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form";
import { BUCKET, caminhoDoArquivo, nomeSugerido, validarArquivo, type TipoArquivo } from "@/lib/arquivos";
import { createClient } from "@/lib/supabase/client";

/** Envia um PDF ou foto direto do aparelho para o Storage e depois registra no banco. */
export function EnviarArquivo({ materiaInicial = "", topicoInicial = "" }: { materiaInicial?: string; topicoInicial?: string }) {
  const router = useRouter();
  const entrada = useRef<HTMLInputElement>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [nome, setNome] = useState("");
  const [materia, setMateria] = useState(materiaInicial);
  const [topico, setTopico] = useState(topicoInicial);
  const [compartilhado, setCompartilhado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "erro" | "ok"; texto: string } | null>(null);

  function escolher(f: File | null) {
    setMensagem(null);
    setArquivo(f);
    if (f) {
      const erro = validarArquivo(f);
      if (erro) setMensagem({ tipo: "erro", texto: erro });
      if (!nome) setNome(nomeSugerido(f.name));
    }
  }

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (!arquivo) return setMensagem({ tipo: "erro", texto: "Escolha um arquivo." });
    const erro = validarArquivo(arquivo);
    if (erro) return setMensagem({ tipo: "erro", texto: erro });
    if (!nome.trim()) return setMensagem({ tipo: "erro", texto: "Dê um nome ao arquivo." });

    setEnviando(true);
    setMensagem(null);
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      if (!data.user) throw new Error("Sua sessão expirou. Entre de novo.");
      const id = crypto.randomUUID();
      const tipo = arquivo.type as TipoArquivo;
      const caminho = caminhoDoArquivo(data.user.id, id, tipo);
      const { error } = await supabase.storage.from(BUCKET).upload(caminho, arquivo, { contentType: tipo, upsert: false });
      if (error) throw new Error("Não foi possível enviar o arquivo. Confira a internet e tente de novo.");
      const r = await registrarArquivo({
        id,
        caminho,
        nome: nome.trim(),
        tipo,
        bytes: arquivo.size,
        materiaSlug: materia,
        topicoId: topico,
        compartilhado,
      });
      if (r.erro) throw new Error(r.erro);
      setMensagem({ tipo: "ok", texto: `"${nome.trim()}" foi enviado.` });
      setArquivo(null);
      setNome("");
      setCompartilhado(false);
      if (entrada.current) entrada.current.value = "";
      router.refresh();
    } catch (err) {
      setMensagem({ tipo: "erro", texto: err instanceof Error ? err.message : "Não foi possível enviar." });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="arquivo">Arquivo (PDF ou foto, até 50 MB)</Label>
        <Input
          ref={entrada}
          id="arquivo"
          type="file"
          accept="application/pdf,image/jpeg,image/png,image/webp"
          onChange={(e) => escolher(e.target.files?.[0] ?? null)}
          className="h-auto py-2 file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:font-medium"
          disabled={enviando}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="nome-arquivo">Nome</Label>
        <Input
          id="nome-arquivo"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          maxLength={200}
          placeholder="Ex.: Apostila de Direito Penal"
          disabled={enviando}
        />
      </div>
      <MateriaSelect
        materiaSlug={materia}
        topicoId={topico}
        onChange={(m, t) => {
          setMateria(m);
          setTopico(t);
        }}
        disabled={enviando}
      />
      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={compartilhado}
          onChange={(e) => setCompartilhado(e.target.checked)}
          className="mt-0.5 size-4"
          disabled={enviando}
        />
        <span>
          Compartilhar com a família
          <span className="block text-xs text-muted-foreground">Os outros logins do app também vão ver este arquivo.</span>
        </span>
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={enviando || !arquivo}>
          {enviando ? <Loader2 className="animate-spin" /> : <Upload />} {enviando ? "Enviando…" : "Enviar"}
        </Button>
        {mensagem && (
          <p role="status" className={mensagem.tipo === "erro" ? "text-sm text-destructive" : "text-sm text-status-questoes"}>
            {mensagem.texto}
          </p>
        )}
      </div>
    </form>
  );
}
