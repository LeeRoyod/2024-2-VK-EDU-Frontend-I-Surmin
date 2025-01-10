import React from 'react';
import PropTypes from 'prop-types';
import styles from './ChatItem.module.scss';
import { IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { LazyLoadAvatar } from '../LazyLoadAvatar/LazyLoadAvatar';

export const ChatItem = ({ chat, openChat, deleteChat }) => {
  const { profile } = useSelector(state => state.auth);

  if (!profile) {
    return <div>Загрузка...</div>;
  }

  const isCreator = chat.creator && chat.creator.id === profile.id;

  const handleClick = () => {
    openChat(chat.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteChat(chat.id);
  };

  let lastMessageText = 'Нет сообщений';
  let lastMessageTime = '';
  let lastMessageFromUser = false;
  let lastMessageReadStatus = '';

  if (chat.last_message) {
    const lastMsg = chat.last_message;

    if (lastMsg.text && lastMsg.text.trim() !== '') {
      lastMessageText = lastMsg.text;
    } else if (lastMsg.files && lastMsg.files.length > 0) {
      lastMessageText = lastMsg.files.length === 1 ? 'Изображение' : 'Изображения';
    }

    if (lastMsg.created_at) {
      lastMessageTime = new Date(lastMsg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    if (lastMsg.sender && lastMsg.sender.id === profile.id) {
      lastMessageFromUser = true;

      if (Array.isArray(lastMsg.was_read_by)) {
        const otherReaders = lastMsg.was_read_by.filter(u => u.id !== profile.id);
        if (otherReaders.length > 0) {
          lastMessageReadStatus = '✔✔';
        } else {
          lastMessageReadStatus = '✔';
        }
      } else {
        lastMessageReadStatus = '✔';
      }
    }
  }

  let chatName = chat.title;
  let chatAvatar = chat.avatar;
  let onlineIndicator = null;

  if (chat.is_private && chat.members.length === 2) {
    const otherUser = chat.members.find(m => m.id !== profile.id);
    if (otherUser) {
      chatName = `${otherUser.first_name} ${otherUser.last_name}`.trim() || otherUser.username;
      chatAvatar = otherUser.avatar;
      onlineIndicator = (
        <span
          className={styles.onlineIndicator}
          style={{ backgroundColor: otherUser.is_online ? '#4caf50' : '#999' }}
          title={otherUser.is_online ? 'Онлайн' : 'Оффлайн'}
        ></span>
      );
    }
  }

  return (
    <li className={styles.chatItem} onClick={handleClick}>
      <div className={styles.chatAvatar}>
        <LazyLoadAvatar src={chatAvatar}>
          {(!chatAvatar && chatName.charAt(0))}
        </LazyLoadAvatar>
      </div>
      <div className={styles.chatInfo}>
        <div className={styles.chatName}>
          {chatName} {onlineIndicator}
        </div>
        <div className={styles.chatLastMessageContainer}>
          <div className={styles.chatLastMessage}>{lastMessageText}</div>
          <div className={styles.chatLastMessageInfo}>
            {isCreator && (
              <IconButton
                className={styles.deleteButton}
                onClick={handleDelete}
                aria-label="delete"
                size="small"
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
            {lastMessageTime && (
              <span className={styles.messageTime}>{lastMessageTime}</span>
            )}
            {lastMessageFromUser && (
              <span className={styles.messageCheck}>{lastMessageReadStatus}</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
};

ChatItem.propTypes = {
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    is_private: PropTypes.bool,
    creator: PropTypes.shape({
      id: PropTypes.string.isRequired
      // добавьте остальные необходимые поля
    }),
    members: PropTypes.arrayOf(PropTypes.object),
    last_message: PropTypes.shape({
      id: PropTypes.string,
      text: PropTypes.string,
      files: PropTypes.arrayOf(PropTypes.object),
      created_at: PropTypes.string,
      sender: PropTypes.shape({
        id: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        avatar: PropTypes.string
      }),
      was_read_by: PropTypes.arrayOf(PropTypes.object)
    })
  }).isRequired,
  openChat: PropTypes.func.isRequired,
  deleteChat: PropTypes.func.isRequired
};
