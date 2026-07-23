import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { LayoutPanelLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300">
        <header className="sticky top-0 z-10 flex h-14 items-center gap-2 px-4 bg-background/80 backdrop-blur-md border-b border-border/40">
          {!sidebarOpen && (
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground">
              <LayoutPanelLeft className="w-5 h-5" />
            </Button>
          )}
          <h1 className="text-sm font-semibold tracking-wide ml-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Djalal Eddine Belkadi
          </h1>
        </header>
        
        <main className="flex-1 flex flex-col min-h-0 relative">
          {children}
        </main>
      </div>
    </div>
  );
};
