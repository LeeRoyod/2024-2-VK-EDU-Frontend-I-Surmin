import './index.css';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const input = document.querySelector('.form-input');
    const messageList = document.querySelector('.message-list');

    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('messages')) || [];
        messageList.innerHTML = '';
        messages.forEach((msg) => {
            addMessage(msg.text, msg.time, msg.nickname);
        });
        scrollToBottom();
    }

    function addMessage(text, time, nickname) {
        const li = document.createElement('li');
        li.classList.add('message');
        const currentNickname = document.getElementById('nickname').value.trim();

        if (nickname === currentNickname) {
            li.classList.add('my');
        }

        const messageText = document.createElement('span');
        messageText.textContent = text;

        const messageInfo = document.createElement('div');
        messageInfo.classList.add('message-info');
        messageInfo.innerHTML = `${nickname} ${time} <span class="material-icons">check</span>`;

        li.appendChild(messageText);
        li.appendChild(messageInfo);

        messageList.appendChild(li);
        scrollToBottom();
    }


    function scrollToBottom() {
        messageList.scrollTop = messageList.scrollHeight;
    }

    function handleSubmit(event) {
        event.preventDefault();
        const text = input.value.trim();
        const nickname = document.getElementById('nickname').value.trim() || 'Anonymous';
        if (text !== '') {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const newMessage = { text: text, time: time, nickname: nickname };
            const messages = JSON.parse(localStorage.getItem('messages')) || [];
            messages.push(newMessage);
            localStorage.setItem('messages', JSON.stringify(messages));
            addMessage(text, time, nickname);
            input.value = '';
        }
    }

    form.addEventListener('submit', handleSubmit);
    form.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            form.dispatchEvent(new Event('submit'));
        }
    });

    loadMessages();
});
