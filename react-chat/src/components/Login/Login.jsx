import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';
import { Api } from '../../api';
import { handleLogin } from '../../slices/authSlice';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await Api.login(username, password);
            dispatch(handleLogin(data.access, data.refresh));
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            alert('Неправильный логин или пароль');
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className={styles.authContainer}>
            <h1 className={styles.title}>Мессенджер</h1>
            <h2 className={styles.subtitle}>Вход</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <TextField
                    label="Логин"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Пароль"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.loginButton}
                >
                    Войти
                </Button>
                <Button
                    variant="text"
                    color="primary"
                    onClick={handleRegisterRedirect}
                >
                    Зарегистрироваться
                </Button>
            </form>
        </div>
    );
}
