import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios.js';

export const fetchAllChats = createAsyncThunk(
    'chats/fetchAllChats',
    async () => {
        const { data } = await axios.get('/chats/all');
        return data;
    }
);
export const fetchAllUserChats = createAsyncThunk(
    'chats/fetchAllUserChats',
    async () => {
        const { data } = await axios.get('/chats');
        return data;
    }
);
export const fetchUserChat = createAsyncThunk(
    'chats/fetchUserChat',
    async (chatId) => {
        const { data } = await axios.get(`/chats/${chatId}`);
        return data;
    }
);
export const fetchSendMessage = createAsyncThunk(
    'chats/fetchSendMessage',
    async ({ chatId, message }) => {
        const { data } = await axios.post(`/chats/${chatId}`, message);
        return data;
    }
);
export const fetchJoinChat = createAsyncThunk(
    'chats/fetchJoinChat',
    async (chatId) => {
        const { data } = await axios.patch(`/chats/${chatId}`);
        return data;
    }
);
export const fetchCreateChat = createAsyncThunk(
    'chats/fetchCreateChat',
    async (params) => {
        const { data } = await axios.post('/chats', params);
        return data;
    }
);
export const fetchLeaveChat = createAsyncThunk(
    'chats/fetchLeaveChat',
    async (chatId) => {
        const { data } = await axios.delete(`/chats/${chatId}`);
        return data;
    }
);
export const fetchRemoveMessage = createAsyncThunk(
    'chats/fetchRemoveMessage',
    async (messageId) => {
        const { data } = await axios.delete(`/chats/${messageId}`);
        return data;
    }
);

const initialState = {
    userChats: {
        items: [],
        status: 'loading',
    },
    activeChat: {
        chat: {
            users: [],
            messages: [],
        },
        // messages: [],
        status: 'loading',
    },
    allChats: {
        items: [],
        status: 'loading',
    },
    searchChatValue: '',
    isCreateChat: false,
};

const chatsSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setSearchValue: (state, action) => {
            state.searchChatValue = action.payload;
        },
        setCreateChat: (state) => {
            state.isCreateChat = !state.isCreateChat;
        },
        setMessages: (state, action) => {
            state.activeChat.chat.messages.push(action.payload);
        },
        removeMessage: (state, action) => {
            const filteredMessages = state.activeChat.chat.messages.filter(
                (message) => message._id !== action.payload
            );
            state.activeChat.chat.messages = filteredMessages;
        },
    },
    extraReducers: (builder) => {
        //fetchAllUserChats
        builder
            .addCase(fetchAllUserChats.pending, (state) => {
                state.userChats.items = [];
                state.userChats.status = 'loading';
            })
            .addCase(fetchAllUserChats.fulfilled, (state, action) => {
                state.userChats.items = action.payload;
                state.userChats.status = 'loaded';
            })
            .addCase(fetchAllUserChats.rejected, (state) => {
                state.userChats.items = [];
                state.userChats.status = 'error';
            });
        //fetchUserChat
        builder
            .addCase(fetchUserChat.pending, (state) => {
                state.activeChat.status = 'loading';
            })
            .addCase(fetchUserChat.fulfilled, (state, action) => {
                state.activeChat.chat = action.payload;
                state.activeChat.status = 'loaded';
            })
            .addCase(fetchUserChat.rejected, (state) => {
                state.activeChat.status = 'error';
            });
        //fetchAllChats
        builder
            .addCase(fetchAllChats.pending, (state) => {
                state.allChats.items = [];
                state.allChats.status = 'loading';
            })
            .addCase(fetchAllChats.fulfilled, (state, action) => {
                state.allChats.items = action.payload;
                state.allChats.status = 'loaded';
            })
            .addCase(fetchAllChats.rejected, (state) => {
                state.allChats.items = [];
                state.allChats.status = 'error';
            });
    },
});

export const { setSearchValue, setCreateChat, setMessages, removeMessage } =
    chatsSlice.actions;

export default chatsSlice.reducer;
