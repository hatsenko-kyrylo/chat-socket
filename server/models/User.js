import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
        },
        passwordHash: {
            type: String,
            required: true,
        },
        chats: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Chat',
                },
            ],
            default: [],
        },
        avatarUrl: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('User', UserSchema);
