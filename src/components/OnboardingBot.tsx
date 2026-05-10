import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, User, Building2, CheckCircle2 } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { cn } from '../lib/utils';
import { GlassCard } from './UI';
import { useAuth } from '../lib/AuthContext';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const OnboardingBot: React.FC<{ onComplete: (data: any) => void }> = ({ onComplete }) => {
  const { user } = useAuth();
  const [messages, setMessages] = React.useState<Message[]>([
    { role: 'assistant', content: 'שלום! אני בוט הרישום של mas4u. אני כאן כדי לעזור לך להגדיר את החשבון החדש שלך בכמה דקות. איך קוראים לך?' }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [chat, setChat] = React.useState<any>(null);
  const [isFinished, setIsFinished] = React.useState(false);

  React.useEffect(() => {
    const initChat = async () => {
      const newChat = await geminiService.createOnboardingChat();
      setChat(newChat);
    };
    initChat();
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading || !chat) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const result = await chat.sendMessage({ message: userMsg });
      const response = result.text;
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
      
      if (response.includes('DONE')) {
        setIsFinished(true);
        // Simulate data extraction from the conversation summary
        const extractedData = {
          fullName: user.displayName || 'משתמש חדש',
          businessName: 'העסק שלי',
          businessType: 'עוסק מורשה'
        };
        
        setTimeout(() => {
           onComplete(extractedData);
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'אופס, משהו השתבש. בוא ננסה שוב.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-navy z-[200] flex items-center justify-center p-4 overflow-hidden"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#C5A05933,transparent_50%)]" />
      
      <div className="w-full max-w-2xl flex flex-col gap-8 h-full max-h-[800px] relative">
        <div className="text-center">
          <div className="w-20 h-20 bg-gold text-navy rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-gold/20">
            <Bot size={40} />
          </div>
          <h2 className="text-3xl font-serif font-bold mb-2">ברוכים הבאים ל-mas4u</h2>
          <p className="text-white/40">בואו נכיר אתכם ואת העסק שלכם</p>
        </div>

        <GlassCard className="flex-1 flex flex-col p-6 overflow-hidden border-white/5 bg-white/[0.02]">
          <div className="flex-1 overflow-y-auto space-y-6 px-2 mb-4 scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === 'user' ? "mr-auto flex-row-reverse" : "ml-auto"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    msg.role === 'user' ? "bg-navy-light text-gold" : "bg-gold text-navy"
                  )}>
                    {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-gold/10 text-white rounded-tl-none border border-gold/20" 
                      : "bg-white/5 text-white/90 rounded-tr-none border border-white/10"
                  )}>
                    {msg.content.replace('DONE', '')}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex gap-4 ml-auto">
                <div className="w-10 h-10 rounded-full bg-gold/20 text-gold flex items-center justify-center animate-pulse">
                  <Bot size={20} />
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 rounded-tr-none flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                  <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                </div>
              </div>
            )}
            {isFinished && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center space-y-4"
              >
                <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/20">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-green-400">הרישום הושלם בהצלחה!</h3>
                <p className="text-white/40">מיד נעבור ללוח הבקרה שלך...</p>
              </motion.div>
            )}
          </div>

          <div className="flex gap-3 bg-navy-light/50 p-2 rounded-2xl border border-white/5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={isLoading || isFinished}
              placeholder="כתבו כאן..."
              className="flex-1 bg-transparent px-4 py-3 focus:outline-none placeholder:text-white/20 text-white disabled:opacity-50"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || isFinished || !input.trim()}
              className="w-12 h-12 bg-gold text-navy rounded-xl flex items-center justify-center hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              <Send size={20} className="rotate-180" />
            </button>
          </div>
        </GlassCard>
        
        <div className="flex justify-between px-2 text-[10px] text-white/20 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-2">
            <Building2 size={12} /> פרטי עסק
          </div>
          <div className="flex items-center gap-2">
            <User size={12} /> פרטי אישיים
          </div>
        </div>
      </div>
    </motion.div>
  );
};
