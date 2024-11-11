const express = require('express');
const path = require('path');
const DarkAI = require('./DarkAI');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Serve HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const darkAI = new DarkAI();

app.get('/api/chat', async (req, res) => {
    const { model, message } = req.query;

    if (!message) {
        return res.status(400).json({ error: 'Tcho ça fait pitié' });
    }

    try {
        const result = await darkAI.createAsyncGenerator(model, [{ text: message }]);
        res.status(200).json({ response: result });
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        res.status(500).json({ error: 'Pauvre tapette, ton code est mal foutue' });
    }
});

app.listen(PORT, () => {
    console.log(`Yeah Dude, ton serveur est Nickel ! ${PORT}`);
});
