"use server";

import { isAlvo, isTipoMarcacao, LIMITE_ANOTACAO, type TipoMarcacao } from "@/lib/marcacoes";
import { createClient, MODO_DEMO } from "@/lib/supabase/server";

const ERRO_DEMO = "Modo demonstração: configure o Supabase para salvar.";

// Sem revalidatePath: os componentes atualizam o próprio estado, e as páginas dinâmicas
// buscam os dados de novo na próxima navegação (recarregar no meio do treino trocaria a lista).

/** Liga ou desliga um favorito, destaque ou reporte. Devolve o novo estado. */
export async function marcar(alvo: string, tipo: TipoMarcacao, ligado: boolean): Promise<{ ligado: boolean; erro?: string }> {
  if (!isAlvo(alvo) || !isTipoMarcacao(tipo)) return { ligado: !ligado, erro: "Marcação inválida." };
  if (MODO_DEMO) return { ligado: !ligado, erro: ERRO_DEMO };
  const supabase = await createClient();
  const { error } = ligado
    ? await supabase.from("marcacoes").upsert({ alvo, tipo }, { onConflict: "user_id,alvo,tipo", ignoreDuplicates: true })
    : await supabase.from("marcacoes").delete().eq("alvo", alvo).eq("tipo", tipo);
  if (error) return { ligado: !ligado, erro: "Não foi possível salvar. Tente de novo." };
  return { ligado };
}

/** Salva a anotação de um alvo; texto vazio apaga. */
export async function anotar(alvo: string, texto: string): Promise<{ erro?: string }> {
  if (!isAlvo(alvo) || typeof texto !== "string") return { erro: "Anotação inválida." };
  if (MODO_DEMO) return { erro: ERRO_DEMO };
  const limpo = texto.trim();
  if (limpo.length > LIMITE_ANOTACAO) return { erro: `A anotação passou de ${LIMITE_ANOTACAO} caracteres.` };
  const supabase = await createClient();
  const { error } = limpo
    ? await supabase.from("anotacoes").upsert({ alvo, texto: limpo, atualizado_em: new Date().toISOString() })
    : await supabase.from("anotacoes").delete().eq("alvo", alvo);
  if (error) return { erro: "Não foi possível salvar a anotação. Tente de novo." };
  return {};
}
