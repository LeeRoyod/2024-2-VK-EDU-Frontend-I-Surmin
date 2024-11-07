import React, { useState, useContext } from 'react';
import { TextField, Button } from '@mui/material';
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.scss';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin } = useContext(AppContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://vkedu-fullstack-div2.ru/api/auth/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            });
            if (response.ok) {
                const data = await response.json();
                handleLogin(data.access, data.refresh);
            } else {
                const errorData = await response.json();
                console.error('Ошибка авторизации:', errorData);
                alert('Неправильный логин или пароль');
            }
        } catch (error) {
            console.error('Ошибка при авторизации:', error);
        }
    };

    const handleRegisterRedirect = () => {
        navigate('/register');
    };

    return (
        <div className={styles.loginContainer}>
            <h1>Вход</h1>
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

export default Login;
