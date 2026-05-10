import React from 'react';
import { GlassCard } from './UI';
import { FileText, Download, Eye, Calendar, TrendingUp, ChevronLeft, Search } from 'lucide-react';
import { mockReports } from '../services/mockData';
import { motion } from 'motion/react';
import { Badge } from './UI';

export const Archive: React.FC = () => {
  const [filter, setFilter] = React.useState<'all' | 'monthly' | 'annual' | 'profit_loss'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortYear, setSortYear] = React.useState<string>('all');

  const filteredReports = mockReports
    .filter(r => (filter === 'all' || r.type === filter))
    .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.period.includes(searchTerm))
    .filter(r => (sortYear === 'all' || r.period.includes(sortYear)));

  const getIcon = (type: string) => {
    switch (type) {
      case 'profit_loss': return <TrendingUp className="text-green-400" size={20} />;
      case 'annual': return <Calendar className="text-gold" size={20} />;
      default: return <FileText className="text-blue-400" size={20} />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'profit_loss': return 'דוח רווח והפסד';
      case 'annual': return 'דוח שנתי';
      case 'monthly': return 'דיווח חודשי';
      default: return 'דוח';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-right" dir="rtl">
      <div>
        <h1 className="text-4xl font-serif font-bold mb-2">ארכיון דוחות</h1>
        <p className="text-white/60">גישה לכל הדוחות הפיננסיים, השנתיים ונתוני הרווח והפסד של העסק.</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'כל הדוחות' },
            { id: 'profit_loss', label: 'רווח והפסד' },
            { id: 'annual', label: 'דוחות שנתיים' },
            { id: 'monthly', label: 'דיווחים שוטפים' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                filter === tab.id 
                  ? 'bg-gold text-navy shadow-lg shadow-gold/20' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              placeholder="חיפוש..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pr-10 pl-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gold w-full"
            />
          </div>
          <select 
            value={sortYear}
            onChange={(e) => setSortYear(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white/60 focus:outline-none"
          >
            <option value="all">כל השנים</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReports.map((report, idx) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <GlassCard className="p-5 flex items-center justify-between hover:bg-white/10 transition-colors group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  {getIcon(report.type)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg">{report.title}</h3>
                    <Badge variant={report.type === 'profit_loss' ? 'success' : 'info'}>
                      {getTypeName(report.type)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white/40">
                    <span className="flex items-center gap-1"><Calendar size={14} /> {report.period}</span>
                    <span>תאריך הפקה: {new Date(report.date).toLocaleDateString('he-IL')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                  <Eye size={18} /> תצוגה
                </Button>
                <Button variant="secondary" size="sm" className="flex items-center gap-2">
                  <Download size={18} /> הורדה
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
        
        {filteredReports.length === 0 && (
          <div className="py-20 text-center text-white/20">
            <FileText size={48} className="mx-auto mb-4 opacity-10" />
            <p>לא נמצאו דוחות בקטגוריה זו</p>
          </div>
        )}
      </div>
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', size = 'md', className, ...props }) => {
  const variants = {
    primary: 'bg-gold text-navy hover:bg-yellow-400 font-bold',
    secondary: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    ghost: 'bg-transparent text-white/60 hover:text-white hover:bg-white/5',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  return (
    <button 
      className={`rounded-xl transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
