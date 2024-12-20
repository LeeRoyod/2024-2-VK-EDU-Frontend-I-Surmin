import React from 'react';
import styles from './MessageList.module.scss';
import { MessageItem } from '../MessageItem/MessageItem';
import { useSelector } from 'react-redux';

export const MessageList = ({ messages, messageListRef, lastSentMessageId, onDeleteMessage, onEditMessage }) => {
    const { profile } = useSelector(state => state.auth);

    const messageItems = messages.map((message) => {
        const isMyMessage = message.sender.id === profile.id;
        const isNew = message.id === lastSentMessageId;

        return (
            <MessageItem
                key={message.id}
                message={message}
                isMyMessage={isMyMessage}
                isNew={isNew}
                onDeleteMessage={onDeleteMessage}
                onEditMessage={onEditMessage}
            />
        );
    });

    return (
        <ul className={styles.messageList} ref={messageListRef}>
            {messageItems}
        </ul>
    );
}
