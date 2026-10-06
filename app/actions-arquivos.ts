"use server";

import { revalidatePath } from "next/cache";
import { BUCKET, caminhoValido, isTipoArquivo, LIMITE_BYTES, type TipoArquivo } from "@/lib/arquivos";
import { getMateria } from "@/lib/edital";
import { createClient, MODO_DEMO } from "@/lib/supabase/server";

const ERRO_DEMO = "Modo demonstração: configure o Supabase para enviar arquivos.";

export type NovoArquivo = {
  id: string;
  caminho: string;
  nome: string;
  tipo: TipoArquivo;
  bytes: number;
  materiaSlug: string;
  topicoId: string;
  compartilhado: boolean;
};

/** Depois que o navegador enviou o arquivo ao Storage, grava os dados dele. */
export async function registrarArquivo(a: NovoArquivo): Promise<{ erro?: string }> {
  if (MODO_DEMO) return { erro: ERRO_DEMO };
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) return { erro: "Sua sessão expirou. Entre de novo." };

  const nome = String(a.nome ?? "").trim().slice(0, 200);
  const materia = getMateria(a.materiaSlug);
  const topico = materia?.topicos.find((t) => t.id === a.topicoId);
  if (
    !/^[0-9a-f-]{36}$/.test(a.id) ||
    !caminhoValido(a.caminho, user.id) ||
    !a.caminho.startsWith(`${user.id}/${a.id}.`) ||
    !isTipoArquivo(a.tipo) ||
    !Number.isInteger(a.bytes) ||
    a.bytes <= 0 ||
    a.bytes > LIMITE_BYTES ||
    !nome
  ) {
    return { erro: "Dados do arquivo inválidos." };
  }

  const { error } = await supabase.from("arquivos").insert({
    id: a.id,
    caminho: a.caminho,
    nome,
    tipo: a.tipo,
    bytes: a.bytes,
    materia_slug: materia?.slug ?? null,
    topico_id: topico?.id ?? null,
    compartilhado: a.compartilhado === true,
  });
  if (error) {
    await supabase.storage.from(BUCKET).remove([a.caminho]);
    return { erro: "Não foi possível salvar o arquivo. Tente de novo." };
  }
  revalidatePath("/arquivos");
  if (topico) revalidatePath(`/topico/${topico.id}`);
  return {};
}

/** Apaga um arquivo da própria usuária (o registro e o arquivo no Storage). */
export async function apagarArquivo(id: string): Promise<{ erro?: string }> {
  if (MODO_DEMO) return { erro: ERRO_DEMO };
  const supabase = await createClient();
  const { data: arquivo } = await supabase.from("arquivos").select("caminho, user_id, topico_id").eq("id", id).maybeSingle();
  const { data } = await supabase.auth.getUser();
  if (!arquivo || arquivo.user_id !== data.user?.id) return { erro: "Você só pode apagar os seus arquivos." };
  const { error } = await supabase.from("arquivos").delete().eq("id", id);
  if (error) return { erro: "Não foi possível apagar. Tente de novo." };
  await supabase.storage.from(BUCKET).remove([arquivo.caminho]);
  revalidatePath("/arquivos");
  if (arquivo.topico_id) revalidatePath(`/topico/${arquivo.topico_id}`);
  return {};
}

/** Liga ou desliga o compartilhamento com os outros logins da família. */
export async function compartilharArquivo(id: string, compartilhado: boolean): Promise<{ erro?: string }> {
  if (MODO_DEMO) return { erro: ERRO_DEMO };
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("arquivos")
    .update({ compartilhado: compartilhado === true })
    .eq("id", id)
    .select("id");
  if (error || !data?.length) return { erro: "Você só pode compartilhar os seus arquivos." };
  revalidatePath("/arquivos");
  return {};
}
