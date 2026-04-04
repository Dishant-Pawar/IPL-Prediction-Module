import React, { createContext, useContext, useState, useEffect } from 'react';
import API_BASE_URL from '../apiConfig';


const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalProfit: 0,
    tossAccuracy: 0,
    matchAccuracy: 0,
    recentLogs: []
  });
  const [predictions, setPredictions] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, predRes, chanRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/stats`),
        fetch(`${API_BASE_URL}/api/predictions`),
        fetch(`${API_BASE_URL}/api/channels`)

      ]);

      const statsData = await statsRes.json();
      const predData = await predRes.json();
      const chanData = await chanRes.json();

      if (statsData && !statsData.error) setStats(statsData);
      if (Array.isArray(predData)) setPredictions(predData);
      if (Array.isArray(chanData)) setChannels(chanData);
      setLoading(false);

    } catch (err) {
      console.error('Error fetching global data:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ stats, predictions, channels, loading, refreshData: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
