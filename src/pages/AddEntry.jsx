import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const AddEntry = () => {
  const { channels, refreshData } = useData();
  const [matchId, setMatchId] = useState('');
  const [matchName, setMatchName] = useState('MI VS CSK');
  const [matchDate, setMatchDate] = useState(new Date().toISOString().split('T')[0]);
  const [forecasts, setForecasts] = useState({});

  const handleToggle = (channel, field, value) => {
    setForecasts(prev => {
      const current = prev[channel] ? prev[channel][field] : null;
      return { ...prev, [channel]: { ...(prev[channel] || {}), [field]: current === value ? null : value } };
    });
  };

  const handleCommit = async () => {
    const entries = Object.entries(forecasts)
      .filter(([_, data]) => data.tossPrediction || data.matchPrediction)
      .map(([channel, data]) => ({ channel, matchName, date: new Date(matchDate), tossPrediction: data.tossPrediction || 'Loss', matchPrediction: data.matchPrediction || 'Loss', matchId }));
    
    if (entries.length === 0) return alert('No forecasts selected.');
    try {
      const response = await fetch('http://localhost:5000/api/predictions/bulk', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(entries) });
      if (response.ok) { refreshData(); setForecasts({}); alert(`Synchronized ${entries.length} data points!`); }
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="hidden lg:flex w-full h-16 sticky top-0 z-40 bg-[var(--bg-app)]/80 backdrop-blur-md items-center justify-between px-8 shadow-sm border-b border-outline-variant/10">
        <h2 className="font-headline text-xl font-black tracking-tighter text-secondary uppercase leading-none italic uppercase">Entry Synchronization</h2>
        <div className="h-8 w-8 rounded-full bg-primary-container ring-1 ring-outline-variant/30 overflow-hidden">
             <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDixRxPA3y35u5PfZQBPGFtHIULze_wLlwEt7KODkpDljdqUTLUyVLMgqtLUHbVeimCYVR-OSHtwaRoO36XuRfem88PnAmOFSjno_xDQv_QjK6S95MeWDaBwQYRFmtvfDHVxi0ElqMx8fh2q47y2Mn_nMdhHaXUXBTIFAr3Fbys8gc1s2wuwGezXFr7JvoIuyPB0JleehgPj9yI4DF22Ga4AAKcyUZmBGfgN4nPdZytAl2ZMrwjGRbKM3LnIcfAYAYoRUqAdMflAiw" alt="Analyst"/>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-5xl mx-auto overflow-x-hidden">
        {/* Global Parameters - Now Responsive Stack/Flex */}
        <section className="bg-surface-container-lowest p-6 md:p-8 rounded-3xl border border-outline-variant/10 shadow-sm relative overflow-hidden">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
              <div className="space-y-2 group">
                 <label className="text-[10px] font-black text-outline uppercase tracking-widest pl-1">Cycle Date</label>
                 <input className="w-full bg-surface-container-low border border-outline-variant/10 p-3.5 rounded-xl text-xs font-black text-on-surface focus:border-secondary transition-all outline-none uppercase" type="date" value={matchDate} onChange={(e)=>setMatchDate(e.target.value)} />
              </div>
              <div className="space-y-2 group">
                 <label className="text-[10px] font-black text-outline uppercase tracking-widest pl-1">Teams Identification</label>
                 <input className="w-full bg-surface-container-low border border-outline-variant/10 p-3.5 rounded-xl text-xs font-black text-on-surface focus:border-secondary transition-all outline-none uppercase tracking-widest" placeholder="MI VS CSK" type="text" value={matchName} onChange={(e)=>setMatchName(e.target.value)} />
              </div>
              <div className="space-y-2 group">
                 <label className="text-[10px] font-black text-outline uppercase tracking-widest pl-1">Match UID (Optional)</label>
                 <input className="w-full bg-surface-container-low border border-outline-variant/10 p-3.5 rounded-xl text-xs font-black text-on-surface focus:border-secondary transition-all outline-none uppercase" placeholder="MATCH_001" type="text" value={matchId} onChange={(e)=>setMatchId(e.target.value)} />
              </div>
           </div>
        </section>

        {/* Sync Table - Responsive Scroll */}
        <section className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
           <div className="px-6 md:px-8 py-5 md:py-6 bg-surface-container-low border-b border-outline-variant/10 flex justify-between items-center">
              <h3 className="font-headline font-black text-sm uppercase tracking-widest text-secondary italic">Source Stream Synchronization</h3>
              <span className="text-[9px] font-black text-outline/40 uppercase italic">{channels.length} Nodes</span>
           </div>
           
           <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                 <thead>
                    <tr className="bg-surface-container-low/30 border-b border-outline-variant/5">
                       <th className="px-6 md:px-10 py-4 md:py-5 text-[9px] font-black text-outline uppercase tracking-tighter">Source Identity</th>
                       <th className="px-6 md:px-10 py-4 md:py-5 text-[9px] font-black text-outline uppercase tracking-tighter text-center">Toss Outcome</th>
                       <th className="px-6 md:px-10 py-4 md:py-5 text-[9px] font-black text-outline uppercase tracking-tighter text-center">Match Outcome</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-outline-variant/10">
                    {channels.map((chan) => (
                       <tr key={chan._id} className="hover:bg-surface-container-low/20 transition-all group">
                          <td className="px-6 md:px-10 py-4 md:py-5">
                             <span className="text-xs md:text-sm font-black text-on-surface uppercase tracking-wider group-hover:text-secondary transition-colors">{chan.name}</span>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-5">
                             <div className="flex justify-center gap-1.5 md:gap-2">
                                <button onClick={()=>handleToggle(chan.name, 'tossPrediction', 'Win')} className={`px-4 md:px-6 py-2 rounded-lg font-black text-[9px] transition-all ${forecasts[chan.name]?.tossPrediction === 'Win' ? 'bg-secondary text-primary shadow-lg ring-1 ring-secondary' : 'bg-surface-container-low text-outline/30 hover:text-outline'}`}>WIN</button>
                                <button onClick={()=>handleToggle(chan.name, 'tossPrediction', 'Loss')} className={`px-4 md:px-6 py-2 rounded-lg font-black text-[9px] transition-all ${forecasts[chan.name]?.tossPrediction === 'Loss' ? 'bg-surface-container-high text-on-surface shadow-md ring-1 ring-outline' : 'bg-surface-container-low text-outline/30 hover:text-outline'}`}>LOSS</button>
                             </div>
                          </td>
                          <td className="px-6 md:px-10 py-4 md:py-5">
                             <div className="flex justify-center gap-1.5 md:gap-2">
                                <button onClick={()=>handleToggle(chan.name, 'matchPrediction', 'Win')} className={`px-4 md:px-6 py-2 rounded-lg font-black text-[9px] transition-all ${forecasts[chan.name]?.matchPrediction === 'Win' ? 'bg-primary text-white shadow-xl ring-1 ring-primary' : 'bg-surface-container-low text-outline/30 hover:text-outline'}`}>WIN</button>
                                <button onClick={()=>handleToggle(chan.name, 'matchPrediction', 'Loss')} className={`px-4 md:px-6 py-2 rounded-lg font-black text-[9px] transition-all ${forecasts[chan.name]?.matchPrediction === 'Loss' ? 'bg-surface-container-high text-on-surface shadow-md ring-1 ring-outline' : 'bg-surface-container-low text-outline/30 hover:text-outline'}`}>LOSS</button>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="p-6 md:p-8 bg-surface-container-low/30 border-t border-outline-variant/10 text-center flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-black text-outline uppercase tracking-[0.2em] italic order-2 md:order-1 opacity-50">Global synchronization will push all active selections to the main repository.</p>
              <button onClick={handleCommit} className="w-full md:w-auto bg-primary text-white font-black py-4 px-10 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-3 order-1 md:order-2">
                 <span className="material-symbols-outlined text-lg">cloud_sync</span>
                 Commit Global Synchronization
              </button>
           </div>
        </section>
      </div>
    </div>
  );
};

export default AddEntry;
