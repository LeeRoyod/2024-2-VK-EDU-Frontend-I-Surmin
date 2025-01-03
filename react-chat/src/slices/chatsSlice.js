import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  chats: [],
  currentChatId: null
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats (state, action) {
      state.chats = action.payload;
    },
    setCurrentChatId (state, action) {
      state.currentChatId = action.payload;
    }
  }
});

export const { setChats, setCurrentChatId } = chatsSlice.actions;
export default chatsSlice.reducer;
