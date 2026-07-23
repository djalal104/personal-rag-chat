import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Settings, LayoutPanelLeft, Plus, Moon, Sun, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useChatStore } from '@/store/useChatStore';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { theme, setTheme } = useTheme();
  const clearChat = useChatStore((state) => state.clearChat);

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.div
        className="fixed md:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-muted/30 border-r border-border h-full"
        initial={{ x: -260 }}
        animate={{ x: isOpen ? 0 : -260, width: isOpen ? 256 : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="md:hidden">
            <LayoutPanelLeft className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="hidden md:flex">
            <LayoutPanelLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col items-center text-center space-y-4">
          {/* Avatar & Profile */}
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <img 
                src="/photo.jpg" 
                alt="Djalal Eddine" 
                className="w-20 h-20 rounded-full object-cover ring-2 ring-primary/20 shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full ring-2 ring-background" />
            </div>

            <h3 className="font-semibold text-sm text-foreground tracking-tight">Djalal Eddine Belkadi</h3>
            <p className="text-[11px] text-primary font-medium">AI & CS Student @ ENSIA</p>
          </div>

          {/* Education Card */}
          <div className="w-full bg-card/60 border border-border/60 rounded-xl p-3 text-left space-y-1 text-xs shadow-sm">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Education</span>
            </div>
            <p className="font-medium text-foreground text-xs">ENSIA</p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              National School of CS & Artificial Intelligence
            </p>
          </div>

          {/* Skills Badges */}
          <div className="w-full bg-card/60 border border-border/60 rounded-xl p-3 text-left space-y-2 text-xs shadow-sm">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Technical Skills</span>
            </div>
            <div className="flex flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium">Deep Learning</span>
              <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium">CNN / RNN</span>
              <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium">Reinforcement Learning</span>
              <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium">React / TypeScript</span>
              <span className="px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[10px] font-medium">FastAPI & RAG</span>
            </div>
          </div>

          {/* Focus Areas */}
          <div className="w-full bg-card/60 border border-border/60 rounded-xl p-3 text-left space-y-1.5 text-xs shadow-sm">
            <div className="flex items-center gap-1.5 font-semibold text-foreground text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Focus Areas</span>
            </div>
            <div className="text-[11px] text-muted-foreground space-y-1">
              <div className="flex items-center justify-between">
                <span>Artificial Intelligence</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary rounded font-medium">Primary</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cybersecurity</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-muted text-muted-foreground rounded font-medium">Secondary</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 mt-auto border-t border-border flex flex-col gap-1">
          <Button variant="ghost" className="w-full justify-start gap-2 h-9 px-2" onClick={() => clearChat()}>
            <Trash2 className="w-4 h-4 shrink-0" />
            Reset Chat
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-2 h-9 px-2"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 shrink-0" /> : <Moon className="w-4 h-4 shrink-0" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
        </div>
      </motion.div>
    </>
  );
};
