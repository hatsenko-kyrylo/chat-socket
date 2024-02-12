import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { authData, logout } from '../../redux/slices/auth';
import { setCreateChat } from '../../redux/slices/chats';
import { useNavigate } from 'react-router-dom';
import avatarStub from '../../images/avatar-stub.png';
import CreateChatForm from '../CreateChatForm';
import './header.scss';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(authData);
    const { isCreateChat } = useSelector((state) => state.chats);

    const handleCreateChat = () => {
        dispatch(setCreateChat());
    };

    const onClickLogout = () => {
        const confirmLeave = window.confirm('Are you sure you want to logout?');
        if (confirmLeave) {
            dispatch(logout());
            window.localStorage.removeItem('token');
            navigate('/auth/login');
        }
    };

    return (
        <header className='header'>
            <button
                type='button'
                className='header__create-chat'
                onClick={handleCreateChat}
            >
                Create Chat
            </button>
            {isCreateChat && (
                <CreateChatForm handleCreateChat={handleCreateChat} />
            )}

            {userData && (
                <div className='header__user'>
                    <p className='header__user-name'>{userData.username}</p>
                    <div
                        className='header__user-avatar'
                        style={{
                            background: `url(${
                                userData.avatarUrl
                                    ? userData.avatarUrl
                                    : avatarStub
                            }) 0 0 / cover no-repeat`,
                        }}
                    ></div>
                    <button type='button' onClick={onClickLogout}>
                        Log out
                    </button>
                </div>
            )}
        </header>
    );
};

export default Header;
