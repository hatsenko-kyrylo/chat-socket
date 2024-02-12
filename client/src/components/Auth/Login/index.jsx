import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { fetchLogin, selectedAuth } from '../../../redux/slices/auth';
import '../auth.scss';

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuth = useSelector(selectedAuth);

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
        const data = await dispatch(fetchLogin(values));

        if (!data.payload) {
            alert('Failed to login');
        }

        if ('token' in data.payload) {
            window.localStorage.setItem('token', data.payload.token);
        }
    };

    useEffect(() => {
        if (isAuth) {
            navigate('/chats');
        }
    }, [isAuth]);

    return (
        <div className='auth'>
            <h1>Log in to your account</h1>
            <form className='form' onSubmit={handleSubmit(onSubmit)}>
                <input
                    className='form-input'
                    type='text'
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
                    Log in
                </button>
            </form>
            <div className='auth__redirect'>
                <p>Don't have an account?</p>
                <Link className='auth__redirect-link' to='/auth/registration'>
                    Sign Up
                </Link>
            </div>
        </div>
    );
};

export default Login;
