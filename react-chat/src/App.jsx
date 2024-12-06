import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ChatList } from './components/ChatList/ChatList';
import { Chat } from './components/Chat/Chat';
import { Profile } from './components/Profile/Profile';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { AppContext } from './context/AppContext';
import { Api } from './api';
import { Centrifuge } from 'centrifuge';
import notificationSound from './assets/notification.mp3';
import {debugLog} from "./utils/logger";

export const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [profile, setProfile] = useState(null);
    const [chats, setChats] = useState([]);
    const [currentChatId, setCurrentChatId] = useState(null);
    const navigate = useNavigate();
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);
    const centrifugeRef = useRef(null);
    const subscriptionRef = useRef(null);
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
        if (centrifugeRef.current) {
            centrifugeRef.current.disconnect();
            centrifugeRef.current = null;
        }
        if (subscriptionRef.current) {
            subscriptionRef.current.removeAllListeners();
            subscriptionRef.current.unsubscribe();
            subscriptionRef.current = null;
        }
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
    }, [currentChatId, triggerNotification, playSound, vibrateDevice, profile, setChats]);

    useEffect(() => {
        if (isAuthenticated && isProfileLoaded && profile) {
            const connect = async () => {
                const channel = profile.id;
                try {
                    const centrifuge = new Centrifuge('wss://vkedu-fullstack-div2.ru/connection/websocket/', {
                        minReconnectDelay: 1000 * 60 * 50,
                        getToken: (ctx) =>
                            new Promise((resolve, reject) =>
                                fetch('/api/centrifugo/connect/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                                    },
                                    body: JSON.stringify(ctx),
                                })
                                    .then(res => res.json())
                                    .then(data => resolve(data.token))
                                    .catch(err => reject(err))
                            )
                    });
                    centrifugeRef.current = centrifuge;
                    centrifuge.connect();

                    const subscription = centrifuge.newSubscription(channel, {
                        minResubscribeDelay: 1000 * 60 * 50,
                        getToken: (ctx) =>
                            new Promise((resolve, reject) =>
                                fetch('/api/centrifugo/subscribe/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                                    },
                                    body: JSON.stringify(ctx),
                                })
                                    .then(res => res.json())
                                    .then(data => resolve(data.token))
                                    .catch(err => reject(err))
                            )
                    });

                    const handleIncomingMessage = (ctx) => {
                        const event = ctx.data.event;
                        if (event === 'create' || event === 'update' || event === 'delete') {
                            const message = ctx.data.message;
                            handleIncomingMessageFunction(message);
                        }
                    };

                    subscription.on('publication', handleIncomingMessage);
                    subscription.subscribe();
                    subscriptionRef.current = subscription;
                } catch (error) {
                    console.error('Ошибка при подключении к Centrifuge:', error);
                }
            };

            connect();
        }

        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.removeAllListeners();
                subscriptionRef.current.unsubscribe();
                subscriptionRef.current = null;
            }
            if (centrifugeRef.current) {
                centrifugeRef.current.disconnect();
                centrifugeRef.current = null;
            }
        };
    }, [isAuthenticated, isProfileLoaded, profile, handleIncomingMessageFunction]);

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
