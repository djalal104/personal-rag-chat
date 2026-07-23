import React, { useRef, useEffect } from 'react';
import { useChatStore } from '@/store/useChatStore';
import { ChatBubble } from './ChatBubble';
import { motion } from 'framer-motion';
import { Sparkles, GraduationCap, Code, Brain } from 'lucide-react';

const SUGGESTIONS = [
  { icon: GraduationCap, text: "Tell me about your education at ENSIA." },
  { icon: Code, text: "What are your main technical skills?" },
  { icon: Brain, text: "Explain your experience with machine learning." }
];


export const MessageList: React.FC = () => {
  const messages = useChatStore((state) => state.messages);
  const updateMessage = useChatStore((state) => state.updateMessage);
  const bottomRef = useRef<HTMLDivElement>(null);
  const addMessage = useChatStore((state) => state.addMessage);
  const setLoading = useChatStore((state) => state.setLoading);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSuggestionClick = (text: string) => {
    // We can't directly trigger the API call from here easily without duplicating logic or moving it.
    // Actually, we can just populate the input by simulating a click? No, we don't have access to the input state here.
    // Let's just create a global event or function in the store to trigger a send, or just leave them as non-clickable text for now.
    // Wait, let's just make it dispatch a message and then the user can see it. But the API call logic is in ChatInput.
    // Let's just use window.dispatchEvent to send the text to ChatInput.
    window.dispatchEvent(new CustomEvent('sendSuggestion', { detail: text }));
  };

  const isLoading = useChatStore((state) => state.isLoading);

  return (
    <div className="flex-1 w-full flex flex-col h-full overflow-hidden">
      <div className="flex-1 px-4 md:px-8 py-4 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full pb-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full mt-20 px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-semibold text-foreground tracking-tight">
                  Hello, I'm Djalal Eddine.
                </h1>
                <p className="text-lg text-muted-foreground max-w-[500px]">
                  How can I help you today? I can answer questions about my skills, projects, and experience.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8 w-full max-w-[800px]">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestionClick(s.text)}
                      className="flex flex-col items-start gap-2 p-4 text-left border border-border rounded-xl bg-card hover:bg-accent/50 transition-colors text-sm"
                    >
                      <s.icon className="w-5 h-5 text-muted-foreground mb-1" />
                      <span className="font-medium text-foreground">{s.text}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatBubble 
                  key={msg.id} 
                  message={msg} 
                  onStreamComplete={() => {
                    if (msg.isStreaming) {
                      updateMessage(msg.id, { isStreaming: false });
                    }
                  }}
                />
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex w-full justify-start mb-6"
                >
                  <div className="flex gap-4 max-w-[85%] flex-row">
                    <img 
                      src="/photo.jpg" 
                      alt="Djalal Eddine" 
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-1 ring-1 ring-border"
                    />
                    <div className="flex flex-col gap-1 items-start">
                      <span className="text-sm font-semibold text-muted-foreground">
                        Djalal Eddine
                      </span>
                      <div className="px-5 py-3.5 rounded-2xl bg-muted/50 border border-border rounded-tl-sm flex items-center gap-1.5">
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1, delay: 0 }}
                          className="w-2 h-2 rounded-full bg-primary/70"
                        />
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1, delay: 0.15 }}
                          className="w-2 h-2 rounded-full bg-primary/70"
                        />
                        <motion.span
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.1, delay: 0.3 }}
                          className="w-2 h-2 rounded-full bg-primary/70"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={bottomRef} className="h-4" />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
