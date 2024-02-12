import React from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import { fetchCreateChat, fetchAllUserChats } from '../../redux/slices/chats';
import close from '../../images/icons/close.svg';
import './createChatForm.scss';

const CreateChatForm = ({ handleCreateChat }) => {
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            chatname: '',
        },
        mode: 'onChange',
    });

    const onSubmit = async (values) => {
        console.log(values);

        dispatch(fetchCreateChat(values));
        dispatch(fetchAllUserChats());

        handleCreateChat();
    };

    return (
        <div className='create-chat'>
            <img src={close} alt='close' onClick={handleCreateChat} />
            <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <input
                    className='form-input'
                    type='text'
                    name='chatname'
                    placeholder='Chatname'
                    autoComplete='off'
                    required
                    {...register('chatname', { required: 'Enter chatname' })}
                />
                {errors.chatname && (
                    <p className='form__error-message'>
                        {errors.chatname.message}
                    </p>
                )}

                <button
                    className='form-buttom'
                    type='submit'
                    disabled={!isValid}
                >
                    Create
                </button>
            </form>
        </div>
    );
};

export default CreateChatForm;
