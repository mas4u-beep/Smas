/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { DocumentCenter } from './components/DocumentCenter';
import { AIConsultant } from './components/AIConsultant';
import { CommunityHub } from './components/CommunityHub';
import { Archive } from './components/Archive';
import { Chat } from './components/Chat';
import { NotificationCenter } from './components/NotificationCenter';
import { OnboardingBot } from './components/OnboardingBot';
import { Login } from './components/Login';
import { useAuth } from './lib/AuthContext';
import { useNotifications } from './lib/useNotifications';
import { db } from './lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { GlassCard } from './components/UI';
import { Bell, Search, User, LogOut, Loader2 } from 'lucide-react';

export default function App() {
  const { user, profile, loading, logout, updateProfile } = useAuth();
  useNotifications();
  const [activeTab, setActiveTab] = React.useState('dashboard');
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      where('read', '==', false)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadCount(snapshot.size);
    });
    return unsubscribe;
  }, [user]);

  const handleOnboardingComplete = async (data: any) => {
    console.log('Onboarding data:', data);
    await updateProfile({ ...data, onboardingCompleted: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <Loader2 className="text-gold animate-spin" size={40} />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const showOnboarding = profile && !profile.onboardingCompleted;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'documents':
        return <DocumentCenter />;
      case 'chat':
        return <Chat />;
      case 'archive':
        return <Archive />;
      case 'ai-consultant':
        return <AIConsultant />;
      case 'marketplace':
        return <CommunityHub />;
      case 'news':
        return <div className="p-20 text-center text-white/40 font-serif text-2xl">מרכז ידע ועדכונים בקרוב...</div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-navy text-white selection:bg-gold/30 selection:text-gold flex">
      {showOnboarding && <OnboardingBot onComplete={handleOnboardingComplete} />}
      
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-8 pt-24 lg:pt-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Top Bar for Desktop */}
          <div className="hidden lg:flex items-center justify-between mb-12">
            <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full px-6 py-2 w-[400px]">
              <Search className="text-white/30" size={18} />
              <input 
                type="text" 
                placeholder="חיפוש משאבים, מסמכים..." 
                className="bg-transparent border-none focus:outline-none w-full text-sm text-right"
              />
              <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-white/40 font-sans">⌘K</span>
            </div>

            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsNotificationsOpen(true)}
                className="relative text-white/60 hover:text-white transition-colors"
                id="bell-button"
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-navy flex items-center justify-center text-[10px] text-white font-bold font-sans">{unreadCount}</span>
                )}
              </button>
              
              <div className="h-8 w-px bg-white/10" />
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 cursor-pointer group">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-semibold group-hover:text-gold transition-colors">{profile?.fullName || user.displayName || 'משתמש'}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold font-sans">{profile?.role === 'admin' ? 'מנהל מערכת' : 'חבר מועדון Elite'}</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-white/10 to-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold/50 transition-colors overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-white/60 group-hover:text-gold transition-colors" />
                    )}
                  </div>
                </div>
                <button 
                  onClick={logout}
                  className="p-2 text-white/40 hover:text-red-400 transition-colors"
                  title="התנתקות"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderContent()}
          </div>
        </div>
      </main>

      <NotificationCenter isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} />

      {/* Decorative Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-electric-blue/5 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none -z-10" />
    </div>
  );
}
