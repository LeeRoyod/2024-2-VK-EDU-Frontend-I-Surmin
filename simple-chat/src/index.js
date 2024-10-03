import './index.css';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const input = document.querySelector('.form-input');
    const messageList = document.querySelector('.message-list');
    const nicknameInput = document.getElementById('nickname');

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messageList.innerHTML = '';
        messages.forEach((msg) => {
            addMessage(msg.text, msg.time, msg.nickname);
        });
        updateMessageClasses();
        scrollToBottom();
    }

    function addMessage(text, time, nickname) {
        const li = document.createElement('li');
        li.classList.add('message');
        const currentNickname = nicknameInput.value.trim();

        if (nickname === currentNickname) {
            li.classList.add('my');
        }

        const messageText = document.createElement('span');
        messageText.textContent = text;

        const messageInfo = document.createElement('div');
        messageInfo.classList.add('message-info');
        messageInfo.textContent = `${nickname} ${time} `;
        const checkIcon = document.createElement('span');
        checkIcon.classList.add('material-icons');
        checkIcon.textContent = 'check';
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
        const nickname = nicknameInput.value.trim() || 'Anonymous';
        if (text !== '') {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const newMessage = { text: text, time: time, nickname: nickname };
            const messages = JSON.parse(localStorage.getItem('messages')) || [];
            messages.push(newMessage);
            localStorage.setItem('messages', JSON.stringify(messages));
            addMessage(text, time, nickname);
            updateMessageClasses();
            scrollToBottom();
            input.value = '';
        }
    }

    function updateMessageClasses() {
        const currentNickname = nicknameInput.value.trim();
        const messages = JSON.parse(localStorage.getItem('messages')) || [];

        const messageElements = messageList.querySelectorAll('.message');
        messageElements.forEach((msgElement, index) => {
            const message = messages[index];
            if (message.nickname === currentNickname) {
                msgElement.classList.add('my');
            } else {
                msgElement.classList.remove('my');
            }
        });
    }

    nicknameInput.addEventListener('input', () => {
        updateMessageClasses();
    });

    form.addEventListener('submit', handleSubmit);

    loadMessages();
});
