import { create } from "zustand";

interface ThemeState {
    theme: string;
    setTheme: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
    theme: typeof window !== "undefined" ? localStorage.getItem("chat-theme") || "coffee" : "coffee",
    setTheme: (theme: string) => {
        localStorage.setItem("chat-theme", theme);
        set({ theme });
    },
}));