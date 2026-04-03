import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';

const Analytics = () => {
  const { predictions, refreshData, loading } = useData();
  const [expandedDate, setExpandedDate] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [localEdits, setLocalEdits] = useState({});

  const groupedData = useMemo(() => {
    const groups = {};
    predictions.forEach(p => {
      const dateStr = new Date(p.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(p);
    });
    return groups;
  }, [predictions]);

  const dateKeys = Object.keys(groupedData);
  const totalPages = Math.ceil(dateKeys.length / itemsPerPage);
  const paginatedDates = dateKeys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLocalEdit = (id, field, value) => {
    setLocalEdits(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    const editCount = Object.keys(localEdits).length;
    if (editCount === 0) return;

    try {
        const response = await fetch('http://localhost:5000/api/predictions/bulk-update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ edits: localEdits }),
        });
        if (response.ok) {
          setLocalEdits({});
          refreshData(); 
          alert(`Successfully synchronized ${editCount} strategy records to the main repository!`);
        }
    } catch (err) {
        console.error('Error during bulk update:', err);
    }
  };

  const handleSave = async (id) => {
    const edits = localEdits[id];
    if (!edits) return;
    try {
      const response = await fetch(`http://localhost:5000/api/predictions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(edits),
      });
      if (response.ok) {
        const { [id]: removed, ...remaining } = localEdits;
        setLocalEdits(remaining);
        refreshData(); 
        alert('Strategy Record Synchronized Successfully!');
      }
    } catch (err) {
      console.error('Error saving prediction:', err);
    }
  };

  const getFieldValue = (item, field) => {
    if (localEdits[item._id] && localEdits[item._id][field] !== undefined) {
      return localEdits[item._id][field];
    }
    return item[field];
  };

  const pendingCount = Object.keys(localEdits).length;

  return (
    <div className="min-h-full pb-12">
      <header className="w-full h-16 sticky top-0 z-40 bg-[#f9f9ff]/90 backdrop-blur-md flex items-center justify-between px-6 md:px-8 border-b border-outline-variant/10">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-lg md:text-xl font-black tracking-tighter text-[#19398a] uppercase leading-none italic">Global Archive</h2>
        </div>
        <div className="flex items-center gap-3 md:gap-6">
             {pendingCount > 0 && (
                <button 
                   onClick={handleSaveAll}
                   className="flex items-center gap-2 bg-primary text-white text-[9px] font-black px-4 py-2.5 rounded-full shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
                >
                   <span className="material-symbols-outlined text-sm hidden sm:inline">cloud_upload</span>
                   Commit ({pendingCount})
                </button>
             )}
             <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg ring-1 ring-outline-variant/5">
                <span className="text-[9px] font-black text-outline uppercase hidden sm:inline tracking-widest">Perspective:</span>
                <select className="bg-transparent border-none focus:ring-0 text-[10px] font-black text-primary p-0 h-4 uppercase tracking-widest" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                    <option value={1}>1 Cycle</option>
                    <option value={5}>5 Cycles</option>
                    <option value={10}>10 Cycles</option>
                </select>
             </div>
             <div className="h-8 w-8 rounded-full bg-primary-container ring-1 ring-primary/20 overflow-hidden hidden sm:block">
                <img className="w-full h-full object-cover grayscale brightness-125" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDixRxPA3y35u5PfZQBPGFtHIULze_wLlwEt7KODkpDljdqUTLUyVLMgqtLUHbVeimCYVR-OSHtwaRoO36XuRfem88PnAmOFSjno_xDQv_QjK6S95MeWDaBwQYRFmtvfDHVxi0ElqMx8fh2q47y2Mn_nMdhHaXUXBTIFAr3Fbys8gc1s2wuwGezXFr7JvoIuyPB0JleehgPj9yI4DF22Ga4AAKcyUZmBGfgN4nPdZytAl2ZMrwjGRbKM3LnIcfAYAYoRUqAdMflAiw" alt="Analyst"/>
             </div>
        </div>
      </header>

      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-8">
        <section className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 shadow-sm relative overflow-hidden flex flex-col justify-center">
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="text-center md:text-left">
                 <p className="text-[9px] font-black text-outline uppercase tracking-[0.4em] mb-2 italic">Synchronized Strategy Archive</p>
                 <h3 className="font-headline font-black text-2xl md:text-3xl text-on-surface uppercase tracking-tighter leading-none italic italic">Repository Matrix</h3>
              </div>
              <div className="flex gap-8 md:gap-12">
                 <div className="text-center group cursor-pointer">
                    <p className="text-[9px] font-black text-outline uppercase tracking-widest mb-2 group-hover:text-primary transition-colors leading-[0.5]">Match Reliability</p>
                    <p className="text-3xl md:text-4xl font-black text-primary font-headline">{(predictions.filter(p=>p.matchPrediction==='Win').length / (predictions.length || 1) * 100).toFixed(1)}%</p>
                 </div>
                 <div className="text-center group cursor-pointer">
                    <p className="text-[9px] font-black text-outline uppercase tracking-widest mb-2 group-hover:text-secondary transition-colors leading-[0.5]">Toss Reliability</p>
                    <p className="text-3xl md:text-4xl font-black text-secondary font-headline">{(predictions.filter(p=>p.tossPrediction==='Win').length / (predictions.length || 1) * 100).toFixed(1)}%</p>
                 </div>
              </div>
           </div>
        </section>

        <section className="space-y-6">
           <div className="flex items-center justify-between px-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-outline italic">Cycle Timeline</h4>
              <div className="flex items-center gap-4">
                 <span className="text-[9px] font-bold text-outline opacity-40 uppercase tracking-widest">Page {currentPage} / {totalPages || 1}</span>
                 <div className="flex gap-1">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="h-8 w-8 rounded-lg bg-surface-container-low border border-outline-variant/10 flex items-center justify-center disabled:opacity-20 hover:scale-105 active:scale-95 transition-all outline-none"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                    <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="h-8 w-8 rounded-lg bg-surface-container-low border border-outline-variant/10 flex items-center justify-center disabled:opacity-20 hover:scale-105 active:scale-95 transition-all outline-none"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              {paginatedDates.map((date) => {
                 const items = groupedData[date];
                 return (
                 <div key={date} className="bg-surface-container-lowest rounded-[2rem] border border-outline-variant/10 shadow-sm overflow-hidden transition-all duration-300">
                    <button onClick={() => setExpandedDate(expandedDate === date ? null : date)} className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-surface-container-low/20 transition-all group">
                       <div className="flex items-center gap-4 md:gap-6">
                          <span className="material-symbols-outlined text-outline text-xl group-hover:text-primary group-hover:scale-110 transition-all duration-500">category</span>
                          <span className="text-xs md:text-sm font-black text-on-surface uppercase tracking-[0.2em]">{date}</span>
                       </div>
                       <div className="flex items-center gap-4 md:gap-8">
                          <span className="hidden sm:block text-[9px] font-black text-outline uppercase bg-surface-container-low px-4 py-1.5 rounded-full ring-1 ring-outline-variant/5">{items.length} Points Synchronized</span>
                          <span className={`material-symbols-outlined text-outline transition-transform duration-500 ${expandedDate === date ? 'rotate-180' : ''}`}>expand_more</span>
                       </div>
                    </button>
                    {expandedDate === date && (
                       <div className="border-t border-outline-variant/10 overflow-x-auto bg-surface-container-low/5">
                          <table className="w-full text-left border-collapse min-w-[700px]">
                             <thead>
                                <tr className="bg-surface-container-low/30">
                                   <th className="px-8 py-5 text-[9px] font-black text-outline uppercase tracking-widest pl-16">Source Identifier</th>
                                   <th className="px-8 py-5 text-[9px] font-black text-outline uppercase tracking-widest text-center">Toss Forecast</th>
                                   <th className="px-8 py-5 text-[9px] font-black text-outline uppercase tracking-widest text-center">Match Forecast</th>
                                   <th className="px-8 py-5 text-[9px] font-black text-outline uppercase tracking-widest text-right pr-12 italic">Sync Lock</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-outline-variant/5">
                                {items.map((row) => {
                                   const isModified = !!localEdits[row._id];
                                   return (
                                   <tr key={row._id} className="hover:bg-primary/5 transition-colors">
                                      <td className="px-8 py-5 pl-16">
                                         <div className="flex flex-col gap-0.5">
                                            <span className="text-sm font-black text-on-surface uppercase tracking-tight">{row.channel}</span>
                                            <span className="text-[9px] text-outline font-bold italic tracking-widest opacity-60">{row.matchName}</span>
                                         </div>
                                      </td>
                                      <td className="px-8 py-5">
                                         <div className="flex justify-center gap-1.5">
                                            <button onClick={() => handleLocalEdit(row._id, 'tossPrediction', 'Win')} className={`px-4 py-2 rounded-lg font-black text-[9px] transition-all shadow-sm ${getFieldValue(row, 'tossPrediction') === 'Win' ? 'bg-secondary-container text-secondary ring-1 ring-secondary/40 scale-105' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100'}`}>WIN</button>
                                            <button onClick={() => handleLocalEdit(row._id, 'tossPrediction', 'Loss')} className={`px-4 py-2 rounded-lg font-black text-[9px] transition-all shadow-sm ${getFieldValue(row, 'tossPrediction') === 'Loss' ? 'bg-surface-container-high text-on-surface ring-1 ring-outline/40 scale-105' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100'}`}>LOSS</button>
                                         </div>
                                      </td>
                                      <td className="px-8 py-5">
                                         <div className="flex justify-center gap-1.5">
                                            <button onClick={() => handleLocalEdit(row._id, 'matchPrediction', 'Win')} className={`px-4 py-2 rounded-lg font-black text-[9px] transition-all shadow-sm ${getFieldValue(row, 'matchPrediction') === 'Win' ? 'bg-primary-container text-primary ring-1 ring-primary/40 scale-105' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100'}`}>WIN</button>
                                            <button onClick={() => handleLocalEdit(row._id, 'matchPrediction', 'Loss')} className={`px-4 py-2 rounded-lg font-black text-[9px] transition-all shadow-sm ${getFieldValue(row, 'matchPrediction') === 'Loss' ? 'bg-surface-container-high text-on-surface ring-1 ring-outline/40 scale-105' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100'}`}>LOSS</button>
                                         </div>
                                      </td>
                                      <td className="px-8 py-5 text-right pr-12">
                                         {isModified ? (
                                            <button onClick={() => handleSave(row._id)} className="bg-primary text-white text-[9px] font-black px-4 py-2 rounded-xl shadow-xl hover:scale-110 active:scale-95 transition-all uppercase tracking-widest inline-flex items-center gap-2">
                                               <span className="material-symbols-outlined text-[12px] animate-spin-slow">sync</span>
                                               Commit
                                            </button>
                                         ) : (
                                            <div className="flex items-center justify-end gap-2 pr-2">
                                               <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_10px_#39edca]"></span>
                                               <span className="text-[9px] font-black text-outline/30 uppercase tracking-[0.2em] italic">Synchronized</span>
                                            </div>
                                         )}
                                      </td>
                                   </tr>
                                   );
                                })}
                             </tbody>
                          </table>
                          <div className="p-4 bg-surface-container-low/20">
                             <p className="text-[8px] font-black text-outline/30 uppercase tracking-[0.3em] italic text-center">End of {date} Strategy Stream - Link Integrity: 100%</p>
                          </div>
                       </div>
                    )}
                 </div>
                 );
              })}
           </div>
        </section>
      </div>
    </div>
  );
};

export default Analytics;
