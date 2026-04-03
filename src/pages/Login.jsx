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
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md z-10 transition-all duration-500">
        <div className="bg-surface-container-lowest/50 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl relative">
          <div className="text-center mb-10">
             <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 rounded-2xl mb-6 ring-1 ring-primary/20">
                <span className="material-symbols-outlined text-primary text-3xl font-black">security</span>
             </div>
             <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">Authority Access</h1>
             <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mt-2">Matrix Synchronization Secure Link</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-white/20 group-focus-within:text-primary transition-colors">lock</span>
              <input 
                type="password" 
                placeholder="Enter Secure Identifier..."
                className={`w-full bg-white/5 border ${error ? 'border-error animate-shake' : 'border-white/10'} focus:border-primary/50 text-white rounded-xl py-4 pl-12 pr-4 outline-none transition-all placeholder:text-white/10 font-bold text-sm`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {error && (
                <p className="text-error text-[9px] font-black uppercase tracking-widest absolute -bottom-5 left-1 animate-fade-in">Verification Failed: Protocol Breach</p>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-xl shadow-xl shadow-primary/20 transition-all active:scale-95 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">verified_user</span>
              Initialize Authority Profile
            </button>
          </form>

          <div className="mt-10 flex flex-col items-center gap-4">
             <span className="h-px w-10 bg-white/10" />
             <p className="text-white/20 text-[8px] font-black text-center leading-relaxed tracking-widest uppercase italic">
                System Integrity Verification Active <br/>
                Unauthorized access will be logged in repository
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
