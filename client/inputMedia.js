document.addEventListener("DOMContentLoaded", () => {
    const placeholderPath = "./placeholder.png";
    const addMediaButton = document.querySelector(".addMedia");
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*,video/*";
    fileInput.style.display = "none";

    let mediaOptions = null;
    const previewContainer = document.querySelector(".preview-container");
    const messageInput = document.querySelector(".message-input");

    addMediaButton.addEventListener("click", () => {
        if (!mediaOptions) {
            mediaOptions = document.createElement("div");
            mediaOptions.classList.add("media-options");

            const uploadImageButton = document.createElement("button");
            uploadImageButton.textContent = "Upload Gambar";
            uploadImageButton.addEventListener("click", () => {
                fileInput.accept = "image/*";
                fileInput.click();
            });

            const uploadVideoButton = document.createElement("button");
            uploadVideoButton.textContent = "Upload Video";
            uploadVideoButton.addEventListener("click", () => {
                fileInput.accept = "video/*";
                fileInput.click();
            });

            mediaOptions.appendChild(uploadImageButton);
            mediaOptions.appendChild(uploadVideoButton);
            addMediaButton.parentElement.appendChild(mediaOptions);
        } else {
            mediaOptions.style.display = mediaOptions.style.display === "none" ? "flex" : "none";
        }
    });

    // Fungsi upload file ke server
    const uploadFile = (file) => {
        const formData = new FormData();
        formData.append("file", file);

        return fetch('http://localhost:3000/file', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            console.log("File uploaded successfully", data);
            return data.fileUrl; // Mengembalikan URL file yang diupload
        })
        .catch(error => {
            console.error('Error uploading file:', error);
            return null;
        });
    };

    // Menangani pemilihan file
    fileInput.addEventListener("change", async (e) => {
        const selectedFile = e.target.files[0];
        previewContainer.innerHTML = ""; // Kosongkan kontainer preview sebelum menambahkan elemen baru

        if (selectedFile) {
            console.log(`File dipilih: ${selectedFile.name}`);

            const filePreview = document.createElement("div");
            filePreview.classList.add("file-preview");

            if (selectedFile.type.startsWith("image/")) {
                const img = document.createElement("img");
                img.src = URL.createObjectURL(selectedFile);
                img.alt = selectedFile.name;
                img.style.width = "100%";
                filePreview.appendChild(img);
            } else if (selectedFile.type.startsWith("video/")) {
                const video = document.createElement("video");
                video.src = URL.createObjectURL(selectedFile);
                video.style.width = "100%";
                video.controls = true;
                filePreview.appendChild(video);
            }

            previewContainer.appendChild(placeholder);

            // Upload file dan perbarui URL
            mediaUrl = await uploadFile(selectedFile);
        } else {
            previewContainer.appendChild(placeholder);
        }
    });

    const sendMessage = () => {
        const messageBody = messageInput.value.trim();

        if (!messageBody && !selectedFile) return;

        if (!currentContactId) {
            alert("Pilih kontak atau grup terlebih dahulu.");
            return;
        }

        let mediaUrl = mediaUrl || "";
        let mediaType = selectedFile ? selectedFile.type : "";

        const newMessage = createMessageData(
            currentContactId,
            messageBody,
            isCurrentChatGroup,
            mediaUrl,
            mediaType
        );

        fetch('http://localhost:3000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMessage),
        })
        .then(response => {
            if (!response.ok) throw new Error('Failed to send message');
            return response.json();
        })
        .then(data => {
            console.log('Pesan terkirim:', data);
            messageInput.value = '';
            previewContainer.innerHTML = '';
            selectedFile = null;
            mediaUrl = null;
        })
        .catch(error => {
            console.error('Error sending message:', error);
        });
    };

    const sendButton = document.querySelector(".send-button");
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    const updateContact = (contactId, isGroup) => {
        setChatDetails(contactId, isGroup);
    };

    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach(contactItem => {
        contactItem.addEventListener('click', (e) => {
            const contactId = e.target.dataset.id;
            const isGroup = e.target.dataset.group === 'true';
            updateContact(contactId, isGroup);
        });
    });
});

function createMessageData(contactId, messageBody, isGroup, mediaUrl = "", mediaType = "") {
    const messageId = isGroup ? `CHTG${String(Date.now()).slice(-10)}` : `CHT${String(Date.now()).slice(-10)}`;

    if (!isGroup) {
        return {
            _data: {
                id: {
                    fromMe: true,
                    remote: `${contactId}@c.us`,
                    id: messageId,
                    _serialized: `true_${contactId}@c.us_${messageId}`
                },
                viewed: false,
                body: messageBody,
                type: 'chat',
                t: Math.floor(Date.now() / 1000),
                notifyName: 'r',
                from: '6285174388804@c.us',
                to: `${contactId}@c.us`,
                ack: 2,
                invis: false,
                isNewMsg: true,
                star: false,
                kicNotified: false,
                recvFresh: true,
                isFromTemplate: false,
                thumbnail: '',
                mediaUrl: mediaUrl,
                mediaType: mediaType,
                quotedMsg: {},
                quotedStanzaID: "",
                quotedParticipant: "",
                mentionedJidList: [],
                groupMentions: [],
                labels: [],
                links: []
            },
            id: {
                fromMe: true,
                remote: `${contactId}@c.us`,
                id: messageId,
                _serialized: `true_${contactId}@c.us_${messageId}`
            },
            ack: 2,
            hasMedia: true,
            body: messageBody,
            type: 'chat',
            timestamp: Math.floor(Date.now() / 1000),
            from: 'user@c.us',
            to: `${contactId}@c.us`,
            deviceType: 'web',
            isStatus: false,
            isStarred: false,
            fromMe: true,
            hasQuotedMsg: false,
            hasReaction: false,
            mentionedIds: [],
            groupMentions: [],
            links: []
        };
    } else {
        return {
            _data: {
                id: {
                    fromMe: true,
                    remote: `${contactId}@g.us`,
                    id: messageId,
                    participant: '6283895262500@c.us',
                    _serialized: `true_${`${contactId}@c.us`}_${messageId}_6285174388804@c.us`
                },
                viewed: false,
                body: messageBody,
                type: "chat",
                t: Math.floor(Date.now() / 1000),
                notifyName: "r",
                from: '6285174388804@c.us',
                to: `${contactId}@g.us`,
                author: '6285174388804@c.us',
                ack: 2,
                invis: false,
                isNewMsg: true,
                star: false,
                kicNotified: false,
                recvFresh: true,
                isFromTemplate: false,
                thumbnail: "",
                mediaUrl: mediaUrl,
                mediaType: mediaType,
                quotedMsg: {},
                quotedStanzaID: "",
                quotedParticipant: "",
                mentionedJidList: [],
                groupMentions: [],
                isEventCanceled: false,
                eventInvalidated: false,
                isVcardOverMmsDocument: false,
                labels: [],
                links: []
            },
            id: {
                fromMe: true,
                remote: `${contactId}@g.us`,
                id: messageId,
                participant: '6283895262500@c.us',
                _serialized: `true_${`${contactId}@c.us`}_${messageId}_6285174388804@c.us`
            },
            ack: 2,
            hasMedia: true,
            body: messageBody,
            type: "chat",
            timestamp: Math.floor(Date.now() / 1000),
            from: '6285174388804@c.us',
            to: `${contactId}@g.us`,
            author: '6285174388804@c.us',
            deviceType: "web",
            forwardingScore: 0,
            isStatus: false,
            isStarred: false,
            fromMe: true,
            hasQuotedMsg: false,
            hasReaction: false,
            mentionedIds: [],
            groupMentions: [],
            links: []
        };
    }
    
}