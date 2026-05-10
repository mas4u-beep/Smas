import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { GlassCard } from './UI';
import { LogIn } from 'lucide-react';
import { motion } from 'motion/react';

export const Login: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-electric-blue/5 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md text-center space-y-8"
      >
        <div className="space-y-4">
          <h1 className="text-5xl font-serif font-bold text-white tracking-tight">mas4u</h1>
          <p className="text-white/40 text-lg">ניהול פיננסי חכם ומתקדם לעסק שלך</p>
        </div>

        <GlassCard className="p-8 space-y-8 border-white/10 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-serif font-bold text-white">כניסה למערכת</h2>
              <p className="text-white/40 text-sm">השתמשו בחשבון Google כדי להתחבר בצורה מאובטחת</p>
            </div>

            <button
              onClick={login}
              className="w-full py-4 bg-white text-navy font-bold rounded-2xl flex items-center justify-center gap-3 hover:bg-gold transition-all duration-300 shadow-xl shadow-white/5 active:scale-95"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              התחברות עם Google
            </button>
            
            <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">
              <div className="w-8 h-px bg-white/10" />
              Secure Authentication
              <div className="w-8 h-px bg-white/10" />
            </div>
          </div>
        </GlassCard>

        <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">
          © 2026 MAS4U • ALL RIGHTS RESERVED
        </p>
      </motion.div>
    </div>
  );
};
