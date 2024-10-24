// src/components/ChatItem/ChatItem.jsx
import React, { useEffect, useState, useContext } from 'react';
import styles from './ChatItem.module.scss';
import AppContext from '../../context/AppContext';
import { Avatar } from '@mui/material';
import { Done, DoneAll } from '@mui/icons-material';

function ChatItem({ chat, openChat }) {
    const [lastMessage, setLastMessage] = useState(null);
    const { userNickname } = useContext(AppContext);

    useEffect(() => {
        const messages = JSON.parse(localStorage.getItem(`messages_${chat.id}`)) || [];
        const lastMsg = messages.length > 0 ? messages[messages.length - 1] : null;
        setLastMessage(lastMsg);
    }, [chat.id]);

    const handleClick = () => {
        openChat(chat.id);
    };

    const lastMessageText = lastMessage ? lastMessage.text : 'Нет сообщений';
    const lastMessageTime = lastMessage ? lastMessage.time : '';
    const lastMessageFromUser = lastMessage ? lastMessage.nickname === userNickname : false;
    const lastMessageRead = lastMessage ? lastMessage.read : false;

    return (
        <li className={styles.chatItem} onClick={handleClick}>
            <div className={styles.chatAvatar}>
                <Avatar src={chat.avatar}>
                    {!chat.avatar && chat.name.charAt(0)}
                </Avatar>
            </div>
            <div className={styles.chatInfo}>
                <div className={styles.chatName}>{chat.name}</div>
                <div className={styles.chatLastMessageContainer}>
                    <div className={styles.chatLastMessage}>{lastMessageText}</div>
                    <div className={styles.chatLastMessageInfo}>
                        <span className={styles.messageTime}>{lastMessageTime}</span>
                        {lastMessageFromUser && (
                            lastMessageRead ? <DoneAll className={styles.messageCheck} /> : <Done className={styles.messageCheck} />
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
}

export default ChatItem;
