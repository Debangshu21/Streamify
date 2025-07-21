import { create } from "zustand";

// Local storage is used so that even if page is refreshed the theme that was last picked is displayed
export const useThemeStore = create((set) => ({
    theme: localStorage.getItem("streamify-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("streamify-theme", theme);
        set({ theme });
    },
}));