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
      const dateStr = new Date(p.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
      if (!groups[dateStr]) groups[dateStr] = [];
      groups[dateStr].push(p);
    });
    return groups;
  }, [predictions]);

  const dateKeys = Object.keys(groupedData);
  const totalPages = Math.ceil(dateKeys.length / itemsPerPage);
  const paginatedDates = dateKeys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleLocalEdit = (id, field, value) => {
    setLocalEdits(prev => ({ ...prev, [id]: { ...(prev[id] || {}), [field]: value } }));
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
        if (response.ok) { setLocalEdits({}); refreshData(); alert(`Synchronized ${editCount} records!`); }
    } catch (err) { console.error(err); }
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
        alert('Record Synchronized!');
      }
    } catch (err) { console.error(err); }
  };

  const getFieldValue = (item, field) => (localEdits[item._id] && localEdits[item._id][field] !== undefined ? localEdits[item._id][field] : item[field]);

  const pendingCount = Object.keys(localEdits).length;

  return (
    <>
      <header className="hidden lg:flex w-full h-16 sticky top-0 z-40 bg-[var(--bg-app)]/80 backdrop-blur-md items-center justify-between px-8 shadow-sm border-b border-outline-variant/10">
        <h2 className="font-headline text-xl font-black tracking-tighter text-primary uppercase leading-none italic uppercase">Global Overview</h2>
        <div className="flex items-center gap-6">
             {pendingCount > 0 && (
                <button onClick={handleSaveAll} className="bg-primary text-white text-[10px] font-black px-5 py-2.5 rounded-full shadow-lg transition-all flex items-center gap-2">
                   <span className="material-symbols-outlined text-sm">cloud_upload</span> Commit ({pendingCount})
                </button>
             )}
             <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/10">
                <select className="bg-transparent border-none text-[10px] font-black text-primary p-0" value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                    <option value={1}>1 Cycle</option>
                    <option value={5}>5 Cycles</option>
                    <option value={10}>10 Cycles</option>
                </select>
             </div>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-6xl mx-auto overflow-x-hidden">
        {/* Mobile Commit Button (Fixed) */}
        {pendingCount > 0 && (
           <div className="lg:hidden fixed bottom-6 right-6 z-50">
              <button onClick={handleSaveAll} className="h-14 w-14 rounded-full bg-primary text-white shadow-2xl shadow-primary/30 flex items-center justify-center animate-bounce-slow">
                 <span className="material-symbols-outlined text-3xl">done_all</span>
              </button>
           </div>
        )}

        {/* Responsive Performance Summary */}
        <section className="bg-surface-container-low p-6 md:p-8 rounded-2xl border border-outline-variant/10 shadow-sm relative overflow-hidden flex flex-col justify-center">
           <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-8">
              <div className="text-center lg:text-left w-full lg:w-auto">
                 <h3 className="font-headline font-black text-xl md:text-2xl text-on-surface uppercase tracking-tighter leading-none italic italic">Repository Overview</h3>
                 <p className="text-[10px] font-black text-outline uppercase tracking-widest mt-2">{predictions.length} Data Points Synchronized</p>
              </div>
              <div className="flex gap-8 md:gap-12 w-full lg:w-auto justify-around lg:justify-end">
                 <div className="text-center group">
                    <p className="text-[8px] md:text-[9px] font-black text-outline uppercase tracking-widest mb-1 md:mb-2">Match Rel.</p>
                    <p className="text-2xl md:text-3xl font-black text-primary font-headline">{(predictions.filter(p=>p.matchPrediction==='Win').length / (predictions.length || 1) * 100).toFixed(0)}%</p>
                 </div>
                 <div className="text-center group">
                    <p className="text-[8px] md:text-[9px] font-black text-outline uppercase tracking-widest mb-1 md:mb-2">Toss Rel.</p>
                    <p className="text-2xl md:text-3xl font-black text-secondary font-headline">{(predictions.filter(p=>p.tossPrediction==='Win').length / (predictions.length || 1) * 100).toFixed(0)}%</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Responsive Archives Section */}
        <section className="space-y-4 pb-20">
           <div className="flex items-center justify-between px-2 md:px-4">
              <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-outline">Date-Wise Map</h4>
              <div className="flex items-center gap-2 md:gap-4">
                 <span className="text-[8px] md:text-[9px] font-black text-outline uppercase">{currentPage}/{totalPages || 1}</span>
                 <div className="flex gap-1">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="h-8 w-8 rounded bg-surface-container-low border border-outline-variant/10 flex items-center justify-center disabled:opacity-30"><span className="material-symbols-outlined text-sm">chevron_left</span></button>
                    <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => prev + 1)} className="h-8 w-8 rounded bg-surface-container-low border border-outline-variant/10 flex items-center justify-center disabled:opacity-30"><span className="material-symbols-outlined text-sm">chevron_right</span></button>
                 </div>
              </div>
           </div>

           <div className="space-y-3">
              {paginatedDates.map((date) => {
                 const items = groupedData[date];
                 return (
                 <div key={date} className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 shadow-sm overflow-hidden transition-all">
                    <button onClick={() => setExpandedDate(expandedDate === date ? null : date)} className="w-full px-4 md:px-6 py-4 md:py-5 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
                       <div className="flex items-center gap-3 md:gap-6 overflow-hidden">
                          <span className="material-symbols-outlined text-outline text-lg">calendar_today</span>
                          <span className="text-xs md:text-sm font-black text-on-surface uppercase tracking-wider truncate">{date}</span>
                       </div>
                       <div className="flex items-center gap-3 md:gap-6 flex-shrink-0">
                          <span className="text-[8px] md:text-[10px] font-black text-outline uppercase bg-surface-container-low px-2 md:px-3 py-1 rounded-full">{items.length} XP</span>
                          <span className={`material-symbols-outlined text-outline transition-transform duration-300 ${expandedDate === date ? 'rotate-180' : ''}`}>expand_more</span>
                       </div>
                    </button>
                    {expandedDate === date && (
                       <div className="border-t border-outline-variant/10 overflow-x-auto custom-scrollbar">
                          <table className="w-full text-left border-collapse min-w-[650px]">
                             <thead>
                                <tr className="bg-surface-container-low/30 border-b border-outline-variant/5">
                                   <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-widest pl-10 md:pl-16">Entity</th>
                                   <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-widest text-center">Toss</th>
                                   <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-widest text-center">Match</th>
                                   <th className="px-6 py-4 text-[9px] font-black text-outline uppercase tracking-widest text-right pr-6 md:pr-8 italic">Sync</th>
                                </tr>
                             </thead>
                             <tbody className="divide-y divide-outline-variant/10">
                                {items.map((row) => {
                                   const isModified = !!localEdits[row._id];
                                   return (
                                   <tr key={row._id} className="hover:bg-surface-container-low/20 transition-colors">
                                      <td className="px-6 py-4 pl-10 md:pl-16">
                                         <div className="flex flex-col">
                                            <span className="text-xs md:text-sm font-black text-on-surface uppercase">{row.channel}</span>
                                            <span className="text-[8px] text-outline font-bold italic tracking-tighter truncate w-32 md:w-full">{row.matchName}</span>
                                         </div>
                                      </td>
                                      <td className="px-6 py-4">
                                         <div className="flex justify-center gap-1">
                                            <button onClick={() => handleLocalEdit(row._id, 'tossPrediction', 'Win')} className={`px-2 md:px-3 py-1.5 rounded font-black text-[8px] transition-all ${getFieldValue(row, 'tossPrediction') === 'Win' ? 'bg-secondary-container text-on-secondary-container ring-1 ring-secondary scale-105' : 'bg-outline/5 text-outline opacity-40'}`}>WIN</button>
                                            <button onClick={() => handleLocalEdit(row._id, 'tossPrediction', 'Loss')} className={`px-2 md:px-3 py-1.5 rounded font-black text-[8px] transition-all ${getFieldValue(row, 'tossPrediction') === 'Loss' ? 'bg-surface-container-high text-on-surface ring-1 ring-outline scale-105' : 'bg-outline/5 text-outline opacity-40'}`}>LOSS</button>
                                         </div>
                                      </td>
                                      <td className="px-6 py-4">
                                         <div className="flex justify-center gap-1">
                                            <button onClick={() => handleLocalEdit(row._id, 'matchPrediction', 'Win')} className={`px-2 md:px-3 py-1.5 rounded font-black text-[8px] transition-all ${getFieldValue(row, 'matchPrediction') === 'Win' ? 'bg-primary-container text-on-primary-container ring-1 ring-primary scale-105' : 'bg-outline/5 text-outline opacity-40'}`}>WIN</button>
                                            <button onClick={() => handleLocalEdit(row._id, 'matchPrediction', 'Loss')} className={`px-2 md:px-3 py-1.5 rounded font-black text-[8px] transition-all ${getFieldValue(row, 'matchPrediction') === 'Loss' ? 'bg-surface-container-high text-on-surface ring-1 ring-outline scale-105' : 'bg-outline/5 text-outline opacity-40'}`}>LOSS</button>
                                         </div>
                                      </td>
                                      <td className="px-6 py-4 text-right pr-6 md:pr-8">
                                         {isModified ? (
                                            <button onClick={() => handleSave(row._id)} className="bg-primary text-white text-[8px] p-2 rounded shadow-md active:scale-95 transition-all"><span className="material-symbols-outlined text-xs">sync</span></button>
                                         ) : (
                                            <span className="h-2 w-2 inline-block rounded-full bg-secondary shadow-[0_0_8px_#39edca]" />
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
