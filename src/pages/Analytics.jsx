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
    <>
      <header className="w-full h-16 sticky top-0 z-40 bg-[#f9f9ff] flex items-center justify-between px-8 shadow-sm">
        <div className="flex items-center gap-4">
          <h2 className="font-headline text-xl font-black tracking-tighter text-[#19398a] uppercase leading-none">Global Overview Archive</h2>
        </div>
        <div className="flex items-center gap-6">
             {pendingCount > 0 && (
                <button 
                   onClick={handleSaveAll}
                   className="flex items-center gap-2 bg-primary text-white text-[10px] font-black px-5 py-2.5 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-widest"
                >
                   <span className="material-symbols-outlined text-sm">cloud_upload</span>
                   Commit All ({pendingCount})
                </button>
             )}
             <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/10">
                <span className="text-[9px] font-black text-outline uppercase">Perspective:</span>
                <select className="bg-transparent border-none focus:ring-0 text-[10px] font-black text-primary p-0" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                    <option value={1}>1 Cycle</option>
                    <option value={5}>5 Cycles</option>
                    <option value={10}>10 Cycles</option>
                </select>
             </div>
             <div className="h-8 w-8 rounded-full bg-primary-container ring-2 ring-[#dbe1ff]">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDixRxPA3y35u5PfZQBPGFtHIULze_wLlwEt7KODkpDljdqUTLUyVLMgqtLUHbVeimCYVR-OSHtwaRoO36XuRfem88PnAmOFSjno_xDQv_QjK6S95MeWDaBwQYRFmtvfDHVxi0ElqMx8fh2q47y2Mn_nMdhHaXUXBTIFAr3Fbys8gc1s2wuwGezXFr7JvoIuyPB0JleehgPj9yI4DF22Ga4AAKcyUZmBGfgN4nPdZytAl2ZMrwjGRbKM3LnIcfAYAYoRUqAdMflAiw" alt="Analyst"/>
             </div>
        </div>
      </header>

      <div className="p-8 max-w-6xl mx-auto space-y-8">
        <section className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden flex flex-col justify-center">
           <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
              <div>
                 <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1 italic">Synchronized Repository Overview</p>
                 <h3 className="font-headline font-black text-2xl text-on-surface uppercase tracking-tighter leading-none italic">Database Strategy Matrix</h3>
              </div>
              <div className="flex gap-12">
                 <div className="text-center group cursor-pointer">
                    <p className="text-[9px] font-black text-outline uppercase tracking-widest mb-2 group-hover:text-primary transition-colors">Match Reliability</p>
                    <p className="text-3xl font-black text-primary font-headline">{(predictions.filter(p=>p.matchPrediction==='Win').length / (predictions.length || 1) * 100).toFixed(1)}%</p>
                 </div>
                 <div className="text-center group cursor-pointer">
                    <p className="text-[9px] font-black text-outline uppercase tracking-widest mb-2 group-hover:text-secondary transition-colors">Toss Reliability</p>
                    <p className="text-3xl font-black text-secondary font-headline">{(predictions.filter(p=>p.tossPrediction==='Win').length / (predictions.length || 1) * 100).toFixed(1)}%</p>
                 </div>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 h-64 w-64 bg-primary/5 rounded-full blur-[100px]" />
        </section>

        <section className="space-y-4 pb-20">
           <div className="flex items-center justify-between px-4">
              <h4 className="text-xs font-black uppercase tracking-[0.3em] text-outline">Date-Wise Archives</h4>
              <div className="flex items-center gap-4">
                 <span className="text-[9px] font-black text-outline uppercase">Page {currentPage} of {totalPages || 1}</span>
                 <div className="flex gap-1">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="h-8 w-8 rounded bg-surface-container-low border border-outline-variant/5 flex items-center justify-center disabled:opacity-30"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                    <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="h-8 w-8 rounded bg-surface-container-low border border-outline-variant/5 flex items-center justify-center disabled:opacity-30"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                 </div>
              </div>
           </div>

           <div className="space-y-3">
              {paginatedDates.map((date) => {
                 const items = groupedData[date];
                 return (
                 <div key={date} className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden transition-all">
                    <button onClick={() => setExpandedDate(expandedDate === date ? null : date)} className="w-full px-6 py-5 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
                       <div className="flex items-center gap-6">
                          <span className="material-symbols-outlined text-outline text-lg">calendar_today</span>
                          <span className="text-sm font-black text-on-surface uppercase tracking-wider">{date}</span>
                       </div>
                       <div className="flex items-center gap-6">
                          <span className="text-[10px] font-black text-outline uppercase bg-surface-container-low px-3 py-1 rounded-full">{items.length} Points</span>
                          <span className={`material-symbols-outlined text-outline transition-transform duration-300 ${expandedDate === date ? 'rotate-180' : ''}`}>expand_more</span>
                       </div>
                    </button>
                    {expandedDate === date && (
                       <div className="border-t border-outline-variant/10 overflow-x-auto">
                          <table className="w-full text-left border-collapse">
                             <thead>
                                <tr className="bg-surface-container-low/30 border-b border-outline-variant/10">
                                   <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-widest pl-16">Source Stream identity</th>
                                   <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-widest text-center">Toss Forecast</th>
                                   <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-widest text-center">Match Forecast</th>
                                   <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-widest text-right pr-8">Synchronization</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-outline-variant/10">
                                {items.map((row) => {
                                   const isModified = !!localEdits[row._id];
                                   return (
                                   <tr key={row._id} className="hover:bg-surface-container-low/20 transition-colors">
                                      <td className="px-6 py-4 pl-16">
                                         <div className="flex flex-col">
                                            <span className="text-sm font-black text-on-surface uppercase">{row.channel}</span>
                                            <span className="text-[9px] text-outline font-bold italic tracking-tighter">{row.matchName}</span>
                                         </div>
                                      </td>
                                      <td className="px-6 py-4">
                                         <div className="flex justify-center gap-1">
                                            <button onClick={() => handleLocalEdit(row._id, 'tossPrediction', 'Win')} className={`px-3 py-1.5 rounded font-black text-[8px] transition-all ${getFieldValue(row, 'tossPrediction') === 'Win' ? 'bg-secondary-container text-on-secondary-container ring-1 ring-secondary' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100'}`}>WIN</button>
                                            <button onClick={() => handleLocalEdit(row._id, 'tossPrediction', 'Loss')} className={`px-3 py-1.5 rounded font-black text-[8px] transition-all ${getFieldValue(row, 'tossPrediction') === 'Loss' ? 'bg-surface-container-high text-on-surface ring-1 ring-outline' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100'}`}>LOSS</button>
                                         </div>
                                      </td>
                                      <td className="px-6 py-4">
                                         <div className="flex justify-center gap-1">
                                            <button onClick={() => handleLocalEdit(row._id, 'matchPrediction', 'Win')} className={`px-3 py-1.5 rounded font-black text-[8px] transition-all ${getFieldValue(row, 'matchPrediction') === 'Win' ? 'bg-primary-container text-on-primary-container ring-1 ring-primary' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100'}`}>WIN</button>
                                            <button onClick={() => handleLocalEdit(row._id, 'matchPrediction', 'Loss')} className={`px-3 py-1.5 rounded font-black text-[8px] transition-all ${getFieldValue(row, 'matchPrediction') === 'Loss' ? 'bg-surface-container-high text-on-surface ring-1 ring-outline' : 'bg-surface-container-low text-outline opacity-40 hover:opacity-100'}`}>LOSS</button>
                                         </div>
                                      </td>
                                      <td className="px-6 py-4 text-right pr-8">
                                         {isModified ? (
                                            <button onClick={() => handleSave(row._id)} className="bg-primary text-white text-[8px] font-black px-4 py-2 rounded shadow-md hover:scale-[1.05] active:scale-[0.95] transition-all uppercase tracking-widest inline-flex items-center gap-2">
                                               <span className="material-symbols-outlined text-[10px]">sync</span>
                                               Commit
                                            </button>
                                         ) : (
                                            <div className="flex items-center justify-end gap-1.5 group">
                                               <span className="h-1.5 w-1.5 rounded-full bg-secondary shadow-[0_0_8px_#39edca]"></span>
                                               <span className="text-[9px] font-black text-outline uppercase tracking-widest italic opacity-50">Synchronized</span>
                                            </div>
                                         )}
                                      </td>
                                   </tr>
                                   );
                                })}
                             </tbody>
                          </table>
                       </div>
                    )}
                 </div>
                 );
              })}
           </div>
        </section>
      </div>
    </>
  );
};

export default Analytics;
