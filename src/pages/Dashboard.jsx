import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { stats, channels, predictions, loading } = useData();

  const topChannelsData = useMemo(() => {
    if (!channels || channels.length === 0) return [];
    
    const channelStats = channels.map(chan => {
      const chanPredictions = predictions.filter(p => p.channel === chan.name);
      const matchWins = chanPredictions.filter(p => p.matchPrediction === 'Win').length;
      const tossWins = chanPredictions.filter(p => p.tossPrediction === 'Win').length;
      
      return { 
        name: chan.name, 
        matchWins, 
        tossWins,
        entries: chanPredictions.length
      };
    });

    const maxMatchWins = Math.max(...channelStats.map(c => c.matchWins), 1);
    const maxTossWins = Math.max(...channelStats.map(c => c.tossWins), 1);

    return channelStats
      .map(c => ({
        ...c,
        matchScore: (c.matchWins / maxMatchWins) * 100,
        tossScore: (c.tossWins / maxTossWins) * 100,
      }))
      .sort((a, b) => b.matchWins - a.matchWins)
      .slice(0, 5);
  }, [channels, predictions]);

  const totalEntries = stats.totalEntries || 0;
  
  return (
    <div className="min-h-full pb-10">
      <header className="w-full h-16 sticky top-0 z-40 bg-[#f9f9ff]/90 backdrop-blur-md flex items-center justify-between px-6 md:px-8 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-lg md:text-xl font-black tracking-tighter text-[#19398a] uppercase italic">Authority Dashboard</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full ring-1 ring-outline-variant/10">
            <span className="material-symbols-outlined text-outline text-lg">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-xs w-32 xl:w-48 font-black uppercase tracking-widest placeholder:text-outline/40" placeholder="Matrix Search..." type="text"/>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary-container ring-1 ring-primary/20 overflow-hidden">
             <img className="w-full h-full object-cover grayscale brightness-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDixRxPA3y35u5PfZQBPGFtHIULze_wLlwEt7KODkpDljdqUTLUyVLMgqtLUHbVeimCYVR-OSHtwaRoO36XuRfem88PnAmOFSjno_xDQv_QjK6S95MeWDaBwQYRFmtvfDHVxi0ElqMx8fh2q47y2Mn_nMdhHaXUXBTIFAr3Fbys8gc1s2wuwGezXFr7JvoIuyPB0JleehgPj9yI4DF22Ga4AAKcyUZmBGfgN4nPdZytAl2ZMrwjGRbKM3LnIcfAYAYoRUqAdMflAiw" alt="Analyst"/>
          </div>
        </div>
      </header>

      <div className="p-6 md:p-8 space-y-8">
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/10 group hover:border-primary/30 transition-all duration-500">
            <span className="text-[9px] font-black text-outline uppercase tracking-[0.3em] block mb-4 flex items-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-primary" />
               Strategy Data Points
            </span>
            <h3 className="text-4xl font-black text-on-surface font-headline italic tracking-tighter">{stats.totalEntries}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/10 group hover:border-secondary/30 transition-all duration-500">
            <span className="text-[9px] font-black text-outline uppercase tracking-[0.3em] block mb-4 flex items-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
               Global Toss Reliability 
            </span>
            <h3 className="text-4xl font-black text-on-surface font-headline italic tracking-tighter">{stats.tossAccuracy}%</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-[2rem] shadow-sm border border-outline-variant/10 group hover:border-tertiary/30 transition-all duration-500 sm:col-span-2 lg:col-span-1">
            <span className="text-[9px] font-black text-outline uppercase tracking-[0.3em] block mb-4 flex items-center gap-2">
               <span className="h-1.5 w-1.5 rounded-full bg-primary" />
               Global Match Reliability
            </span>
            <h3 className="text-4xl font-black text-on-surface font-headline italic tracking-tighter">{stats.matchAccuracy}%</h3>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="font-headline font-black text-xl uppercase tracking-tighter italic">Match Analytics Score</h3>
                <p className="text-[9px] font-black text-outline uppercase tracking-[0.3em]">Relative Data Matrix (Top 5)</p>
              </div>
              <span className="material-symbols-outlined text-primary/30 text-3xl font-black">finance_mode</span>
            </div>
            
            <div className="h-56 flex items-end justify-around gap-2 md:gap-4 px-2">
              {topChannelsData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full flex items-end justify-center h-40 bg-surface-container-low/20 rounded-2xl relative">
                     <div 
                      className="w-10 md:w-12 rounded-t-xl bg-primary chart-gradient-primary transition-all duration-1000 group-hover:brightness-110" 
                      style={{ height: `${data.matchScore}%` }}
                     >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all pb-2 z-10">
                            <div className="bg-on-surface text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md whitespace-nowrap ring-1 ring-white/10 uppercase tracking-widest">{data.matchWins} Wins</div>
                        </div>
                     </div>
                  </div>
                  <span className="text-[8px] md:text-[9px] font-black text-outline uppercase tracking-widest truncate w-full text-center px-1">{data.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="font-headline font-black text-xl uppercase tracking-tighter italic">Toss Analytics Score</h3>
                <p className="text-[9px] font-black text-outline uppercase tracking-[0.3em]">Relative Data Matrix (Top 5)</p>
              </div>
              <span className="material-symbols-outlined text-secondary/30 text-3xl font-black">query_stats</span>
            </div>
            
            <div className="h-56 flex items-end justify-around gap-2 md:gap-4 px-2">
              {topChannelsData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                  <div className="w-full flex items-end justify-center h-40 bg-surface-container-low/20 rounded-2xl relative">
                     <div 
                      className="w-10 md:w-12 rounded-t-xl bg-secondary chart-gradient-secondary transition-all duration-1000 group-hover:brightness-110" 
                      style={{ height: `${data.tossScore}%` }}
                     >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-all pb-2 z-10">
                            <div className="bg-on-surface text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-md whitespace-nowrap ring-1 ring-white/10 uppercase tracking-widest">{data.tossWins} Wins</div>
                        </div>
                     </div>
                  </div>
                  <span className="text-[8px] md:text-[9px] font-black text-outline uppercase tracking-widest truncate w-full text-center px-1">{data.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>


      </div>
    </div>
  );
};

export default Dashboard;
