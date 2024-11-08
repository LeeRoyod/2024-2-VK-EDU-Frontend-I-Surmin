import React, { useState, useEffect, useContext, useCallback } from 'react';
import styles from './ChatList.module.scss';
import ChatItem from '../ChatItem/ChatItem';
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
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

function ChatList() {
    const [searchTerm, setSearchTerm] = useState('');
    const { chats, setChats, accessToken, profile } = useContext(AppContext);
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);
    const [openCreateChatDialog, setOpenCreateChatDialog] = useState(false);
    const [chatTitle, setChatTitle] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [userSearchTerm, setUserSearchTerm] = useState('');

    const fetchChats = useCallback(async () => {
        try {
            let allChats = [];
            let nextUrl = `${process.env.REACT_APP_API_URL}/chats/?page_size=100`;
            while (nextUrl) {
                const response = await fetch(nextUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    allChats = allChats.concat(data.results);

                    if (data.next) {
                        const url = new URL(data.next, window.location.origin);
                        nextUrl = url.pathname + url.search;
                    } else {
                        nextUrl = null;
                    }
                } else {
                    console.error('Ошибка при получении чатов');
                    break;
                }
            }
            setChats(allChats);
        } catch (error) {
            console.error('Ошибка при получении чатов:', error);
        }
    }, [accessToken, setChats]);

    const fetchUsers = useCallback(async () => {
        try {
            let allUsers = [];
            let nextUrl = `${process.env.REACT_APP_API_URL}/users/?page_size=100`;

            while (nextUrl) {
                const response = await fetch(nextUrl, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    allUsers = allUsers.concat(data.results);

                    if (data.next) {
                        const url = new URL(data.next, window.location.origin);
                        nextUrl = url.pathname + url.search;
                    } else {
                        nextUrl = null;
                    }
                } else {
                    console.error('Ошибка при получении списка пользователей');
                    break;
                }
            }
            setUsers(allUsers);
        } catch (error) {
            console.error('Ошибка при получении списка пользователей:', error);
        }
    }, [accessToken, setUsers]);

    useEffect(() => {
        if (accessToken) {
            fetchChats();
            fetchUsers();
        }
    }, [accessToken, fetchChats, fetchUsers]);

    const addNewChat = async (chatName, memberIds) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/chats/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: chatName,
                    is_private: false,
                    members: memberIds,
                }),
            });
            if (response.ok) {
                fetchChats();
            } else {
                const errorData = await response.json();
                console.error('Ошибка при создании чата:', errorData);
                alert(`Ошибка при создании чата: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Ошибка при создании чата:', error);
        }
    };

    const deleteChat = async (chatId) => {
        const confirmed = window.confirm('Вы действительно хотите удалить этот чат?');
        if (!confirmed) return;
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/chat/${chatId}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                setChats(chats.filter((chat) => chat.id !== chatId));
            } else {
                const errorData = await response.json();
                console.error('Ошибка при удалении чата:', errorData);
                alert(`Ошибка при удалении чата: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Ошибка при удалении чата:', error);
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
        setChatTitle('');
        setSelectedUserIds([]);
        setUserSearchTerm('');
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
        handleCreateChatClose();
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
        .filter((user) => user.id !== profile.id);

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
                    <ChatItem key={chat.id} chat={chat} openChat={openChat} deleteChat={deleteChat} />
                ))}
            </ul>
            <Dialog
                open={openCreateChatDialog}
                onClose={handleCreateChatClose}
                maxWidth="sm"
                fullWidth
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

export default ChatList;
