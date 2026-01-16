const fs = require('fs');
const path = require('path');

// Mapeamento de tipos MIME
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

module.exports = (req, res) => {
    let filePath = req.url === '/' ? 'index.html' : req.url.replace(/^\//, '');
    
    // Remover query string
    filePath = filePath.split('?')[0];
    
    // Segurança: prevenir path traversal
    if (filePath.includes('..')) {
        return res.status(403).send('Forbidden');
    }
    
    const fullPath = path.join(__dirname, filePath);
    const ext = path.extname(filePath);
    
    // Verificar se o arquivo existe
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        const content = fs.readFileSync(fullPath, 'utf8');
        const contentType = mimeTypes[ext] || 'text/plain';
        res.setHeader('Content-Type', contentType);
        return res.send(content);
    }
    
    // Se não encontrou, tentar index.html
    if (req.url === '/' || !ext) {
        const indexPath = path.join(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
            const content = fs.readFileSync(indexPath, 'utf8');
            res.setHeader('Content-Type', 'text/html');
            return res.send(content);
        }
    }
    
    res.status(404).send('Not Found');
};
