import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatMessage } from '@/services/api';

export type Message = ChatMessage & {
  id: string;
  sources?: any[];
  isStreaming?: boolean;
};

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  addMessage: (msg: Message) => void;
  updateMessage: (id: string, partialMsg: Partial<Message>) => void;
  setLoading: (loading: boolean) => void;
  clearChat: () => void;
  deleteMessage: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isLoading: false,
      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
      updateMessage: (id, partialMsg) =>
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, ...partialMsg } : m)),
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      clearChat: () => set({ messages: [] }),
      deleteMessage: (id) => set((state) => ({ messages: state.messages.filter((m) => m.id !== id) })),
    }),
    {
      name: 'chat-storage',
    }
  )
);
