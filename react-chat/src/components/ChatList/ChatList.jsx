// react-chat/src/components/ChatList/ChatList.jsx
import React, { useState, useContext } from 'react';
import styles from './ChatList.module.scss';
import ChatItem from '../ChatItem/ChatItem';
import { TextField, IconButton } from '@mui/material';
import { Edit, Menu } from '@mui/icons-material';
import AppContext from '../../context/AppContext';

function ChatList({ openChat, addNewChat }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { chats } = useContext(AppContext);

    const handleCreateChat = () => {
        const chatName = prompt('Введите имя нового чата:');
        if (chatName) {
            addNewChat(chatName);
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBurgerClick = () => {
        alert('Бургер-кнопка нажата');
    };

    return (
        <div className={styles.form}>
            <header className={styles.header}>
                <IconButton className={styles.burgerButton} aria-label="Меню" onClick={handleBurgerClick}>
                    <Menu />
                </IconButton>
                <h1 className={styles.headerTitle}>Мессенджер</h1>
                <TextField
                    className={styles.searchInput}
                    placeholder="Поиск чатов..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
            </header>
            <ul className={styles.chatList}>
                {filteredChats.map(chat => (
                    <ChatItem key={chat.id} chat={chat} openChat={openChat} />
                ))}
            </ul>
            <IconButton
                className={styles.floatingCreateButton}
                aria-label="Создать Новый Чат"
                title="Создать Новый Чат"
                onClick={handleCreateChat}
            >
                <Edit />
            </IconButton>
        </div>
    );
}

export default ChatList;
