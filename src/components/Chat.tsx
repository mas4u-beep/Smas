import React, { useState, useEffect, useRef } from 'react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { useAuth } from '../lib/AuthContext';
import { GlassCard, Button } from './UI';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export const Chat: React.FC = () => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    // Use a shared chat ID or user-specific chat with staff
    const chatId = user.uid; // Simple case: each user has one chat with the office

    const q = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toMillis() || Date.now()
      }));
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `chats/${chatId}/messages`);
    });

    return unsubscribe;
  }, [user]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const chatId = user.uid;
    const text = input;
    setInput('');

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: user.uid,
        senderName: profile?.fullName || user.displayName,
        text,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
       console.error("Chat error:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col space-y-6 text-right" dir="rtl">
      <div>
        <h1 className="text-4xl font-serif font-bold mb-2">צ'אט עם המשרד</h1>
        <p className="text-white/60">תקשורת ישירה ומאובטחת עם רואי החשבון והצוות המקצועי.</p>
      </div>

      <GlassCard className="flex-1 flex flex-col overflow-hidden border-white/10 bg-white/[0.02]">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide"
        >
          {loading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="animate-spin text-gold" />
            </div>
          ) : messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-white/20">
              <Bot size={48} className="mb-4 opacity-5" />
              <p>התחילו שיחה חדשה עם הצוות שלנו</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[70%]",
                    msg.senderId === user?.uid ? "mr-auto flex-row-reverse" : "ml-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold",
                    msg.senderId === user?.uid ? "bg-gold text-navy" : "bg-white/10 text-white/60"
                  )}>
                    {msg.senderId === user?.uid ? 'אתה' : 'משרד'}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-sm relative",
                    msg.senderId === user?.uid 
                      ? "bg-gold/10 text-white rounded-tl-none border border-gold/20" 
                      : "bg-white/5 text-white/90 rounded-tr-none border border-white/10"
                  )}>
                    <p>{msg.text}</p>
                    <span className="text-[9px] opacity-20 mt-2 block">
                      {new Date(msg.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="p-4 bg-navy-light/30 border-t border-white/5">
          <div className="flex gap-3 bg-white/5 p-2 rounded-2xl border border-white/5">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="כתבו הודעה..."
              className="flex-1 bg-transparent px-4 py-3 focus:outline-none placeholder:text-white/20 text-white"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-12 h-12 bg-gold text-navy rounded-xl flex items-center justify-center hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              <Send size={20} className="rotate-180" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
