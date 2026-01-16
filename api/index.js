const fs = require('fs');
const path = require('path');

// Mapeamento de tipos MIME
const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

module.exports = async (req, res) => {
    try {
        // Se for uma rota de API, não processar
        if (req.url && req.url.startsWith('/api/') && !req.url.startsWith('/api/index')) {
            return res.status(404).send('Not Found');
        }

        let filePath = req.url === '/' || req.url === '' ? 'index.html' : req.url.replace(/^\//, '');
        
        // Remover query string
        filePath = filePath.split('?')[0];
        
        // Segurança: prevenir path traversal
        if (filePath.includes('..') || filePath.includes('//')) {
            return res.status(403).send('Forbidden');
        }
        
        // Tentar diferentes caminhos possíveis na Vercel
        const possiblePaths = [
            path.join(__dirname, '..', filePath), // Raiz do projeto
            path.join(process.cwd(), filePath),   // Diretório de trabalho atual
            path.join('/var/task', filePath),      // Caminho comum na Vercel
            path.join('/var/task', '..', filePath) // Alternativa
        ];
        
        let fullPath = null;
        for (const possiblePath of possiblePaths) {
            if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isFile()) {
                fullPath = possiblePath;
                break;
            }
        }
        
        const ext = path.extname(filePath);
        
        if (fullPath) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const contentType = mimeTypes[ext] || 'text/plain; charset=utf-8';
            
            res.setHeader('Content-Type', contentType);
            res.setHeader('Cache-Control', 'public, max-age=3600');
            
            return res.send(content);
        }
        
        // Se não encontrou e é a raiz, tentar servir index.html
        if (req.url === '/' || req.url === '' || !ext) {
            for (const possiblePath of possiblePaths.map(p => p.replace(filePath, 'index.html'))) {
                if (fs.existsSync(possiblePath)) {
                    const content = fs.readFileSync(possiblePath, 'utf8');
                    res.setHeader('Content-Type', 'text/html; charset=utf-8');
                    return res.send(content);
                }
            }
        }
        
        res.status(404).send('Not Found');
    } catch (error) {
        console.error('Erro ao servir arquivo:', error);
        res.status(500).send('Internal Server Error');
    }
};
