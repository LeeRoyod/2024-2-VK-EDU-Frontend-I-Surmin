import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ChatList } from './components/ChatList/ChatList';
import { Chat } from './components/Chat/Chat';
import { Profile } from './components/Profile/Profile';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { AppContext } from './context/AppContext';
import { Api } from './api';
import { CentrifugeApi } from './api/centrifuge';
import notificationSound from './assets/notification.mp3';
import {debugLog} from "./utils/logger";

export const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [profile, setProfile] = useState(null);
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const navigate = useNavigate();
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        setProfile(null);
        setIsProfileLoaded(false);
        Api.setAccessToken(null);
        CentrifugeApi.disconnectFromCentrifuge();
        navigate('/login');
    }, [navigate]);

    const fetchProfileData = useCallback(async (token) => {
        try {
            Api.setAccessToken(token);
            const userData = await Api.getCurrentUser();
            setProfile(userData);
            setIsProfileLoaded(true);
        } catch (error) {
            console.error('Ошибка при получении профиля:', error);
            handleLogout();
        }
    }, [handleLogout]);

    const handleLogin = useCallback((access, refresh) => {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        setIsAuthenticated(true);
        fetchProfileData(access);
        navigate('/');
    }, [fetchProfileData, navigate]);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (storedAccessToken && storedRefreshToken) {
            setIsAuthenticated(true);
            fetchProfileData(storedAccessToken);
        } else {
            setIsAuthenticated(false);
        }
    }, [fetchProfileData]);

    const getChatTitle = useCallback((chatId) => {
        const chat = chats.find(c => c.id === chatId);
        return chat ? chat.title : 'Неизвестный чат';
    }, [chats]);

    const playSound = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play().catch(error => console.error('Ошибка при воспроизведении звука:', error));
        }
    }, []);

    const vibrateDevice = useCallback(() => {
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
    }, []);

    const triggerNotification = useCallback((message) => {
        if (Notification.permission === 'granted') {
            const notification = new Notification(`Новое сообщение в чате "${getChatTitle(message.chat)}"`, {
                body: message.text || 'Без текста',
                icon: message.sender.avatar || '/default-avatar.png',
            });

            notification.onclick = () => {
                window.focus();
                navigate(`/chat/${message.chat}`);
            };
        }
    }, [navigate, getChatTitle]);

    const handleIncomingMessageFunction = useCallback((message) => {
        const messageChatId = message.chat;
        debugLog('Получено сообщение:', message);

        if (currentChatId !== messageChatId && message.sender.id !== profile?.id) {
            triggerNotification(message);
            playSound();
            vibrateDevice();
        }

        Api.getChats().then(allChats => setChats(allChats)).catch(error => console.error(error));
    }, [currentChatId, triggerNotification, playSound, vibrateDevice, profile]);

    const fetchChatsData = useCallback(async () => {
        try {
            const allChats = await Api.getChats(100);
            setChats(allChats);
        } catch (error) {
            console.error('Ошибка при получении чатов:', error);
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            fetchChatsData();
        }
    }, [isAuthenticated, fetchChatsData]);

    useEffect(() => {
        if (isAuthenticated && isProfileLoaded && profile) {
            CentrifugeApi.connectToCentrifuge(profile.id, localStorage.getItem('accessToken'), handleIncomingMessageFunction);
        }

        return () => {
            CentrifugeApi.disconnectFromCentrifuge();
        };
    }, [isAuthenticated, isProfileLoaded, profile, handleIncomingMessageFunction]);

    if (isAuthenticated === null || (isAuthenticated && !isProfileLoaded)) {
        return <div>Загрузка...</div>;
    }

    return (
        <AppContext.Provider value={{
            isAuthenticated,
            profile,
            setProfile,
            chats,
            setChats,
            handleLogin,
            handleLogout,
            currentChatId,
            setCurrentChatId,
        }}>
            <audio ref={audioRef} src={notificationSound} />
            <Routes>
                <Route path="/" element={isAuthenticated ? <ChatList /> : <Navigate to="/login" />} />
                <Route path="/chat/:chatId" element={isAuthenticated ? <ChatWrapper /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AppContext.Provider>
    );
}

function ChatWrapper() {
    const { chatId } = useParams();
    const { setCurrentChatId } = React.useContext(AppContext);

    useEffect(() => {
        setCurrentChatId(chatId);
        return () => setCurrentChatId(null);
    }, [chatId, setCurrentChatId]);

    return <Chat chatId={chatId} />;
}
