import React from 'react';
import { Send, Terminal, Bot, User, Sparkles, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard, Button, cn } from './UI';
import { ChatMessage } from '../types';
import { geminiService } from '../services/geminiService';

export const AIConsultant: React.FC = () => {
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'שלום! אני היועץ העסקי של mas4u המבוסס על בינה מלאכותית. איך אוכל לעזור לך לייעל את הכספים בעסק היום? אני יכול לסייע בשאלות מס, ניתוח הוצאות או אסטרטגיות צמיחה כלליות.',
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user' as any,
        parts: [{ text: m.content }]
      }));

      const response = await geminiService.getAIBusinessAdvice(history, input);

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500 text-right">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-gold to-yellow-200 rounded-2xl flex items-center justify-center text-navy shadow-lg shadow-gold/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-bold">יועץ עסקי AI</h1>
            <p className="text-white/60">מופעל על ידי Gemini 3.1 Pro</p>
          </div>
        </div>
        <Badge variant="info">מחובר</Badge>
      </div>

      <GlassCard className="flex-1 flex flex-col p-4 relative">
        {/* Chat History */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-white/10"
        >
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex gap-4 max-w-[80%]",
                msg.role === 'user' ? "mr-auto" : "ml-auto flex-row-reverse"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-white/10",
                msg.role === 'user' ? "bg-navy-light text-gold" : "bg-gold text-navy"
              )}>
                {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
              </div>
              
              <div className={cn(
                "p-4 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                  ? "bg-navy-light text-white rounded-tl-none" 
                  : "bg-white/5 text-white/90 rounded-tr-none border border-white/10"
              )}>
                {msg.content}
                <div className="mt-2 text-[10px] opacity-40">
                  {new Date(msg.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-4 flex-row-reverse ml-auto"
            >
              <div className="w-10 h-10 rounded-full bg-gold text-navy flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div className="p-4 bg-white/5 rounded-2xl flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" />
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-4 p-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="שאל אותי כל דבר על העסק שלך..."
            className="flex-1 bg-transparent px-4 py-3 focus:outline-none placeholder:text-white/20 text-right"
          />
          <Button 
            className="rounded-xl w-12 h-12 p-0" 
            onClick={handleSend}
            isLoading={isLoading}
          >
            <Send size={20} className="rotate-180" />
          </Button>
        </div>
      </GlassCard>

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-3">
        {[
          "מהי תחזית הרווח שלי לרבעון הבא?",
          "איך אוכל להקטין את תשלומי המע\"מ שלי?",
          "הסבר לי את חוקי המס החדשים ל-2026",
          "נתח את קטגוריות ההוצאות שלי"
        ].map((q) => (
          <button
            key={q}
            onClick={() => setInput(q)}
            className="px-4 py-2 bg-white/5 border border-white/5 rounded-full text-xs text-white/50 hover:bg-gold/10 hover:text-gold hover:border-gold/30 transition-all font-medium"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

const Badge: React.FC<{ children: React.ReactNode; variant?: 'info' | 'success' }> = ({ children }) => (
  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium flex items-center gap-2">
     <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
     {children}
  </span>
);
