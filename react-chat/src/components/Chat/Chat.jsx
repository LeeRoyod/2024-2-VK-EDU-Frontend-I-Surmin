import React, { useState, useEffect, useContext, useRef, useLayoutEffect, useCallback } from 'react';
import styles from './Chat.module.scss';
import MessageList from '../MessageList/MessageList';
import TypingIndicator from '../TypingIndicator/TypingIndicator';
import { IconButton, TextField } from '@mui/material';
import { ArrowBack, AttachFile, Send } from '@mui/icons-material';
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

function Chat({ chatId }) {
    const [chat, setChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const { profile, accessToken, chats } = useContext(AppContext);
    const messageListRef = useRef(null);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [lastSentMessageId, setLastSentMessageId] = useState(null);
    const navigate = useNavigate();
    const isFirstLoad = useRef(true);

    const fetchChat = useCallback(async () => {
        try {
            const response = await fetch(`/api/chat/${chatId}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                const chatData = await response.json();
                setChat(chatData);
            } else {
                console.error('Ошибка при получении данных чата');
            }
        } catch (error) {
            console.error('Ошибка при получении данных чата:', error);
        }
    }, [accessToken, chatId]);

    const fetchMessages = useCallback(async () => {
        let allMessages = [];
        let nextUrl = `/api/messages/?chat=${chatId}&limit=50`;
        try {
            while (nextUrl) {
                const response = await fetch(nextUrl, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    allMessages = allMessages.concat(data.results);

                    if (data.next) {
                        const nextUrlObj = new URL(data.next);
                        nextUrl = nextUrlObj.pathname + nextUrlObj.search;
                    } else {
                        nextUrl = null;
                    }
                } else {
                    console.error('Ошибка при получении сообщений');
                    break;
                }
            }
            setMessages(allMessages.reverse());
        } catch (error) {
            console.error('Ошибка при получении сообщений:', error);
        }
    }, [accessToken, chatId]);

    useEffect(() => {
        const foundChat = chats.find(chat => chat.id === chatId);
        if (foundChat) {
            setChat(foundChat);
        } else {
            fetchChat();
        }
        fetchMessages();
        isFirstLoad.current = true;
    }, [chatId, chats, fetchChat, fetchMessages]);

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
                const response = await fetch('/api/messages/', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        text: text,
                        chat: chatId,
                    }),
                });

                if (response.ok) {
                    const newMessage = await response.json();
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
                } else {
                    console.error('Ошибка при отправке сообщения');
                }
            } catch (error) {
                console.error('Ошибка при отправке сообщения:', error);
            }
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchMessages();
        }, 5000);

        return () => clearInterval(intervalId);
    }, [chatId, fetchMessages]);

    const handleGoBack = () => {
        navigate('/');
    };

    const onDeleteMessage = async (messageId) => {
        const confirmed = window.confirm('Вы действительно хотите удалить это сообщение?');
        if (!confirmed) return;

        try {
            const response = await fetch(`/api/message/${messageId}/`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            if (response.ok) {
                setMessages(messages.filter((msg) => msg.id !== messageId));
            } else {
                const errorData = await response.json();
                console.error('Ошибка при удалении сообщения:', errorData);
                alert(`Ошибка при удалении сообщения: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Ошибка при удалении сообщения:', error);
        }
    };

    const onEditMessage = async (messageId, newText) => {
        try {
            const response = await fetch(`/api/message/${messageId}/`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: newText,
                }),
            });
            if (response.ok) {
                const updatedMessage = await response.json();
                setMessages(messages.map((msg) => (msg.id === messageId ? updatedMessage : msg)));
            } else {
                const errorData = await response.json();
                console.error('Ошибка при редактировании сообщения:', errorData);
                alert(`Ошибка при редактировании сообщения: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Ошибка при редактировании сообщения:', error);
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
