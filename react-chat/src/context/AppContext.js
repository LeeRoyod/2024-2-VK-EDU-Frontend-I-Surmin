import React from 'react';

const AppContext = React.createContext({
    isAuthenticated: false,
    profile: null,
    setProfile: () => {},
    chats: [],
    setChats: () => {},
    handleLogin: () => {},
    handleLogout: () => {},
});

export default AppContext;
