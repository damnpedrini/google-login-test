const { google } = require('googleapis');

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

// Função para salvar email no Google Sheets
async function saveEmailToGoogleSheets(email, timestamp, ip, additionalData = {}) {
    const auth = await getGoogleSheetsAuth();
    const sheets = google.sheets({ version: 'v4', auth });

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
                    values: [['Timestamp', 'Email', 'IP Address', 'User Agent', 'Extra Info']]
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
                values: [['Timestamp', 'Email', 'IP Address', 'User Agent', 'Extra Info']]
            }
        });
    }

    // Adicionar nova linha com os dados
    const values = [[
        timestamp,
        email,
        ip,
        additionalData.userAgent || '',
        additionalData.extra || ''
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

// Handler principal do endpoint REST
module.exports = async (req, res) => {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Lidar com preflight OPTIONS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Apenas aceitar POST
    if (req.method !== 'POST') {
        return res.status(405).json({ 
            success: false,
            error: 'Método não permitido. Use POST.' 
        });
    }

    try {
        const { email, extra } = req.body;
        const timestamp = new Date().toISOString();
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.headers['x-real-ip'] || 
                   req.connection?.remoteAddress || 
                   'Unknown';
        const userAgent = req.headers['user-agent'] || '';

        // Validar email
        if (!email) {
            return res.status(400).json({ 
                success: false,
                error: 'Email é obrigatório' 
            });
        }

        // Validação básica de formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false,
                error: 'Formato de email inválido' 
            });
        }

        // Salvar no Google Sheets
        await saveEmailToGoogleSheets(email, timestamp, ip, {
            userAgent,
            extra: extra || ''
        });

        console.log(`Email salvo no Google Sheets: ${email} - ${timestamp}`);

        // Retornar sucesso
        return res.status(200).json({ 
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

        return res.status(500).json({ 
            success: false,
            error: 'Erro ao salvar email no Google Sheets',
            details: error.message
        });
    }
};
