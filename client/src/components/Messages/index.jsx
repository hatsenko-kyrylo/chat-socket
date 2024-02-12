import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { authData } from '../../redux/slices/auth';
import { fetchRemoveMessage, removeMessage } from '../../redux/slices/chats';

import useContextMenu from '../../hooks/useContextMenu';
import './messages.scss';
import ContextMenu from '../ContextMenu';

const Messages = ({ activeChat }) => {
    const [currentMessageId, setCurrentMessageId] = useState('');
    const dispatch = useDispatch();
    const userData = useSelector(authData);

    const { clicked, setClicked, points, setPoints } = useContextMenu();

    const toggleContextMenu = (e, myMessage) => {
        e.preventDefault();

        setCurrentMessageId(e.target.id);
        setPoints({
            x: e.pageX - 350,
            y: e.pageY - 75,
        });
        if (myMessage) {
            setClicked(true);
        }
    };

    const removeMessageFn = () => {
        dispatch(fetchRemoveMessage(currentMessageId));
        dispatch(removeMessage(currentMessageId));
        setCurrentMessageId('');
    };

    return (
        <div className='messages'>
            {userData &&
                activeChat.chat.messages.map((message) => {
                    //
                    const myMessage =
                        message.author_id &&
                        message.author_id._id === userData._id;

                    const classNameColor = `messages__item-message ${
                        myMessage ? 'me' : 'otherUser'
                    }`;

                    //
                    return !message.author_id ? (
                        <div
                            key={message._id}
                            className='messages__item system'
                        >
                            {message.text}
                        </div>
                    ) : (
                        <div
                            key={message._id}
                            className={`messages__item ${
                                myMessage ? 'meRight' : ''
                            }`}
                        >
                            {!myMessage && (
                                <div className='messages__item-info'>
                                    <div
                                        className='messages__item-info-avatar'
                                        style={{
                                            background: `url(${message.author_id.avatarUrl})0 0 / cover no-repeat`,
                                        }}
                                    />
                                    <span className='messages__item-info-name'>
                                        {message.author_id.username}
                                    </span>
                                </div>
                            )}
                            <div
                                className={classNameColor}
                                onContextMenu={(e) =>
                                    toggleContextMenu(e, myMessage)
                                }
                                id={message._id}
                            >
                                {message.text}
                            </div>
                        </div>
                    );
                })}
            {clicked && (
                <ContextMenu
                    top={points.y}
                    left={points.x}
                    removeMessageFn={removeMessageFn}
                />
            )}
        </div>
    );
};

export default Messages;
