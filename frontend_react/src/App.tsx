import React from 'react';
import { ThemeProvider } from 'next-themes';
import { MainLayout } from './components/layout/MainLayout';
import { MessageList } from './components/chat/MessageList';
import { ChatInput } from './components/chat/ChatInput';
import { TooltipProvider } from './components/ui/tooltip';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <MainLayout>
          <MessageList />
          <ChatInput />
        </MainLayout>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
