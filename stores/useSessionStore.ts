import * as Crypto from "expo-crypto";
import { create } from "zustand";

interface SessionState {
    sessionId: string | null;
    isActive: boolean;
    currentMessage: string;
    isLoading: boolean;
    history: string[];
    serviceCode: string;
    error: string | null;
}

interface SessionActions {
    startSession: (serviceCode: string) => string;
    setMessage: (message: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    addToHistory: (input: string) => void;
    endSession: () => void;
    getFullInput: () => string;
}

type SessionStore = SessionState & SessionActions;

export const useSessionStore = create<SessionStore>()((set, get) => ({
    sessionId: null,
    isActive: false,
    currentMessage: "",
    isLoading: false,
    history: [],
    serviceCode: "",
    error: null,

    startSession: (serviceCode: string) => {
        const sessionId = Crypto.randomUUID();
        set({
            sessionId,
            isActive: true,
            currentMessage: "",
            isLoading: true,
            history: [],
            serviceCode,
            error: null,
        });
        return sessionId;
    },

    setMessage: (message: string) => {
        set({ currentMessage: message });
    },

    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },

    setError: (error: string | null) => {
        set({ error });
    },

    addToHistory: (input: string) => {
        set((state) => ({
            history: [...state.history, input],
        }));
    },

    endSession: () => {
        set({
            sessionId: null,
            isActive: false,
            currentMessage: "",
            isLoading: false,
            history: [],
            serviceCode: "",
            error: null,
        });
    },

    getFullInput: () => {
        return get().history.join("*");
    },
}));
