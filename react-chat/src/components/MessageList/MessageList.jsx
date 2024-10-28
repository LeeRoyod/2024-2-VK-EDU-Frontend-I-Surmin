import React, { useContext } from 'react';
import styles from './MessageList.module.scss';
import MessageItem from '../MessageItem/MessageItem';
import AppContext from '../../context/AppContext';

function MessageList({ messages, filterValue, messageListRef, lastSentMessageId }) {
    const { profile } = useContext(AppContext);

    const filteredMessages = messages.map((message) => {
        let isMyMessage = message.nickname === profile.nickname;
        let isNew = message.id === lastSentMessageId;

        if (filterValue === 'my') {
            if (isMyMessage) {
                return <MessageItem key={message.id} message={message} isMyMessage={true} isNew={isNew} />;
            } else {
                return <MessageItem key={message.id} message={message} isMyMessage={false} isNew={isNew} />;
            }
        } else if (filterValue === 'others') {
            if (!isMyMessage && message.nickname !== 'Система') {
                return <MessageItem key={message.id} message={message} isMyMessage={true} isNew={isNew} />;
            } else {
                return <MessageItem key={message.id} message={message} isMyMessage={false} isNew={isNew} />;
            }
        }
        return null;
    });

    return (
        <ul className={styles.messageList} ref={messageListRef}>
            {filteredMessages}
        </ul>
    );
}

export default MessageList;
