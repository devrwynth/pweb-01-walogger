document.addEventListener("DOMContentLoaded", () => {
  const sendButton = document.querySelector('.chat-footer button');
  const messageInput = document.querySelector('.chat-footer input');
  const chatHeader = document.querySelector('.chat-header p');
  
  // Variabel global untuk chat saat ini
  let currentContactId = "6283895262500";  // ID kontak yang sedang aktif
  let isCurrentChatGroup = false;  // Tentukan apakah chat ini grup atau kontak biasa

  // Fungsi untuk memperbarui detail kontak/chat
  const setChatDetails = (contactId, isGroup) => {
      currentContactId = contactId;
      isCurrentChatGroup = isGroup;
      chatHeader.textContent = `Chat with ${contactId}`;  // Tampilkan nama kontak/chat aktif
  };

  // Fungsi untuk membuat data pesan
  function createMessageData(contactId, messageBody, isGroup) {
    const messageId = isGroup ? `CHTG${String(Date.now()).slice(-10)}` : `CHT${String(Date.now()).slice(-10)}`;

    return {
        _data: {
            id: {
                fromMe: true,
                remote: isGroup ? `${contactId}@g.us` : `${contactId}@c.us`,
                id: messageId,
                _serialized: `true_${isGroup ? `${contactId}@g.us` : `${contactId}@c.us`}_${messageId}`
            },
            viewed: false,
            body: messageBody,
            type: 'chat',
            t: Math.floor(Date.now() / 1000),
            notifyName: 'user',
            from: 'user@c.us',
            to: isGroup ? `${contactId}@g.us` : `${contactId}@c.us`,
            ack: 1,
            invis: false,
            isNewMsg: true,
            star: false,
            kicNotified: false,
            recvFresh: true,
            isFromTemplate: false,
            thumbnail: '',
            mentionedJidList: [],
            groupMentions: [],
            labels: [],
            links: []
        },
        id: {
            fromMe: true,
            remote: isGroup ? `${contactId}@g.us` : `${contactId}@c.us`,
            id: messageId,
            _serialized: `true_${isGroup ? `${contactId}@g.us` : `${contactId}@c.us`}_${messageId}`
        },
        ack: 1,
        hasMedia: false,
        body: messageBody,
        type: 'chat',
        timestamp: Math.floor(Date.now() / 1000),
        from: 'user@c.us',
        to: isGroup ? `${contactId}@g.us` : `${contactId}@c.us`,
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
  }

  // Fungsi untuk mengirim pesan ke backend
  const sendMessage = () => {
    const messageBody = messageInput.value.trim();
    if (!messageBody) return;  // Jangan kirim pesan kosong

    const newMessage = createMessageData(chatHeader.textContent, messageBody, isCurrentChatGroup);

    // Kirim pesan ke backend
    fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newMessage),
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        console.log('Pesan terkirim:', data);
        messageInput.value = ''; // Kosongkan input setelah pengiriman
        // Jika ingin memuat pesan baru, bisa dipanggil loadMessages()
    })
    .catch(error => {
        console.error('Error mengirim pesan:', error);
    });
  };

  // Tambahkan event listener untuk tombol kirim
  sendButton.addEventListener('click', sendMessage);

  // Event listener untuk input pesan (Enter untuk kirim pesan)
  messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
  });

  // Fungsi untuk memperbarui daftar kontak yang dipilih (contoh)
  const updateContact = (contactId, isGroup) => {
    setChatDetails(contactId, isGroup);
  };
  
  // Contoh jika ada event untuk memilih kontak
  const contactItems = document.querySelectorAll('.contact-item');
  contactItems.forEach(contactItem => {
    contactItem.addEventListener('click', (e) => {
      const contactId = e.target.dataset.id;  // ID kontak bisa dari data-atribut
      const isGroup = e.target.dataset.group === 'true';  // Menentukan apakah grup
      updateContact(contactId, isGroup);
    });
  });
});
