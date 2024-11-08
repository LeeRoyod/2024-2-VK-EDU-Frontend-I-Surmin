import React, { useContext } from 'react';
import styles from './ChatItem.module.scss';
import AppContext from '../../context/AppContext';
import { Avatar, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

function ChatItem({ chat, openChat, deleteChat }) {
    const { profile } = useContext(AppContext);

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

    const lastMessageText = chat.last_message && chat.last_message.text
        ? chat.last_message.text
        : 'Нет сообщений';

    const lastMessageTime = chat.last_message && chat.last_message.created_at
        ? new Date(chat.last_message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : '';

    const lastMessageFromUser = chat.last_message && chat.last_message.sender && chat.last_message.sender.id === profile.id;

    return (
        <li className={styles.chatItem} onClick={handleClick}>
            <div className={styles.chatAvatar}>
                <Avatar src={chat.avatar}>
                    {!chat.avatar && chat.title.charAt(0)}
                </Avatar>
            </div>
            <div className={styles.chatInfo}>
                <div className={styles.chatName}>{chat.title}</div>
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
                            <span className={styles.messageCheck}>✓</span>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
}

export default ChatItem;