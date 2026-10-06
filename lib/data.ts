import "server-only";
import { isConfianca } from "./confianca";
import { MATERIAS } from "./edital";
import { isTipoMarcacao, type Marcacao } from "./marcacoes";
import { QUESTOES, validas } from "./questoes";
import type { Resposta, RespostaValor } from "./questoes-logica";
import { createClient, MODO_DEMO } from "./supabase/server";
import { isStatus, type Progresso, type Sessao } from "./types";

export const META_PADRAO = 15;

export async function getUsuario(): Promise<{ email: string } | null> {
  if (MODO_DEMO) return { email: "demonstracao@local" };
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user ? { email: data.user.email ?? "" } : null;
}

export async function getProgresso(): Promise<Progresso> {
  if (MODO_DEMO) return progressoDemo();
  const supabase = await createClient();
  const { data, error } = await supabase.from("progresso_topico").select("topico_id, status");
  if (error) throw error;
  const progresso: Progresso = {};
  for (const row of data) if (isStatus(row.status)) progresso[row.topico_id] = row.status;
  return progresso;
}

/** Sessões dos últimos `dias` dias, da mais recente para a mais antiga. */
export async function getSessoes(dias = 60): Promise<Sessao[]> {
  if (MODO_DEMO) return sessoesDemo();
  const desde = new Date(Date.now() - dias * 86_400_000).toISOString();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessoes_estudo")
    .select("id, materia_slug, topico_id, inicio, duracao_seg, anotacao")
    .gte("inicio", desde)
    .order("inicio", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getMetaHoras(): Promise<number> {
  if (MODO_DEMO) return META_PADRAO;
  const supabase = await createClient();
  const { data, error } = await supabase.from("metas").select("horas_semana").maybeSingle();
  if (error) throw error;
  return data ? Number(data.horas_semana) : META_PADRAO;
}

/** Todas as respostas às questões, da mais recente para a mais antiga. */
export async function getRespostas(): Promise<Resposta[]> {
  if (MODO_DEMO) return respostasDemo();
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("respostas")
    .select("questao_id, resposta, correta, respondida_em, simulado_id, confianca")
    .order("respondida_em", { ascending: false });
  if (error) throw error;
  return data.map((r) => ({ ...r, confianca: isConfianca(r.confianca) ? r.confianca : null })) as Resposta[];
}

/** Favoritos, destaques e reportes da usuária. `prefixo` filtra o alvo (ex.: "lei:cf:"). */
export async function getMarcacoes(prefixo?: string): Promise<Marcacao[]> {
  if (MODO_DEMO) return [];
  const supabase = await createClient();
  let consulta = supabase.from("marcacoes").select("alvo, tipo");
  if (prefixo) consulta = consulta.like("alvo", `${prefixo}%`);
  const { data, error } = await consulta;
  if (error) throw error;
  return data.filter((m): m is Marcacao => isTipoMarcacao(m.tipo));
}

/** Anotações da usuária por alvo. `prefixo` filtra o alvo (ex.: "questao:"). */
export async function getAnotacoes(prefixo?: string): Promise<Map<string, string>> {
  if (MODO_DEMO) return new Map();
  const supabase = await createClient();
  let consulta = supabase.from("anotacoes").select("alvo, texto");
  if (prefixo) consulta = consulta.like("alvo", `${prefixo}%`);
  const { data, error } = await consulta;
  if (error) throw error;
  return new Map(data.map((a) => [a.alvo, a.texto]));
}

export type SimuladoFeito = {
  id: string;
  prova_id: string;
  finalizado_em: string;
  duracao_seg: number;
  certas: number;
  erradas: number;
  brancos: number;
};

export async function getSimulados(): Promise<SimuladoFeito[]> {
  if (MODO_DEMO) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("simulados")
    .select("id, prova_id, finalizado_em, duracao_seg, certas, erradas, brancos")
    .order("finalizado_em", { ascending: false });
  if (error) throw error;
  return data;
}

// ---- Dados de exemplo para o modo demonstração ----

function respostasDemo(): Resposta[] {
  const agora = Date.now();
  return validas(QUESTOES)
    .filter((_, i) => i % 3 === 0)
    .map((q, i) => {
      const acertou = i % 4 !== 0;
      const resposta: RespostaValor =
        i % 9 === 0 ? "B" : acertou ? (q.gabarito as RespostaValor) : q.gabarito === "C" ? "E" : "C";
      return {
        questao_id: q.id,
        resposta,
        correta: resposta === "B" ? null : resposta === q.gabarito,
        respondida_em: new Date(agora - i * 3_600_000).toISOString(),
        simulado_id: null,
        confianca: (["certeza", "duvida", "chute"] as const)[i % 3],
      };
    });
}

function progressoDemo(): Progresso {
  const progresso: Progresso = {};
  const ordem = ["questoes_ok", "revisado", "estudado"] as const;
  MATERIAS.forEach((m, mi) => {
    const feitos = Math.max(0, Math.round(m.topicos.length * (0.6 - mi * 0.06)));
    m.topicos.slice(0, feitos).forEach((t, ti) => {
      progresso[t.id] = ordem[Math.min(2, Math.floor((ti / Math.max(feitos, 1)) * 3))];
    });
  });
  return progresso;
}

function sessoesDemo(): Sessao[] {
  const sessoes: Sessao[] = [];
  const agora = Date.now();
  for (let dia = 0; dia < 21; dia++) {
    if (dia === 9 || dia === 15) continue; // alguns dias de folga
    const porDia = dia % 3 === 0 ? 2 : 1;
    for (let k = 0; k < porDia; k++) {
      const materia = MATERIAS[(dia * 2 + k) % 9];
      sessoes.push({
        id: `demo-${dia}-${k}`,
        materia_slug: materia.slug,
        topico_id: materia.topicos[dia % materia.topicos.length].id,
        inicio: new Date(agora - dia * 86_400_000 - (k + 1) * 2 * 3_600_000).toISOString(),
        duracao_seg: (40 + ((dia * 17 + k * 23) % 60)) * 60,
        anotacao: k === 0 && dia % 4 === 0 ? "Revisar os exemplos da aula" : null,
      });
    }
  }
  return sessoes;
}
