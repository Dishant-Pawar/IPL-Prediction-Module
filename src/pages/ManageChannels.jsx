import React, { useState } from 'react';
import { useData } from '../context/DataContext';

const ManageChannels = () => {
  const { channels, refreshData, loading } = useData();
  const [newChannel, setNewChannel] = useState('');
  const [error, setError] = useState('');

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newChannel.trim()) return;
    try {
      const response = await fetch('http://localhost:5000/api/channels', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: newChannel }) });
      const data = await response.json();
      if (response.ok) { setNewChannel(''); refreshData(); setError(''); }
      else { setError(data.message || 'Error occurred'); }
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (name) => {
    if (!window.confirm(`Delete channel '${name}' and all associated history?`)) return;
    try {
      const response = await fetch(`http://localhost:5000/api/channels/${name}`, { method: 'DELETE' });
      if (response.ok) refreshData();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)]">
      <header className="hidden lg:flex w-full h-16 sticky top-0 z-40 bg-[var(--bg-app)]/80 backdrop-blur-md items-center justify-between px-8 shadow-sm border-b border-outline-variant/10">
        <h2 className="font-headline text-xl font-black tracking-tighter text-secondary uppercase leading-none italic uppercase">Channel Repository</h2>
        <div className="h-8 w-8 rounded-full bg-primary-container ring-1 ring-outline-variant/30 overflow-hidden">
             <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDixRxPA3y35u5PfZQBPGFtHIULze_wLlwEt7KODkpDljdqUTLUyVLMgqtLUHbVeimCYVR-OSHtwaRoO36XuRfem88PnAmOFSjno_xDQv_QjK6S95MeWDaBwQYRFmtvfDHVxi0ElqMx8fh2q47y2Mn_nMdhHaXUXBTIFAr3Fbys8gc1s2wuwGezXFr7JvoIuyPB0JleehgPj9yI4DF22Ga4AAKcyUZmBGfgN4nPdZytAl2ZMrwjGRbKM3LnIcfAYAYoRUqAdMflAiw" alt="Analyst"/>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-6xl mx-auto overflow-x-hidden">
        {/* Responsive Repository Header Card */}
        <section className="bg-surface-container-lowest p-6 md:p-10 rounded-3xl border border-outline-variant/10 shadow-sm relative overflow-hidden flex flex-col justify-center">
           <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-6 md:gap-10">
              <div className="text-center lg:text-left w-full lg:w-auto">
                 <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1 italic">Channel Infrastructure</p>
                 <h3 className="font-headline font-black text-2xl md:text-3xl text-on-surface uppercase tracking-tighter leading-none italic italic">Identity Index</h3>
              </div>
              <form onSubmit={handleAdd} className="w-full lg:w-auto flex flex-col md:flex-row gap-3 md:items-center">
                 <div className="relative flex-1 group min-w-0 md:min-w-[300px]">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline/40">add_task</span>
                    <input className="w-full bg-surface-container-low border border-outline-variant/10 py-3.5 pl-12 pr-4 rounded-2xl text-xs font-black text-on-surface focus:border-secondary outline-none transition-all uppercase tracking-widest placeholder:text-outline/30" placeholder="Source Name..." type="text" value={newChannel} onChange={(e)=>setNewChannel(e.target.value)} />
                 </div>
                 <button className="bg-secondary text-primary font-black py-4 px-8 rounded-2xl shadow-xl shadow-secondary/10 hover:scale-[1.05] active:scale-[0.95] transition-all uppercase tracking-widest text-[10px] flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-sm">hub</span>
                    Authorize Node
                 </button>
              </form>
           </div>
           {error && <p className="mt-4 text-error font-black text-[10px] uppercase tracking-widest text-center">{error}</p>}
        </section>

        {/* Responsive Grid Layout for Channel Nodes */}
        <section className="space-y-4">
           <div className="flex items-center justify-between px-2 md:px-4">
              <h4 className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-outline italic">Verified Source Nodes</h4>
              <span className="text-[9px] font-black text-outline uppercase bg-surface-container-low px-2 py-0.5 rounded-full">{channels.length} Total</span>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20">
              {channels.map((chan) => (
                 <div key={chan._id} className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/10 shadow-sm relative group hover:border-secondary/30 transition-all flex flex-col justify-between h-auto min-h-[160px]">
                    <div className="space-y-3">
                       <div className="flex items-center gap-3">
                          <div className="h-4 w-4 rounded-full bg-secondary shadow-[0_0_8px_#39edca]" />
                          <h4 className="text-sm font-black text-on-surface uppercase tracking-wider truncate py-1">{chan.name}</h4>
                       </div>
                       <div className="space-y-1 pl-7 opacity-50">
                          <p className="text-[9px] font-black text-outline uppercase tracking-widest leading-none">Node History</p>
                          <p className="text-[10px] font-black text-on-surface uppercase tracking-[0.2em]">{chan.entriesCount || 0} Entries Captured</p>
                       </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                       <button onClick={()=>handleDelete(chan.name)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-container-low border border-outline-variant/5 text-outline/20 hover:text-error hover:bg-error/10 hover:border-error/20 active:scale-90 transition-all">
                          <span className="material-symbols-outlined text-sm">delete_sweep</span>
                       </button>
                    </div>
                 </div>
              ))}
              {channels.length === 0 && (
                 <div className="col-span-full py-20 text-center opacity-30 select-none">
                    <span className="material-symbols-outlined text-6xl block mb-4">cloud_off</span>
                    <p className="text-[10px] font-black uppercase tracking-widest italic">No authorized nodes in current repository.</p>
                 </div>
              )}
           </div>
        </section>
      </div>
    </div>
  );
};

export default ManageChannels;
