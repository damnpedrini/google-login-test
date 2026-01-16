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
        // Buscar na pasta front primeiro
        const possiblePaths = [
            path.join(__dirname, '..', '..', 'front', filePath), // Pasta front
            path.join(__dirname, '..', '..', filePath),         // Raiz do projeto
            path.join(process.cwd(), 'front', filePath),        // Front no cwd
            path.join(process.cwd(), filePath),                  // Diretório de trabalho atual
            path.join('/var/task', 'front', filePath),           // Front na Vercel
            path.join('/var/task', filePath),                     // Caminho comum na Vercel
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
        
        // Se não encontrou e é a raiz, tentar servir index.html da pasta front
        if (req.url === '/' || req.url === '' || !ext) {
            const indexPaths = [
                path.join(__dirname, '..', '..', 'front', 'index.html'),
                path.join(process.cwd(), 'front', 'index.html'),
                path.join('/var/task', 'front', 'index.html'),
                path.join(__dirname, '..', '..', 'index.html'),
            ];
            
            for (const indexPath of indexPaths) {
                if (fs.existsSync(indexPath)) {
                    const content = fs.readFileSync(indexPath, 'utf8');
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
