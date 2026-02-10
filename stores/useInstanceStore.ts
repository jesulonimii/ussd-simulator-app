import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type InteractionType = "arkesel" | "africastalking" | "hollatags";

export interface USSDInstance {
    id: string;
    name: string;
    phoneNumber: string;
    callbackUrl: string;
    interactionType: InteractionType;
    createdAt: number;
}

interface InstanceStore {
    instances: USSDInstance[];
    addInstance: (instance: Omit<USSDInstance, "id" | "createdAt">) => void;
    removeInstance: (id: string) => void;
    updateInstance: (id: string, updates: Partial<Omit<USSDInstance, "id" | "createdAt">>) => void;
    getInstance: (id: string) => USSDInstance | undefined;
}

export const useInstanceStore = create<InstanceStore>()(
    persist(
        (set, get) => ({
            instances: [],

            addInstance: (instance) => {
                const newInstance: USSDInstance = {
                    ...instance,
                    id: Crypto.randomUUID(),
                    createdAt: Date.now(),
                };
                set((state) => ({
                    instances: [newInstance, ...state.instances],
                }));
            },

            removeInstance: (id) => {
                set((state) => ({
                    instances: state.instances.filter((i) => i.id !== id),
                }));
            },

            updateInstance: (id, updates) => {
                set((state) => ({
                    instances: state.instances.map((i) =>
                        i.id === id ? { ...i, ...updates } : i
                    ),
                }));
            },

            getInstance: (id) => {
                return get().instances.find((i) => i.id === id);
            },
        }),
        {
            name: "ussd-instances",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
