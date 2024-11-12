import React, { useState, useEffect, useContext, useRef, useLayoutEffect, useCallback } from 'react';
import styles from './Chat.module.scss';
import MessageList from '../MessageList/MessageList';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import { IconButton, TextField } from '@mui/material';
import { ArrowBack, AttachFile, Send } from '@mui/icons-material';
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import Api from '../../api/api';

function Chat({ chatId }) {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const { profile, chats } = useContext(AppContext);
    const messageListRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [lastSentMessageId, setLastSentMessageId] = useState(null);
    const navigate = useNavigate();
    const isFirstLoad = useRef(true);

    const fetchChatData = useCallback(async () => {
        try {
            const chatData = await Api.getChat(chatId);
            setChat(chatData);
        } catch (error) {
            console.error('Ошибка при получении данных чата:', error);
        }
    }, [chatId]);

    const fetchMessagesData = useCallback(async () => {
        try {
            const allMessages = await Api.getMessages(chatId, 50);
            setMessages(allMessages.reverse());
        } catch (error) {
            console.error('Ошибка при получении сообщений:', error);
        }
    }, [chatId]);

    useEffect(() => {
        const foundChat = chats.find(chat => chat.id === chatId);
        if (foundChat) {
            setChat(foundChat);
        } else {
            fetchChatData();
        }
        fetchMessagesData();
        isFirstLoad.current = true;
    }, [chatId, chats, fetchChatData, fetchMessagesData]);

    const isUserAtBottom = () => {
        if (messageListRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = messageListRef.current;
            return scrollHeight - scrollTop <= clientHeight + 50;
        }
        return false;
    };

    useLayoutEffect(() => {
        if (messageListRef.current && messages.length > 0) {
            if (isFirstLoad.current) {
                scrollToBottom();
                isFirstLoad.current = false;
            } else if (isUserAtBottom()) {
                scrollToBottom();
            }
        }
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const text = inputText.trim();
        if (text !== '') {
            try {
                const newMessage = await Api.sendMessage({
                    text: text,
                    chat: chatId,
                });

                newMessage.sender = {
                    id: profile.id,
                    username: profile.username,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    bio: profile.bio,
                    avatar: profile.avatar,
                };

                setMessages([...messages, newMessage]);
                setInputText('');
                setIsTyping(false);
                setLastSentMessageId(newMessage.id);
                scrollToBottom();
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
                alert(`Ошибка при отправке сообщения: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchMessagesData();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [chatId, fetchMessagesData]);

    const handleGoBack = () => {
        navigate('/');
    };

    const onDeleteMessage = async (messageId) => {
        const confirmed = window.confirm('Вы действительно хотите удалить это сообщение?');
        if (!confirmed) return;

        try {
            await Api.deleteMessage(messageId);
            setMessages(messages.filter((msg) => msg.id !== messageId));
        } catch (error) {
            console.error('Ошибка при удалении сообщения:', error);
            alert(`Ошибка при удалении сообщения: ${error.message}`);
        }
    };

    const onEditMessage = async (messageId, newText) => {
        try {
            const updatedMessage = await Api.editMessage(messageId, { text: newText });
            setMessages(messages.map((msg) => (msg.id === messageId ? updatedMessage : msg)));
        } catch (error) {
            console.error('Ошибка при редактировании сообщения:', error);
            alert(`Ошибка при редактировании сообщения: ${error.message}`);
        }
    };

    if (!chat) {
        return <div className={styles.loading}>Загрузка чата...</div>;
    }

    return (
        <div className={styles.chatContainer}>
            <header className={styles.header}>
                <IconButton className={styles.backButton} onClick={handleGoBack}>
                    <ArrowBack />
                </IconButton>
                <h1 className={styles.chatTitle}>{chat.title}</h1>
            </header>
            <MessageList
                messages={messages}
                messageListRef={messageListRef}
                lastSentMessageId={lastSentMessageId}
                onDeleteMessage={onDeleteMessage}
                onEditMessage={onEditMessage}
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
                        required
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
