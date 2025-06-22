// script.js

document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Fungsi untuk menambahkan pesan ke kotak chat
    function addMessage(message, sender) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message", `${sender}-message`);
        
        const pElement = document.createElement("p");
        pElement.textContent = message;
        messageElement.appendChild(pElement);

        chatBox.appendChild(messageElement);
        // Auto-scroll ke pesan terbaru
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // Fungsi untuk mengirim pesan ke backend dan mendapatkan balasan
    async function getBotReply(userMessage) {
        try {
            // Ganti URL jika backend Anda berjalan di port yang berbeda
            const response = await fetch("http://localhost:3000/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: userMessage }),
            });

            if (!response.ok) {
                throw new Error("Gagal mendapatkan respons dari server.");
            }

            const data = await response.json();
            addMessage(data.reply, "bot");
        } catch (error) {
            console.error("Error:", error);
            addMessage("Maaf, terjadi kesalahan. Coba lagi nanti.", "bot");
        }
    }
    
    // Fungsi untuk menangani pengiriman pesan
    function handleSend() {
        const userMessage = userInput.value.trim();
        if (userMessage) {
            addMessage(userMessage, "user");
            getBotReply(userMessage);
            userInput.value = ""; // Kosongkan input setelah dikirim
        }
    }

    // Event listener untuk tombol kirim
    sendBtn.addEventListener("click", handleSend);

    // Event listener untuk tombol 'Enter' pada keyboard
    userInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            handleSend();
        }
    });
});