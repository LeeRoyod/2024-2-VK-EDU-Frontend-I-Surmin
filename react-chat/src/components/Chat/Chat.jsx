// react-chat/src/components/Chat/Chat.jsx
import React, { useState, useEffect, useContext, useRef } from 'react';
import styles from './Chat.module.scss';
import MessageList from '../MessageList/MessageList';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import { IconButton, TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { ArrowBack, AttachFile, Send } from '@mui/icons-material';
import AppContext from '../../context/AppContext';

function Chat({ chatId, goBack }) {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [filterValue, setFilterValue] = useState('my');
    const { userNickname, chats } = useContext(AppContext);
    const messageListRef = useRef(null);

    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);

    const [lastSentMessageId, setLastSentMessageId] = useState(null);

    const chat = chats.find(chat => chat.id === chatId);
    const chatTitle = chat ? chat.name : 'Чат';

    useEffect(() => {
        const storedMessages = JSON.parse(localStorage.getItem(`messages_${chatId}`)) || [];
        setMessages(storedMessages);
    }, [chatId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);

        setIsTyping(true);
        clearTimeout(typingTimeoutRef.current);

        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
        }, 2000);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const text = inputText.trim();
        let nickname;
        if (filterValue === 'my') {
            nickname = userNickname;
        } else {
            nickname = chatTitle;
        }
        if (text !== '') {
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const newMessage = {
                id: Date.now(),
                text: text,
                time: time,
                nickname: nickname,
                read: false
            };
            const updatedMessages = [...messages, newMessage];
            setMessages(updatedMessages);
            localStorage.setItem(`messages_${chatId}`, JSON.stringify(updatedMessages));
            setInputText('');
            setIsTyping(false);
            setLastSentMessageId(newMessage.id);
        }
    };

    const handleFilterChange = (e) => {
        const newFilter = e.target.value;
        setFilterValue(newFilter);
        markMessagesAsRead(newFilter);
    };

    const markMessagesAsRead = (filter) => {
        const updatedMessages = messages.map(msg => {
            if (filter === 'my' && msg.nickname !== userNickname && !msg.read) {
                return { ...msg, read: true };
            } else if (filter === 'others' && msg.nickname === userNickname && !msg.read) {
                return { ...msg, read: true };
            }
            return msg;
        });
        setMessages(updatedMessages);
        localStorage.setItem(`messages_${chatId}`, JSON.stringify(updatedMessages));
    };

    return (
        <div className={styles.chatContainer}>
            <header className={styles.header}>
                <IconButton className={styles.backButton} onClick={goBack}>
                    <ArrowBack />
                </IconButton>
                <h1 className={styles.chatTitle}>{chatTitle}</h1>
            </header>
            <RadioGroup
                row
                value={filterValue}
                onChange={handleFilterChange}
                className={styles.filterGroup}
            >
                <FormControlLabel value="my" control={<Radio />} label="Я" />
                <FormControlLabel value="others" control={<Radio />} label="Собеседник" />
            </RadioGroup>
            <MessageList
                messages={messages}
                filterValue={filterValue}
                messageListRef={messageListRef}
                lastSentMessageId={lastSentMessageId}
            />
            {isTyping && <TypingIndicator />}
            <form className={styles.chatForm} onSubmit={handleSubmit}>
                <div className={styles.inputContainer}>
                    <IconButton className={styles.attachIcon}>
                        <AttachFile />
                    </IconButton>
                    <TextField
                        className={styles.formInput}
                        placeholder="Введите сообщение..."
                        variant="outlined"
                        size="small"
                        value={inputText}
                        onChange={handleInputChange}
                    />
                    <IconButton className={styles.sendButton} type="submit">
                        <Send />
                    </IconButton>
                </div>
            </form>
        </div>
    );
}

export default Chat;
