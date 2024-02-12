import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/auth.js';
import chats from './slices/chats.js';

export const store = configureStore({
    reducer: { auth, chats },
});
