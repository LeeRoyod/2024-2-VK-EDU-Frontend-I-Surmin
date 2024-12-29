import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styles from './MessageItem.module.scss';
import { Typography, IconButton, TextField } from '@mui/material';
import { Edit, Delete, Save, Close } from '@mui/icons-material';
import Modal from 'react-modal';
import { LazyLoadAvatar } from '../LazyLoadAvatar/LazyLoadAvatar';
import { LazyLoadImage } from '../LazyLoadImage/LazyLoadImage';

Modal.setAppElement('#root');

export const MessageItem = ({ message, isMyMessage, isNew, onDeleteMessage, onEditMessage }) => {
    const { profile } = useSelector(state => state.auth);
    const { text, sender, created_at, files, voice, was_read_by } = message;

    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text || '');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImage, setCurrentImage] = useState(null);

    const messageTime = new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let readStatus = '';
    if (isMyMessage) {
        const otherReaders = was_read_by.filter(user => user.id !== profile.id);
        readStatus = otherReaders.length > 0 ? '✔✔' : '✔';
    }

    const isReadByUser = was_read_by.some(u => u.id === profile.id);

    const messageClass = [styles.message];
    if (isMyMessage) {
        messageClass.push(styles.my);
    }
    if (isNew) {
        messageClass.push(styles.newMessage);
    }
    if (!isMyMessage && !isReadByUser) {
        messageClass.push(styles.unread);
    }

    const handleDelete = () => {
        onDeleteMessage(message.id);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditedText(text || '');
    };

    const handleEditSave = () => {
        if (editedText.trim() === '') {
            alert('Сообщение не может быть пустым');
            return;
        }
        onEditMessage(message.id, editedText);
        setIsEditing(false);
    };

    const openModal = (imageSrc) => {
        setCurrentImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentImage(null);
    };

    return (
        <li className={messageClass.join(' ')}>
            {isMyMessage ? (
                <>
                    <div className={styles.messageContent}>
                        {isEditing ? (
                            <>
                                <TextField
                                    value={editedText}
                                    onChange={(e) => setEditedText(e.target.value)}
                                    fullWidth
                                    multiline
                                    variant="outlined"
                                    size="small"
                                />
                                <div className={styles.messageActions}>
                                    <IconButton size="small" onClick={handleEditSave}>
                                        <Save fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" onClick={handleEditToggle}>
                                        <Close fontSize="small" />
                                    </IconButton>
                                </div>
                            </>
                        ) : (
                            <>
                                <Typography variant="body1" component="span">
                                    {text}
                                </Typography>
                                {files && files.length > 0 && (
                                    <div className={styles.imagesContainer}>
                                        {files.map((file, index) => (
                                            <LazyLoadImage
                                                key={index}
                                                src={file.item}
                                                alt={`file-${index}`}
                                                className={styles.messageImage}
                                                onClick={() => openModal(file.item)}
                                            />
                                        ))}
                                    </div>
                                )}
                                {voice && (
                                    <div className={styles.voiceContainer}>
                                        <audio controls>
                                            <source src={voice} type="audio/ogg" />
                                            Ваш браузер не поддерживает элемент audio.
                                        </audio>
                                    </div>
                                )}
                                <div className={styles.messageInfo}>
                                    <Typography component="span" className={styles.nicknameTime}>
                                        {sender.first_name} {sender.last_name}, {messageTime}
                                    </Typography>
                                    <div className={styles.messageActions}>
                                        <span className={styles.readStatus}>{readStatus}</span>
                                        <IconButton size="small" onClick={handleEditToggle}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={handleDelete}>
                                            <Delete fontSize="small" />
                                        </IconButton>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <LazyLoadAvatar
                        src={sender.avatar}
                        alt={`${sender.first_name} ${sender.last_name}`}
                        className={styles.avatar}
                    >
                        {!sender.avatar && sender.first_name.charAt(0)}
                    </LazyLoadAvatar>
                </>
            ) : (
                <>
                    <div className={styles.messageContent}>
                        <Typography variant="body1" component="span">
                            {text}
                        </Typography>
                        {files && files.length > 0 && (
                            <div className={styles.imagesContainer}>
                                {files.map((file, index) => (
                                    <LazyLoadImage
                                        key={index}
                                        src={file.item}
                                        alt={`file-${index}`}
                                        className={styles.messageImage}
                                        onClick={() => openModal(file.item)}
                                    />
                                ))}
                            </div>
                        )}
                        {voice && (
                            <div className={styles.voiceContainer}>
                                <audio controls>
                                    <source src={voice} type="audio/ogg" />
                                    Ваш браузер не поддерживает элемент audio.
                                </audio>
                            </div>
                        )}
                        <div className={styles.messageInfo}>
                            <Typography component="span" className={styles.nicknameTime}>
                                {sender.first_name} {sender.last_name}, {messageTime}
                            </Typography>
                        </div>
                    </div>
                    <LazyLoadAvatar
                        src={sender.avatar}
                        alt={`${sender.first_name} ${sender.last_name}`}
                        className={styles.avatar}
                    >
                        {!sender.avatar && sender.first_name.charAt(0)}
                    </LazyLoadAvatar>
                </>
            )}

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Просмотр изображения"
                className={styles.modal}
                overlayClassName={styles.overlay}
            >
                <button onClick={closeModal} className={styles.closeButton}>×</button>
                {currentImage && <img src={currentImage} alt="Просмотр" className={styles.fullImage} />}
            </Modal>
        </li>
    );
};
