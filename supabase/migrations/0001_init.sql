-- Dados de estudo de cada usuária. O conteúdo do edital (matérias e tópicos)
-- fica em lib/edital.ts; aqui guardamos só o que muda com o uso.

create table public.progresso_topico (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  topico_id text not null,
  status text not null check (status in ('nao_iniciado', 'estudado', 'revisado', 'questoes_ok')),
  atualizado_em timestamptz not null default now(),
  primary key (user_id, topico_id)
);

create table public.sessoes_estudo (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  materia_slug text not null,
  topico_id text,
  inicio timestamptz not null,
  duracao_seg integer not null check (duracao_seg > 0 and duracao_seg <= 86400),
  anotacao text,
  criado_em timestamptz not null default now()
);

create index sessoes_estudo_user_inicio on public.sessoes_estudo (user_id, inicio desc);

create table public.metas (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  horas_semana numeric(4, 1) not null default 15 check (horas_semana > 0 and horas_semana <= 100)
);

alter table public.progresso_topico enable row level security;
alter table public.sessoes_estudo enable row level security;
alter table public.metas enable row level security;

create policy "dono" on public.progresso_topico
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "dono" on public.sessoes_estudo
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "dono" on public.metas
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
