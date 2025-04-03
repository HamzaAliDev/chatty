import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    senderId: string;
    receiverId: string;
    text: string;
    media: string;
}

const MessageSchema: Schema<Message> = new Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    text: { type: String, default: '' },
    media: { type: String, default: '' },
}, { timestamps: true });

const messageModel = (mongoose.models.Message as mongoose.Model<Message>) || mongoose.model<Message>('Message', MessageSchema);

export default messageModel;