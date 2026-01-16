module.exports = (req, res) => {
    res.json({ 
        status: 'online', 
        timestamp: new Date().toISOString() 
    });
};
