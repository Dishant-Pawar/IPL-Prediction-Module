import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import AddEntry from './pages/AddEntry';
import Analytics from './pages/Analytics';
import ManageChannels from './pages/ManageChannels';
import Login from './pages/Login';
import { DataProvider } from './context/DataContext';

const Layout = ({ children, onLogout, theme, toggleTheme }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const menuItems = [
    { name: 'Home Identity', path: '/', icon: 'dashboard' },
    { name: 'Strategy Matrix', path: '/analytics', icon: 'analytics' },
    { name: 'Channel Repo', path: '/channels', icon: 'hub' },
    { name: 'Entry Sync', path: '/add', icon: 'sync' },
  ];

  // Close sidebar on route change for mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen font-sans bg-[var(--bg-app)] text-[var(--text-normal)] relative overflow-x-hidden">
      
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
           className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden animate-fade-in"
           onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Global Sidebar (Drawer on mobile, Sidebar on desktop) */}
      <aside className={`
        fixed lg:sticky top-0 h-screen w-72 bg-[var(--sidebar-bg)] text-[var(--sidebar-text)] flex flex-col p-6 shadow-2xl z-[70] border-r border-white/5 transition-transform duration-500 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="mb-10 px-2 flex items-center justify-between">
            <div className="flex items-center gap-3 group transition-transform duration-300">
                <span className="material-symbols-outlined text-3xl font-black text-secondary">account_balance</span>
                <h1 className="text-xl font-headline font-black tracking-tighter italic uppercase">Authority</h1>
            </div>
            <button className="lg:hidden h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center text-white" onClick={() => setSidebarOpen(false)}>
               <span className="material-symbols-outlined text-xl">close</span>
            </button>
        </div>
        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
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
        <div className="mt-auto space-y-4 pt-6 border-t border-white/10">
           <button onClick={toggleTheme} className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all shadow-inner">
              <span className="material-symbols-outlined text-sm">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
              Switch Perspective
           </button>
           <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-error/10 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-error transition-all">
              <span className="material-symbols-outlined text-sm">logout</span>
              Logout
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header (Only visible on mobile) */}
        <header className="lg:hidden h-16 bg-[var(--bg-app)]/80 backdrop-blur-md flex items-center justify-between px-6 border-b border-outline-variant/10 sticky top-0 z-[50]">
           <button onClick={() => setSidebarOpen(true)} className="h-10 w-10 flex items-center justify-center rounded-xl bg-surface-container-low border border-outline-variant/10 text-primary active:scale-95 transition-all">
              <span className="material-symbols-outlined text-2xl">menu</span>
           </button>
           <h2 className="text-sm font-black uppercase tracking-widest text-primary italic">Authority Platform</h2>
           <div className="h-8 w-8 rounded-full bg-primary-container overflow-hidden">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDixRxPA3y35u5PfZQBPGFtHIULze_wLlwEt7KODkpDljdqUTLUyVLMgqtLUHbVeimCYVR-OSHtwaRoO36XuRfem88PnAmOFSjno_xDQv_QjK6S95MeWDaBwQYRFmtvfDHVxi0ElqMx8fh2q47y2Mn_nMdhHaXUXBTIFAr3Fbys8gc1s2wuwGezXFr7JvoIuyPB0JleehgPj9yI4DF22Ga4AAKcyUZmBGfgN4nPdZytAl2ZMrwjGRbKM3LnIcfAYAYoRUqAdMflAiw" alt="User"/>
           </div>
        </header>

        <main className="flex-1 p-2 md:p-6 lg:p-0 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
};

function App() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('auth_id') === 'ravan_verified');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const handleAuth = () => { localStorage.setItem('auth_id', 'ravan_verified'); setIsAuthenticated(true); };
  const handleLogout = () => { localStorage.removeItem('auth_id'); setIsAuthenticated(false); };

  if (!isAuthenticated) return <Login onAuthenticate={handleAuth} />;

  return (
    <DataProvider>
      <Router>
        <Layout onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme}>
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
