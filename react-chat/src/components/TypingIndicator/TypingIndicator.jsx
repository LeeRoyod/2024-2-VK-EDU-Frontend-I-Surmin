// react-chat/src/components/TypingIndicator/TypingIndicator.jsx
import React from 'react';
import styles from './TypingIndicator.module.scss';

function TypingIndicator() {
    return (
        <div className={styles.typingIndicator}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
        </div>
    );
}

export default TypingIndicator;
