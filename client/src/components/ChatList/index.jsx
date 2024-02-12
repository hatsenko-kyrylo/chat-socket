import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchAllChats,
    setSearchValue,
    fetchAllUserChats,
} from '../../redux/slices/chats';

import ChatItem from '../ChatItem';
import Loading from '../Loading';
import './chatList.scss';
import { authData } from '../../redux/slices/auth';

const ChatList = () => {
    const dispatch = useDispatch();
    const userData = useSelector(authData);
    const { userChats, searchChatValue, allChats } = useSelector(
        (state) => state.chats
    );
    const isLoadingChats = userChats.status === 'loading';

    const handleSearchChat = (e) => {
        const searchValue = e.target.value;

        if (searchValue.startsWith(' ') || searchValue.includes('  ')) {
            return;
        }

        if (searchChatValue) {
            dispatch(fetchAllChats());
        }

        dispatch(setSearchValue(searchValue));
    };

    useEffect(() => {
        dispatch(fetchAllUserChats());
        dispatch(fetchAllChats());
    }, [searchChatValue]);

    const returnAllChats = () => {
        return allChats.items
            .filter((chat) =>
                chat.chatname
                    .toLowerCase()
                    .includes(searchChatValue.toLowerCase())
            )
            .map((chat) => {
                const isUserChat = chat.users.some(
                    (userId) => userId === userData._id
                );

                return (
                    <ChatItem
                        key={chat._id}
                        data={chat}
                        isUserChat={isUserChat}
                    />
                );
            });
    };

    const renderChatList = () => {
        if (isLoadingChats) {
            return <Loading />;
        }

        return (
            <>
                {!searchChatValue
                    ? userChats.items.map((chat) => (
                          <ChatItem
                              key={chat._id}
                              data={chat}
                              isUserChat={true}
                          />
                      ))
                    : returnAllChats()}
            </>
        );
    };

    return (
        <div className='chat-list'>
            <div className='chat-list__search'>
                <input
                    type='search'
                    placeholder='Search chat..'
                    value={searchChatValue}
                    onChange={handleSearchChat}
                />
            </div>
            {renderChatList()}
        </div>
    );
};

export default ChatList;
