import express from 'express';

import { register, login, getMe } from '../controllers/UserController.js';
import checkAuth from '../utils/checkAuth.js';
import {
    registrationValidation,
    loginValidation,
} from '../validations/validation.js';
//----------------------------

const router = express.Router();

router.get('/me', checkAuth, getMe);
router.post('/registration', registrationValidation, register);
router.post('/login', loginValidation, login);

export default router;
