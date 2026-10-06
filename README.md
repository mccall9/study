# Estudos PRF + INSS

App de uso interno para organizar os estudos para os concursos da **PRF** e do **INSS**. Funciona no computador e no celular; no celular, dá para instalar como app (PWA).

## O que tem

- **Painel**: horas na semana contra a meta, sequência de dias seguidos, % do edital concluído em cada concurso, gráfico dos últimos 7 dias, horas por matéria e uma sugestão de matéria para hoje (a que está há mais tempo sem estudo).
- **Edital verticalizado**: todas as matérias, com filtro PRF / INSS. Em cada matéria há um checklist de tópicos com 4 status: não iniciado → estudado → revisado → questões feitas.
- **Estudar**: cronômetro por matéria/tópico, com pausar e encerrar. Se a página recarregar, o cronômetro continua de onde parou. Também dá para lançar uma sessão manualmente.
- **Histórico**: sessões dos últimos 60 dias, com opção de editar e excluir.

As matérias em comum (Português, RLM, Informática, Constitucional, Administrativo e Ética) aparecem uma vez só e contam para os dois concursos.

## Conteúdo do edital

O conteúdo fica em [`lib/edital.ts`](lib/edital.ts) e foi montado a partir dos **últimos editais** (PRF 2021 e INSS 2022, os dois da banca Cebraspe). **Revise esse arquivo quando os editais novos saírem.** Não reaproveite o id de um tópico para outro assunto, porque o progresso é salvo pelo id.

## Configuração (uma vez só)

### 1. Supabase (banco e login, gratuito)

1. Crie um projeto em <https://supabase.com>.
2. No **SQL Editor**, cole e rode o conteúdo de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql).
3. Em **Authentication → Sign In / Providers**, desligue *Allow new users to sign up*. Assim só entra quem você cadastrar.
4. Em **Authentication → Users → Add user**, crie o usuário da sua mãe (e-mail e senha) e marque *Auto Confirm User*.
5. Em **Project Settings → API**, copie a *Project URL* e a chave *anon public*.

### 2. Vercel (hospedagem, gratuito)

1. Em <https://vercel.com/new>, importe este repositório.
2. Em *Environment Variables*, adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os valores do passo anterior.
3. Faça o deploy e abra o link no celular. No Android: menu ⋮ → *Instalar app*. No iPhone: Compartilhar → *Adicionar à Tela de Início*.

## Rodando localmente

```bash
pnpm install
cp .env.example .env.local   # preencha com os dados do Supabase
pnpm dev
```

Sem o `.env.local`, o app abre em **modo demonstração**: sem login, com dados de exemplo e sem salvar nada. Serve para ver o visual.

```bash
pnpm lint        # ESLint
pnpm typecheck   # TypeScript
pnpm test        # testes (Vitest)
pnpm build       # build de produção
```

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · componentes no estilo shadcn/ui · Supabase (Auth + Postgres com Row Level Security) · Vitest

## Próximas fases

1. Flashcards com revisão espaçada ([ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs)) e caderno de erros
2. Banco de questões certo/errado com nota no estilo Cebraspe (certas − erradas)
3. IA (Claude) para gerar itens certo/errado a partir da lei seca e explicar erros
