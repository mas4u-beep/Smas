import React, { useEffect, useState } from 'react';
import { GlassCard } from './UI';
import { Bell, AlertTriangle, FileWarning, Info, MessageSquare, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { useAuth } from '../lib/AuthContext';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from 'firebase/firestore';

export const NotificationCenter: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotifications(notifs);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
    });

    return unsubscribe;
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <AlertTriangle className="text-red-400" size={20} />;
      case 'missing_doc': return <FileWarning className="text-yellow-400" size={20} />;
      case 'chat': return <MessageSquare className="text-blue-400" size={20} />;
      default: return <Info className="text-gold" size={20} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="fixed right-0 top-0 h-full w-full max-w-[400px] bg-navy border-l border-white/10 z-[101] shadow-2xl flex flex-col pt-20"
            dir="rtl"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-gold" />
                <h2 className="text-xl font-serif font-bold">התראות</h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                    {unreadCount} חדשות
                  </span>
                )}
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
                id="close-notifications"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {notifications.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-white/20">
                  <Bell size={48} className="mb-4 opacity-5" />
                  <p>אין התראות חדשות</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <motion.div
                    key={notif.id}
                    layout
                    className={cn(
                      "p-4 rounded-2xl border transition-all cursor-pointer",
                      notif.read 
                        ? "bg-white/5 border-transparent opacity-60" 
                        : "bg-white/10 border-gold/20 shadow-lg shadow-gold/5"
                    )}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex gap-4">
                      <div className="mt-1">{getIcon(notif.type)}</div>
                      <div className="flex-1 text-right">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className={cn("font-bold", notif.read ? "text-white/60" : "text-white")}>
                            {notif.title}
                          </h4>
                          <span className="text-[10px] text-white/30">
                            {new Date(notif.timestamp).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed mb-3">
                          {notif.message}
                        </p>
                        {notif.actionUrl && (
                          <button className="text-xs text-gold font-bold flex items-center gap-1 hover:underline">
                            בצע פעולה <ChevronRight size={14} className="rotate-180" />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            <div className="p-4 border-t border-white/10">
              <button className="w-full py-3 text-sm text-white/40 hover:text-white transition-colors">
                סמן הכל כנקרא
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
