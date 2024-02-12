import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
dotenv.config();

import { Server } from 'socket.io';
import cors from 'cors';
import mongoose from 'mongoose';
import UserModel from './models/User.js';
import ChatModel from './models/Chat.js';

import authRouter from './routes/auth.js';
import chatsRouter from './routes/chats.js';

const DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const PORT = process.env.PORT;

mongoose
    .connect(`mongodb+srv://Admin:${DB_PASSWORD}@chat.rcfzaqq.mongodb.net/`)
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB Error', err));

//----------------------------------
const app = express();
app.use(express.json());
app.use(cors({ origin: '*' }));

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    },
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

// Routes
app.use('/auth', authRouter);
app.use('/chats', chatsRouter);

// Sockets
io.on('connection', (socket) => {
    console.log('user connection');

    socket.on('chatId', ({ chatId }) => {
        socket.join(chatId);
    });

    socket.on('disconnect', () => {
        console.log('Disconnect');
    });
});

httpServer.listen(PORT, () => console.log('Server OK'));
