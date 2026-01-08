import { create } from "zustand";
import { persist } from "zustand/middleware";

const useChatSettings = create(
    persist(
        (set) => ({
            settings: {}, // { conversationId: { background: '...', bubbleStyle: '...' } }

            updateSetting: (conversationId, key, value) =>
                set((state) => ({
                    settings: {
                        ...state.settings,
                        [conversationId]: {
                            ...state.settings[conversationId],
                            [key]: value,
                        },
                    },
                })),

            getSettings: (conversationId) => {
                // Retorna settings o defaults
                return (
                    useChatSettings.getState().settings[conversationId] || {
                        background: "default",
                        bubbleStyle: "modern", // modern, comic, cloud, pixel
                    }
                );
            },
        }),
        {
            name: "chat-settings-storage", // key en localStorage
        }
    )
);

export default useChatSettings;
