import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useModal } from '../context/ModalContext';
import API_BASE_URL from '../apiConfig';



const AddEntry = () => {
  const { channels, refreshData, loading } = useData();
  const { showAlert } = useModal();

  const [commonData, setCommonData] = useState({
    date: new Date().toISOString().split('T')[0],
    team1: '',
    team2: '',
    matchName: '',
  });

  // predictionMap: { [channelName]: { tossPrediction: 'Win' | 'Loss' | null, matchPrediction: 'Win' | 'Loss' | null } }
  const [predictionMap, setPredictionMap] = useState({});

  // Initialize prediction map when channels load
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
        [type]: prev[channelName][type] === val ? null : val // Toggle null if clicked again
      }
    }));
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!commonData.team1 || !commonData.team2) return showAlert('Please enter team details.', 'Incomplete Data');


    // Only include channels that have at least one prediction set
    const entries = Object.entries(predictionMap)
      .filter(([_, data]) => data.tossPrediction !== null || data.matchPrediction !== null)
      .map(([channelName, data]) => ({
        ...commonData,
        channel: channelName,
        tossPrediction: data.tossPrediction || 'N/A',
        matchPrediction: data.matchPrediction || 'N/A',
      }));

    if (entries.length === 0) return showAlert('Please set at least one prediction.', 'Missing Strategy');


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
        // Reset map
        const resetMap = {};
        channels.forEach(chan => resetMap[chan.name] = { tossPrediction: null, matchPrediction: null });
        setPredictionMap(resetMap);
        
        refreshData();
        showAlert(`Successfully synchronized ${entries.length} predictions to the repository!`, 'Sync Complete');
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
    <>
       <header className="w-full h-16 sticky top-0 z-40 bg-[#f9f9ff] flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center">
          <span className="text-xl font-black tracking-tighter text-[#19398a] font-headline uppercase">Matrix Synchronizer</span>
        </div>
        <div className="flex items-center space-x-4">
             <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
             <span className="text-xs font-black text-outline uppercase tracking-widest">Repository Live</span>
        </div>
      </header>

      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <section className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm border border-outline-variant/10">
            <h2 className="text-xl font-black text-on-surface mb-6 uppercase tracking-tighter italic">Global Parameters</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="space-y-1">
                   <label className="text-[9px] font-black text-outline uppercase tracking-widest block px-1">Cycle Date</label>
                   <input className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 focus:ring-2 focus:ring-primary-container text-xs font-black" type="date" value={commonData.date} onChange={(e) => setCommonData({ ...commonData, date: e.target.value })} />
                </div>
                <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                     <label className="text-[9px] font-black text-outline uppercase tracking-widest block px-1">Home Entity</label>
                     <input className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 text-xs font-black" placeholder="MI..." value={commonData.team1} onChange={(e) => setCommonData({ ...commonData, team1: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-black text-outline uppercase tracking-widest block px-1">Away Entity</label>
                     <input className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 text-xs font-black" placeholder="CSK..." value={commonData.team2} onChange={(e) => setCommonData({ ...commonData, team2: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-black text-outline uppercase tracking-widest block px-1">Match Identity</label>
                     <input className="w-full bg-surface-container-low border-none rounded-lg py-3 px-4 text-xs font-black" placeholder="Qualifier 1..." value={commonData.matchName} onChange={(e) => setCommonData({ ...commonData, matchName: e.target.value })} />
                  </div>
                </div>
            </div>
            <div className="grid grid-cols-10 gap-1 mt-6">
                {teams.map(team => (
                    <button 
                        key={team.name}
                        onClick={() => {
                            if (!commonData.team1) setCommonData({ ...commonData, team1: team.name });
                            else if (!commonData.team2 && commonData.team1 !== team.name) setCommonData({ ...commonData, team2: team.name, matchName: `${commonData.team1} vs ${team.name}` });
                        }}
                        className="h-10 rounded-md bg-surface-container-low/50 hover:bg-surface-container-low border border-outline-variant/5 text-[9px] font-black text-on-surface transition-all active:scale-95"
                    >{team.name}</button>
                ))}
            </div>
        </section>

        <section className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="px-6 py-5 bg-surface-container-low/50 border-b border-outline-variant/10 flex justify-between items-center">
               <h3 className="text-sm font-black uppercase tracking-[0.15em] text-[#19398a]">Source Stream Synchronization</h3>
               <span className="text-[10px] font-black text-outline uppercase">{channels.length} Identity Points Loaded</span>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-surface-container-low/10">
                        <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-widest">Stream Source Identity</th>
                        <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-widest text-center">Toss Forecast</th>
                        <th className="px-8 py-5 text-[10px] font-black text-outline uppercase tracking-widest text-center">Match Forecast</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                     {channels.map((chan) => {
                        const pred = predictionMap[chan.name] || { tossPrediction: null, matchPrediction: null };
                        return (
                           <tr key={chan._id} className="hover:bg-surface-container-low/20 transition-colors">
                              <td className="px-8 py-4">
                                 <div className="flex flex-col">
                                    <span className="text-sm font-bold text-on-surface">{chan.name}</span>
                                    <span className="text-[9px] text-outline font-black uppercase tracking-tighter italic">Status: Link Active</span>
                                 </div>
                              </td>
                              <td className="px-8 py-4">
                                 <div className="flex justify-center gap-2">
                                    <button 
                                       onClick={() => togglePrediction(chan.name, 'tossPrediction', 'Win')}
                                       className={`px-4 py-2 rounded font-black text-[9px] transition-all ${pred.tossPrediction === 'Win' ? 'bg-secondary-container text-on-secondary-container ring-1 ring-secondary' : 'bg-surface-container-low text-outline/30 grayscale opacity-60'}`}
                                    >WIN</button>
                                    <button 
                                       onClick={() => togglePrediction(chan.name, 'tossPrediction', 'Loss')}
                                       className={`px-4 py-2 rounded font-black text-[9px] transition-all ${pred.tossPrediction === 'Loss' ? 'bg-surface-container-high text-on-surface ring-1 ring-outline' : 'bg-surface-container-low text-outline/30 grayscale opacity-60'}`}
                                    >LOSS</button>
                                 </div>
                              </td>
                              <td className="px-8 py-4">
                                 <div className="flex justify-center gap-2">
                                    <button 
                                       onClick={() => togglePrediction(chan.name, 'matchPrediction', 'Win')}
                                       className={`px-4 py-2 rounded font-black text-[9px] transition-all ${pred.matchPrediction === 'Win' ? 'bg-primary-container text-on-primary-container ring-1 ring-primary' : 'bg-surface-container-low text-outline/30 grayscale opacity-60'}`}
                                    >WIN</button>
                                    <button 
                                       onClick={() => togglePrediction(chan.name, 'matchPrediction', 'Loss')}
                                       className={`px-4 py-2 rounded font-black text-[9px] transition-all ${pred.matchPrediction === 'Loss' ? 'bg-surface-container-high text-on-surface ring-1 ring-outline' : 'bg-surface-container-low text-outline/30 grayscale opacity-60'}`}
                                    >LOSS</button>
                                 </div>
                              </td>
                           </tr>
                        );
                     })}
                     {channels.length === 0 && (
                        <tr>
                            <td colSpan="3" className="px-8 py-16 text-center text-outline text-xs italic">No channel sources available for bulk synchronization.</td>
                        </tr>
                     )}
                  </tbody>
               </table>
            </div>
            <div className="p-8 bg-surface-container-low/10 border-t border-outline-variant/10">
               <button 
                  onClick={handleBulkSubmit}
                  className="w-full bg-[#19398a] text-white font-black py-4 rounded-xl shadow-xl hover:shadow-[#19398a]/20 active:scale-[0.99] transition-all text-xs uppercase tracking-[0.2em]"
               >
                  Commit Global Synchronization
               </button>
            </div>
        </section>
      </div>
    </>
  );
};

export default AddEntry;
