import React from 'react';
import { Store, Newspaper, Tag, ArrowRight, ExternalLink, MessageCircle, Users, Search, Phone, MapPin, Star } from 'lucide-react';
import { GlassCard, Button, Badge } from './UI';
import { mockMarketplace, mockNews, mockProfessionals } from '../services/mockData';
import { motion } from 'motion/react';

export const CommunityHub: React.FC = () => {
  const [professionSearch, setProfessionSearch] = React.useState('');

  const filteredProfessionals = mockProfessionals.filter(p => 
    p.name.includes(professionSearch) || 
    p.specialty.includes(professionSearch) || 
    p.area.includes(professionSearch)
  );

  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-right">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">קהילה וערך</h1>
          <p className="text-white/60">התחברו לעסקים אחרים והישארו מעודכנים בחדשות פיננסיות.</p>
        </div>
      </div>

      {/* Professional Search */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
            <Users size={22} />
          </div>
          <h2 className="text-2xl font-serif font-bold">חיפוש אנשי מקצוע</h2>
        </div>
        
        <div className="max-w-xl flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-3">
          <Search className="text-white/30" />
          <input 
            type="text" 
            placeholder="חפש רואי חשבון, עורכי דין, יועצים לפי שם או אזור..."
            value={professionSearch}
            onChange={(e) => setProfessionSearch(e.target.value)}
            className="flex-1 bg-transparent border-none focus:outline-none text-right"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProfessionals.map((pro) => (
            <GlassCard key={pro.id} className="p-5 flex flex-col items-center text-center hover:border-purple-500/30 transition-colors">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 text-purple-400">
                <Users size={32} />
              </div>
              <h4 className="text-lg font-bold mb-1">{pro.name}</h4>
              <p className="text-gold text-xs font-bold uppercase tracking-wider mb-3">{pro.specialty}</p>
              
              <div className="space-y-2 mb-6 w-full text-white/60 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <MapPin size={14} /> {pro.area}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone size={14} /> {pro.phone}
                </div>
              </div>

              <div className="mt-auto flex items-center gap-1 text-gold text-sm font-bold">
                <Star size={14} fill="currentColor" /> {pro.rating}
              </div>
              
              <Button variant="secondary" className="w-full mt-4 text-xs py-2">
                צרו קשר
              </Button>
            </GlassCard>
          ))}
          {filteredProfessionals.length === 0 && (
            <div className="col-span-full py-10 text-center text-white/20">
              לא נמצאו אנשי מקצוע התואמים לחיפוש
            </div>
          )}
        </div>
      </section>

      {/* B2B Marketplace */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gold/10 rounded-lg text-gold">
            <Store size={22} />
          </div>
          <h2 className="text-2xl font-serif font-bold">זירת B2B</h2>
        </div>
        <p className="text-white/40">הטבות בלעדיות בין לקוחות mas4u.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockMarketplace.map((item) => (
            <GlassCard key={item.id} className="group relative">
              <div className="absolute top-4 left-4">
                <Badge variant="info">{item.category}</Badge>
              </div>
              <h4 className="text-xl font-bold mb-2 pl-12">{item.title}</h4>
              <p className="text-white/60 text-sm mb-6 line-clamp-2">{item.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                <div>
                  <p className="text-[10px] uppercase text-white/30 tracking-widest">ספק</p>
                  <p className="font-medium text-sm">{item.providerName}</p>
                </div>
                {item.discount ? (
                  <div className="text-left">
                    <p className="text-[10px] uppercase text-gold tracking-widest font-bold">הנחה</p>
                    <p className="text-lg font-bold text-gold">{item.discount}</p>
                  </div>
                ) : (
                  <div className="text-left">
                    <p className="text-[10px] uppercase text-white/30 tracking-widest">מחיר</p>
                    <p className="text-lg font-bold font-mono">{item.price}</p>
                  </div>
                )}
              </div>
              
              <Button variant="primary" className="w-full mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                מימוש הטבה <ArrowRight size={16} className="rotate-180" />
              </Button>
            </GlassCard>
          ))}
          
          <GlassCard className="border-dashed border-2 flex flex-col items-center justify-center text-center p-8 cursor-pointer hover:bg-white/5 transition-colors group">
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Tag className="text-white/40" />
             </div>
             <h4 className="text-lg font-semibold mb-2">הציעו את השירות שלכם</h4>
             <p className="text-sm text-white/40">הצטרפו לזירה ושתפו הטבות בלעדיות עם הקהילה.</p>
             <Button variant="ghost" className="mt-4">למידע נוסף</Button>
          </GlassCard>
        </div>
      </section>

      {/* Tax Knowledge Base */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
            <Newspaper size={22} />
          </div>
          <h2 className="text-2xl font-serif font-bold">מרכז ידע</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {mockNews.map((news) => (
            <GlassCard key={news.id} className="p-0 flex flex-col md:flex-row overflow-hidden group cursor-pointer hover:border-gold/30 transition-colors">
              <div className="w-full md:w-48 bg-navy-light relative overflow-hidden">
                <img 
                   src={`https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop`}
                   alt={news.title}
                   referrerPolicy="no-referrer"
                   className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-navy/60" />
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase font-bold text-gold tracking-widest underline underline-offset-4">{news.date}</span>
                  <ExternalLink size={16} className="text-white/20" />
                </div>
                <h4 className="text-xl font-bold mb-2 group-hover:text-gold transition-colors">{news.title}</h4>
                <p className="text-white/60 text-sm mb-6 flex-1">{news.summary}</p>
                <div className="flex items-center gap-2 text-xs font-semibold text-white/40 group-hover:text-white transition-colors">
                  קרא עוד <ArrowRight size={14} className="rotate-180" />
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Contact Manager */}
      <GlassCard className="bg-navy-light border-blue-500/20 py-8 px-12 flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-center lg:text-right">
          <h3 className="text-2xl font-serif font-bold mb-2">צריכים עזרה ישירה?</h3>
          <p className="text-white/60">מנהלת התיק שלך, שרה, זמינה בווטסאפ או בצ'אט המאובטח.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="secondary" className="bg-[#25D366] hover:bg-[#128C7E] text-white border-0 py-4 px-8">
            <MessageCircle size={24} /> ווטסאפ לשרה
          </Button>
          <Button variant="primary" className="py-4 px-8">
            קביעת פגישה
          </Button>
        </div>
      </GlassCard>
    </div>
  );
};
