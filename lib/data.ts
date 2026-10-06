import "server-only";
import { MATERIAS } from "./edital";
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

// ---- Dados de exemplo para o modo demonstração ----

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
