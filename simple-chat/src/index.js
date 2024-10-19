import './index.css';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.chat-form');
    const input = document.querySelector('.form-input');
    const messageList = document.querySelector('.message-list');
    const chatTitle = document.getElementById('chat-title');

    const urlParams = new URLSearchParams(window.location.search);
    const chatId = urlParams.get('chatId');
    const chats = JSON.parse(localStorage.getItem('chats')) || [];
    const userNickname = 'Илья';

    if (chatId) {
        const currentChat = chats.find(chat => chat.id === parseInt(chatId));
        if (currentChat) {
            chatTitle.textContent = currentChat.name;
        } else {
            chatTitle.textContent = 'Чат';
        }
    } else {
        chatTitle.textContent = 'Чат';
    }

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem(`messages_${chatId}`)) || [];
        messageList.innerHTML = '';
        messages.forEach((msg) => {
            addMessage(msg.text, msg.time, msg.nickname, msg.read);
        });
        updateMessageClasses();
        scrollToBottom();
    }

    function addMessage(text, time, nickname, read) {
        const li = document.createElement('li');
        li.classList.add('message');

        if (nickname === userNickname) {
            li.classList.add('my');
        }

        const messageText = document.createElement('span');
        messageText.textContent = text;

        const messageInfo = document.createElement('div');
        messageInfo.classList.add('message-info');
        messageInfo.textContent = `${nickname} ${time} `;
        const checkIcon = document.createElement('span');
        checkIcon.classList.add('material-icons');

        if (read) {
            checkIcon.textContent = 'done_all';
            checkIcon.classList.add('message-check');
        } else {
            checkIcon.textContent = 'done';
        }

        messageInfo.appendChild(checkIcon);
        li.appendChild(messageText);
        li.appendChild(messageInfo);
        messageList.appendChild(li);
    }

    function scrollToBottom() {
        messageList.scrollTop = messageList.scrollHeight;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const text = input.value.trim();
        let nickname;
        const filterValue = document.querySelector('input[name="message-filter"]:checked').value;
        if (filterValue === 'my') {
            nickname = userNickname;
        } else {
            nickname = chatTitle.textContent;
        }
        if (text !== '') {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const newMessage = { text: text, time: time, nickname: nickname, read: false };
            const messages = JSON.parse(localStorage.getItem(`messages_${chatId}`)) || [];
            messages.push(newMessage);
            localStorage.setItem(`messages_${chatId}`, JSON.stringify(messages));
            addMessage(text, time, nickname, newMessage.read);
            updateMessageClasses();
            scrollToBottom();
            input.value = '';
        }
    }

    const filterRadios = document.querySelectorAll('input[name="message-filter"]');

    filterRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            markMessagesAsRead();
            updateMessageClasses();

        });
    });

    function updateMessageClasses() {
        const filterValue = document.querySelector('input[name="message-filter"]:checked').value;
        const messages = JSON.parse(localStorage.getItem(`messages_${chatId}`)) || [];
        const messageElements = messageList.querySelectorAll('.message');

        messageElements.forEach((msgElement, index) => {
            const message = messages[index];
            if (filterValue === 'my') {
                if (message.nickname === userNickname) {
                    msgElement.classList.add('my');
                } else {
                    msgElement.classList.remove('my');
                }
            } else {
                if (message.nickname === userNickname) {
                    msgElement.classList.remove('my');
                } else if (message.nickname !== 'Система') {
                    msgElement.classList.add('my');
                }
            }
        });
    }

    function markMessagesAsRead() {
        const messages = JSON.parse(localStorage.getItem(`messages_${chatId}`)) || [];
        const filterValue = document.querySelector('input[name="message-filter"]:checked').value;
        let updated = false;
        messages.forEach((msg, index) => {
            if (filterValue === 'my' && msg.nickname !== userNickname && !msg.read) {
                msg.read = true;
                updated = true;
            } else if (filterValue === 'others' && msg.nickname === userNickname && !msg.read) {
                msg.read = true;
                updated = true;
            }
        });
        if (updated) {
            localStorage.setItem(`messages_${chatId}`, JSON.stringify(messages));
            messageList.innerHTML = '';
            messages.forEach(msg => {
                addMessage(msg.text, msg.time, msg.nickname, msg.read);
            });
            scrollToBottom();
        }
    }

    form.addEventListener('submit', handleSubmit);

    loadMessages();
});
