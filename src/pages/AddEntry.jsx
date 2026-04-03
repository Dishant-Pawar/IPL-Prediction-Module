import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { API_BASE_URL } from '../config';

const AddEntry = () => {
  const { channels, refreshData, loading } = useData();
  const [commonData, setCommonData] = useState({
    date: new Date().toISOString().split('T')[0],
    team1: '',
    team2: '',
    matchName: '',
  });

  const [predictionMap, setPredictionMap] = useState({});

  useEffect(() => {
    if (channels && channels.length > 0) {
      const initialMap = {};
      channels.forEach(chan => {
        initialMap[chan.name] = { tossPrediction: null, matchPrediction: null };
      });
      setPredictionMap(initialMap);
    }
  }, [channels]);

  const togglePrediction = (channelName, type, val) => {
    setPredictionMap(prev => ({
      ...prev,
      [channelName]: {
        ...prev[channelName],
        [type]: prev[channelName][type] === val ? null : val
      }
    }));
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!commonData.team1 || !commonData.team2) return alert('Please enter team details.');

    const entries = Object.entries(predictionMap)
      .filter(([_, data]) => data.tossPrediction !== null || data.matchPrediction !== null)
      .map(([channelName, data]) => ({
        ...commonData,
        channel: channelName,
        tossPrediction: data.tossPrediction || 'N/A',
        matchPrediction: data.matchPrediction || 'N/A',
      }));

    if (entries.length === 0) return alert('Please set at least one prediction.');

    try {
      const response = await fetch(`${API_BASE_URL}/api/predictions/bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      });
      if (response.ok) {
        setCommonData({
            date: new Date().toISOString().split('T')[0],
            team1: '',
            team2: '',
            matchName: '',
        });
        const resetMap = {};
        channels.forEach(chan => resetMap[chan.name] = { tossPrediction: null, matchPrediction: null });
        setPredictionMap(resetMap);
        refreshData();
        alert(`Successfully synchronized ${entries.length} strategy records!`);
      }
    } catch (err) {
      console.error('Error in bulk submit:', err);
    }
  };

  const teams = [
    { name: 'MI', color: '#004BA0' }, { name: 'CSK', color: '#FFFF0C' }, { name: 'RCB', color: '#2B2A29' },
    { name: 'KKR', color: '#3A225D' }, { name: 'DC', color: '#0057A2' }, { name: 'RR', color: '#254AA5' },
    { name: 'SRH', color: '#F7A721' }, { name: 'PBKS', color: '#ED1B24' }, { name: 'GT', color: '#0B4973' },
    { name: 'LSG', color: '#D3E0E9' },
  ];

  return (
    <div className="min-h-full pb-16">
       <header className="w-full h-16 sticky top-0 z-40 bg-[#f9f9ff]/90 backdrop-blur-md flex items-center justify-between px-6 border-b border-outline-variant/10">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black tracking-tighter text-[#19398a] font-headline uppercase italic">Matrix Synchronizer</span>
        </div>
        <div className="flex items-center space-x-3">
             <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_#39edca] animate-pulse" />
             <span className="text-[10px] font-black text-outline uppercase tracking-[0.2em] hidden sm:block">Repository Live Link</span>
        </div>
      </header>

      <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
        <section className="bg-surface-container-lowest rounded-[3rem] p-8 md:p-12 shadow-sm border border-outline-variant/10">
            <h2 className="text-2xl font-black text-on-surface mb-10 uppercase tracking-tighter italic italic">Global Synchronization Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-outline uppercase tracking-[0.3em] block px-1">Cycle Baseline Date</label>
                   <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-6 focus:ring-2 focus:ring-primary-container text-xs font-black ring-1 ring-outline-variant/5" type="date" value={commonData.date} onChange={(e) => setCommonData({ ...commonData, date: e.target.value })} />
                </div>
                <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-outline uppercase tracking-[0.3em] block px-1">Home Entity</label>
                     <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-6 text-xs font-black ring-1 ring-outline-variant/5" placeholder="MI..." value={commonData.team1} onChange={(e) => setCommonData({ ...commonData, team1: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-outline uppercase tracking-[0.3em] block px-1">Away Entity</label>
                     <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-6 text-xs font-black ring-1 ring-outline-variant/5" placeholder="CSK..." value={commonData.team2} onChange={(e) => setCommonData({ ...commonData, team2: e.target.value })} />
                  </div>
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                     <label className="text-[10px] font-black text-outline uppercase tracking-[0.3em] block px-1">Match Identity Protocol</label>
                     <input className="w-full bg-surface-container-low border-none rounded-xl py-4 px-6 text-xs font-black ring-1 ring-outline-variant/5" placeholder="Final Stream..." value={commonData.matchName} onChange={(e) => setCommonData({ ...commonData, matchName: e.target.value })} />
                  </div>
                </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-10 p-4 bg-surface-container-low/20 rounded-2.5rem ring-1 ring-outline-variant/5">
                {teams.map(team => (
                    <button 
                        key={team.name}
                        onClick={() => {
                            if (!commonData.team1) setCommonData({ ...commonData, team1: team.name });
                            else if (!commonData.team2 && commonData.team1 !== team.name) setCommonData({ ...commonData, team2: team.name, matchName: `${commonData.team1} vs ${team.name}` });
                        }}
                        className="flex-1 min-w-[70px] h-11 rounded-lg bg-white/50 hover:bg-white border border-outline-variant/10 text-[9px] font-black text-[#19398a] transition-all hover:scale-105 active:scale-95 shadow-sm uppercase tracking-widest"
                    >{team.name}</button>
                ))}
            </div>
        </section>

        <section className="bg-surface-container-lowest rounded-[3rem] shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="px-10 py-8 bg-surface-container-low/50 border-b border-outline-variant/10 flex flex-col md:flex-row justify-between items-center gap-4">
               <h3 className="text-xl font-black uppercase tracking-tighter text-[#19398a] italic">Source Matrix Feed</h3>
               <span className="text-[9px] font-black text-outline uppercase bg-primary/5 px-4 py-1.5 rounded-full ring-1 ring-primary/10">{channels.length} Source Points Available</span>
            </div>

            {/* Responsive Table/Card View */}
            <div className="w-full">
               {/* Desktop Header */}
               <div className="hidden md:grid grid-cols-12 bg-surface-container-low/20 px-10 py-5 border-b border-outline-variant/10">
                  <div className="col-span-6 text-[9px] font-black text-outline uppercase tracking-[0.3em]">Stream Source Identifier</div>
                  <div className="col-span-3 text-[9px] font-black text-outline uppercase tracking-[0.3em] text-center">Toss Forecast Matrix</div>
                  <div className="col-span-3 text-[9px] font-black text-outline uppercase tracking-[0.3em] text-center">Match Forecast Matrix</div>
               </div>

               {/* Rows / Cards */}
               <div className="divide-y divide-outline-variant/10">
                  {channels.map((chan) => {
                     const pred = predictionMap[chan.name] || { tossPrediction: null, matchPrediction: null };
                     return (
                        <div key={chan._id} className="grid grid-cols-1 md:grid-cols-12 px-8 md:px-10 py-6 md:py-8 hover:bg-primary/5 transition-all group items-center gap-6 md:gap-0">
                           <div className="md:col-span-6 flex flex-col gap-1.5">
                              <span className="text-lg md:text-xl font-black text-on-surface uppercase tracking-tighter group-hover:text-primary transition-all duration-500 italic">{chan.name}</span>
                              <span className="text-[9px] text-outline font-black uppercase tracking-[0.3em] italic opacity-40">System Link: Verified Level 9</span>
                           </div>
                           
                           {/* Mobile Labels (Hidden on Desktop) */}
                           <div className="flex flex-col sm:flex-row md:contents gap-6 sm:gap-12">
                              <div className="md:col-span-3 flex flex-col items-center gap-3">
                                 <span className="md:hidden text-[8px] font-black text-outline uppercase tracking-widest italic opacity-50">Toss Protocol</span>
                                 <div className="flex justify-center gap-2.5 w-full">
                                    <button 
                                       onClick={() => togglePrediction(chan.name, 'tossPrediction', 'Win')}
                                       className={`flex-1 md:flex-none md:w-20 py-3 md:py-2 rounded-xl font-black text-[9px] transition-all shadow-sm ${pred.tossPrediction === 'Win' ? 'bg-secondary-container text-secondary ring-1 ring-secondary/50 scale-105' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100 hover:scale-105'}`}
                                    >WIN</button>
                                    <button 
                                       onClick={() => togglePrediction(chan.name, 'tossPrediction', 'Loss')}
                                       className={`flex-1 md:flex-none md:w-20 py-3 md:py-2 rounded-xl font-black text-[9px] transition-all shadow-sm ${pred.tossPrediction === 'Loss' ? 'bg-surface-container-high text-on-surface ring-1 ring-outline/50 scale-105' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100 hover:scale-105'}`}
                                    >LOSS</button>
                                 </div>
                              </div>
                              
                              <div className="md:col-span-3 flex flex-col items-center gap-3">
                                 <span className="md:hidden text-[8px] font-black text-outline uppercase tracking-widest italic opacity-50">Match Protocol</span>
                                 <div className="flex justify-center gap-2.5 w-full">
                                    <button 
                                       onClick={() => togglePrediction(chan.name, 'matchPrediction', 'Win')}
                                       className={`flex-1 md:flex-none md:w-20 py-3 md:py-2 rounded-xl font-black text-[9px] transition-all shadow-sm ${pred.matchPrediction === 'Win' ? 'bg-primary-container text-primary ring-1 ring-primary/50 scale-105' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100 hover:scale-105'}`}
                                    >WIN</button>
                                    <button 
                                       onClick={() => togglePrediction(chan.name, 'matchPrediction', 'Loss')}
                                       className={`flex-1 md:flex-none md:w-20 py-3 md:py-2 rounded-xl font-black text-[9px] transition-all shadow-sm ${pred.matchPrediction === 'Loss' ? 'bg-surface-container-high text-on-surface ring-1 ring-outline/50 scale-105' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100 hover:scale-105'}`}
                                    >LOSS</button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     );
                  })}
                  {channels.length === 0 && (
                     <div className="px-10 py-24 text-center space-y-4">
                         <span className="material-symbols-outlined text-outline/20 text-6xl">leak_remove</span>
                         <p className="text-sm text-outline/40 uppercase tracking-[0.4em] italic">No distribution channels in baseline... Access repository to initialize</p>
                     </div>
                  )}
               </div>
            </div>

            <div className="p-10 md:p-14 bg-surface-container-low/20 border-t border-outline-variant/10">
               <button 
                  onClick={handleBulkSubmit}
                  className="w-full bg-[#19398a] text-white font-black py-5 md:py-6 rounded-[2rem] shadow-2xl hover:shadow-[#19398a]/30 active:scale-[0.98] transition-all text-xs md:text-sm uppercase tracking-[0.3em] flex items-center justify-center gap-4 group"
               >
                  <span className="material-symbols-outlined text-lg group-hover:rotate-[360deg] transition-transform duration-1000">verified</span>
                  Execute Global Synchronization
               </button>
               <p className="text-[8px] font-black text-outline/30 uppercase tracking-[0.4em] text-center mt-6 italic">Warning: Baseline synchronization is permanent once committed to strategy Matrix</p>
            </div>
        </section>
      </div>
    </div>
  );
};

export default AddEntry;
