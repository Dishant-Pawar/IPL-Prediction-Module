import React, { useMemo } from 'react';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { stats, channels, predictions, loading } = useData();

  // Calculate relative performance (Score based on win count)
  const topChannelsData = useMemo(() => {
    if (!channels || channels.length === 0) return [];
    
    // 1. Calculate raw win counts
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

    // 2. Find max wins for scaling
    const maxMatchWins = Math.max(...channelStats.map(c => c.matchWins), 1);
    const maxTossWins = Math.max(...channelStats.map(c => c.tossWins), 1);

    // 3. Calculate relative performance (0-100)
    return channelStats
      .map(c => ({
        ...c,
        matchScore: (c.matchWins / maxMatchWins) * 100,
        tossScore: (c.tossWins / maxTossWins) * 100,
      }))
      .sort((a, b) => b.matchWins - a.matchWins) // Sort by match wins
      .slice(0, 5);
  }, [channels, predictions]);

  const totalEntries = stats.totalEntries || 0;
  
  return (
    <>
      <header className="w-full h-16 sticky top-0 z-40 bg-[#f9f9ff] flex items-center justify-between px-8 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-xl font-extrabold tracking-tighter text-[#19398a]">Authority Dashboard</h2>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-2 bg-surface-container-low px-4 py-2 rounded-full">
            <span className="material-symbols-outlined text-outline text-lg">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm w-48 font-medium placeholder:text-outline" placeholder="Search analytics..." type="text"/>
          </div>
          <div className="h-8 w-8 rounded-full bg-primary-container overflow-hidden ring-2 ring-[#dbe1ff]">
             <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDixRxPA3y35u5PfZQBPGFtHIULze_wLlwEt7KODkpDljdqUTLUyVLMgqtLUHbVeimCYVR-OSHtwaRoO36XuRfem88PnAmOFSjno_xDQv_QjK6S95MeWDaBwQYRFmtvfDHVxi0ElqMx8fh2q47y2Mn_nMdhHaXUXBTIFAr3Fbys8gc1s2wuwGezXFr7JvoIuyPB0JleehgPj9yI4DF22Ga4AAKcyUZmBGfgN4nPdZytAl2ZMrwjGRbKM3LnIcfAYAYoRUqAdMflAiw" alt="Analyst"/>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <span className="text-[10px] font-black text-outline uppercase tracking-widest block mb-4">Total Predictions Recorded</span>
            <h3 className="text-3xl font-black text-on-surface font-headline">{stats.totalEntries}</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <span className="text-[10px] font-black text-outline uppercase tracking-widest block mb-4">Global Toss Avg</span>
            <h3 className="text-3xl font-black text-on-surface font-headline">{stats.tossAccuracy}%</h3>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <span className="text-[10px] font-black text-outline uppercase tracking-widest block mb-4">Global Match Avg</span>
            <h3 className="text-3xl font-black text-on-surface font-headline">{stats.matchAccuracy}%</h3>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-headline font-bold text-lg">Match Analytics Score</h3>
                <p className="text-xs text-outline font-medium uppercase tracking-widest">Relative to Top Performer (100%)</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-primary" />
            </div>
            
            <div className="h-48 flex items-end justify-around gap-4 px-2">
              {topChannelsData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full flex items-end justify-center h-32 bg-surface-container-low/20 rounded-t-lg relative group">
                     <div 
                      className="w-10 rounded-t-lg bg-primary chart-gradient-primary transition-all duration-700" 
                      style={{ height: `${data.matchScore}%` }}
                     >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pb-2 z-10">
                            <div className="bg-on-surface text-white text-[10px] font-black px-2 py-1 rounded shadow-lg whitespace-nowrap">{data.matchWins} Match Wins</div>
                        </div>
                     </div>
                  </div>
                  <span className="text-[10px] font-black text-outline uppercase tracking-tighter truncate w-full text-center">{data.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-headline font-bold text-lg">Toss Analytics Score</h3>
                <p className="text-xs text-outline font-medium uppercase tracking-widest">Relative to Top Performer (100%)</p>
              </div>
              <span className="h-2 w-2 rounded-full bg-secondary" />
            </div>
            
            <div className="h-48 flex items-end justify-around gap-4 px-2">
              {topChannelsData.map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <div className="w-full flex items-end justify-center h-32 bg-surface-container-low/20 rounded-t-lg relative group">
                     <div 
                      className="w-10 rounded-t-lg bg-secondary chart-gradient-secondary transition-all duration-700" 
                      style={{ height: `${data.tossScore}%` }}
                     >
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity pb-2 z-10">
                            <div className="bg-on-surface text-white text-[10px] font-black px-2 py-1 rounded shadow-lg whitespace-nowrap">{data.tossWins} Toss Wins</div>
                        </div>
                     </div>
                  </div>
                  <span className="text-[10px] font-black text-outline uppercase tracking-tighter truncate w-full text-center">{data.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
             <div className="px-6 py-5 border-b border-outline-variant/10">
                <h3 className="font-headline font-bold text-lg">Live Strategy Logs</h3>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-surface-container-low/50">
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-[0.1em]">Identity / Source</th>
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-[0.1em] text-center">Matrix Outcome (T/M)</th>
                      <th className="px-6 py-4 text-[10px] font-black text-outline uppercase tracking-[0.1em] text-right">Synchronization</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-outline-variant/10">
                  {stats.recentLogs.map((log) => (
                     <tr key={log._id} className="hover:bg-surface-container-low/30 transition-colors">
                        <td className="px-6 py-4 font-bold text-sm text-on-surface">
                           <div className="flex flex-col">
                              <span>{log.channel}</span>
                              <span className="text-[10px] text-outline font-normal uppercase tracking-widest">{log.matchName}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                           <div className="flex justify-center gap-1">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black ${log.tossPrediction === 'Win' ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-high text-outline'}`}>{log.tossPrediction}</span>
                              <span className={`px-2 py-0.5 rounded text-[8px] font-black ${log.matchPrediction === 'Win' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-outline'}`}>{log.matchPrediction}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <span className="text-[10px] font-black text-secondary-container bg-secondary px-2 py-1 rounded">VERIFIED</span>
                        </td>
                     </tr>
                  ))}
                 </tbody>
               </table>
             </div>
          </div>

          <div className="lg:col-span-4 bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10">
             <h3 className="font-headline font-bold text-lg mb-6">Channel Distribution</h3>
             <div className="space-y-6">
                {topChannelsData.map(chan => {
                  const percent = totalEntries > 0 ? ((chan.entries / totalEntries) * 100).toFixed(0) : 0;
                  return (
                     <div key={chan.name} className="space-y-2">
                        <div className="flex justify-between items-center">
                           <span className="text-xs font-bold text-on-surface">{chan.name}</span>
                           <span className="text-[10px] font-black text-outline uppercase">{percent}%</span>
                        </div>
                        <div className="w-full bg-surface-container-low h-1 rounded-full overflow-hidden">
                           <div className="bg-primary h-full transition-all duration-700" style={{ width: `${percent}%` }} />
                        </div>
                     </div>
                  );
                })}
             </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Dashboard;
