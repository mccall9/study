-- Fase 2: nível de confiança nas respostas, favoritos/destaques e anotações.
-- "alvo" identifica o que foi marcado ou anotado:
--   questao:prf-2021-009   lei:cf:art5   topico:direito-constitucional-2

alter table public.respostas
  add column confianca text check (confianca in ('certeza', 'duvida', 'chute'));

create table public.marcacoes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  alvo text not null check (alvo ~ '^(questao|lei|topico):[a-z0-9:-]+$'),
  -- favorito: questão ou tópico salvo; destaque: artigo grifado na lei seca;
  -- reportado: a usuária achou erro no comentário ou no gabarito
  tipo text not null check (tipo in ('favorito', 'destaque', 'reportado')),
  criado_em timestamptz not null default now(),
  primary key (user_id, alvo, tipo)
);

create index marcacoes_user_tipo on public.marcacoes (user_id, tipo, criado_em desc);

create table public.anotacoes (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  alvo text not null check (alvo ~ '^(questao|lei|topico):[a-z0-9:-]+$'),
  texto text not null check (char_length(texto) between 1 and 5000),
  atualizado_em timestamptz not null default now(),
  primary key (user_id, alvo)
);

create index anotacoes_user_atualizado on public.anotacoes (user_id, atualizado_em desc);

alter table public.marcacoes enable row level security;
alter table public.anotacoes enable row level security;

create policy "dono" on public.marcacoes
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "dono" on public.anotacoes
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
