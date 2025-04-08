import { create } from "zustand";
import { io } from "socket.io-client";

interface AuthStore {
    authUser: { firstName: string, lastName: string, imageUrl: string, createdAt: string } | null;
    authUserId: string | null;
    onlineUsers: string[];
    socket: ReturnType<typeof io> | null;
    setAuthUser: (user: { firstName: string; lastName: string; imageUrl: string; createdAt: string } | null) => void;
    setAuthUserId: (id: string | null) => void;
    // fetchOnlineUsers: () => Promise<void>;
    connectSocket: () => void;
    disconnectSocket: () => void;
}
interface SetAuthUser {
    (user: { firstName: string; lastName: string; imageUrl: string; createdAt: string } | null): void;
}

interface SetAuthUserId {
    (id: string | null): void;
}

interface FetchOnlineUsers {
    (): Promise<void>;
}

const BASEURL = process.env.NEXT_PUBLIC_SOCKET_IO_BASE_URL || '';
export const useAuthStore = create<AuthStore>((set, get) => ({
    authUser: null,
    authUserId: null,
    onlineUsers: [],
    socket: null,

    setAuthUser: ((user) => {
        set({ authUser: user });
    }) as SetAuthUser,

    setAuthUserId: ((id) => {
        set({ authUserId: id });
    }) as SetAuthUserId,

    // fetchOnlineUsers: (async () => {
    //     try {

    //     } catch (error) {

    //     }
    // }) as FetchOnlineUsers,



    connectSocket: () => {
        const { authUser, authUserId } = get()
        // console.log("authUser in connectSocket:", authUser);
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASEURL, {
            query: {
                userId: authUserId,
            }
        })
        socket.connect();

        set({ socket });

        socket.on("getOnlineUsers", (userIds: string[]) => {
            // console.log("Online users:", userIds);
            set({ onlineUsers: userIds });
        })
    },

    disconnectSocket: () => {
        const socket = get().socket;
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null });
        }
    }
}));