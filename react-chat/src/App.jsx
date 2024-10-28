import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import ChatList from './components/ChatList/ChatList';
import Chat from './components/Chat/Chat';
import Profile from './components/Profile/Profile';
import AppContext from './context/AppContext';
import { avatars, defaultAvatar } from './assets/avatars';

function App() {
    const [chats, setChats] = useState([]);
    const [profile, setProfile] = useState({
        name: 'Илья',
        nickname: '@Илья',
        about: '',
    });

    useEffect(() => {
        let storedChats = JSON.parse(localStorage.getItem('chats')) || [];

        storedChats = storedChats.map((chat, index) => ({
            ...chat,
            avatar: chat.avatar || avatars[index % avatars.length] || defaultAvatar,
        }));

        setChats(storedChats);
        localStorage.setItem('chats', JSON.stringify(storedChats));
    }, []);

    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem('profile')) || {
            name: 'Илья',
            nickname: '@Илья',
            about: '',
        };
        setProfile(storedProfile);
    }, []);

    useEffect(() => {
        localStorage.setItem('profile', JSON.stringify(profile));
    }, [profile]);

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
            id: Date.now(),
            text: 'Чат создан',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            nickname: 'Система',
            name: 'Система',
            read: true,
        };
        localStorage.setItem(`messages_${newChatId}`, JSON.stringify([initialMessage]));
    };

    return (
        <AppContext.Provider value={{
            profile,
            setProfile,
            chats,
            setChats
        }}>
            <Routes>
                <Route path="/" element={<ChatList addNewChat={addNewChat} />} />
                <Route path="/chat/:chatId" element={<ChatWrapper chats={chats} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AppContext.Provider>
    );
}

function ChatWrapper({ chats }) {
    const { chatId } = useParams();
    const parsedChatId = parseInt(chatId, 10);

    if (isNaN(parsedChatId)) {
        return <Navigate to="/" replace />;
    }

    const chat = chats.find(c => c.id === parsedChatId);

    if (!chat) {
        return <Navigate to="/" replace />;
    }

    return <Chat chatId={parsedChatId} />;
}

export default App;
