-- Fase 3: arquivos enviados pelas usuárias (PDFs e imagens) e "assistido" nas videoaulas.

-- Vídeos do YouTube têm ids com maiúsculas e "_": o alvo passa a aceitar esses caracteres.
alter table public.marcacoes drop constraint marcacoes_alvo_check;
alter table public.marcacoes add constraint marcacoes_alvo_check check (alvo ~ '^(questao|lei|topico|video):[A-Za-z0-9:_-]+$');
alter table public.marcacoes drop constraint marcacoes_tipo_check;
alter table public.marcacoes add constraint marcacoes_tipo_check check (tipo in ('favorito', 'destaque', 'reportado', 'assistido'));

create table public.arquivos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nome text not null check (char_length(nome) between 1 and 200),
  -- caminho no bucket "arquivos": <user_id>/<uuid>.<ext>
  caminho text not null unique,
  tipo text not null check (tipo in ('application/pdf', 'image/jpeg', 'image/png', 'image/webp')),
  bytes bigint not null check (bytes > 0 and bytes <= 52428800),
  materia_slug text,
  topico_id text,
  -- visível para os outros logins da família
  compartilhado boolean not null default false,
  criado_em timestamptz not null default now(),
  check (split_part(caminho, '/', 1) = user_id::text)
);

create index arquivos_user_criado on public.arquivos (user_id, criado_em desc);
create index arquivos_topico on public.arquivos (topico_id) where topico_id is not null;

alter table public.arquivos enable row level security;

create policy "ver os meus e os compartilhados" on public.arquivos
  for select to authenticated
  using ((select auth.uid()) = user_id or compartilhado);

create policy "criar os meus" on public.arquivos
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "alterar os meus" on public.arquivos
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "apagar os meus" on public.arquivos
  for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Bucket privado: só se lê por URL assinada, gerada no servidor para quem pode ver o arquivo.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('arquivos', 'arquivos', false, 52428800, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

create policy "arquivos: enviar na própria pasta" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'arquivos' and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "arquivos: ler os meus e os compartilhados" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'arquivos'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or exists (select 1 from public.arquivos a where a.caminho = storage.objects.name and a.compartilhado)
    )
  );

create policy "arquivos: apagar os meus" on storage.objects
  for delete to authenticated
  using (bucket_id = 'arquivos' and (storage.foldername(name))[1] = (select auth.uid())::text);
