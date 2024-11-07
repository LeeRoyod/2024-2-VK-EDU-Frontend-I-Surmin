import React, { useState, useContext } from 'react';
import { TextField, Button } from '@mui/material';
import AppContext from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [avatar, setAvatar] = useState(null);
    const { handleLogin } = useContext(AppContext);
    const navigate = useNavigate();

    const handleAvatarChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('username', username);
        formData.append('password', password);
        formData.append('first_name', firstName);
        formData.append('last_name', lastName);
        formData.append('bio', bio);
        if (avatar) {
            formData.append('avatar', avatar);
        }

        try {
            const response = await fetch('/api/register/', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const loginResponse = await fetch('/api/auth/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                });

                if (loginResponse.ok) {
                    const data = await loginResponse.json();
                    handleLogin(data.access, data.refresh);
                } else {
                    console.error('Ошибка авторизации после регистрации');
                }
            } else {
                const errorData = await response.json();
                console.error('Ошибка регистрации:', errorData);
                alert(`Ошибка регистрации: ${JSON.stringify(errorData)}`);
            }
        } catch (error) {
            console.error('Ошибка при регистрации:', error);
        }
    };

    const handleBackToLogin = () => {
        navigate('/login');
    };

    return (
        <div className={styles.registerContainer}>
            <h1>Регистрация</h1>
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
                <TextField
                    label="Имя"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <TextField
                    label="Фамилия"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
                <TextField
                    label="О себе"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    multiline
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                />
                <div className={styles.avatarUpload}>
                    <input
                        accept="image/*"
                        style={{ display: 'none' }}
                        id="avatar-upload"
                        type="file"
                        onChange={handleAvatarChange}
                    />
                    <label htmlFor="avatar-upload">
                        <Button variant="contained" color="primary" component="span">
                            Загрузить аватар
                        </Button>
                        {avatar && <span style={{ marginLeft: '10px' }}>{avatar.name}</span>}
                    </label>
                </div>
                <div className={styles.buttonContainer}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className={styles.registerButton}
                    >
                        Зарегистрироваться
                    </Button>
                    <Button
                        variant="text"
                        color="primary"
                        onClick={handleBackToLogin}
                        className={styles.backButton}
                    >
                        Назад
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default Register;
