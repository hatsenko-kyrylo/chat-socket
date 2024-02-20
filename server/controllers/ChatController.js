import ChatModel from '../models/Chat.js';
import UserModel from '../models/User.js';
import MessageModel from '../models/Message.js';

export const getOne = async (req, res) => {
    try {
        const chat = await ChatModel.findById(req.params.chatId)
            .populate({
                path: 'users',
                select: '_id',
            })
            .populate({
                path: 'messages',
                select: 'author_id text',
                populate: {
                    path: 'author_id',
                    select: 'username avatarUrl',
                },
            })
            .exec();

        res.json(chat);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Failed to get messages for the chat',
            error: error.message,
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const message = new MessageModel({
            author_id: req.userId,
            chat_id: req.params.chatId,
            text: req.body.text,
        });

        const savedMessage = await message.save();

        const fillMessage = await MessageModel.findById(
            savedMessage._id
        ).populate({
            path: 'author_id',
            select: 'username avatarUrl',
        });

        // Sending messages via sockets

        req.io
            .to(req.params.chatId)
            .emit('sendMessage', { data: { message: fillMessage } });

        await ChatModel.findByIdAndUpdate(
            req.params.chatId,
            {
                $push: { messages: message },
            },
            { new: true }
        );

        res.json({
            message: 'success',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to send message',
        });
    }
};
export const getAllChats = async (req, res) => {
    try {
        const chats = await ChatModel.find()
            .sort({ updatedAt: -1 })
            .populate({
                path: 'messages',
                select: 'text author_id',
                populate: {
                    path: 'author_id',
                    select: 'username',
                },
            })
            .exec();

        res.json(chats);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get all chats',
        });
    }
};
export const getAllUserChats = async (req, res) => {
    try {
        const chats = await ChatModel.find({ users: req.userId })
            .sort({ updatedAt: -1 })
            .populate({
                path: 'users',
                select: 'username _id avatarUrl',
            })
            .populate({
                path: 'messages',
                select: 'text author_id',
                populate: {
                    path: 'author_id',
                    select: 'username',
                },
            })
            .exec();

        res.json(chats);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to get all users chats',
        });
    }
};

export const create = async (req, res) => {
    try {
        const chat = new ChatModel({
            chatname: req.body.chatname,
            owner_id: req.userId,
            users: [req.userId],
        });
        const savedChat = await chat.save();

        await UserModel.findByIdAndUpdate(
            req.userId,
            {
                $push: { chats: savedChat._id },
            },
            { new: true }
        );

        const firstMessage = new MessageModel({
            chat_id: savedChat._id,
            text: 'Chat created',
        });
        const savedFirstMessage = await firstMessage.save();

        savedChat.messages.push(savedFirstMessage._id);
        await savedChat.save();

        res.json(savedChat);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Failed to create chat',
        });
    }
};

export const joinChat = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const userIdToJoin = req.userId;

        const user = await UserModel.findByIdAndUpdate(
            userIdToJoin,
            {
                $push: { chats: chatId },
            },
            { new: true }
        );

        const joinMessage = new MessageModel({
            chat_id: chatId,
            text: `${user.username} has joined the chat`,
        });
        const savedJoinMessage = await joinMessage.save();

        // socket
        req.io.emit('join', {
            data: { message: savedJoinMessage },
        });

        await ChatModel.findByIdAndUpdate(
            chatId,
            {
                $push: { users: userIdToJoin, messages: savedJoinMessage },
            },
            { new: true }
        );

        res.json({
            message: 'success',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error joining chat',
        });
    }
};

export const removeMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;

        const message = await MessageModel.findOneAndDelete({ _id: messageId });

        await ChatModel.findByIdAndUpdate(
            message.chat_id,
            {
                $pull: { messages: messageId },
            },
            { new: true }
        );

        res.json({
            message: 'success',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to remove message',
        });
    }
};

export const leaveChat = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const userIdToRemove = req.userId;

        const user = await UserModel.findByIdAndUpdate(
            userIdToRemove,
            { $pull: { chats: chatId } },
            { new: true }
        );

        // socket
        const leaveMessage = new MessageModel({
            chat_id: req.params.chatId,
            text: `${user.username} left the chat`,
        });
        const savedLeaveMessage = await leaveMessage.save();

        req.io.emit('leave', {
            data: { message: savedLeaveMessage },
        });

        await ChatModel.findByIdAndUpdate(
            chatId,
            {
                $pull: { users: userIdToRemove },
                $push: { messages: savedLeaveMessage },
            },
            { new: true }
        );

        res.json({
            message: 'success',
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error leaving chat',
        });
    }
};
