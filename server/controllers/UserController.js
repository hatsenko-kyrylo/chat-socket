import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const secretHash = process.env.SECRET_HASH;

export const register = async (req, res) => {
    try {
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = new UserModel({
            username: req.body.username,
            passwordHash: hash,
            email: req.body.email,
            avatarUrl: req.body.avatarUrl,
        });

        // Save user
        const savedUser = await user.save();

        // encrypt id
        const token = jwt.sign(
            {
                _id: user._id,
            },
            secretHash,
            { expiresIn: '24h' }
        );

        // Don't include passwordHash in the answer
        const { passwordHash, ...userData } = savedUser._doc;

        res.json({ ...userData, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Registration Error',
        });
    }
};

export const login = async (req, res) => {
    try {
        // I check if such mail is among the registered ones
        const user = await UserModel.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user._doc.passwordHash
        );
        if (!isValidPassword) {
            return res.status(400).json({
                message: 'Wrong login or password',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            secretHash,
            { expiresIn: '24h' }
        );

        const { passwordHash, ...userData } = user._doc;
        res.json({ ...userData, token });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'Login Error',
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(400).json({
                message: 'User not found',
            });
        }

        const { passwordHash, ...userData } = user._doc;
        res.json(userData);
    } catch (error) {
        console.log(error);
        res.status(403).json({
            message: 'No access',
        });
    }
};
