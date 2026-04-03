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
      return { name: chan.name, matchWins, tossWins, entries: chanPredictions.length };
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
    <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="w-full h-16 sticky top-0 z-40 bg-[var(--bg-app)]/80 backdrop-blur-md flex items-center justify-between px-8 shadow-sm border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-xl font-black tracking-tighter text-primary uppercase leading-none italic italic">Authority Dashboard</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
            <span className="material-symbols-outlined text-outline text-lg">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-48 font-medium placeholder:text-outline text-on-surface" placeholder="Search archives..." type="text"/>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary-container ring-1 ring-outline-variant/30 overflow-hidden">
             <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDixRxPA3y35u5PfZQBPGFtHIULze_wLlwEt7KODkpDljdqUTLUyVLMgqtLUHbVeimCYVR-OSHtwaRoO36XuRfem88PnAmOFSjno_xDQv_QjK6S95MeWDaBwQYRFmtvfDHVxi0ElqMx8fh2q47y2Mn_nMdhHaXUXBTIFAr3Fbys8gc1s2wuwGezXFr7JvoIuyPB0JleehgPj9yI4DF22Ga4AAKcyUZmBGfgN4nPdZytAl2ZMrwjGRbKM3LnIcfAYAYoRUqAdMflAiw" alt="Analyst"/>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:border-primary/20 transition-all">
            <span className="text-[10px] font-black text-outline uppercase tracking-widest block mb-4 italic opacity-70">Total Points Synchronized</span>
            <h3 className="text-4xl font-black text-on-surface font-headline">{stats.totalEntries}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:border-secondary/20 transition-all">
            <span className="text-[10px] font-black text-outline uppercase tracking-widest block mb-4 italic opacity-70">Global Toss Average</span>
            <h3 className="text-4xl font-black text-secondary font-headline">{stats.tossAccuracy}%</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 hover:border-primary/20 transition-all">
            <span className="text-[10px] font-black text-outline uppercase tracking-widest block mb-4 italic opacity-70">Global Match Average</span>
            <h3 className="text-4xl font-black text-primary font-headline">{stats.matchAccuracy}%</h3>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="font-headline font-black text-lg uppercase tracking-tighter">Match Analytics Score</h3>
                <p className="text-[10px] text-outline font-black uppercase tracking-widest opacity-50 italic">Scaled Relative to Top Performer</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(25,57,138,0.5)]" />
            </div>
            
            <div className="h-48 flex items-end justify-around gap-6 px-4">
              {topChannelsData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4">
                  <div className="w-full flex items-end justify-center h-32 bg-surface-container-low/30 rounded-t-xl relative group overflow-hidden">
                     <div 
                      className="w-10 rounded-t-xl bg-primary chart-gradient-primary transition-all duration-700 shadow-lg" 
                      style={{ height: `${data.matchScore}%` }}
                     >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pb-3 z-10">
                            <div className="bg-on-surface text-bg-lowest text-[9px] font-black px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap uppercase tracking-widest">{data.matchWins} Wins</div>
                        </div>
                     </div>
                  </div>
                  <span className="text-[9px] font-black text-outline uppercase tracking-tighter truncate w-full text-center">{data.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="font-headline font-black text-lg uppercase tracking-tighter">Toss Analytics Score</h3>
                <p className="text-[10px] text-outline font-black uppercase tracking-widest opacity-50 italic">Scaled Relative to Top Performer</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_12px_rgba(57,237,202,0.5)]" />
            </div>
            
            <div className="h-48 flex items-end justify-around gap-6 px-4">
              {topChannelsData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-4">
                  <div className="w-full flex items-end justify-center h-32 bg-surface-container-low/30 rounded-t-xl relative group overflow-hidden">
                     <div 
                      className="w-10 rounded-t-xl bg-secondary chart-gradient-secondary transition-all duration-700 shadow-lg" 
                      style={{ height: `${data.tossScore}%` }}
                     >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pb-3 z-10">
                            <div className="bg-on-surface text-bg-lowest text-[9px] font-black px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap uppercase tracking-widest">{data.tossWins} Wins</div>
                        </div>
                     </div>
                  </div>
                  <span className="text-[9px] font-black text-outline uppercase tracking-tighter truncate w-full text-center">{data.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
             <div className="px-8 py-6 bg-surface-container-low flex justify-between items-center border-b border-outline-variant/10">
                <h3 className="font-headline font-black text-md uppercase tracking-[0.2em] text-primary">Live Strategy Logs</h3>
                <span className="text-[9px] font-black text-outline/30 uppercase italic uppercase">Synchronization Active</span>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-surface-container-low/30">
                      <th className="px-8 py-5 text-[9px] font-black text-outline uppercase tracking-widest">Source Entity</th>
                      <th className="px-8 py-5 text-[9px] font-black text-outline uppercase tracking-widest text-center">Outcome Matrix (T/M)</th>
                      <th className="px-8 py-5 text-[9px] font-black text-outline uppercase tracking-widest text-right">Verification</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-outline-variant/10">
                  {stats.recentLogs.map((log) => (
                     <tr key={log._id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-8 py-5">
                           <div className="flex flex-col">
                              <span className="font-black text-sm text-on-surface uppercase">{log.channel}</span>
                              <span className="text-[10px] text-outline font-normal uppercase tracking-widest italic">{log.matchName}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-center">
                           <div className="flex justify-center gap-2">
                              <span className={`px-2.5 py-1 rounded-md text-[9px] font-black border tracking-widest ${log.tossPrediction === 'Win' ? 'bg-secondary-container/20 border-secondary/30 text-secondary' : 'bg-surface-container-high/50 border-outline/10 text-outline/40'}`}>T {log.tossPrediction}</span>
                              <span className={`px-2.5 py-1 rounded-md text-[9px] font-black border tracking-widest ${log.matchPrediction === 'Win' ? 'bg-primary-container/20 border-primary/30 text-primary' : 'bg-surface-container-high/50 border-outline/10 text-outline/40'}`}>M {log.matchPrediction}</span>
                           </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant/10">
                              <span className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" />
                              <span className="text-[8px] font-black text-outline uppercase tracking-widest italic leading-none">Verified Stream</span>
                           </div>
                        </td>
                     </tr>
                  ))}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="lg:col-span-4 bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/10 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h3 className="font-headline font-black text-lg uppercase tracking-tighter">Yield Share</h3>
                <span className="material-symbols-outlined text-primary text-xl">pie_chart</span>
             </div>
             <div className="space-y-8">
                {topChannelsData.map(chan => {
                  const percent = totalEntries > 0 ? ((chan.entries / totalEntries) * 100).toFixed(0) : 0;
                  return (
                     <div key={chan.name} className="space-y-3 group cursor-pointer">
                        <div className="flex justify-between items-center px-1">
                           <span className="text-[10px] font-black text-on-surface uppercase tracking-wider group-hover:text-primary transition-colors">{chan.name}</span>
                           <span className="text-[9px] font-black text-outline uppercase tracking-[0.2em] bg-surface-container-low px-2 py-0.5 rounded-md">{percent}% Yield</span>
                        </div>
                        <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden p-[1px] border border-outline-variant/5">
                           <div className="bg-primary h-full transition-all duration-1000 shadow-[0_0_8px_rgba(25,57,138,0.3)]" style={{ width: `${percent}%` }} />
                        </div>
                     </div>
                  );
                })}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
