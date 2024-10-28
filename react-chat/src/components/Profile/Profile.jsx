import React, { useContext, useState, useEffect } from 'react';
import styles from './Profile.module.scss';
import { TextField, Button, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const { profile, setProfile, chats } = useContext(AppContext);
    const [name, setName] = useState(profile.name);
    const [nickname, setNickname] = useState(profile.nickname);
    const [about, setAbout] = useState(profile.about);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        setName(profile.name);
        setNickname(profile.nickname);
        setAbout(profile.about);
    }, [profile]);

    const validate = () => {
        const newErrors = {};
        if (!name.trim()) {
            newErrors.name = 'Имя обязательно';
        }
        if (!nickname.trim()) {
            newErrors.nickname = 'Никнейм обязателен';
        } else if (!nickname.startsWith('@')) {
            newErrors.nickname = 'Никнейм должен начинаться с @';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const oldNickname = profile.nickname;
            const oldName = profile.name;
            const newProfile = {
                name: name.trim(),
                nickname: nickname.trim(),
                about: about.trim(),
            };
            setProfile(newProfile);

            for (const chat of chats) {
                const messagesKey = `messages_${chat.id}`;
                const storedMessages = JSON.parse(localStorage.getItem(messagesKey)) || [];
                let updated = false;

                const updatedMessages = storedMessages.map(msg => {
                    if (msg.nickname === oldNickname && msg.name === oldName) {
                        updated = true;
                        return {
                            ...msg,
                            nickname: newProfile.nickname,
                            name: newProfile.name,
                        };
                    }
                    return msg;
                });

                if (updated) {
                    localStorage.setItem(messagesKey, JSON.stringify(updatedMessages));
                }
            }

            navigate('/');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.profileContainer}>
            <header className={styles.header}>
                <IconButton className={styles.backButton} onClick={handleGoBack}>
                    <ArrowBack />
                </IconButton>
                <h1 className={styles.profileTitle}>Мой профиль</h1>
            </header>
            <form className={styles.form} onSubmit={handleSubmit}>
                <TextField
                    label="Имя"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={!!errors.name}
                    helperText={errors.name}
                />
                <TextField
                    label="Никнейм"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    error={!!errors.nickname}
                    helperText={errors.nickname}
                />
                <TextField
                    label="Обо мне"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.saveButton}
                >
                    Сохранить
                </Button>
            </form>
        </div>
    );
}

export default Profile;
