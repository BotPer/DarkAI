document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendButton = document.getElementById("send-button");

    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessageToChat("Vous", message);
        userInput.value = "";

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ model: "gpt-3.5-turbo-0613", message }),
            });

            const data = await response.json();
            if (data.response) {
                addMessageToChat("IA", data.response);
            } else {
                addMessageToChat("Erreur", "Pas de réponse de l'IA.");
            }
        } catch (error) {
            addMessageToChat("Erreur", "Erreur de connexion au serveur.");
            console.error(error);
        }
    }

    function addMessageToChat(sender, text) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");
        messageElement.innerHTML = `<strong>${sender}:</strong> ${text}`;
        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    sendButton.addEventListener("click", sendMessage);
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") sendMessage();
    });
});
