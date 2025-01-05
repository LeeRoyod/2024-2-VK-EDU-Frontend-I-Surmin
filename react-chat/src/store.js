import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import chatsReducer from './slices/chatsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatsReducer
  }
});
