import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import Chat from '../Chat';
import Login from '../Auth/Login';
import Registration from '../Auth/Registration';

import { fetchAuthMe } from '../../redux/slices/auth.js';
import './app.scss';

function App() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchAuthMe());
    }, []);

    return (
        <div className='app'>
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/auth/login' element={<Login />} />
                <Route path='/auth/registration' element={<Registration />} />
                <Route path='/chats' element={<Chat />} />
                <Route path='/chats/:chatId' element={<Chat />} />
            </Routes>
        </div>
    );
}

export default App;
