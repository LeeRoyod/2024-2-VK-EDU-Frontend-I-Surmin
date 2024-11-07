import React from 'react';

const AppContext = React.createContext({
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    profile: null,
    setProfile: () => {},
    chats: [],
    setChats: () => {},
    handleLogin: () => {},
    handleLogout: () => {},
});

export default AppContext;
