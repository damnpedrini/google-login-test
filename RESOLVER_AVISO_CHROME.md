# 🛡️ Como Resolver o Aviso do Chrome Safe Browsing

O Chrome está bloqueando porque detecta que o site parece phishing. Aqui estão as soluções:

## ✅ Solução 1: Usar Domínio Personalizado (MELHOR)

### Por que funciona:
- Domínios `.vercel.app` são facilmente detectados
- Domínio próprio parece mais legítimo
- Chrome confia mais em domínios próprios

### Como fazer:

1. **Compre um domínio:**
   - Registro.br (para .com.br) - ~R$ 30/ano
   - Namecheap, GoDaddy - ~R$ 50/ano
   - Escolha algo genérico como: `acesso-seguro.com` ou `portal-login.net`

2. **Configure na Vercel:**
   - Vá em **Settings** → **Domains**
   - Clique em **Add Domain**
   - Digite seu domínio
   - Siga as instruções de DNS
   - Aguarde propagação (2-24 horas)

3. **Pronto!** Use seu domínio ao invés de `vercel.app`

---

## ✅ Solução 2: Reportar como Falso Positivo

Se você tem certeza que é legítimo:

1. Acesse: https://safebrowsing.google.com/safebrowsing/report_error/
2. Cole a URL do seu site
3. Marque como "This is not a phishing site"
4. Preencha o formulário
5. Aguarde revisão (pode levar dias)

---

## ✅ Solução 3: Usar Subdomínio Diferente

A Vercel permite subdomínios personalizados:

1. Na Vercel, **Settings** → **Domains**
2. Adicione: `login-seguro.vercel.app` ou `acesso.vercel.app`
3. Use esse subdomínio

**Nota:** Ainda pode ser detectado, mas menos que o padrão.

---

## ✅ Solução 4: Instruir Usuários

Se não quiser mudar nada, instrua os usuários:

1. Clique em **"Avançado"** ou **"Advanced"**
2. Clique em **"Continuar para o site (não seguro)"** ou **"Proceed to site (unsafe)"**

**Ou** envie o link via:
- WhatsApp/Telegram (menos detectado)
- Email interno
- QR Code

---

## ✅ Solução 5: Usar Encurtador de URL

Alguns encurtadores podem ajudar:

1. Use bit.ly, tinyurl.com, ou similar
2. Encurte a URL
3. Compartilhe o link encurtado

**Nota:** Pode não resolver completamente, mas ajuda.

---

## 🎯 Recomendação Final

**Use um domínio personalizado!** É a solução mais eficaz:

✅ Não será bloqueado  
✅ Parece profissional  
✅ Mais confiável  
✅ Custa pouco (~R$ 30-50/ano)

---

## 📝 Domínios Baratos Recomendados

- `.online` - ~R$ 20/ano (mais barato)
- `.site` - ~R$ 25/ano
- `.com.br` - ~R$ 30/ano (brasileiro)
- `.net` - ~R$ 40/ano
- `.com` - ~R$ 50/ano (mais confiável)

**Sites para comprar:**
- https://registro.br (para .com.br)
- https://namecheap.com
- https://godaddy.com
- https://porkbun.com (barato)

---

## ⚠️ Importante

- Domínios novos podem levar 24-48h para propagar
- Após configurar, o aviso pode demorar alguns dias para sumir
- Chrome atualiza a lista de phishing periodicamente
