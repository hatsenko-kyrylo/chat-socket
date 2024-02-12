import { body } from 'express-validator';

export const registrationValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),
    body('username', 'Enter username').isLength({ min: 3 }),
    body('avatarUrl', 'Incorrect link to avatar').optional().isURL(),
];

export const loginValidation = [
    body('email', 'Invalid mail format').isEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .matches(/\d/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),
];

export const chatCreateValidation = [
    body('chatname', 'Enter article chatname').isLength({ min: 3 }).isString(),
    body('imageUrl', 'Invalid image link').optional().isString(),
];
