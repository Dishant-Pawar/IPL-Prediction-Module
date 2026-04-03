import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="bg-surface font-body text-on-surface antialiased flex">
      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-[#ffffff] dark:bg-[#0f172a] border-r border-[#c4c6d3]/15 flex flex-col py-6" style={{boxShadow: '0px 12px 32px rgba(18, 28, 43, 0.06)'}}>
        <div className="px-6 mb-8">
          <h1 className="text-lg font-black font-headline text-[#19398a] tracking-tighter">IPL Curator</h1>
          <p className="text-[10px] uppercase tracking-widest text-outline font-bold">Data Authority</p>
        </div>
        <nav className="flex-1 space-y-1">
          <NavLink to="/" className={({isActive}) => `flex items-center px-4 py-3 mx-2 font-inter text-sm font-medium rounded-lg transition-transform duration-150 active:scale-95 ${isActive ? 'bg-[#dbe1ff] dark:bg-[#19398a]/30 text-[#00174d] dark:text-[#dbe1ff]' : 'text-[#121c2b]/80 dark:text-slate-400 hover:bg-[#f0f3ff] dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="dashboard">dashboard</span>
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/add" className={({isActive}) => `flex items-center px-4 py-3 mx-2 font-inter text-sm font-medium rounded-lg transition-transform duration-150 active:scale-95 ${isActive ? 'bg-[#dbe1ff] dark:bg-[#19398a]/30 text-[#00174d] dark:text-[#dbe1ff]' : 'text-[#121c2b]/80 dark:text-slate-400 hover:bg-[#f0f3ff] dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="add_circle">add_circle</span>
            <span>Add Entry</span>
          </NavLink>
          <NavLink to="/channels" className={({isActive}) => `flex items-center px-4 py-3 mx-2 font-inter text-sm font-medium rounded-lg transition-transform duration-150 active:scale-95 ${isActive ? 'bg-[#dbe1ff] dark:bg-[#19398a]/30 text-[#00174d] dark:text-[#dbe1ff]' : 'text-[#121c2b]/80 dark:text-slate-400 hover:bg-[#f0f3ff] dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="hub">hub</span>
            <span>Manage Channels</span>
          </NavLink>
          <NavLink to="/analytics" className={({isActive}) => `flex items-center px-4 py-3 mx-2 font-inter text-sm font-medium rounded-lg transition-transform duration-150 active:scale-95 ${isActive ? 'bg-[#dbe1ff] dark:bg-[#19398a]/30 text-[#00174d] dark:text-[#dbe1ff]' : 'text-[#121c2b]/80 dark:text-slate-400 hover:bg-[#f0f3ff] dark:hover:bg-slate-800'}`}>
            <span className="material-symbols-outlined mr-3" data-icon="query_stats">query_stats</span>
            <span>Analytics</span>
          </NavLink>
        </nav>
        <div className="mt-auto px-2 space-y-1">
          <button className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-headline font-bold text-sm shadow-md hover:shadow-lg transition-shadow">
            Export Report
          </button>
          <a className="flex items-center text-[#121c2b]/80 dark:text-slate-400 px-4 py-3 font-inter text-sm font-medium hover:bg-[#f0f3ff] rounded-lg" href="#">
            <span className="material-symbols-outlined mr-3" data-icon="help_outline">help_outline</span>
            <span>Support</span>
          </a>
          <a className="flex items-center text-error px-4 py-3 font-inter text-sm font-medium hover:bg-error-container/20 rounded-lg" href="#">
            <span className="material-symbols-outlined mr-3" data-icon="logout">logout</span>
            <span>Sign Out</span>
          </a>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <main className="ml-64 flex-1 min-h-screen relative">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
