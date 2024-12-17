import React, { useState, useEffect, useCallback } from 'react';
import styles from './ChatList.module.scss';
import { ChatItem } from '../ChatItem/ChatItem';
import {
    TextField,
    IconButton,
    Menu,
    MenuItem,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Checkbox,
} from '@mui/material';
import { Edit, Menu as MenuIcon } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../api';
import { setChats } from '../../slices/chatsSlice';

export const ChatList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { chats } = useSelector(state => state.chats);
    const { profile } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [openCreateChatDialog, setOpenCreateChatDialog] = useState(false);
    const [chatTitle, setChatTitle] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');

    const fetchChatsData = useCallback(async () => {
        try {
            const allChats = await Api.getChats(100);
            dispatch(setChats(allChats));
        } catch (error) {
            console.error('Ошибка при получении чатов:', error);
        }
    }, [dispatch]);

    const fetchUsersData = useCallback(async () => {
        try {
            const allUsers = await Api.getUsers(100);
            setUsers(allUsers);
        } catch (error) {
            console.error('Ошибка при получении списка пользователей:', error);
        }
    }, []);

    useEffect(() => {
        fetchChatsData();
        fetchUsersData();
    }, [fetchChatsData, fetchUsersData]);

    const addNewChat = async (chatName, memberIds) => {
        try {
            await Api.createChat({
                title: chatName,
                is_private: false,
                members: memberIds,
            });
            fetchChatsData();
        } catch (error) {
            console.error('Ошибка при создании чата:', error);
            alert(`Ошибка при создании чата: ${error.message}`);
        }
    };

    const deleteChatHandler = async (chatId) => {
        const confirmed = window.confirm('Вы действительно хотите удалить этот чат?');
        if (!confirmed) return;
        try {
            await Api.deleteChat(chatId);
            dispatch(setChats(chats.filter((chat) => chat.id !== chatId)));
        } catch (error) {
            console.error('Ошибка при удалении чата:', error);
            alert(`Ошибка при удалении чата: ${error.message}`);
        }
    };

    const filteredChats = chats.filter((chat) =>
        chat.title.toLowerCase().includes(searchTerm.toLowerCase())
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

    const handleCreateChatClick = () => {
        setOpenCreateChatDialog(true);
    };

    const handleCreateChatClose = () => {
        setOpenCreateChatDialog(false);
    };

    const handleCreateChatConfirm = () => {
        if (chatTitle.trim() === '') {
            alert('Введите имя нового чата');
            return;
        }
        if (selectedUserIds.length === 0) {
            alert('Выберите пользователей для добавления в чат');
            return;
        }
        addNewChat(chatTitle, selectedUserIds);
        setOpenCreateChatDialog(false);
    };

    const handleUserToggle = (userId) => {
        const currentIndex = selectedUserIds.indexOf(userId);
        const newSelectedUserIds = [...selectedUserIds];

        if (currentIndex === -1) {
            newSelectedUserIds.push(userId);
        } else {
            newSelectedUserIds.splice(currentIndex, 1);
        }
        setSelectedUserIds(newSelectedUserIds);
    };

    const filteredUsers = users
        .filter((user) => {
            const fullName = `${user.first_name} ${user.last_name} ${user.username}`;
            return fullName.toLowerCase().includes(userSearchTerm.toLowerCase());
        })
        .filter((user) => user.id !== profile?.id);

    const handleCreateChatDialogExited = () => {
        setChatTitle('');
        setSelectedUserIds([]);
        setUserSearchTerm('');
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
                    onChange={(e) => setSearchTerm(e.target.value)}
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
                {filteredChats.map((chat) => (
                    <ChatItem
                        key={chat.id}
                        chat={chat}
                        openChat={openChat}
                        deleteChat={deleteChatHandler}
                    />
                ))}
            </ul>
            <Dialog
                open={openCreateChatDialog}
                onClose={handleCreateChatClose}
                maxWidth="sm"
                fullWidth
                onExited={handleCreateChatDialogExited}
            >
                <DialogTitle>Создать новый чат</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Название чата"
                        type="text"
                        fullWidth
                        value={chatTitle}
                        onChange={(e) => setChatTitle(e.target.value)}
                        required
                    />
                    <TextField
                        margin="dense"
                        label="Поиск пользователей"
                        type="text"
                        fullWidth
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                    <List>
                        {filteredUsers.map((user) => (
                            <ListItem key={user.id} disablePadding>
                                <ListItemButton onClick={() => handleUserToggle(user.id)}>
                                    <Checkbox
                                        edge="start"
                                        checked={selectedUserIds.indexOf(user.id) !== -1}
                                        tabIndex={-1}
                                        disableRipple
                                    />
                                    <ListItemText
                                        primary={`${user.first_name} ${user.last_name} (${user.username})`}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCreateChatClose} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleCreateChatConfirm} color="primary">
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>
            <IconButton
                className={styles.floatingCreateButton}
                aria-label="Создать Новый Чат"
                title="Создать Новый Чат"
                onClick={handleCreateChatClick}
            >
                <Edit />
            </IconButton>
        </div>
    );
}
