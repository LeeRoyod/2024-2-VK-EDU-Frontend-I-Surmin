import React from 'react';

const AppContext = React.createContext({
    profile: {
        name: 'Илья',
        nickname: '@Илья',
        about: '',
    },
    setProfile: () => {},
    chats: [],
    setChats: () => {},
});

export default AppContext;
