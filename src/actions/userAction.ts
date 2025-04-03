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