const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    try {
        const possiblePaths = [
            path.join(__dirname, '..', 'script.js'),
            path.join(process.cwd(), 'script.js'),
            path.join('/var/task', 'script.js')
        ];
        
        let content = null;
        for (const filePath of possiblePaths) {
            if (fs.existsSync(filePath)) {
                content = fs.readFileSync(filePath, 'utf8');
                break;
            }
        }
        
        if (content) {
            res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
            res.setHeader('Cache-Control', 'public, max-age=3600');
            return res.send(content);
        }
        
        res.status(404).send('JS file not found');
    } catch (error) {
        console.error('Erro ao servir JS:', error);
        res.status(500).send('Internal Server Error');
    }
};
