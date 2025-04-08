'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader } from 'lucide-react';

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
    const { user, isSignedIn, } = useUser();
    const { connectSocket, setAuthUser, setAuthUserId } = useAuthStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isSignedIn && user) {
            // console.log("Logged in Clerk user:", user);

            const { firstName, lastName, imageUrl, createdAt } = user;
            const userData = {
                firstName: firstName || "",
                lastName: lastName || "",
                imageUrl: imageUrl || "",
                createdAt: createdAt ? createdAt.toString() : new Date().toString()
            };
            setAuthUser(userData);
            setAuthUserId(user.id);

            connectSocket();
        }

        setLoading(false);

    }, [isSignedIn, user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader className="size-10 animate-spin" />
            </div>
        )
    }

    return <>{children}</>;
}
