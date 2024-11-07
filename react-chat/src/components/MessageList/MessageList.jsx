import React, { useContext } from 'react';
import styles from './MessageList.module.scss';
import MessageItem from '../MessageItem/MessageItem';
import AppContext from '../../context/AppContext';

function MessageList({ messages, messageListRef, lastSentMessageId, onDeleteMessage, onEditMessage }) {
    const { profile } = useContext(AppContext);

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

export default MessageList;
