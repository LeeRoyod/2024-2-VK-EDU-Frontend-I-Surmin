// src/App.jsx
import React, { useState, useEffect } from 'react';
import ChatList from './components/ChatList/ChatList';
import Chat from './components/Chat/Chat';
import AppContext from './context/AppContext';

import { avatars, defaultAvatar } from './assets/avatars';

function App() {
    const [currentPage, setCurrentPage] = useState('chatList');
    const [currentChatId, setCurrentChatId] = useState(null);
    const [chats, setChats] = useState([]);
    const [userNickname] = useState('Илья');

    useEffect(() => {
        let storedChats = JSON.parse(localStorage.getItem('chats')) || [];

        storedChats = storedChats.map((chat, index) => ({
            ...chat,
            avatar: chat.avatar || avatars[index % avatars.length] || defaultAvatar,
        }));

        setChats(storedChats);
        localStorage.setItem('chats', JSON.stringify(storedChats));
    }, []);

    const openChat = (chatId) => {
        setCurrentChatId(chatId);
        setCurrentPage('chat');
    };

    const goBackToChatList = () => {
        setCurrentPage('chatList');
    };

    const addNewChat = (chatName) => {
        const newChatId = Date.now();
        const avatar = avatars[newChatId % avatars.length] || defaultAvatar;
        const newChat = {
            id: newChatId,
            name: chatName,
            avatar: avatar,
        };
        const updatedChats = [...chats, newChat];
        setChats(updatedChats);
        localStorage.setItem('chats', JSON.stringify(updatedChats));

        const initialMessage = {
            text: 'Чат создан',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            nickname: 'Система',
            read: true,
        };
        localStorage.setItem(`messages_${newChatId}`, JSON.stringify([initialMessage]));
    };

    return (
        <AppContext.Provider value={{ userNickname, chats, setChats }}>
            {currentPage === 'chatList' ? (
                <ChatList
                    chats={chats}
                    openChat={openChat}
                    addNewChat={addNewChat}
                />
            ) : (
                <Chat
                    chatId={currentChatId}
                    goBack={goBackToChatList}
                />
            )}
        </AppContext.Provider>
    );
}

export default App;
