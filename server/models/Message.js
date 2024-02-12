import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
    {
        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        chat_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chat',
        },
        text: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Message', MessageSchema);
