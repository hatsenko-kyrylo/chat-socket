import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';

import { selectedAuth, fetchRegistration } from '../../../redux/slices/auth';
import '../auth.scss';

export const Registration = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector(selectedAuth);

    // react-hook-form
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({
        defaultValues: {
            username: 'Ron',
            email: 'ron@gmail.com',
            password: 'iamron1!',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (values) => {
        const data = await dispatch(fetchRegistration(values));

        if (!data.payload) {
            alert('Failed to registration');
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    };

    if (isAuth) {
        navigate('/chats');
    }

    return (
        <div className='auth'>
            <h1>Create your account</h1>
            <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <input
                    className='form-input'
                    type='text'
                    name='username'
                    placeholder='Username'
                    autoComplete='off'
                    required
                    {...register('username', { required: 'Enter username' })}
                />
                {errors.username && (
                    <p className='form__error-message'>
                        {errors.username.message}
                    </p>
                )}
                <input
                    className='form-input'
                    type='email'
                    name='email'
                    placeholder='Email'
                    autoComplete='off'
                    required
                    {...register('email', { required: 'Enter email' })}
                />
                {errors.email && (
                    <p className='form__error-message'>
                        {errors.email.message}
                    </p>
                )}
                <input
                    className='form-input'
                    type='password'
                    name='password'
                    placeholder='Password'
                    autoComplete='off'
                    required
                    {...register('password', { required: 'Enter password' })}
                />
                {errors.password && (
                    <p className='form__error-message'>
                        {errors.password.message}
                    </p>
                )}
                <button
                    className='form-buttom'
                    type='submit'
                    disabled={!isValid}
                >
                    Sign up
                </button>
            </form>
            <div className='auth__redirect'>
                <p>Have an account?</p>
                <Link className='auth__redirect-link' to='/auth/login'>
                    Log in
                </Link>
            </div>
        </div>
    );
};

export default Registration;
