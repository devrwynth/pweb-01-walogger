fetch("http://localhost:3001/users")
    .then((response) => response.json())
    .then((data) => {
        const chat = document.getElementById("chat");
        const chatHeader = document.querySelector('.chat-header p');

        data.data.forEach((res, index) => {
            // Ganti nama kontak atau grup hanya pada iterasi pertama
            if (index === 0) {
                chatHeader.textContent = res.from; 
            }

            // Membuat elemen pesan
            const message = document.createElement("div");
            message.classList.add("message");
            res.fromMe ? message.classList.add("chat-self") : message.classList.add("chat-other");

            const messageText = document.createElement("p");
            messageText.innerText = res.body; // Mengisi teks pesan

            message.appendChild(messageText);
            chat.appendChild(message);
        });
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
        alert("Data loaded successfully");
    });
