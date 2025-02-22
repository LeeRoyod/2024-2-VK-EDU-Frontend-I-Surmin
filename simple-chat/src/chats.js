import './chats.css';

const importAll = (r) => r.keys().map(r);
const avatars = importAll(require.context('./assets/avatars', false, /\.(png|jpe?g|svg)$/));

const avatarDefault = avatars.find(src => src.includes('avatarDefault'));
const filteredAvatars = avatars.filter(src => src !== avatarDefault);

document.addEventListener('DOMContentLoaded', () => {
    const chatList = document.querySelector('.chat-list');
    const createChatButton = document.querySelector('.floating-create-button');
    const burgerButton = document.querySelector('.burger-button');
    const searchInput = document.querySelector('.search-input');

    const chats = JSON.parse(localStorage.getItem('chats')) || [];
    const userNickname = 'Илья';

    function getAvatarForChat(index) {
        return filteredAvatars[index] || avatarDefault;
    }

    function renderChats(filter = '') {
        chatList.innerHTML = '';
        const filteredChats = chats.filter(chat =>
            chat.name.toLowerCase().includes(filter.toLowerCase())
        );

        filteredChats.forEach((chat, index) => {
            const messages = JSON.parse(localStorage.getItem(`messages_${chat.id}`)) || [];
            const lastMessageObj = messages.length > 0 ? messages[messages.length - 1] : null;
            const lastMessage = lastMessageObj ? lastMessageObj.text : 'Нет сообщений';
            const lastMessageTime = lastMessageObj ? lastMessageObj.time : '';
            const lastMessageFromUser = lastMessageObj ? (lastMessageObj.nickname === userNickname) : false;
            const lastMessageRead = lastMessageObj ? lastMessageObj.read : false;

            const li = document.createElement('li');
            li.classList.add('chat-item');
            li.onclick = () => {
                window.location.href = `index.html?chatId=${chat.id}`;
            };

            const avatar = document.createElement('div');
            avatar.classList.add('chat-avatar');
            avatar.style.backgroundImage = `url(${getAvatarForChat(index)})`;

            const info = document.createElement('div');
            info.classList.add('chat-info');

            const name = document.createElement('div');
            name.classList.add('chat-name');
            name.textContent = chat.name;

            const lastMsgContainer = document.createElement('div');
            lastMsgContainer.classList.add('chat-last-message-container');

            const lastMsg = document.createElement('div');
            lastMsg.classList.add('chat-last-message');
            lastMsg.textContent = lastMessage;

            const lastMsgInfo = document.createElement('div');
            lastMsgInfo.classList.add('chat-last-message-info');

            const timeSpan = document.createElement('span');
            timeSpan.classList.add('message-time');
            timeSpan.textContent = lastMessageTime;

            lastMsgInfo.appendChild(timeSpan);

            if (lastMessageFromUser) {
                const checkIcon = document.createElement('span');
                checkIcon.classList.add('material-icons', 'message-check');
                if (lastMessageRead) {
                    checkIcon.textContent = 'done_all';
                } else {
                    checkIcon.textContent = 'done';
                }
                lastMsgInfo.appendChild(checkIcon);
            }

            lastMsgContainer.appendChild(lastMsg);
            lastMsgContainer.appendChild(lastMsgInfo);

            info.appendChild(name);
            info.appendChild(lastMsgContainer);

            li.appendChild(avatar);
            li.appendChild(info);

            chatList.appendChild(li);
        });
    }

    renderChats();

    createChatButton.addEventListener('click', () => {
        const chatName = prompt('Введите имя нового чата:');
        if (chatName) {
            const newChatId = chats.length + 1;
            const newAvatar = avatarDefault;

            const newChat = {
                id: newChatId,
                name: chatName,
                avatar: newAvatar
            };
            chats.push(newChat);
            localStorage.setItem('chats', JSON.stringify(chats));

            const initialMessage = {
                text: 'Чат создан',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                nickname: 'Система',
                read: true
            };
            const messages = [initialMessage];
            localStorage.setItem(`messages_${newChat.id}`, JSON.stringify(messages));

            renderChats(searchInput.value);

            const newChatElement = chatList.querySelector(`.chat-item:last-child`);
            newChatElement.classList.add('new-chat');
            setTimeout(() => {
                newChatElement.classList.remove('new-chat');
            }, 1000);
        }
    });

    burgerButton.addEventListener('click', () => {
        alert('Бургер-кнопка нажата');
    });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value;
        renderChats(searchTerm);
    });
});
