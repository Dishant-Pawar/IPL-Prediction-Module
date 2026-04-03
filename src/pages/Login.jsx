import React, { useState } from 'react';

const Login = ({ onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === 'Ravan@008') {
      onAuthenticate();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Deep Glows */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[60%] h-[60%] bg-[#19398a]/30 rounded-full blur-[160px]" />
        <div className="absolute -bottom-40 -right-40 w-[60%] h-[60%] bg-[#39edca]/10 rounded-full blur-[160px]" />
      </div>

      <div className="w-full max-w-md z-10">
        <div className="bg-[#121218]/80 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-[0_24px_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
          {/* Subtle top edge highlighting */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="text-center mb-12">
             <div className="inline-flex items-center justify-center h-20 w-20 bg-white/5 rounded-3xl mb-8 border border-white/10 shadow-inner">
                <span className="material-symbols-outlined text-white text-4xl font-black">security</span>
             </div>
             <h1 className="text-4xl font-black text-white uppercase tracking-tighter italic leading-none mb-4">Authority Access</h1>
             <p className="text-white/60 text-[11px] font-black uppercase tracking-[0.4em]">Secure Synchronization Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative group">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/40 group-focus-within:text-white transition-colors">lock</span>
              <input 
                type="password" 
                placeholder="Enter Secure Identifier..."
                className={`w-full bg-white/5 border-2 ${error ? 'border-error/80 animate-shake bg-error/5' : 'border-white/5 focus:border-white/20 group-focus-within:bg-white/10'} text-white rounded-2xl py-5 pl-14 pr-6 outline-none transition-all placeholder:text-white/20 font-black text-sm tracking-widest`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-error font-black text-[10px] uppercase tracking-widest absolute -bottom-6 left-2">Verification Error: Unauthorized Identity</p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-white text-[#050508] font-black py-5 rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-10 transition-opacity" />
              <span className="material-symbols-outlined text-lg">verified_user</span>
              Initialize Protocol
            </button>
          </form>

          <footer className="mt-14 pt-8 border-t border-white/5 text-center">
             <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em] italic leading-relaxed">
                System Integrity Verification Matrix <br/>
                <span className="text-white/10">Logs recorded at authorized terminal</span>
             </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
