import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema(
    {
        chatname: {
            type: String,
            unique: true,
            required: true,
        },
        owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        users: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User',
                },
            ],
            default: [],
        },
        messages: {
            type: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Message',
                },
            ],
            default: [],
        },
        imageUrl: String,
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Chat', ChatSchema);
