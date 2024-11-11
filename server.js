const express = require('express');
const path = require('path');
const DarkAI = require('./DarkAI');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const darkAI = new DarkAI();

app.post('/api/chat', async (req, res) => {
    const { model, message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message manquant" });
    }

    try {
        const result = await darkAI.createAsyncGenerator(model, message);
        res.status(200).json({ response: result });
    } catch (error) {
        console.error("Erreur serveur:", error);
        res.status(500).json({ error: "Erreur lors de la réponse de l'IA" });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur en marche sur le port ${PORT}`);
});
