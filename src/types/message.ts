export interface IMessage{
    _id?: string;
    createdAt?: string;
    senderId?: string;
    receiverId?: string;
    text: string;
    media?: string | null;
} 