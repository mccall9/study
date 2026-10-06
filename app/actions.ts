"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getMateria } from "@/lib/edital";
import { createClient, MODO_DEMO } from "@/lib/supabase/server";
import { isStatus, type Status } from "@/lib/types";

export type Resultado = { erro?: string };

const ERRO_DEMO = "Modo demonstração: configure o Supabase para salvar.";

export async function entrar(_: Resultado, form: FormData): Promise<Resultado> {
  if (MODO_DEMO) redirect("/");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email") ?? "").trim(),
    password: String(form.get("senha") ?? ""),
  });
  if (error) return { erro: "E-mail ou senha incorretos." };
  redirect("/");
}

export async function sair() {
  if (!MODO_DEMO) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}

export async function definirStatus(topicoId: string, status: Status): Promise<Resultado> {
  if (MODO_DEMO) return { erro: ERRO_DEMO };
  if (!isStatus(status)) return { erro: "Status inválido." };
  const supabase = await createClient();
  const { error } = await supabase
    .from("progresso_topico")
    .upsert({ topico_id: topicoId, status, atualizado_em: new Date().toISOString() });
  if (error) return { erro: error.message };
  revalidatePath("/", "layout");
  return {};
}

export type NovaSessao = {
  materiaSlug: string;
  topicoId: string | null;
  inicio: string;
  duracaoSeg: number;
  anotacao: string;
};

function validarSessao(s: NovaSessao): string | null {
  const materia = getMateria(s.materiaSlug);
  if (!materia) return "Escolha uma matéria.";
  if (s.topicoId && !materia.topicos.some((t) => t.id === s.topicoId)) return "Tópico inválido.";
  if (!Number.isFinite(s.duracaoSeg) || s.duracaoSeg < 60) return "A sessão precisa ter pelo menos 1 minuto.";
  if (s.duracaoSeg > 86_400) return "A sessão não pode passar de 24 horas.";
  if (Number.isNaN(Date.parse(s.inicio))) return "Data inválida.";
  return null;
}

export async function salvarSessao(s: NovaSessao): Promise<Resultado> {
  if (MODO_DEMO) return { erro: ERRO_DEMO };
  const erro = validarSessao(s);
  if (erro) return { erro };
  const supabase = await createClient();
  const { error } = await supabase.from("sessoes_estudo").insert({
    materia_slug: s.materiaSlug,
    topico_id: s.topicoId || null,
    inicio: new Date(s.inicio).toISOString(),
    duracao_seg: Math.round(s.duracaoSeg),
    anotacao: s.anotacao.trim() || null,
  });
  if (error) return { erro: error.message };
  revalidatePath("/", "layout");
  return {};
}

export async function atualizarSessao(
  id: string,
  dados: { duracaoSeg: number; anotacao: string },
): Promise<Resultado> {
  if (MODO_DEMO) return { erro: ERRO_DEMO };
  if (!Number.isFinite(dados.duracaoSeg) || dados.duracaoSeg < 60 || dados.duracaoSeg > 86_400) {
    return { erro: "Duração deve ficar entre 1 minuto e 24 horas." };
  }
  const supabase = await createClient();
  const { error } = await supabase
    .from("sessoes_estudo")
    .update({ duracao_seg: Math.round(dados.duracaoSeg), anotacao: dados.anotacao.trim() || null })
    .eq("id", id);
  if (error) return { erro: error.message };
  revalidatePath("/", "layout");
  return {};
}

export async function excluirSessao(id: string): Promise<Resultado> {
  if (MODO_DEMO) return { erro: ERRO_DEMO };
  const supabase = await createClient();
  const { error } = await supabase.from("sessoes_estudo").delete().eq("id", id);
  if (error) return { erro: error.message };
  revalidatePath("/", "layout");
  return {};
}

export async function salvarMeta(_: Resultado, form: FormData): Promise<Resultado> {
  if (MODO_DEMO) return { erro: ERRO_DEMO };
  const horas = Number(String(form.get("horas") ?? "").replace(",", "."));
  if (!Number.isFinite(horas) || horas <= 0 || horas > 100) {
    return { erro: "Informe entre 1 e 100 horas." };
  }
  const supabase = await createClient();
  const { error } = await supabase.from("metas").upsert({ horas_semana: horas });
  if (error) return { erro: error.message };
  revalidatePath("/");
  return {};
}
