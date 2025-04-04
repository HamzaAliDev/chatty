'use server';

import User from '@/model/User';
import dbConnect from '@/lib/dbConnect';

interface IUser {
    _id?: string;
    clerkId: string;
    email: string;
    fullName: string;
    profilePic: string;
}

export async function createUser(user: IUser): Promise<IUser> {
    await dbConnect();
    try {
        const { clerkId, email, fullName, profilePic } = user;
        const userData = new User({
            clerkId,
            email,
            fullName,
            profilePic,
        });
        const newUser = await userData.save();
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
    }
}

export async function updateUser(user: IUser): Promise<IUser> {
    await dbConnect();
    try {
        const { clerkId, email, fullName, profilePic } = user;
        const updatedUser = await User.findOneAndUpdate(
            { clerkId },
            { email, fullName, profilePic },
            { new: true }
        );
        return JSON.parse(JSON.stringify(updatedUser));
    } catch (error) {
        console.error('Error updating user:', error);
        throw new Error('Error updating user');
    }
}

export async function deleteUser(clerkId: string): Promise<IUser> {
    await dbConnect();
    try {
        const deletedUser = await User.findOneAndDelete({ clerkId });
        return JSON.parse(JSON.stringify(deletedUser));
    } catch (error) {
        console.error('Error deleting user:', error);
        throw new Error('Error deleting user');
    }
}