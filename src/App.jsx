import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import ManageChannels from './pages/ManageChannels';
import AddEntry from './pages/AddEntry';
import { DataProvider } from './context/DataContext';

function App() {
  return (
    <Router>
      <DataProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="channels" element={<ManageChannels />} />
            <Route path="add" element={<AddEntry />} />
          </Route>
        </Routes>
      </DataProvider>
    </Router>
  );
}

export default App;
