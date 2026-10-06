"use server";

import { getComentario, type Comentario } from "@/lib/comentarios";
import { isConfianca, type Confianca } from "@/lib/confianca";
import { getProva, QUESTOES_POR_ID, validas } from "@/lib/questoes";
import { corrigir, resumo, type Gabarito, type RespostaValor } from "@/lib/questoes-logica";
import { createClient, MODO_DEMO } from "@/lib/supabase/server";

const AVISO_DEMO = "Modo demonstração: a resposta foi corrigida, mas não foi salva.";

function isResposta(v: unknown): v is RespostaValor {
  return v === "C" || v === "E" || v === "B";
}

export type Correcao = {
  gabarito: Gabarito;
  correta: boolean | null;
  observacao?: string;
  comentario?: Comentario | null;
  aviso?: string;
  erro?: string;
};

/** Corrige e registra a resposta de um item no modo treino. */
export async function responder(
  questaoId: string,
  resposta: RespostaValor,
  confianca: Confianca | null = null,
): Promise<Correcao | { erro: string }> {
  const questao = QUESTOES_POR_ID.get(questaoId);
  if (!questao || questao.gabarito === "X") return { erro: "Questão não encontrada." };
  if (!isResposta(resposta)) return { erro: "Resposta inválida." };

  const correta = corrigir(questao.gabarito, resposta);
  const correcao: Correcao = {
    gabarito: questao.gabarito,
    correta,
    observacao: questao.observacao,
    comentario: await getComentario(questaoId),
  };
  if (MODO_DEMO) return { ...correcao, aviso: AVISO_DEMO };

  const supabase = await createClient();
  const { error } = await supabase.from("respostas").insert({
    questao_id: questaoId,
    resposta,
    correta,
    // O nível de confiança só faz sentido quando a usuária marcou C ou E.
    confianca: resposta !== "B" && isConfianca(confianca) ? confianca : null,
  });
  // Sem revalidatePath: as páginas são dinâmicas e buscam os dados de novo ao navegar, e
  // recarregar aqui mudaria a lista do treino no meio da sessão.
  if (error) return { ...correcao, erro: "A resposta foi corrigida, mas não foi salva. Tente de novo." };
  return correcao;
}

export type ResultadoSimulado = {
  certas: number;
  erradas: number;
  brancos: number;
  nota: number;
  total: number;
  duracaoSeg: number;
  correcao: Record<string, { gabarito: Gabarito; resposta: RespostaValor; correta: boolean | null }>;
  comentarios: Record<string, Comentario>;
  aviso?: string;
  erro?: string;
};

/** Corrige um simulado inteiro e salva o resultado e cada resposta. */
export async function finalizarSimulado(
  provaId: string,
  marcadas: Record<string, RespostaValor>,
  iniciadoEm: string,
): Promise<ResultadoSimulado | { erro: string }> {
  const prova = getProva(provaId);
  if (!prova) return { erro: "Prova não encontrada." };
  const inicio = Date.parse(iniciadoEm);
  if (Number.isNaN(inicio)) return { erro: "Data de início inválida." };
  const duracaoSeg = Math.max(0, Math.round((Date.now() - inicio) / 1000));

  const questoes = validas(prova.questoes);
  const correcao: ResultadoSimulado["correcao"] = {};
  for (const q of questoes) {
    const resposta = isResposta(marcadas[q.id]) ? marcadas[q.id] : "B";
    correcao[q.id] = { gabarito: q.gabarito, resposta, correta: corrigir(q.gabarito, resposta) };
  }
  const r = resumo(Object.values(correcao));
  const comentarios: Record<string, Comentario> = {};
  for (const q of questoes) {
    const c = await getComentario(q.id);
    if (c) comentarios[q.id] = c;
  }
  const resultado: ResultadoSimulado = {
    comentarios,
    certas: r.certas,
    erradas: r.erradas,
    brancos: r.brancos,
    nota: r.nota,
    total: r.total,
    duracaoSeg,
    correcao,
  };
  if (MODO_DEMO) return { ...resultado, aviso: "Modo demonstração: o simulado foi corrigido, mas não foi salvo." };

  const supabase = await createClient();
  const { data: simulado, error } = await supabase
    .from("simulados")
    .insert({
      prova_id: provaId,
      iniciado_em: new Date(inicio).toISOString(),
      duracao_seg: duracaoSeg,
      certas: r.certas,
      erradas: r.erradas,
      brancos: r.brancos,
    })
    .select("id")
    .single();
  if (error) return { ...resultado, erro: "O simulado foi corrigido, mas não foi salvo. Tente de novo." };

  const { error: erroRespostas } = await supabase.from("respostas").insert(
    Object.entries(correcao).map(([questao_id, c]) => ({
      questao_id,
      resposta: c.resposta,
      correta: c.correta,
      simulado_id: simulado.id,
    })),
  );
  if (erroRespostas) {
    await supabase.from("simulados").delete().eq("id", simulado.id);
    return { ...resultado, erro: "O simulado foi corrigido, mas não foi salvo. Tente de novo." };
  }
  return resultado;
}
