import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import {
    setFromLanguage,
    setToLanguage,
    setQuery,
    fetchTranslation,
    selectFromLanguage,
    selectToLanguage,
    selectQuery,
    selectResult,
    selectLoading,
    selectError,
    loadHistoryFromLocalStorage,
} from '../features/translation/translationSlice';

import { AppDispatch } from '../app/store';
import rawLanguages from '../languages.json';
import './Home.css';

const languages = rawLanguages as Record<string, string>;

const FAVORITE_FROM = ['Autodetect', 'de-DE', 'en-GB', 'es-ES'];
const FAVORITE_TO = ['ru-RU', 'en-GB', 'es-ES'];

function getDisplayedLangs(favorites: string[], selectedLang: string): string[] {
    const arr = [...favorites];
    if (!arr.includes(selectedLang)) {
        arr.push(selectedLang);
    }
    const idxAuto = arr.indexOf('Autodetect');
    if (idxAuto > 0) {
        arr.splice(idxAuto, 1);
        arr.unshift('Autodetect');
    }
    return arr;
}

const Home: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();

    const fromLanguage = useSelector(selectFromLanguage);
    const toLanguage = useSelector(selectToLanguage);
    const query = useSelector(selectQuery);
    const result = useSelector(selectResult);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [showFromDropdown, setShowFromDropdown] = useState(false);
    const [showToDropdown, setShowToDropdown] = useState(false);

    useEffect(() => {
        dispatch(loadHistoryFromLocalStorage());
    }, [dispatch]);

    useEffect(() => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
        if (query.trim()) {
            const t = setTimeout(() => {
                dispatch(fetchTranslation({ query, from: fromLanguage, to: toLanguage }));
            }, 1500);
            typingTimeoutRef.current = t;
        } else {
            dispatch(setQuery(''));
        }
        return () => {
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
            }
        };
    }, [query, fromLanguage, toLanguage, dispatch]);

    const displayedFromLangs = getDisplayedLangs(FAVORITE_FROM, fromLanguage);
    const displayedToLangs = getDisplayedLangs(FAVORITE_TO, toLanguage);

    const otherFrom = Object.entries(languages)
        .filter(([code]) => !displayedFromLangs.includes(code))
        .sort((a, b) => a[1].localeCompare(b[1]));
    const otherTo = Object.entries(languages)
        .filter(([code]) => !displayedToLangs.includes(code))
        .sort((a, b) => a[1].localeCompare(b[1]));

    const handleSelectFromTab = (code: string) => {
        dispatch(setFromLanguage(code));
        setShowFromDropdown(false);
    };
    const handleSelectToTab = (code: string) => {
        dispatch(setToLanguage(code));
        setShowToDropdown(false);
    };

    const handleFromDropdownClick = (code: string) => {
        dispatch(setFromLanguage(code));
        setShowFromDropdown(false);
    };
    const handleToDropdownClick = (code: string) => {
        dispatch(setToLanguage(code));
        setShowToDropdown(false);
    };

    const swapLanguages = () => {
        dispatch(setFromLanguage(toLanguage));
        dispatch(setToLanguage(fromLanguage));
    };

    return (
        <div className="home-container">
            <div className="top-title-bar">
                <h1>VK Translate</h1>
            </div>

            <div className="tabs-row">
                {displayedFromLangs.map((code) => (
                    <div
                        key={code}
                        className={fromLanguage === code ? 'tab-item tab-active' : 'tab-item'}
                        onClick={() => handleSelectFromTab(code)}
                    >
                        {languages[code] || code}
                    </div>
                ))}

                <div className="dropdown-wrapper">
                    <div
                        className="tab-item dropdown-trigger"
                        onClick={() => setShowFromDropdown(!showFromDropdown)}
                    >
                        ▼
                    </div>
                    {showFromDropdown && (
                        <div className="dropdown-menu">
                            {otherFrom.map(([code, name]) => (
                                <div
                                    key={code}
                                    className="dropdown-item"
                                    onClick={() => handleFromDropdownClick(code)}
                                >
                                    {name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button className="swap-arrow" onClick={swapLanguages}>
                    ⇄
                </button>

                {displayedToLangs.map((code) => (
                    <div
                        key={code}
                        className={toLanguage === code ? 'tab-item tab-active' : 'tab-item'}
                        onClick={() => handleSelectToTab(code)}
                    >
                        {languages[code] || code}
                    </div>
                ))}

                <div className="dropdown-wrapper">
                    <div
                        className="tab-item dropdown-trigger"
                        onClick={() => setShowToDropdown(!showToDropdown)}
                    >
                        ▼
                    </div>
                    {showToDropdown && (
                        <div className="dropdown-menu">
                            {otherTo.map(([code, name]) => (
                                <div
                                    key={code}
                                    className="dropdown-item"
                                    onClick={() => handleToDropdownClick(code)}
                                >
                                    {name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="main-translate-row">

                <div className="left-pane">
                    <div className="pane-body">
            <textarea
                placeholder="Введите текст..."
                value={query}
                onChange={(e) => dispatch(setQuery(e.target.value))}
            />
                    </div>
                    <div className="pane-footer">
                        <div className="char-counter">{query.length} / 5000</div>
                    </div>
                </div>

                <div className="right-pane">
                    <div className="pane-body">
                        {loading ? (
                            <div className="translation big-placeholder">Перевод...</div>
                        ) : (
                            <div className="translation">
                                {result || <span className="placeholder-text">Перевод</span>}
                            </div>
                        )}
                    </div>
                    <div className="pane-footer">
                    </div>
                </div>
            </div>

            {error && <div className="error-box">Ошибка: {error}</div>}

            <div className="bottom-link">
                <Link to="/history">История переводов</Link>
            </div>
        </div>
    );
};

export default Home;
