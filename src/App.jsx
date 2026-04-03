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
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  const menuItems = [
    { name: 'Home Identity', path: '/', icon: 'dashboard' },
    { name: 'Strategy Matrix', path: '/analytics', icon: 'analytics' },
    { name: 'Channel Repo', path: '/channels', icon: 'hub' },
    { name: 'Entry Sync', path: '/add', icon: 'sync' },
  ];

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-[#f9f9ff] font-sans text-on-surface flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <header className="md:hidden w-full h-16 bg-[#19398a] text-white flex items-center justify-between px-6 sticky top-0 z-[60] shadow-lg">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-secondary text-2xl font-black">account_balance</span>
          <h1 className="text-lg font-headline font-black tracking-tighter uppercase italic">Authority</h1>
        </div>
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
          <span className="material-symbols-outlined text-white text-2xl">{isSidebarOpen ? 'close' : 'menu'}</span>
        </button>
      </header>

      {/* Sidebar (Responsive) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#19398a] text-white flex flex-col p-8 transition-transform duration-300 md:static md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full shadow-none'} md:shadow-2xl h-screen overflow-y-auto`}>
        <div className="mb-12 px-2 hidden md:flex items-center gap-4 group cursor-pointer">
           <span className="material-symbols-outlined text-4xl font-black text-secondary animate-pulse-slow">account_balance</span>
           <div className="flex flex-col">
              <h1 className="text-2xl font-headline font-black tracking-tighter leading-none italic uppercase italic">Authority</h1>
              <span className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mt-1 ml-1">Matrix v2.0</span>
           </div>
        </div>

        <nav className="flex-1 space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-headline font-black uppercase text-[11px] tracking-[0.2em] border ${
                location.pathname === item.path 
                ? 'bg-white/10 border-white/20 text-white shadow-xl translate-x-2' 
                : 'border-transparent hover:bg-white/5 hover:border-white/10 text-white/40 hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-8 pt-12 space-y-4">
           <div className="bg-white/5 p-4 rounded-2xl space-y-2">
              <p className="text-[8px] font-black text-white/40 uppercase tracking-widest text-center">Session Verified</p>
              <div className="flex justify-center gap-1.5">
                 {[1,2,3].map(i => <div key={i} className="h-1 w-1 bg-secondary rounded-full opacity-50" />)}
              </div>
           </div>
           <button onClick={onLogout} className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-error/20 hover:border-error/30 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white/30 hover:text-error transition-all group">
              <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform duration-500">logout</span>
              Terminate Session
           </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-[#0a0a0f]/40 backdrop-blur-sm z-[45] md:hidden cursor-pointer" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 bg-[#f9f9ff] h-screen overflow-y-auto w-full">
        {children}
      </main>
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
