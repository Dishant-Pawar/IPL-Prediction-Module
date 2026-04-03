import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddEntry from './pages/AddEntry';
import Analytics from './pages/Analytics';
import ManageChannels from './pages/ManageChannels';
import Login from './pages/Login';
import { DataProvider } from './context/DataContext';

const Layout = ({ children, onLogout }) => {
  const location = useLocation();
  const menuItems = [
    { name: 'Home Identity', path: '/', icon: 'dashboard' },
    { name: 'Strategy Matrix', path: '/analytics', icon: 'analytics' },
    { name: 'Channel Repo', path: '/channels', icon: 'hub' },
    { name: 'Entry Sync', path: '/add', icon: 'sync' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f9f9ff] font-sans text-on-surface">
      <aside className="w-64 bg-[#19398a] text-white flex flex-col p-6 sticky top-0 h-screen shadow-2xl z-50">
        <div className="mb-10 px-2 flex items-center gap-3 group cursor-pointer transition-transform duration-300 hover:scale-105">
           <span className="material-symbols-outlined text-3xl font-black text-secondary animate-pulse-slow">account_balance</span>
           <div className="flex flex-col">
              <h1 className="text-xl font-headline font-black tracking-tighter leading-none italic uppercase italic">Authority</h1>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.3em] mt-1 italic">Matrix Platform</span>
           </div>
        </div>
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 font-headline font-black uppercase text-[11px] tracking-[0.15em] border ${
                location.pathname === item.path 
                ? 'bg-white/10 border-white/20 text-white shadow-lg' 
                : 'border-transparent hover:bg-white/5 hover:border-white/10 text-white/50 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-white/10 pt-6">
           <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-error/10 hover:border-error/20 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-error transition-all">
              <span className="material-symbols-outlined text-sm">logout</span>
              Terminate Session
           </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('auth_id') === 'ravan_verified'
  );

  const handleAuth = () => {
    localStorage.setItem('auth_id', 'ravan_verified');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_id');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onAuthenticate={handleAuth} />;
  }

  return (
    <DataProvider>
      <Router>
        <Layout onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add" element={<AddEntry />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/channels" element={<ManageChannels />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;
