# Runbook: Woodshop Dashboard

Este guia descreve como iniciar a aplicação para uso de produção e as rotinas de backup.
Como esta aplicação roda apenas na rede local (LAN), não envolvemos nuvem, apenas PM2 e Deno.

## 1. Configurando o Ambiente de Produção

### 1.1 Gerar o build da aplicação
A aplicação utiliza Next.js, por isso precisa ser compilada antes de executar em produção.
```bash
deno task build
```

### 1.2 Aplicar Migrações e Dados Iniciais
Se este for o primeiro deploy, certifique-se de que o banco está estruturado e populado (opcional):
```bash
deno task db:migrate
deno task db:seed
```

### 1.3 Iniciar com PM2
O arquivo `ecosystem.config.js` já está configurado. O PM2 iniciará o servidor no Deno usando o comando `start`.
```bash
pm2 start ecosystem.config.js
```

Para garantir que a aplicação inicie automaticamente quando o PC reiniciar:
```bash
pm2 save
pm2 startup
```

Para visualizar os logs:
```bash
pm2 logs woodshop-dashboard
```

## 2. Backup do Banco de Dados

O banco de dados SQLite fica salvo por padrão em `./data/woodshop.db`.
Foi criada uma task no Deno que executa uma cópia segura (backup online via API) do banco, que funciona perfeitamente com o modo WAL.

### 2.1 Como fazer o backup manual
```bash
deno task db:backup
```
Este comando criará uma cópia com timestamp no diretório `./data/backups/`.

### 2.2 Backup Automático
Você pode agendar um "Cron Job" ou Tarefa Agendada no Windows/Linux para rodar o comando diariamente, ou usar o próprio PM2:
```bash
# Executa um backup todos os dias às 2 da manhã (exemplo usando Cron no Linux)
0 2 * * * cd /caminho/para/rangel-moveis && deno task db:backup >> ./data/backups/backup.log 2>&1
```

## 3. Resolução de Problemas

- **Erro "Database locked"**: Embora estejamos usando modo WAL (Write-Ahead Logging) no SQLite, evite deixar o `drizzle-kit studio` rodando o tempo inteiro caso haja alto tráfego de escritas simultâneas.
- **Porta em uso**: Se o servidor não iniciar, verifique se a porta `3000` está ocupada por outro programa (como outro servidor Node ou Deno). O PM2 logs informará este problema.
