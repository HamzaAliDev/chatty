import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
    clerkId: string;
    fullName: string;
    email: string;
    profilePic: string;
    status: string;
}

const UserSchema: Schema<User> = new Schema({
    clerkId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profilePic: { type: String, default: '' },
    status: { type: String, default: 'active' },
}, { timestamps: true });

const userModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>('User', UserSchema);

export default userModel;