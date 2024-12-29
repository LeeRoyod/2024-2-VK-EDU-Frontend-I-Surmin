import React from 'react';
import styles from './ChatItem.module.scss';
import { Avatar, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';

export const ChatItem = ({ chat, openChat, deleteChat }) => {
    const { profile } = useSelector(state => state.auth);

    if (!profile) {
        return <div>Загрузка...</div>;
    }

    const isCreator = chat.creator && chat.creator.id === profile.id;

    const handleClick = () => {
        openChat(chat.id);
    };

    const handleDelete = (e) => {
        e.stopPropagation();
        deleteChat(chat.id);
    };

    let lastMessageText = 'Нет сообщений';
    let lastMessageTime = '';
    let lastMessageFromUser = false;
    let lastMessageReadStatus = '';

    if (chat.last_message) {
        const lastMsg = chat.last_message;

        if (lastMsg.text && lastMsg.text.trim() !== '') {
            lastMessageText = lastMsg.text;
        } else if (lastMsg.files && lastMsg.files.length > 0) {
            lastMessageText = lastMsg.files.length === 1 ? 'Изображение' : 'Изображения';
        }

        if (lastMsg.created_at) {
            lastMessageTime = new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        if (lastMsg.sender && lastMsg.sender.id === profile.id) {
            lastMessageFromUser = true;

            if (Array.isArray(lastMsg.was_read_by)) {
                const otherReaders = lastMsg.was_read_by.filter(u => u.id !== profile.id);
                if (otherReaders.length > 0) {
                    lastMessageReadStatus = '✔✔';
                } else {
                    lastMessageReadStatus = '✔';
                }
            } else {
                lastMessageReadStatus = '✔';
            }
        }
    }

    let chatName = chat.title;
    let chatAvatar = chat.avatar;
    let onlineIndicator = null;

    if (chat.is_private && chat.members.length === 2) {
        const otherUser = chat.members.find(m => m.id !== profile.id);
        if (otherUser) {
            chatName = `${otherUser.first_name} ${otherUser.last_name}`.trim() || otherUser.username;
            chatAvatar = otherUser.avatar;
            onlineIndicator = (
                <span
                    className={styles.onlineIndicator}
                    style={{ backgroundColor: otherUser.is_online ? '#4caf50' : '#999' }}
                    title={otherUser.is_online ? 'Онлайн' : 'Оффлайн'}
                ></span>
            );
        }
    }

    return (
        <li className={styles.chatItem} onClick={handleClick}>
            <div className={styles.chatAvatar}>
                <Avatar src={chatAvatar}>
                    {!chatAvatar && chatName.charAt(0)}
                </Avatar>
            </div>
            <div className={styles.chatInfo}>
                <div className={styles.chatName}>
                    {chatName} {onlineIndicator}
                </div>
                <div className={styles.chatLastMessageContainer}>
                    <div className={styles.chatLastMessage}>{lastMessageText}</div>
                    <div className={styles.chatLastMessageInfo}>
                        {isCreator && (
                            <IconButton
                                className={styles.deleteButton}
                                onClick={handleDelete}
                                aria-label="delete"
                                size="small"
                            >
                                <Delete fontSize="small" />
                            </IconButton>
                        )}
                        {lastMessageTime && (
                            <span className={styles.messageTime}>{lastMessageTime}</span>
                        )}
                        {lastMessageFromUser && (
                            <span className={styles.messageCheck}>{lastMessageReadStatus}</span>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
}
