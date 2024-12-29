import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styles from './Chat.module.scss';
import { MessageList } from '../MessageList/MessageList';
import { TypingIndicator } from '../TypingIndicator/TypingIndicator';
import { IconButton, TextField } from '@mui/material';
import { ArrowBack, Image as ImageIcon, Send, Mic, Stop, LocationOn } from '@mui/icons-material';
import CloseIcon from '@mui/icons-material/Close';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../api';
import { debugLog } from '../../utils/logger';
import { LazyLoadImage } from '../LazyLoadImage/LazyLoadImage';

export const Chat = ({ chatId }) => {
  const { profile } = useSelector(state => state.auth);
  const { chats } = useSelector(state => state.chats);
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messageListRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const [lastSentMessageId, setLastSentMessageId] = useState(null);
  const navigate = useNavigate();
  const isFirstLoad = useRef(true);
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const audioRef = useRef(null);
  const audioChunksRef = useRef([]);

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
      await Api.readAllMessages(chatId);
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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...imageFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length > 0) {
      setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    }
  };

  useEffect(() => {
    const newPreviews = selectedFiles.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }));
    setPreviews(newPreviews);

    return () => {
      newPreviews.forEach(preview => URL.revokeObjectURL(preview.url));
    };
  }, [selectedFiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = inputText.trim();
    const files = selectedFiles;

    if (text === '' && files.length === 0 && !isRecording) {
      alert('Введите текст или выберите изображения/запишите голосовое сообщение для отправки.');
      return;
    }

    try {
      let newMessage;
      if (files.length > 0) {
        const formData = new FormData();
        formData.append('chat', chatId);
        if (text !== '') {
          formData.append('text', text);
        }
        files.forEach(file => {
          formData.append('files', file);
        });

        debugLog('Отправка FormData:');
        for (const pair of formData.entries()) {
          debugLog(`${pair[0]}:`, pair[1]);
        }

        newMessage = await Api.sendMessage(formData, true);
      } else {
        const messageData = {
          text,
          chat: chatId
        };
        debugLog('Отправка JSON:', messageData);
        newMessage = await Api.sendMessage(messageData);
      }

      newMessage.sender = {
        id: profile.id,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio,
        avatar: profile.avatar
      };

      setMessages([...messages, newMessage]);
      setInputText('');
      setSelectedFiles([]);
      setPreviews([]);
      setIsTyping(false);
      setLastSentMessageId(newMessage.id);
      scrollToBottom();
    } catch (error) {
      console.error('Ошибка при отправке сообщения:', error);
      alert(`Ошибка при отправке сообщения: ${error.message}`);
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices) {
      alert('Ваш браузер не поддерживает запись аудио.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      setIsRecording(true);
      audioChunksRef.current = [];
      recorder.start();

      recorder.ondataavailable = (e) => {
        debugLog('Получены аудиоданные:', e.data);
        audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        debugLog('Запись остановлена. Аудио чанки:', audioChunksRef.current);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/ogg' });
        debugLog('Создан Blob:', audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
        }
        sendVoiceMessage(audioBlob);
        audioChunksRef.current = [];
      };
    } catch (error) {
      console.error('Ошибка при доступе к микрофону:', error);
      alert('Не удалось получить доступ к микрофону.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const sendVoiceMessage = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('chat', chatId);
      formData.append('voice', audioBlob, 'voice.ogg');

      if (inputText.trim() !== '') {
        formData.append('text', inputText.trim());
      }

      debugLog('Отправка голосового сообщения:');
      for (const pair of formData.entries()) {
        debugLog(`${pair[0]}:`, pair[1]);
      }

      const newMessage = await Api.sendMessage(formData, true);
      debugLog('Получено новое сообщение:', newMessage);

      newMessage.sender = {
        id: profile.id,
        username: profile.username,
        first_name: profile.first_name,
        last_name: profile.last_name,
        bio: profile.bio,
        avatar: profile.avatar
      };

      setMessages([...messages, newMessage]);
      setInputText('');
      setIsTyping(false);
      setLastSentMessageId(newMessage.id);
      scrollToBottom();
    } catch (error) {
      console.error('Ошибка при отправке голосового сообщения:', error);
      alert(`Ошибка при отправке голосового сообщения: ${error.message}`);
    }
  };

  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      alert('Геолокация не поддерживается вашим браузером.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const link = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
        try {
          const messageData = {
            text: link,
            chat: chatId
          };
          const newMessage = await Api.sendMessage(messageData);
          newMessage.sender = {
            id: profile.id,
            username: profile.username,
            first_name: profile.first_name,
            last_name: profile.last_name,
            bio: profile.bio,
            avatar: profile.avatar
          };

          setMessages([...messages, newMessage]);
          setLastSentMessageId(newMessage.id);
          scrollToBottom();
        } catch (error) {
          console.error('Ошибка при отправке сообщения с геолокацией:', error);
          alert(`Ошибка при отправке геолокации: ${error.message}`);
        }
      },
      (error) => {
        console.error('Ошибка при получении геолокации:', error);
        alert('Не удалось получить геолокацию.');
      }
    );
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
      debugLog('Обновлённое сообщение с сервера:', updatedMessage);
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
        <div
            className={styles.chatContainer}
            onDragOver={(e) => { e.preventDefault(); }}
            onDrop={handleDrop}
        >
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
                    <IconButton
                        className={styles.attachIcon}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <ImageIcon />
                    </IconButton>
                    <IconButton className={styles.locationButton} onClick={handleSendLocation}>
                        <LocationOn />
                    </IconButton>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        style={{ display: 'none' }}
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                    />
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
                    <IconButton
                        className={styles.micButton}
                        onClick={isRecording ? stopRecording : startRecording}
                        color={isRecording ? 'secondary' : 'default'}
                    >
                        {isRecording ? <Stop /> : <Mic />}
                    </IconButton>
                </div>
                {previews.length > 0 && (
                    <div className={styles.selectedFiles}>
                        {previews.map((preview, index) => (
                            <div key={index} className={styles.fileItem}>
                                <LazyLoadImage
                                    src={preview.url}
                                    alt={`Предпросмотр ${index + 1}`}
                                    className={styles.previewImage}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                      setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                                      setPreviews(previews.filter((_, i) => i !== index));
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </div>
                        ))}
                    </div>
                )}
                <audio ref={audioRef} controls style={{ display: 'none' }} />
            </form>
        </div>
  );
};

Chat.propTypes = {
  chatId: PropTypes.string.isRequired
};
