const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
    // Servir index.html na raiz
    if (req.url === '/' || req.url === '/index.html') {
        const filePath = path.join(__dirname, 'index.html');
        const content = fs.readFileSync(filePath, 'utf8');
        res.setHeader('Content-Type', 'text/html');
        return res.send(content);
    }
    
    // Servir outros arquivos estáticos
    const staticFiles = {
        '/style.css': { path: 'style.css', type: 'text/css' },
        '/script.js': { path: 'script.js', type: 'application/javascript' }
    };
    
    if (staticFiles[req.url]) {
        const filePath = path.join(__dirname, staticFiles[req.url].path);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            res.setHeader('Content-Type', staticFiles[req.url].type);
            return res.send(content);
        }
    }
    
    res.status(404).send('Not Found');
};
