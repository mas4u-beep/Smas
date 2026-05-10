import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare,
  MessagesSquare,
  Bot,
  Store, 
  Newspaper, 
  Archive,
  Settings, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { cn } from './UI';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
  { id: 'documents', label: 'מסמכים', icon: FileText },
  { id: 'chat', label: 'צ\'אט עם המשרד', icon: MessagesSquare },
  { id: 'archive', label: 'ארכיון דוחות', icon: Archive },
  { id: 'ai-consultant', label: 'יועץ AI', icon: Bot },
  { id: 'marketplace', label: 'קהילה', icon: Store },
  { id: 'news', label: 'ידע ועדכונים', icon: Newspaper },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-navy-light rounded-lg border border-white/10"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        className={cn(
          "fixed right-0 top-0 h-screen bg-navy border-l border-white/5 z-40 transition-all duration-300 overflow-hidden flex flex-col",
          !isOpen && "items-center"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center font-bold text-navy text-xl">
            M
          </div>
          {isOpen && (
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-serif tracking-tight"
            >
              mas4u
            </motion.span>
          )}
        </div>

        <nav className="flex-1 mt-8 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-4 p-3 rounded-xl transition-all group text-right",
                activeTab === item.id 
                  ? "bg-gold text-navy shadow-lg shadow-gold/20" 
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={22} className={activeTab === item.id ? "" : "group-hover:scale-110 transition-transform"} />
              {isOpen && (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-white/5">
          <button className="w-full flex items-center gap-4 p-3 text-white/40 hover:text-red-400 rounded-xl transition-all">
            <LogOut size={22} />
            {isOpen && <span>התנתקות</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Padding */}
      <div className={cn("hidden lg:block transition-all duration-300", isOpen ? "mr-[280px]" : "mr-[80px]")} />
    </>
  );
};
