fetch("http://localhost:3000/chat")
    .then((response) => response.json())
    .then((data) => {
        const chatList = document.getElementById("chat-list");
        const chat = document.getElementById("chat");
        const chatHeader = document.querySelector('.chat-header p');

        // Fungsi untuk membersihkan ID (menghapus @c.us, @g.us)
        const cleanId = (id) => id.replace(/@c.us|@g.us/g, '');

        // Fungsi untuk menampilkan isi chat
        const loadChatMessages = (messages, contactName, isGroup) => {
            // Perbarui header dengan nama kontak
            chatHeader.textContent = contactName;

            // Kosongkan jendela obrolan
            chat.innerHTML = '';

            // Loop untuk menampilkan setiap pesan
            messages.forEach(chatItem => {
                // Buat elemen pesan di jendela obrolan
                const message = document.createElement("div");
                message.classList.add("message");
                chatItem.fromMe ? message.classList.add("chat-self") : message.classList.add("chat-other");

                // Jika ini pesan grup, tampilkan pengirimnya
                if (isGroup && !chatItem.fromMe && chatItem.author) {
                    const authorElement = document.createElement("p");
                    authorElement.classList.add("message-author");
                    authorElement.innerText = cleanId(chatItem.author); // Tampilkan nama pengirim tanpa @c.us
                    message.appendChild(authorElement);
                }

                const messageText = document.createElement("p");
                messageText.classList.add("messageText");
                messageText.innerText = chatItem.body;

                // Konversi timestamp ke format jam.menit
                const date = new Date(chatItem.timestamp * 1000);
                let hours = date.getUTCHours();
                const minutes = String(date.getUTCMinutes()).padStart(2, '0');
                hours = String(hours).padStart(2, '0');
                const timeString = `${hours}:${minutes}`;

                // Buat footer untuk timestamp dan read receipt
                const messageFooter = document.createElement("div");
                messageFooter.classList.add("messageFooter");

                const timeElement = document.createElement("span");
                timeElement.classList.add("timestamp");
                timeElement.innerText = timeString;
                messageFooter.appendChild(timeElement);

                // Jika pesan dikirim oleh pengguna, tambahkan tanda centang atau ikon jam
                if (chatItem.fromMe) {
                    const readReceipt = document.createElement("span");
                    readReceipt.classList.add("readReceipt");

                    // Tentukan kelas berdasarkan nilai ack
                    if (chatItem.ack === 0) {
                        readReceipt.classList.add("clock"); // Tambahkan kelas ikon jam
                    } else if (chatItem.ack === 1) {
                        readReceipt.innerText = "✓"; // Centang satu (sent)
                        readReceipt.style.color = "lightgrey";
                    } else if (chatItem.ack === 2) {
                        readReceipt.innerText = "✓✓"; // Centang dua (delivered)
                        readReceipt.style.color = "lightgrey";
                    } else if (chatItem.ack === 3) {
                        readReceipt.innerText = "✓✓"; // Centang dua (read)
                        readReceipt.style.color = "#34B7F1";
                    }

                messageFooter.appendChild(readReceipt);
                }


                // Tambahkan teks dan footer ke pesan, kemudian tambahkan ke elemen chat
                message.appendChild(messageText);
                message.appendChild(messageFooter);
                chat.appendChild(message);
            });
        };

        // Kosongkan daftar chat
        chatList.innerHTML = '';

        // Mengelompokkan pesan berdasarkan kontak
        const groupedChats = {};

        data.data.forEach(chatItem => {
            const contact = chatItem.fromMe ? chatItem.to : chatItem.from;
            const cleanContact = cleanId(contact); // Bersihkan ID
            const isGroup = contact.includes('@g.us');

            if (!groupedChats[cleanContact]) {
                groupedChats[cleanContact] = {
                    notifyName: chatItem.notifyName || cleanContact,
                    isGroup: isGroup,
                    messages: []
                };
            }
            groupedChats[cleanContact].messages.push(chatItem);
        });

        // dijadikan function agar bisa dipanggil lagi
        function loadContacts(searchData, loadFirstData) {
            // clear chat items yang sudah diload sebelumnya
            let allChatItems = document.getElementsByClassName("chat-list");
            allChatItems[0].innerHTML = '';
            // Loop untuk daftar chat di sidebar
            Object.keys(groupedChats).forEach((contact, index) => {
                const chatItem = groupedChats[contact];
                // kalo loadContacts dipanggil tanpa argumen (searchData == undefined) maka tampilkan
                // semua contacts. kalo searchData terisi string maka tampilkan contacts yang namanya
                // terdapat bagian dari searchData
                if (chatItem.notifyName.includes(searchData) || searchData == undefined) {
                    
                // Buat elemen untuk setiap item chat di sidebar
                    const chatDiv = document.createElement("div");
                    chatDiv.classList.add("chat-item");

                    const avatar = document.createElement("img");
                    avatar.src = "https://via.placeholder.com/30";
                    avatar.alt = "Chat Avatar";

                    const chatDetails = document.createElement("div");
                    chatDetails.classList.add("chat-details");

                    const chatName = document.createElement("p");
                    chatName.textContent = chatItem.notifyName;

                    const lastMessage = document.createElement("span");
                    lastMessage.textContent = chatItem.messages[chatItem.messages.length - 1].body;

                    chatDetails.appendChild(chatName);
                    chatDetails.appendChild(lastMessage);
                    chatDiv.appendChild(avatar);
                    chatDiv.appendChild(chatDetails);
                    chatList.appendChild(chatDiv);

                // Event Listener untuk menampilkan isi chat
                    chatDiv.addEventListener("click", () => {
                        loadChatMessages(chatItem.messages, chatItem.notifyName, chatItem.isGroup);
                    });

                // Tampilkan isi chat pertama secara default
                    if (index === 0 && loadFirstData) {
                        loadChatMessages(chatItem.messages, chatItem.notifyName, chatItem.isGroup);
                    }
                }
            });
        }

        loadContacts(undefined,true);
        // dapetin searchbar
        var searchbar = document.getElementsByClassName("search-bar")[0].children[0]; 
        searchbar.addEventListener("input", () => {
            if (searchbar.value == "") {
                loadContacts();
            } else {
                loadContacts(searchbar.value);
            }
        })
    })
    .catch((error) => console.error("Error:", error))
    .finally(() => {
        console.log("Data loaded successfully");
    });
