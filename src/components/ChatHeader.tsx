import React from 'react';
import { X } from "lucide-react";
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import Image from 'next/image';

export default function ChatHeader() {
    const { selectedUser, setSelectedUser } = useChatStore();
    const { onlineUsers } = useAuthStore();

    const isOnline = selectedUser?.clerkId && onlineUsers.includes(selectedUser.clerkId);
    if (!selectedUser) return null;

    return (
        <div className="p-2.5 border-b border-base-300">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="avatar">
                        <div className="size-10 rounded-full relative">
                            <Image src={selectedUser?.profilePic || "/avatar.png"}
                                alt={selectedUser?.fullName || "User avatar"}
                                width={40}
                                height={40}
                            />
                        </div>
                    </div>

                    {/* User info */}
                    <div>
                        <h3 className="font-medium">{selectedUser?.fullName}</h3>
                        <p className="text-sm text-base-content/70">
                            {isOnline ? "Online" : "Offline"}
                        </p>
                    </div>
                </div>

                {/* Close button */}
                <button onClick={() => setSelectedUser(null)}>
                    <X />
                </button>
            </div>
        </div>
    )
}
