import React, { useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { ChatList } from './components/ChatList/ChatList';
import { Chat } from './components/Chat/Chat';
import { Profile } from './components/Profile/Profile';
import { Login } from './components/Login/Login';
import { Register } from './components/Register/Register';
import { Api } from './api';
import { CentrifugeApi } from './api/centrifuge';
import notificationSound from './assets/notification.mp3';
import { debugLog } from './utils/logger';
import { useDispatch, useSelector } from 'react-redux';
import { handleLogout, handleLogin, setProfile } from './slices/authSlice';
import { setChats, setCurrentChatId } from './slices/chatsSlice';

export const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, profile, isProfileLoaded, accessToken } = useSelector(state => state.auth);
  const { chats, currentChatId } = useSelector(state => state.chats);

  const audioRef = useRef(null);

  const fetchProfileData = useCallback(async (token) => {
    try {
      Api.setAccessToken(token);
      const userData = await Api.getCurrentUser();
      dispatch(setProfile(userData));
      await Api.setUserOnline();
    } catch (error) {
      console.error('Ошибка при получении профиля:', error);
      dispatch(handleLogout());
    }
  }, [dispatch]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (storedAccessToken && storedRefreshToken) {
      dispatch(handleLogin(storedAccessToken, storedRefreshToken));
    }
  }, [dispatch]);

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
        icon: message.sender?.avatar || '/default-avatar.png'
      });

      notification.onclick = () => {
        window.focus();
        navigate(`/chat/${message.chat}`);
      };
    }
  }, [navigate, getChatTitle]);

  const handleIncomingMessageFunction = useCallback((message, event) => {
    debugLog('Получено сообщение:', message, 'Событие:', event);

    if (event === 'read_all' || event === 'read') {
      Api.getChats().then(allChats => dispatch(setChats(allChats))).catch(error => console.error(error));
      return;
    }

    const messageChatId = message.chat;
    if (message.sender && currentChatId !== messageChatId && message.sender.id !== profile?.id) {
      triggerNotification(message);
      playSound();
      vibrateDevice();
    }

    Api.getChats().then(allChats => dispatch(setChats(allChats))).catch(error => console.error(error));
  }, [currentChatId, profile, triggerNotification, playSound, vibrateDevice, dispatch]);

  const fetchChatsData = useCallback(async () => {
    try {
      const allChats = await Api.getChats(100);
      dispatch(setChats(allChats));
    } catch (error) {
      console.error('Ошибка при получении чатов:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      fetchProfileData(accessToken).then(() => {
        fetchChatsData();
      });
    }
  }, [isAuthenticated, accessToken, fetchProfileData, fetchChatsData]);

  useEffect(() => {
    if (isAuthenticated && isProfileLoaded && profile) {
      CentrifugeApi.connectToCentrifuge(profile.id, accessToken, handleIncomingMessageFunction);
    }

    return () => {
      CentrifugeApi.disconnectFromCentrifuge();
    };
  }, [isAuthenticated, isProfileLoaded, profile, accessToken, handleIncomingMessageFunction]);

  if (isAuthenticated && !isProfileLoaded) {
    return <div>Загрузка...</div>;
  }

  return (
        <>
            <audio ref={audioRef} src={notificationSound} />
            <Routes>
                <Route path="/" element={isAuthenticated ? <ChatList /> : <Navigate to="/login" />} />
                <Route path="/chat/:chatId" element={isAuthenticated ? <ChatWrapper /> : <Navigate to="/login" />} />
                <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} />
                <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </>
  );
};

function ChatWrapper () {
  const { chatId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentChatId(chatId));
    return () => dispatch(setCurrentChatId(null));
  }, [chatId, dispatch]);

  return <Chat chatId={chatId} />;
}
