import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';

import { fetchUserChat } from '../../redux/slices/chats';
import avatarStub from '../../images/avatar-stub.png';
import animationArrow from '../../images/arrow-animation.json';
import { authData } from '../../redux/slices/auth';
import './chatItem.scss';

const ChatItem = ({ data, isUserChat }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = useSelector(authData);
    const { activeChat } = useSelector((state) => state.chats);
    let lastMessage = data.messages[data.messages.length - 1];
    let isMyMessage;

    if (userData && lastMessage.author_id) {
        isMyMessage = userData._id === lastMessage.author_id._id;
    }

    if (data && activeChat && data._id === activeChat.chat._id) {
        lastMessage =
            activeChat.chat.messages[activeChat.chat.messages.length - 1];
    }

    const dateTime = new Date(data.updatedAt);
    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();
    const formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
    const formattedHours = (hours < 10 ? '0' : '') + hours;

    const handleChat = () => {
        dispatch(fetchUserChat(data._id));
        navigate(`/chats/${data._id}`);
    };

    const returnLastName = () => {
        if (isMyMessage) {
            return '';
        } else return lastMessage.author_id.username;
    };

    return (
        <div className='chat-item' onClick={handleChat}>
            <div
                className='chat-item__image'
                style={{
                    background: `url(${
                        data.imageUrl ? data.imageUrl : avatarStub
                    })0 0 / cover no-repeat`,
                }}
            />
            {isUserChat ? (
                <div className='chat-item__info'>
                    <div className='chat-item__info-header'>
                        <p className='chat-item__info-header-name'>
                            {data.chatname}
                        </p>
                        <p className='chat-item__info-header-time'>
                            {dateTime
                                ? `${formattedHours}:${formattedMinutes}`
                                : ''}
                        </p>
                    </div>

                    {lastMessage ? (
                        <p className='chat-item__info-last-message'>
                            {lastMessage.author_id && !isMyMessage
                                ? `${returnLastName()}: ${lastMessage.text}`
                                : lastMessage.text}
                        </p>
                    ) : (
                        <p className='chat-item__info-last-message'>
                            Chat created
                        </p>
                    )}
                </div>
            ) : (
                <div className='chat-item__join'>
                    {data.chatname}
                    <div className='chat-item__join-animation'>
                        <Lottie
                            animationData={animationArrow}
                            loop={true}
                            style={{
                                width: '50px',
                                height: '50px',
                            }}
                            autoplay={true}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatItem;
