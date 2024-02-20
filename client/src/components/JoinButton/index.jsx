import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { gsap } from 'gsap';

import { fetchJoinChat, fetchAllChats } from '../../redux/slices/chats';
import plus from '../../images/icons/plus.svg';
import chechMark from '../../images/icons/check-mark-light.svg';
import './joinButton.scss';

const JoinButton = ({ chatId }) => {
    const dispatch = useDispatch();
    const [isJoined, setIsJoined] = useState(false);

    const handleClick = (e) => {
        e.stopPropagation();
        e.preventDefault();

        if (isJoined) return;

        dispatch(fetchJoinChat(chatId));
        dispatch(fetchAllChats());

        // Animation
        const button = e.currentTarget;
        const tl = gsap.timeline();
        tl.to(button, { rotation: 360, duration: 0.5 })
            .to(button, { backgroundColor: '#003977', duration: 0.5 }, 0)
            .to(button.querySelector('img'), { opacity: 0, duration: 0.2 }, 0)
            .set(button.querySelector('img'), { src: chechMark })
            .to(button.querySelector('img'), { opacity: 1, duration: 0.4 });

        setIsJoined(true);
    };

    return (
        <button className='join-button' onClick={handleClick} type='submit'>
            {!isJoined ? (
                <img src={plus} alt='join' />
            ) : (
                <img src={chechMark} alt='joined' />
            )}
        </button>
    );
};

export default JoinButton;
