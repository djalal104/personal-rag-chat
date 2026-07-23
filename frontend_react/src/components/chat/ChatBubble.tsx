import React from 'react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MarkdownRenderer } from '../markdown/MarkdownRenderer';
import { useSimulatedStreaming } from '@/hooks/useSimulatedStreaming';
import type { Message } from '@/store/useChatStore';
import { Bot, User } from 'lucide-react';

interface ChatBubbleProps {
  message: Message;
  onStreamComplete?: () => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onStreamComplete }) => {
  const isUser = message.role === 'user';
  const displayedContent = useSimulatedStreaming(
    message.content,
    message.isStreaming || false,
    onStreamComplete
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}
    >
      <div className={`flex gap-4 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        <Avatar className="w-8 h-8 shrink-0 mt-1 ring-1 ring-border">
          {isUser ? (
            <>
              <AvatarFallback className="bg-primary text-primary-foreground"><User size={16} /></AvatarFallback>
            </>
          ) : (
            <>
              <AvatarImage src="/photo.jpg" alt="AI Avatar" />
              <AvatarFallback className="bg-secondary text-secondary-foreground"><Bot size={16} /></AvatarFallback>
            </>
          )}
        </Avatar>
        
        <div className={`flex flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-muted-foreground">
              {isUser ? 'You' : 'Djalal Eddine'}
            </span>
          </div>
          <div
            className={`px-5 py-3 rounded-2xl ${
              isUser
                ? 'bg-primary text-primary-foreground rounded-tr-sm'
                : 'bg-muted/50 border border-border rounded-tl-sm'
            }`}
          >
            {isUser ? (
              <div className="whitespace-pre-wrap">{message.content}</div>
            ) : (
              <MarkdownRenderer content={displayedContent} />
            )}
            
            {message.isStreaming && !isUser && displayedContent.length < message.content.length && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
              />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
