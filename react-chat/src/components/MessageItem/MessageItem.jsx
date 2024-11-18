import React, { useState } from 'react';
import styles from './MessageItem.module.scss';
import { Typography, Avatar, IconButton, TextField } from '@mui/material';
import { Edit, Delete, Save, Close } from '@mui/icons-material';

export const MessageItem = ({ message, isMyMessage, isNew, onDeleteMessage, onEditMessage }) => {
    const { text, sender, created_at } = message;
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(text);

    const messageClass = [styles.message];
    if (isMyMessage) {
        messageClass.push(styles.my);
    }
    if (isNew) {
        messageClass.push(styles.newMessage);
    }

    const messageTime = new Date(created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleDelete = () => {
        onDeleteMessage(message.id);
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
        setEditedText(text);
    };

    const handleEditSave = () => {
        if (editedText.trim() === '') {
            alert('Сообщение не может быть пустым');
            return;
        }
        onEditMessage(message.id, editedText);
        setIsEditing(false);
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
                                <div className={styles.messageInfo}>
                                    <Typography component="span" className={styles.nicknameTime}>
                                        {sender.first_name} {sender.last_name}, {messageTime}
                                    </Typography>
                                    <div className={styles.messageActions}>
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
                    <Avatar src={sender.avatar} className={styles.avatar}>
                        {!sender.avatar && sender.first_name.charAt(0)}
                    </Avatar>
                </>
            ) : (
                <>
                    <div className={styles.messageContent}>
                        <Typography variant="body1" component="span">
                            {text}
                        </Typography>
                        <div className={styles.messageInfo}>
                            <Typography component="span" className={styles.nicknameTime}>
                                {sender.first_name} {sender.last_name}, {messageTime}
                            </Typography>
                        </div>
                    </div>
                    <Avatar src={sender.avatar} className={styles.avatar}>
                        {!sender.avatar && sender.first_name.charAt(0)}
                    </Avatar>
                </>
            )}
        </li>
    );
}
