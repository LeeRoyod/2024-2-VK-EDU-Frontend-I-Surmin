// react-chat/src/components/MessageItem/MessageItem.jsx
import React from 'react';
import styles from './MessageItem.module.scss';
import { Typography } from '@mui/material';
import { Done, DoneAll, Info } from '@mui/icons-material';

function MessageItem({ message, isMyMessage, isNew }) {
    const { text, time, nickname, read } = message;

    const messageClass = [styles.message];
    if (isMyMessage) {
        messageClass.push(styles.my);
    }
    if (nickname === 'Система') {
        messageClass.push(styles.system);
    }
    if (isNew) {
        messageClass.push(styles.newMessage);
    }

    return (
        <li className={messageClass.join(' ')}>
            <Typography variant="body1" component="span">
                {text}
            </Typography>
            <div className={styles.messageInfo}>
                {nickname === 'Система' && <Info className={styles.systemIcon} />}
                <Typography component="span" className={styles.nicknameTime}>
                    {`${nickname} ${time}`}
                </Typography>
                {isMyMessage && nickname !== 'Система' && (
                    read ? <DoneAll className={styles.messageCheck} /> : <Done className={styles.messageCheck} />
                )}
            </div>
        </li>
    );
}

export default MessageItem;
