import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';

export const fetchRegistration = createAsyncThunk(
    'auth/fetchRegistration',
    async (params) => {
        const { data } = await axios.post('/auth/registration', params);
        return data;
    }
);
export const fetchLogin = createAsyncThunk(
    'auth/fetchLogin',
    async (params) => {
        const { data } = await axios.post('/auth/login', params);
        return data;
    }
);
export const fetchAuthMe = createAsyncThunk('auth/fetchAuthMe', async () => {
    const { data } = await axios.get('/auth/me');
    return data;
});

const initialState = {
    data: null,
    status: 'loading',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.data = null;
        },
    },
    extraReducers: (builder) => {
        //fetchRegistration
        builder
            .addCase(fetchRegistration.pending, (state) => {
                state.data = null;
                state.status = 'loading';
            })
            .addCase(fetchRegistration.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchRegistration.rejected, (state) => {
                state.data = null;
                state.status = 'error';
            });
        //fetchLogin
        builder
            .addCase(fetchLogin.pending, (state) => {
                state.data = null;
                state.status = 'loading';
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchLogin.rejected, (state) => {
                state.data = null;
                state.status = 'error';
            });
        //fetchAuthMe
        builder
            .addCase(fetchAuthMe.pending, (state) => {
                state.data = null;
                state.status = 'loading';
            })
            .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.data = action.payload;
                state.status = 'loaded';
            })
            .addCase(fetchAuthMe.rejected, (state) => {
                state.data = null;
                state.status = 'error';
            })
            .addDefaultCase(() => {});
    },
});

export const selectedAuth = (state) => Boolean(state.auth.data);
export const authData = (state) => state.auth.data;

export const { logout } = authSlice.actions;

export default authSlice.reducer;
