import React, { useState, useContext } from 'react';
import styles from './ChatList.module.scss';
import ChatItem from '../ChatItem/ChatItem';
import { TextField, IconButton, Menu, MenuItem } from '@mui/material';
import { Edit, Menu as MenuIcon } from '@mui/icons-material';
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

function ChatList({ addNewChat }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { chats } = useContext(AppContext);
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleCreateChat = () => {
        const chatName = prompt('Введите имя нового чата:');
        if (chatName) {
            addNewChat(chatName);
        }
    };

    const filteredChats = chats.filter(chat =>
        chat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleBurgerClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        handleMenuClose();
    };

    const openChat = (chatId) => {
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className={styles.form}>
            <header className={styles.header}>
                <IconButton
                    className={styles.burgerButton}
                    aria-label="Меню"
                    onClick={handleBurgerClick}
                >
                    <MenuIcon />
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
                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <MenuItem onClick={handleProfileClick}>Мой профиль</MenuItem>
                </Menu>
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
