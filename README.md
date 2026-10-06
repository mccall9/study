# Estudos PRF + INSS

App de uso interno para organizar os estudos para os concursos da **PRF** e do **INSS**. Funciona no computador e no celular; no celular, dá para instalar como app (PWA).

## O que tem

- **Painel**: horas na semana contra a meta, sequência de dias seguidos, % do edital concluído em cada concurso, gráfico dos últimos 7 dias, horas por matéria e uma sugestão de matéria para hoje (a que está há mais tempo sem estudo).
- **Edital verticalizado**: todas as matérias, com filtro PRF / INSS. Em cada matéria há um checklist de tópicos com 4 status: não iniciado → estudado → revisado → questões feitas.
- **Estudar**: cronômetro por matéria/tópico, com pausar e encerrar. Se a página recarregar, o cronômetro continua de onde parou. Também dá para lançar uma sessão manualmente.
- **Questões**: 214 itens certo/errado das provas oficiais do Cebraspe (PRF 2021 e INSS 2022).
  - **Treino**: uma questão por vez, com filtro por concurso, matéria, tópico, "só as que não fiz" ou caderno de erros, e correção na hora. No computador, atalhos C / E / B e Enter.
  - **Simulado**: a prova inteira com cronômetro, nota no estilo Cebraspe (certas − erradas), resultado por matéria e revisão dos erros. As marcações sobrevivem a recarregar a página.
  - **Caderno de erros**: questões cuja última resposta foi errada ou em branco; acertando ao refazer, ela sai do caderno.
- **Histórico**: sessões dos últimos 60 dias, com opção de editar e excluir.

As matérias em comum (Português, RLM, Informática, Constitucional, Administrativo e Ética) aparecem uma vez só e contam para os dois concursos.

## Conteúdo do edital

O conteúdo fica em [`lib/edital.ts`](lib/edital.ts) e foi montado a partir dos **últimos editais** (PRF 2021 e INSS 2022, os dois da banca Cebraspe). **Revise esse arquivo quando os editais novos saírem.** Não reaproveite o id de um tópico para outro assunto, porque o progresso é salvo pelo id.

## Banco de questões

As questões ficam em [`data/questoes/`](data/questoes), um JSON por prova, geradas pelo script [`scripts/extrair-prova.py`](scripts/extrair-prova.py) a partir dos PDFs oficiais (caderno de prova e gabarito definitivo) no site do Cebraspe. Itens anulados ficam marcados com gabarito `X` e não entram no treino nem no simulado. Itens que dependem de uma figura que não dá para reproduzir ficam de fora (estão listados em `pular` no script).

A matéria e o tópico de cada item foram classificados à mão no próprio script. Para incluir outra prova, adicione uma entrada em `PROVAS` com os links do caderno e do gabarito e a classificação, e rode:

```bash
python3 scripts/extrair-prova.py <id-da-prova>   # precisa do pdftotext (poppler-utils)
```

Depois inclua o JSON novo em [`lib/questoes.ts`](lib/questoes.ts). O teste `pnpm test` confere se todo item aponta para uma matéria e um tópico que existem no edital.

## Configuração (uma vez só)

### 1. Supabase (banco e login, gratuito)

1. Crie um projeto em <https://supabase.com>.
2. No **SQL Editor**, cole e rode, em ordem, os arquivos de [`supabase/migrations/`](supabase/migrations) (`0001_init.sql` e `0002_questoes.sql`).
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

1. Mais provas no banco de questões (PRF 2019, INSS 2016 e outras do Cebraspe nas matérias em comum)
2. Flashcards com revisão espaçada ([ts-fsrs](https://github.com/open-spaced-repetition/ts-fsrs))
3. IA (Claude) para explicar por que um item está certo ou errado e gerar itens a partir da lei seca
