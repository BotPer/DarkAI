
const express = require('express');
const DarkAI = require('./DarkAI'); // Ganti dengan path file DarkAI
const app = express();
const PORT = process.env.PORT || 3000; // Gunakan PORT dari environment atau default ke 3000

app.use(express.json());

const darkAI = new DarkAI();

app.get('/api/chat', async (req, res) => {
    const { model, messages } = req.query;

    if (!messages || !Array.isArray(JSON.parse(messages))) {
        return res.status(400).json({ error: 'Messages harus berupa array.' });
    }

    try {
        const messagesArray = JSON.parse(messages);
        const result = await darkAI.createAsyncGenerator(model, messagesArray);
        res.status(200).json({ response: result });
    } catch (error) {
        console.error('Terjadi kesalahan:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat memproses permintaan.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
