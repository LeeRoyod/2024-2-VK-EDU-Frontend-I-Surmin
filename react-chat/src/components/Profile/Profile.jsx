import React, { useState, useEffect } from 'react';
import styles from './Profile.module.scss';
import { TextField, Button, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Api } from '../../api';
import { handleLogout, setProfile } from '../../slices/authSlice';
import { LazyLoadAvatar } from '../LazyLoadAvatar/LazyLoadAvatar';

export const Profile = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector(state => state.auth);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile && !isInitialized) {
      setUsername(profile.username || '');
      setFirstName(profile.first_name || '');
      setLastName(profile.last_name || '');
      setBio(profile.bio || '');
      setIsInitialized(true);
    }
  }, [profile, isInitialized]);

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const validate = () => {
    const newErrors = {};
    if (!username.trim()) {
      newErrors.username = 'Логин обязателен';
    }
    if (!firstName.trim()) {
      newErrors.firstName = 'Имя обязательно';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Фамилия обязательна';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      const userData = {
        username: username.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        bio: bio.trim()
      };
      if (password) {
        userData.password = password;
      }
      if (avatar) {
        userData.avatar = avatar;
      }

      try {
        const updatedProfile = await Api.updateUser(profile.id, userData);
        dispatch(setProfile(updatedProfile));
        navigate('/');
      } catch (error) {
        console.error('Ошибка при обновлении профиля:', error);
        alert(`Ошибка при обновлении профиля: ${JSON.stringify(error)}`);
      }
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleLogoutClick = () => {
    dispatch(handleLogout());
    navigate('/login');
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
                <div className={styles.avatarContainer}>
                    <LazyLoadAvatar
                        src={profile?.avatar}
                        alt={`${profile?.first_name} ${profile?.last_name}`}
                        sx={{ width: 100, height: 100, fontSize: 48 }}
                    >
                        {(!profile?.avatar && profile?.first_name)
                          ? profile.first_name.charAt(0)
                          : ''}
                    </LazyLoadAvatar>
                </div>
                <TextField
                    label="Логин"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    error={!!errors.username}
                    helperText={errors.username}
                />
                <TextField
                    label="Новый пароль"
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={styles.saveButton}
                >
                    Сохранить
                </Button>
            </form>
            <Button
                variant="contained"
                color="error"
                onClick={handleLogoutClick}
                className={styles.logoutButton}
            >
                Выйти из аккаунта
            </Button>
        </div>
  );
};
