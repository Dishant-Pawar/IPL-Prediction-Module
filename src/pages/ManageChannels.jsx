import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { API_BASE_URL } from '../config';

const ManageChannels = () => {
  const { channels, refreshData, loading } = useData();
  const [newChannel, setNewChannel] = useState('');
  const [error, setError] = useState('');

  const handleAddChannel = async (e) => {
    e.preventDefault();
    if (!newChannel.trim()) return;
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newChannel.trim() }),
      });
      if (response.ok) {
        setNewChannel('');
        refreshData();
      } else {
        const data = await response.json();
        setError(data.message || 'Error creating channel');
      }
    } catch (err) {
      console.error('Error adding channel:', err);
    }
  };

  const handleDeleteChannel = async (name) => {
    if (!window.confirm(`Terminate Source Steam: ${name}? All linked historical data points will be permanently purged.`)) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/channels/${name}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        refreshData();
      }
    } catch (err) {
      console.error('Error deleting channel:', err);
    }
  };

  return (
    <div className="min-h-full pb-16">
      <header className="w-full h-16 sticky top-0 z-40 bg-[#f9f9ff]/90 backdrop-blur-md flex items-center justify-between px-6 md:px-8 border-b border-outline-variant/10">
        <h2 className="font-headline text-lg md:text-xl font-black tracking-tighter text-[#19398a] uppercase italic">Channel Repository</h2>
        <div className="flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_#39edca]" />
          <span className="text-[10px] font-black text-outline uppercase tracking-[0.2em] hidden sm:block">Source Stream: ONLINE</span>
        </div>
      </header>

      <div className="p-6 md:p-8 max-w-6xl mx-auto space-y-10">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 bg-surface-container-lowest p-8 md:p-10 rounded-[3rem] shadow-sm border border-outline-variant/10 sticky top-24">
            <h3 className="font-headline font-black text-2xl text-on-surface mb-8 uppercase tracking-tighter italic">Provision New Stream</h3>
            <form onSubmit={handleAddChannel} className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-outline uppercase tracking-[0.3em] block px-1">Source Name Identifier</label>
                 <input 
                  className={`w-full bg-surface-container-low border-none rounded-2xl py-5 px-6 text-xs font-black ring-1 ${error ? 'ring-error animate-shake' : 'ring-outline-variant/10 focus:ring-primary/50'} transition-all`} 
                  placeholder="TELEGRAM_SOURCE_01..." 
                  value={newChannel} 
                  onChange={(e) => {setNewChannel(e.target.value); setError('');}} 
                 />
                 {error && (
                    <p className="text-error text-[8px] font-black uppercase tracking-widest px-1 animate-fade-in">{error}</p>
                 )}
              </div>
              <button 
                type="submit" 
                className="w-full bg-[#19398a] hover:bg-primary text-white font-black py-5 rounded-2xl shadow-xl hover:shadow-primary/20 active:scale-95 transition-all text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 group"
              >
                <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform duration-500">add_circle</span>
                Initialize Provisioning
              </button>
            </form>
            <div className="mt-10 p-6 bg-primary/5 border border-primary/10 rounded-2.5rem space-y-3">
               <span className="text-[8px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">Security Protocol</span>
               <p className="text-[9px] text-[#19398a]/60 font-medium font-headline leading-relaxed">System requires unique nomenclature for identifier mapping. Avoid duplicates to maintain link integrity.</p>
            </div>
          </div>

          <div className="lg:col-span-8 bg-surface-container-lowest rounded-[3rem] shadow-sm border border-outline-variant/10 overflow-hidden">
            <div className="px-8 py-6 bg-surface-container-low/50 border-b border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center gap-4">
               <div>
                  <h3 className="font-headline font-black text-xl text-on-surface uppercase tracking-tighter italic leading-none">Active Distributed Sources</h3>
                  <p className="text-[8px] font-black text-outline uppercase tracking-widest mt-1 italic">Repository Matrix Stream</p>
               </div>
               <span className="text-[9px] font-black text-secondary bg-secondary-container px-4 py-1.5 rounded-full ring-1 ring-secondary/20 uppercase tracking-widest">{channels.length} Nodes Active</span>
            </div>
            
            <div className="divide-y divide-outline-variant/5">
              {channels.map((chan) => (
                <div key={chan._id} className="p-8 hover:bg-primary/5 transition-all group flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-6 text-center sm:text-left">
                    <div className="h-14 w-14 rounded-2.5rem bg-surface-container-low flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500 ring-1 ring-outline-variant/10 group-hover:ring-primary/20">
                      <span className="material-symbols-outlined text-2xl font-black">podcasts</span>
                    </div>
                    <div>
                      <h4 className="font-black text-lg text-on-surface uppercase tracking-tighter group-hover:text-primary transition-all italic">{chan.name}</h4>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1.5">
                         <span className="text-[9px] font-black text-outline uppercase tracking-widest bg-surface-container-low/50 px-2.5 py-0.5 rounded italic opacity-60">Verified Link</span>
                         <span className="text-[9px] font-black text-secondary uppercase tracking-[0.3em] font-headline">{chan.entriesCount || 0} Data Operations</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteChannel(chan.name)}
                    className="w-full sm:w-auto px-6 py-3 border border-outline-variant/10 group-hover:border-error/20 hover:bg-error/10 text-outline group-hover:text-error/60 hover:text-error rounded-xl text-[10px] font-black uppercase tracking-widest transition-all inline-flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">link_off</span>
                    Terminate Access
                  </button>
                </div>
              ))}
              {channels.length === 0 && (
                <div className="py-24 text-center px-10 space-y-4">
                  <span className="material-symbols-outlined text-outline/20 text-6xl">cloud_off</span>
                  <p className="text-xs text-outline/40 italic uppercase tracking-[0.4em]">Repository currently de-synchronized</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ManageChannels;
