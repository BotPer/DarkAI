
const axios = require('axios');

class DarkAI {
    constructor() {
        this.url = 'https://www.aiuncensored.info';
        this.apiEndpoint = 'https://darkai.foundation/chat';
        this.defaultModel = 'gpt-4o';
        this.models = [
            this.defaultModel, // Uncensored
            'gpt-3.5-turbo', // Uncensored
            'llama-3-70b', // Uncensored
            'llama-3-405b',
        ];
        this.modelAliases = {
            'llama-3.1-70b': 'llama-3-70b',
            'llama-3.1-405b': 'llama-3-405b',
        };
    }

    getModel(model) {
        if (this.models.includes(model)) {
            return model;
        } else if (this.modelAliases[model]) {
            return this.modelAliases[model];
        } else {
            return this.defaultModel;
        }
    }

    async createAsyncGenerator(model, messages, proxy = null) {
        model = this.getModel(model);
        
        const headers = {
            'accept': 'text/event-stream',
            'content-type': 'application/json',
            'origin': 'https://www.aiuncensored.info',
            'referer': 'https://www.aiuncensored.info/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
        };

        const prompt = this.formatPrompt(messages);
        const data = {
            query: prompt,
            model: model,
        };

        try {
            const response = await axios.post(this.apiEndpoint, data, {
                headers,
                proxy: proxy ? { host: proxy } : undefined,
                responseType: 'stream'
            });

            return new Promise((resolve, reject) => {
                let fullText = '';
                response.data.on('data', (chunk) => {
                    try {
                        const chunkStr = chunk.toString().trim();
                        if (chunkStr.startsWith('data: ')) {
                            const chunkData = JSON.parse(chunkStr.substring(6));
                            if (chunkData.event === 'text-chunk') {
                                fullText += chunkData.data.text;
                            } else if (chunkData.event === 'stream-end') {
                                if (fullText) resolve(fullText.trim());
                                else resolve();
                            }
                        }
                    } catch (err) {
                        console.error(`Error processing chunk: ${err}`);
                    }
                });

                response.data.on('end', () => {
                    if (fullText) resolve(fullText.trim());
                });

                response.data.on('error', (err) => {
                    reject(`Error in stream: ${err}`);
                });
            });
        } catch (error) {
            console.error(`Request failed: ${error}`);
            throw error;
        }
    }

    formatPrompt(messages) {
        // Implementasi format prompt untuk menggabungkan pesan
        return messages.map(msg => msg.text).join('\n');
    }
}

module.exports = DarkAI;
