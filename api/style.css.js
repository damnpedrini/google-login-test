const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const possiblePaths = [
            path.join(__dirname, '..', 'style.css'),
            path.join(process.cwd(), 'style.css'),
            path.join('/var/task', 'style.css')
        ];
        
        let content = null;
        for (const filePath of possiblePaths) {
            if (fs.existsSync(filePath)) {
                content = fs.readFileSync(filePath, 'utf8');
                break;
            }
        }
        
        if (content) {
            res.setHeader('Content-Type', 'text/css; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            return res.send(content);
        }
        
        res.status(404).send('CSS file not found');
    } catch (error) {
        console.error('Erro ao servir CSS:', error);
        res.status(500).send('Internal Server Error');
    }
};
