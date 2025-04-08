import React, { useEffect, useRef } from 'react'
import Image from 'next/image';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { formatMessageTime } from '@/lib/utils';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './MessageSkeleton';
import MessageInput from './MessageInput';

export default function ChatContainer() {
    const { messages, fetchMessages, isMessagesLoading, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();
    const { authUserId, authUser } = useAuthStore();
    const messageEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (selectedUser && authUserId) {
            if (selectedUser.clerkId) {
                fetchMessages(selectedUser.clerkId, authUserId);

                subscribeToMessages()
            }
        }
        return () => {
            unsubscribeFromMessages()
        }
    }, [selectedUser]);

    useEffect(() => {
        if (messageEndRef.current && messages) {
            messageEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    if (isMessagesLoading) {
        return (
            <div className="flex-1 flex flex-col overflow-auto">
                <ChatHeader />
                <MessageSkeleton />
                <MessageInput />
            </div>
        );
    }
    return (
        <div className="flex-1 flex flex-col overflow-auto">
            <ChatHeader />

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message._id}
                        className={`chat ${message.senderId === authUserId ? "chat-end" : "chat-start"}`}
                        // ref={messageEndRef}
                    >
                        <div className=" chat-image avatar">
                            <div className="size-10 rounded-full border">
                                <Image
                                    src={
                                        message.senderId === authUserId
                                            ? authUser?.imageUrl || "/avatar.png"
                                            : (selectedUser?.profilePic || "/avatar.png")
                                    }
                                    width={40}
                                    height={40}
                                    sizes="40px"
                                    alt="profile pic"
                                    className="object-cover rounded-full"
                                />
                            </div>
                        </div>
                        <div className="chat-header mb-1">
                            <time className="text-xs opacity-50 ml-1">
                                {formatMessageTime(message.createdAt || new Date())}
                            </time>
                        </div>
                        <div className="chat-bubble flex flex-col">
                            {message.media && (
                                <Image
                                    src={message.media}
                                    alt="Attachment"
                                    className="sm:max-w-[200px] rounded-md mb-2 object-cover"
                                    width={250}
                                    height={300}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 200px"
                                />
                            )}
                            {message.text && <p>{message.text}</p>}
                        </div>
                    </div>
                ))}
                <div ref={messageEndRef} />
            </div>

            <MessageInput />
        </div>
    )
}
