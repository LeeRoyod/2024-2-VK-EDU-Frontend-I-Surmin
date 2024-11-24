import React from 'react';

export const AppContext = React.createContext({
    isAuthenticated: false,
    profile: null,
    setProfile: () => {},
    chats: [],
    setChats: () => {},
    handleLogin: () => {},
    handleLogout: () => {},
});
