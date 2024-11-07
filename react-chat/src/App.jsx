import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import ChatList from './components/ChatList/ChatList';
import Chat from './components/Chat/Chat';
import Profile from './components/Profile/Profile';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import AppContext from './context/AppContext';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [profile, setProfile] = useState(null);
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();
    const [isProfileLoaded, setIsProfileLoaded] = useState(false);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setRefreshToken(null);
        setIsAuthenticated(false);
        setProfile(null);
        setIsProfileLoaded(false);
        navigate('/login');
    }, [navigate]);

    const fetchProfile = useCallback(async (token) => {
        try {
            const response = await fetch('/api/user/current/', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
                setIsProfileLoaded(true);
            } else {
                handleLogout();
            }
        } catch (error) {
            console.error('Ошибка при получении профиля:', error);
            handleLogout();
        }
    }, [handleLogout]);

    const handleLogin = useCallback((access, refresh) => {
        localStorage.setItem('accessToken', access);
        localStorage.setItem('refreshToken', refresh);
        setAccessToken(access);
        setRefreshToken(refresh);
        setIsAuthenticated(true);
        fetchProfile(access);
        navigate('/');
    }, [fetchProfile, navigate]);

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setIsAuthenticated(true);
            fetchProfile(storedAccessToken);
        } else {
            setIsAuthenticated(false);
        }
    }, [fetchProfile]);

    if (isAuthenticated === null || (isAuthenticated && !isProfileLoaded)) {
        return <div>Загрузка...</div>;
    }

    return (
        <AppContext.Provider value={{
            isAuthenticated,
            accessToken,
            refreshToken,
            profile,
            setProfile,
            chats,
            setChats,
            handleLogin,
            handleLogout,
        }}>
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
    return <Chat chatId={chatId} />;
}

export default App;
