const fetch = require('node-fetch'); // Assurez-vous d'avoir importé fetch

class DarkAI {
  constructor() {
    this.url = "https://doanything.ai/api/chat"; // URL de l'API
    this.headers = {
      "Content-Type": "application/json",
      "Accept": "*/*",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
      "Origin": "https://doanything.ai",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      "Accept-Language": "en-US,en;q=0.9"
    };
    this.conversationHistory = []; // Historique de la conversation
  }

  // Ajouter un message à l'historique
  addToHistory(role, content) {
    this.conversationHistory.push({ role, content });
  }

  // Méthode pour envoyer la requête et récupérer la réponse
  async fetchResponse(query) {
    const payload = {
      model: "gpt-3.5-turbo-0613", // Modèle à utiliser
      messages: this.conversationHistory, // Inclure l'historique complet
      temperature: 0.7 // Température pour la diversité des réponses
    };

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify(payload)
      });

      const responseText = await response.text();

      try {
        // Vérifie si la réponse peut être analysée en JSON
        const jsonResponse = JSON.parse(responseText);
        return jsonResponse.text || "No message in JSON response";
      } catch {
        // Si ce n'est pas du JSON, retourne le texte brut
        return responseText;
      }

    } catch (error) {
      console.error('Error fetching AI response:', error);
      return "Error fetching AI response: " + error.message;
    }
  }

  // Crée un générateur de réponse avec l'historique des messages
  async createAsyncGenerator(model, messages) {
    // Ajouter le message de l'utilisateur à l'historique
    const userMessage = messages[0].text;
    this.addToHistory('user', userMessage);

    // Obtenir la réponse de l'IA
    const aiResponse = await this.fetchResponse(userMessage);

    // Ajouter la réponse de l'IA à l'historique
    this.addToHistory('assistant', aiResponse);

    return aiResponse; // Retourner la réponse générée par l'IA
  }
}

module.exports = DarkAI;
