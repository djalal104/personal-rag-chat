import React, { useState, useRef, useEffect } from 'react';
import { Send, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/store/useChatStore';
import { chatService } from '@/services/api';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { addMessage, messages, isLoading, setLoading } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    const handleSuggestion = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setInput(customEvent.detail);
      // Wait for state to update, then we could auto-send or just let the user click send.
      // We'll just populate the text field to be safe.
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 0);
    };

    window.addEventListener('sendSuggestion', handleSuggestion);
    return () => window.removeEventListener('sendSuggestion', handleSuggestion);
  }, []);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMessageId = Date.now().toString();
    addMessage({
      id: userMessageId,
      role: 'user',
      content: trimmed,
    });

    setLoading(true);

    try {
      // The history should only include actual messages, omitting the one we just added.
      // Wait, we need to send history. We can map the store messages to API format.
      const history = messages
        .filter((m) => m.role !== 'system') // Exclude system if any
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await chatService.sendMessage({
        message: trimmed,
        history,
      });

      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        sources: response.sources,
        isStreaming: true, // triggers the simulated streaming effect
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || error.message || "Unknown error";
      addMessage({
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `**Error:** Failed to reach the assistant. \n\nDetails: ${errorMessage}`,
        isStreaming: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="relative flex flex-col bg-background border border-border shadow-sm rounded-2xl overflow-hidden focus-within:ring-1 focus-within:ring-primary transition-all">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything..."
          className="min-h-[56px] max-h-[200px] w-full resize-none border-0 focus-visible:ring-0 px-4 py-4 text-base bg-transparent overflow-y-auto"
          rows={1}
        />
        <div className="flex justify-between items-center px-2 pb-2 mt-auto">
          <div className="flex items-center gap-2">
            {/* Future attachment button */}
          </div>
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="stop"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button 
                  size="icon" 
                  variant="secondary" 
                  className="rounded-full w-8 h-8"
                  onClick={() => { /* In a real scenario, this would abort the fetch */ }}
                >
                  <Square className="w-4 h-4 fill-current" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="send"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button 
                  size="icon" 
                  className="rounded-full w-8 h-8 transition-all"
                  onClick={handleSend}
                  disabled={!input.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground mt-3 select-none">
        © {new Date().getFullYear()} Djalal Eddine Belkadi. All rights reserved.
      </div>
    </div>
  );
};
