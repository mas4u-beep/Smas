import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { TrendingUp, TrendingDown, Wallet, Receipt, Calculator, ArrowUpRight } from 'lucide-react';
import { GlassCard, Badge } from './UI';
import { mockInsights } from '../services/mockData';

export const Dashboard: React.FC = () => {
  const currentMonth = mockInsights[mockInsights.length - 1];
  const lastMonth = mockInsights[mockInsights.length - 2];
  
  const incomeGrowth = ((currentMonth.income - lastMonth.income) / lastMonth.income * 100).toFixed(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">ברוך השב, אלכס</h1>
          <p className="text-white/60">העסק שלך בצמיחה. הנה סקירה פיננסית לאפריל 2026.</p>
        </div>
        <Badge variant="success">סטטוס עסק: בריא</Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-right">
        <GlassCard className="border-r-4 border-r-gold">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gold/10 rounded-lg">
              <TrendingUp className="text-gold" size={20} />
            </div>
            <span className="text-green-400 text-sm font-medium flex items-center gap-1">
              {incomeGrowth}% <ArrowUpRight size={14} />
            </span>
          </div>
          <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">הכנסות נטו</p>
          <p className="text-3xl font-bold">₪{currentMonth.income.toLocaleString()}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-red-500/10 rounded-lg">
              <TrendingDown className="text-red-400" size={20} />
            </div>
            <span className="text-white/40 text-sm font-medium">יעד חודשי</span>
          </div>
          <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">הוצאות</p>
          <p className="text-3xl font-bold">₪{currentMonth.expenses.toLocaleString()}</p>
        </GlassCard>

        <GlassCard>
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Calculator className="text-blue-400" size={20} />
            </div>
          </div>
          <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">הערכת מע"מ</p>
          <p className="text-3xl font-bold">₪{currentMonth.taxEstimation.toLocaleString()}</p>
        </GlassCard>

        <GlassCard className="bg-gradient-to-br from-navy-light to-navy border-gold/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gold/10 rounded-lg">
              <Wallet className="text-gold" size={20} />
            </div>
          </div>
          <p className="text-white/60 text-sm mb-1 uppercase tracking-wider">רווח זמין</p>
          <p className="text-3xl font-bold text-gold">₪{currentMonth.netProfit.toLocaleString()}</p>
        </GlassCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-right">
        <GlassCard className="lg:col-span-2">
          <h3 className="text-xl font-serif mb-6">הכנסות מול הוצאות</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockInsights}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#ffffff40" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(val) => val.split('-')[1] + '/' + val.split('-')[0].slice(2)}
                />
                <YAxis orientation="right" stroke="#ffffff40" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A192F', border: '1px solid #ffffff10', borderRadius: '12px', textAlign: 'right' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="income" 
                  stroke="#D4AF37" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorIncome)" 
                  name="הכנסות"
                />
                <Area 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  fill="transparent"
                  name="הוצאות"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-xl font-serif mb-6">מרווח רווח</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockInsights}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="#ffffff40" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(val) => val.split('-')[1]}
                />
                <YAxis orientation="right" stroke="#ffffff40" tick={{ fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#ffffff05' }}
                  contentStyle={{ backgroundColor: '#0A192F', border: '1px solid #ffffff10', borderRadius: '12px', textAlign: 'right' }}
                />
                <Bar dataKey="netProfit" name="רווח נטו">
                  {mockInsights.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={index === mockInsights.length - 1 ? '#D4AF37' : '#D4AF3730'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">שיעור רווח</span>
              <span className="font-semibold text-green-400">60.9%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">חיסכון במס</span>
              <span className="font-semibold font-mono">₪12,450</span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
        <GlassCard className="flex items-center gap-6 cursor-pointer hover:bg-white/10 transition-colors group">
          <div className="p-4 bg-gold rounded-full text-navy group-hover:scale-110 transition-transform">
            <Receipt size={32} />
          </div>
          <div>
            <h4 className="text-xl font-semibold">העלאת חשבוניות</h4>
            <p className="text-white/60">העלו מסמכים לעיבוד AI מהיר</p>
          </div>
        </GlassCard>
        
        <GlassCard className="flex items-center gap-6 cursor-pointer hover:bg-white/10 transition-colors group">
          <div className="p-4 bg-electric-blue rounded-full text-white group-hover:scale-110 transition-transform">
            <Calculator size={32} />
          </div>
          <div>
            <h4 className="text-xl font-semibold">תחזית מס</h4>
            <p className="text-white/60">הפעילו סימולציה של חבות המס השנתית</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};
