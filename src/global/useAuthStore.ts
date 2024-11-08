import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
    id: number | null;
    fullName: string | null;
    token: string | null;
    preferredTopics: string[];
    setUser: (token: string) => void;
    clearUser: () => void;
}

interface DecodedToken {
    id: number;
    fullName: string;
    preferredTopics: string[];
}

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            (set) => ({
                id: null,
                fullName: null,
                token: null,
                preferredTopics: [],
                setUser: (token) => {
                    const decoded = jwtDecode<DecodedToken>(token);
                    const { id, fullName, preferredTopics } = decoded;
                    return set({ id, fullName, preferredTopics, token });
                },
                clearUser: () => {
                    localStorage.removeItem('token');
                    return set({
                        id: null,
                        fullName: null,
                        preferredTopics: [],
                        token: null,
                    });
                },
            }),
            { name: 'authStore' }
        )
    )
);
