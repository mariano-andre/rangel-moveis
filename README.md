# Woodshop Dashboard

Um sistema de gestão local para marcenaria, construído com Next.js (App Router),
Deno, e SQLite.

## Requisitos

- [Deno](https://deno.land/) instalado na máquina (versão mais recente)
- [PM2](https://pm2.keymetrics.io/) instalado globalmente (opcional, recomendado
  para execução em background)

## Como executar no ambiente de desenvolvimento

1. Instale as dependências executando o comando (o Deno baixará os módulos npm):

```bash
deno task dev
```

2. Acesse http://localhost:3000 no seu navegador.

## Scripts Disponíveis (deno.jsonc)

- `deno task dev`: Inicia o servidor de desenvolvimento.
- `deno task build`: Faz a compilação de produção da aplicação Next.js.
- `deno task start`: Inicia o servidor de produção Next.js.
- `deno task db:generate`: Gera as migrações SQL com base no esquema do Drizzle.
- `deno task db:migrate`: Aplica as migrações no banco SQLite local.
- `deno task db:studio`: Abre o Drizzle Studio para visualizar os dados.
- `deno task db:seed`: Popula o banco com os dados iniciais.
- `deno task db:backup`: Realiza o backup do banco de dados SQLite de forma
  segura usando API nativa do better-sqlite3.

## Banco de Dados (SQLite)

O projeto usa SQLite via `better-sqlite3` gerenciado pelo `drizzle-orm`. O banco
de dados roda em modo WAL para melhor concorrência. O arquivo fica por padrão em
`./data/woodshop.db`.

## Testes End-to-End (E2E)

A aplicação conta com uma robusta bateria de testes E2E usando Puppeteer (Deno),
localizada na pasta `test/`.

- `deno run -A test/massive_parallel_e2e.ts`: Executa múltiplos browsers
  simultaneamente simulando alto tráfego (stress testing e UI race conditions).
- `deno run -A test/deterministic_e2e.ts`: Teste determinístico que valida o
  caminho feliz (happy path) de gestor e funcionários.
- Demais arquivos documentam variações caóticas (Monkey Testing) e simulações
  focadas em performance.

Consulte o arquivo `RUNBOOK.md` para instruções completas sobre como implantar,
gerenciar o serviço PM2 e executar backups.
