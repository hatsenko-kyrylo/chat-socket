import express from 'express';

import {
    create,
    joinChat,
    getAllUserChats,
    getOne,
    sendMessage,
    getAllChats,
    removeMessage,
    leaveChat,
} from '../controllers/ChatController.js';
import checkAuth from '../utils/checkAuth.js';
import { chatCreateValidation } from '../validations/validation.js';
//------------------------

const router = express.Router();

router.get('/all', checkAuth, getAllChats);
router.get('/', checkAuth, getAllUserChats);
router.get('/:chatId', checkAuth, getOne);
router.post('/', checkAuth, chatCreateValidation, create);
router.patch('/:chatId', checkAuth, joinChat);
router.delete('/:messageId', checkAuth, removeMessage);
router.delete('/:chatId', checkAuth, leaveChat);
router.post('/:chatId', checkAuth, sendMessage);

export default router;
