import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
    fetchAllUserChats,
    fetchSendMessage,
    fetchUserChat,
    setMessages,
    fetchLeaveChat,
} from '../../redux/slices/chats';
import { authData, selectedAuth } from '../../redux/slices/auth';
import socket from '../../utils/socket';

import emojies from '../../images/icons/emojies.svg';
import sendMessage from '../../images/icons/send-message.svg';
import EmojiPicker from 'emoji-picker-react';
import './chat.scss';
import Messages from '../Messages';
import Header from '../Header';
import Loading from '../Loading';
import ChatList from '../ChatList';
import JoinButton from '../JoinButton';
import close from '../../images/icons/close.svg';

const Chat = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector(selectedAuth);
    const userData = useSelector(authData);
    let isUserChat;

    const { activeChat } = useSelector((state) => state.chats);
    const isLoadingChat = activeChat.status === 'loading';

    const { chatId } = useParams();

    const [message, setMessage] = useState('');
    const [isOpen, setOpen] = useState(false);
    const usersCount = activeChat.chat.users.length;
    const chatName = activeChat.chat.chatname;

    const token = window.localStorage.getItem('token');
    useEffect(() => {
        if (!isAuth && !token) {
            navigate('/auth/login');
        }
    }, []);

    useEffect(() => {
        if (chatId) {
            dispatch(fetchUserChat(chatId));
        }
    }, []);

    // Sockets
    useEffect(() => {
        socket.emit('chatId', { chatId });
    }, [chatId]);

    useEffect(() => {
        socket.on('sendMessage', ({ data }) => {
            dispatch(setMessages(data.message));
        });

        socket.on('join', ({ data }) => {
            dispatch(setMessages(data.message));
        });

        socket.on('leave', ({ data }) => {
            dispatch(setMessages(data.message));
        });

        return () => {
            socket.off('sendMessage');
            socket.off('join');
            socket.off('leave');
        };
    }, []);

    const leaveChat = () => {
        const confirmLeave = window.confirm(
            'Are you sure you want to leave this chat?'
        );

        if (confirmLeave) {
            dispatch(fetchLeaveChat(chatId));
            dispatch(fetchAllUserChats());
            navigate('/chats');
        }
    };

    const closeChat = () => {
        navigate('/chats');
    };

    const handleChange = (e) => {
        setMessage(e);
    };

    const handleEmojiesPicker = ({ emoji }) => {
        setMessage(`${message} ${emoji}`);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (!message.trim()) return;

        const fetchParams = {
            chatId,
            message: { text: message },
        };

        dispatch(fetchSendMessage(fetchParams));
        setMessage('');
    };

    // Check user chat
    const objStyle = {
        filter: 'blur(10px)',
        pointerEvents: 'none',
    };
    const returnJoin = () => {
        isUserChat = activeChat.chat.users.some(
            (user) => user._id === userData._id
        );

        if (isUserChat) {
            return false;
        }

        return (
            <div className='join'>
                <div className='join__btn'>
                    <JoinButton chatId={chatId} />
                    <p>Join to chat</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <Header />
            <div className='chat'>
                <ChatList />
                {chatId && (
                    <div className='chat__main'>
                        {!isLoadingChat && userData && returnJoin()}
                        {isLoadingChat ? (
                            <Loading />
                        ) : (
                            <div
                                className='chat__main-field'
                                style={!isUserChat ? objStyle : {}}
                            >
                                <div className='chat__main-field-tools'>
                                    <div className='chat__main-field-tools-info'>
                                        <h5>{chatName}</h5>
                                        <p>Users: {usersCount}</p>
                                    </div>
                                    <div className='chat__main-field-tools-btns'>
                                        <button
                                            type='button'
                                            onClick={leaveChat}
                                        >
                                            Leave Chat
                                        </button>
                                        <img
                                            src={close}
                                            alt='Close chat'
                                            onClick={closeChat}
                                        />
                                    </div>
                                </div>

                                <Messages activeChat={activeChat} />
                            </div>
                        )}

                        <form
                            className='chat__main-send-message'
                            onSubmit={onSubmit}
                            style={!isUserChat ? objStyle : {}}
                        >
                            <input
                                className='chat__main-send-message-input'
                                name='message'
                                type='text'
                                placeholder='Write message...'
                                value={message}
                                onChange={(e) => handleChange(e.target.value)}
                                autoComplete='off'
                                required
                            ></input>
                            <div className='chat__main-send-message-tools'>
                                <img
                                    src={emojies}
                                    alt='tool'
                                    onClick={() => setOpen(!isOpen)}
                                />
                                {isOpen && (
                                    <div className='emoji-picker-container'>
                                        <EmojiPicker
                                            suggestedEmojisMode='recent'
                                            lazyLoadEmojis={true}
                                            onEmojiClick={handleEmojiesPicker}
                                        />
                                    </div>
                                )}
                            </div>
                            <button
                                className='chat__main-send-message-btn'
                                type='submit'
                                onClick={() => setOpen(false)}
                            >
                                <img src={sendMessage} alt='Send button' />
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
};

export default Chat;
