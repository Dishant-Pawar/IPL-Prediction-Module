import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import API_BASE_URL from '../apiConfig';


const ManageChannels = () => {
  const { channels, refreshData, loading } = useData();
  const [formData, setFormData] = useState({ name: '', sourceType: 'Telegram Feed' });

  const handleAddChannel = async () => {
    if (!formData.name) return;
    try {
      const response = await fetch(`${API_BASE_URL}/api/channels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setFormData({ name: '', sourceType: 'Telegram Feed' });
        refreshData(); // Global sync
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error adding channel:', err);
    }
  };

  const handleDeleteChannel = async (name) => {
    if (!window.confirm(`Are you sure you want to delete '${name}' and all its associated records? This cannot be undone.`)) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/channels/${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        alert(`${name} and all associated records deleted successfully.`);
        refreshData(); // Sync everything
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error deleting channel:', err);
    }
  };

  return (
    <>
      <header className="w-full h-16 sticky top-0 z-40 bg-[#f9f9ff] shadow-sm flex items-center justify-between px-8">
        <div className="flex items-center">
          <span className="font-headline text-xl tracking-tight font-bold text-[#19398a]">Channel Repository</span>
        </div>
        <div className="flex items-center gap-4">
           <button className="material-symbols-outlined text-[#19398a] p-2 hover:bg-[#f0f3ff] rounded-full transition-colors">notifications</button>
           <div className="h-8 w-8 rounded-full bg-primary-container overflow-hidden ring-2 ring-[#dbe1ff]">
               <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDixRxPA3y35u5PfZQBPGFtHIULze_wLlwEt7KODkpDljdqUTLUyVLMgqtLUHbVeimCYVR-OSHtwaRoO36XuRfem88PnAmOFSjno_xDQv_QjK6S95MeWDaBwQYRFmtvfDHVxi0ElqMx8fh2q47y2Mn_nMdhHaXUXBTIFAr3Fbys8gc1s2wuwGezXFr7JvoIuyPB0JleehgPj9yI4DF22Ga4AAKcyUZmBGfgN4nPdZytAl2ZMrwjGRbKM3LnIcfAYAYoRUqAdMflAiw" alt="Profile"/>
            </div>
        </div>
      </header>

      <div className="p-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1">
            <div className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_12px_32px_rgba(18,28,43,0.06)] h-full border border-outline-variant/10">
              <h3 className="font-headline font-bold text-lg mb-6">Provision New Source</h3>
              <div className="space-y-4">
                <input 
                  className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-primary-container text-sm font-semibold" 
                  placeholder="Channel Name..." 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <select 
                  className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 focus:ring-2 focus:ring-primary-container text-sm font-semibold"
                  value={formData.sourceType}
                  onChange={(e) => setFormData({ ...formData, sourceType: e.target.value })}
                >
                  <option>Telegram Feed</option>
                  <option>WhatsApp Group</option>
                  <option>Internal API</option>
                </select>
                <p className="text-[9px] text-outline font-bold uppercase tracking-widest px-1">Note: Channel names must be unique.</p>
                <button 
                  onClick={handleAddChannel}
                  className="w-full mt-2 bg-primary text-white font-headline font-black py-3 px-6 rounded-xl shadow-md active:scale-95 transition-all text-sm uppercase tracking-widest"
                >
                  Confirm Provision
                </button>
              </div>
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/10 overflow-hidden">
              <div className="px-6 py-5 bg-surface-container-low flex justify-between items-center">
                <h3 className="font-headline font-bold text-sm uppercase tracking-widest text-primary">Active Distribution</h3>
                <span className="text-xs font-bold text-outline">{channels.length} Source Identifiers</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="text-left border-b border-outline-variant/15 bg-surface-container-low/20">
                      <th className="px-6 py-4 text-xs font-black text-outline uppercase tracking-wider">Identity</th>
                      <th className="px-6 py-4 text-xs font-black text-outline uppercase tracking-wider text-center">Data Count</th>
                      <th className="px-6 py-4 text-xs font-black text-outline uppercase tracking-wider text-right">Administrative</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {channels.map((chan) => (
                      <tr key={chan._id} className="hover:bg-surface-container-low/30 transition-colors group">
                        <td className="px-6 py-4">
                          <span className="text-sm font-black text-on-surface">{chan.name}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface font-black text-center">{chan.entriesCount}</td>
                        <td className="px-6 py-4 text-right">
                           <button 
                              onClick={() => handleDeleteChannel(chan.name)}
                              className="p-2 text-outline hover:text-error transition-all"
                              title="Delete source"
                           >
                              <span className="material-symbols-outlined text-md">delete</span>
                           </button>
                        </td>
                      </tr>
                    ))}
                    {loading && channels.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-6 py-10 text-center text-outline text-sm italic">
                          Synchronizing with repository...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ManageChannels;
