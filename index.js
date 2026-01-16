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

module.exports = (req, res) => {
    try {
        let filePath = req.url === '/' ? 'index.html' : req.url.replace(/^\//, '');
        
        // Remover query string
        filePath = filePath.split('?')[0];
        
        // Segurança: prevenir path traversal
        if (filePath.includes('..') || filePath.includes('//')) {
            return res.status(403).send('Forbidden');
        }
        
        // Se for rota da API, não processar aqui
        if (filePath.startsWith('api/')) {
            return res.status(404).send('Not Found');
        }
        
        const fullPath = path.join(__dirname, filePath);
        const ext = path.extname(filePath);
        
        // Verificar se o arquivo existe
        if (fs.existsSync(fullPath)) {
            const stats = fs.statSync(fullPath);
            if (stats.isFile()) {
                const content = fs.readFileSync(fullPath, 'utf8');
                const contentType = mimeTypes[ext] || 'text/plain; charset=utf-8';
                
                res.setHeader('Content-Type', contentType);
                res.setHeader('Cache-Control', 'public, max-age=3600');
                
                return res.send(content);
            }
        }
        
        // Se não encontrou e é a raiz, servir index.html
        if (req.url === '/' || req.url === '') {
            const indexPath = path.join(__dirname, 'index.html');
            if (fs.existsSync(indexPath)) {
                const content = fs.readFileSync(indexPath, 'utf8');
                res.setHeader('Content-Type', 'text/html; charset=utf-8');
                return res.send(content);
            }
        }
        
        res.status(404).send('Not Found');
    } catch (error) {
        console.error('Erro ao servir arquivo:', error);
        res.status(500).send('Internal Server Error');
    }
};
