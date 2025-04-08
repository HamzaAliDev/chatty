import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "axios";
import { IMessage } from "@/types/message";
import { IUser } from "@/types/user";
import { useAuthStore } from "./useAuthStore";

interface ChatStore {
    messages: IMessage[];
    users: IUser[];
    selectedUser: IUser | null;
    isUsersLoading: boolean;
    isMessagesLoading: boolean;
    fetchUsers: (loggedInUserId: string) => Promise<void>;
    fetchMessages: (selectedUserId: string, authUserId: string | null) => Promise<void>;
    sendMessage: (messageData: IMessage, authUserId: string | null) => Promise<void>;
    setSelectedUser: (user: IUser | null) => void;
    subscribeToMessages: () => void;
    unsubscribeFromMessages: () => void;
}

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
export const useChatStore = create<ChatStore>((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    fetchUsers: async (loggedInUserId) => {
        set({ isUsersLoading: true });
        try {
            // console.log("fetching user loggedInUserId", loggedInUserId);
            const response = await axios.get(`${API_URL}messages/users`, {
                params: { loggedInUserId }
            });
            // console.log("response", response);
            if (response.status === 200) {
                set({ users: response.data.data });
                // toast.success(response.data.message);

            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log("error", error);
            toast.error("Failed to fetch users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    // get messages
    fetchMessages: async (selectedUserId, authUserId): Promise<void> => {
        set({ isMessagesLoading: true });
        try {
            const response = await axios.get(`${API_URL}messages`, {
                params: { selectedUserId, authUserId }
            });
            console.log("response", response);
            if (response.status === 200) {
                set({ messages: response.data.data });
                // toast.success(response.data.message);
            }
        } catch (error: unknown) {
            toast.error("Failed to fetch messages");
            console.error("Error fetching messages:", error);
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    // send message
    sendMessage: async (messageData, authUserId) => {
        const { selectedUser, messages } = get();
      
        try {
            const response = await axios.post(`${API_URL}messages/send`, messageData, {
                params: { selectedUserId: selectedUser?.clerkId, authUserId: authUserId }
            })
            // console.log("response", response);
            if (response.status === 200) {
                set({ messages: [...messages, response.data.data] });
                // toast.success(response.data.message);
            }
            else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Failed to send message");
            console.error("Error sending message:", error);
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket;

        socket?.on("newMessage",(newMessage)=>{
            if(newMessage.senderId !== selectedUser.clerkId) return;
            set({messages: [...get().messages, newMessage]})
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket?.off("newMessage");
    },

    // set selected user
    setSelectedUser: (user) => set({ selectedUser: user }),

}));