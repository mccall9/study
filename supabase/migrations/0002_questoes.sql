-- Respostas às questões e simulados. As questões em si ficam em data/questoes/*.json;
-- aqui guardamos só o que cada usuária respondeu.

create table public.simulados (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  prova_id text not null,
  iniciado_em timestamptz not null,
  finalizado_em timestamptz not null default now(),
  duracao_seg integer not null check (duracao_seg >= 0),
  certas integer not null check (certas >= 0),
  erradas integer not null check (erradas >= 0),
  brancos integer not null check (brancos >= 0)
);

create index simulados_user_finalizado on public.simulados (user_id, finalizado_em desc);

create table public.respostas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  questao_id text not null,
  -- C = certo, E = errado, B = deixou em branco
  resposta text not null check (resposta in ('C', 'E', 'B')),
  -- null quando em branco
  correta boolean,
  simulado_id uuid references public.simulados (id) on delete cascade,
  respondida_em timestamptz not null default now(),
  check ((resposta = 'B') = (correta is null))
);

create index respostas_user_respondida on public.respostas (user_id, respondida_em desc);
create index respostas_simulado on public.respostas (simulado_id) where simulado_id is not null;

alter table public.simulados enable row level security;
alter table public.respostas enable row level security;

create policy "dono" on public.simulados
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "dono" on public.respostas
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
