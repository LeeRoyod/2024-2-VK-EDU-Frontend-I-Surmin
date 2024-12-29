import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.scss';
import { Api } from '../../api';
import { handleLogin } from '../../slices/authSlice';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [errors, setErrors] = useState({});

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) newErrors.username = 'Логин обязателен';
    if (!password.trim()) newErrors.password = 'Пароль обязателен';
    if (!firstName.trim()) newErrors.firstName = 'Имя обязательно';
    if (!lastName.trim()) newErrors.lastName = 'Фамилия обязательна';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const userData = {
      username: username.trim(),
      password: password.trim(),
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      bio: bio.trim(),
      avatar
    };

    try {
      await Api.register(userData);
      const loginData = await Api.login(username.trim(), password.trim());
      dispatch(handleLogin(loginData.access, loginData.refresh));
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      alert(`Ошибка регистрации: ${error.message}`);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
        <div className={styles.authContainer}>
            <h1 className={styles.title}>Мессенджер</h1>
            <h2 className={styles.subtitle}>Регистрация</h2>
            <form className={styles.form} onSubmit={handleSubmit}>
                <TextField
                    label="Логин"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    error={!!errors.username}
                    helperText={errors.username}
                />
                <TextField
                    label="Пароль"
                    variant="outlined"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <TextField
                    label="Имя"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                />
                <TextField
                    label="Фамилия"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    error={!!errors.lastName}
                    helperText={errors.lastName}
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
                            {avatar ? 'Изменить аватар' : 'Загрузить аватар'}
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
};
