fetch("http://localhost:3001/chat")
    .then((response) => response.json())
    .then((data) => {
        const chat = document.getElementById("chat");
        const chatHeader = document.querySelector('.chat-header p');

        data.data.forEach((res, index) => {
            if (index === 0) {
                chatHeader.textContent = res.from;
            }

            // Create message container
            const message = document.createElement("div");
            message.classList.add("message");
            res.fromMe ? message.classList.add("chat-self") : message.classList.add("chat-other");

            // Message text
            const messageText = document.createElement("p");
            messageText.classList.add("messageText");
            messageText.innerText = res.body;

            // Convert timestamp to hours.minutes format
            const date = new Date(res.timestamp * 1000);
            let hours = date.getUTCHours();
            const minutes = String(date.getUTCMinutes()).padStart(2, '0');
            if (hours >= 24) hours -= 24;
            hours = String(hours).padStart(2, '0');
            const timeString = `${hours}.${minutes}`;

            // Create message footer for timestamp and read receipt
            const messageFooter = document.createElement("div");
            messageFooter.classList.add("messageFooter");

            // Timestamp
            const timeElement = document.createElement("span");
            timeElement.classList.add("timestamp");
            timeElement.innerText = timeString;
            messageFooter.appendChild(timeElement);

            // Only add read receipt ticks if the message is sent by the user
            if (res.fromMe) {
                const readReceipt = document.createElement("span");
                readReceipt.classList.add("readReceipt");
                readReceipt.innerText = "✓✓"; // Double ticks for read receipt
                readReceipt.style.color = res.read ? "#34B7F1" : "lightgrey";
                messageFooter.appendChild(readReceipt);
            }

            // Append text and footer to message
            message.appendChild(messageText);
            message.appendChild(messageFooter);
            chat.appendChild(message);
        });
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
        alert("Data loaded successfully");
    });
