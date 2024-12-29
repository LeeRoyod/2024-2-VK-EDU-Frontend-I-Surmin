import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { selectHistory, clearHistory } from '../features/translation/translationSlice';
import { AppDispatch } from '../app/store';
import './History.css';

const History: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const history = useSelector(selectHistory);

    const handleClear = () => {
        dispatch(clearHistory());
    };

    const reversedHistory = history.slice().reverse();

    return (
        <div className="history-container">
            <header className="history-header">
                <h1>История переводов</h1>
                <div className="header-buttons">
                    <Link to="/" className="back-home">
                        На главную
                    </Link>
                    <button onClick={handleClear} disabled={history.length === 0}>
                        Очистить историю
                    </button>
                </div>
            </header>

            <div className="history-list">
                {reversedHistory.length === 0 ? (
                    <p className="empty">История пуста.</p>
                ) : (
                    reversedHistory.map((item) => (
                        <div key={item.id} className="history-item">
                            <div className="lang-info">
                                {item.from} → {item.to}
                            </div>
                            <div className="original-text">{item.originalText}</div>
                            <div className="translated-text">{item.translatedText}</div>
                            <div className="timestamp">
                                {new Date(item.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default History;
