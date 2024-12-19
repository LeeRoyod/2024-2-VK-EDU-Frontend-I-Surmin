import { createSlice } from '@reduxjs/toolkit';
import { Api } from '../api';

const initialState = {
    isAuthenticated: false,
    profile: null,
    accessToken: null,
    refreshToken: null,
    isProfileLoaded: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setTokens(state, action) {
            const { access, refresh } = action.payload;
            state.accessToken = access;
            state.refreshToken = refresh;
            state.isAuthenticated = true;
        },
        clearTokens(state) {
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.profile = null;
            state.isProfileLoaded = false;
        },
        setProfile(state, action) {
            state.profile = action.payload;
            state.isProfileLoaded = true;
        }
    }
});

export const { setTokens, clearTokens, setProfile } = authSlice.actions;

export const handleLogin = (access, refresh) => async (dispatch) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    dispatch(setTokens({ access, refresh }));
    Api.setAccessToken(access);
    try {
        const userData = await Api.getCurrentUser();
        dispatch(setProfile(userData));
    } catch (error) {
        console.error('Ошибка при получении профиля:', error);
        dispatch(handleLogout());
    }
};

export const handleLogout = () => (dispatch) => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    dispatch(clearTokens());
};

export default authSlice.reducer;
