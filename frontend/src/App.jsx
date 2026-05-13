import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrafficChart from './components/TrafficChart';
import KeywordsChart from './components/KeywordsChart';

export default function App() {
  const [targetDomain, setTargetDomain] = useState('gonukkad.com');
  const [seoData, setSeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async (domain, forceRefresh = false) => {
    setLoading(true); setError(null);
    try {
      const res = await axios.get(`http://localhost:8000/api/dashboard/seo-history?domain=${domain}&refresh=${forceRefresh}`);
      if (res.data.status === 'success' && res.data.data.length > 0) {
        const formatted = res.data.data.map((item) => {
          const year = item.date.substring(2, 4);
          const monthNum = parseInt(item.date.substring(4, 6), 10);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return { ...item, formattedDate: `${monthNames[monthNum - 1] || ''} '${year}` };
        });
        setSeoData(formatted.reverse()); // Format left-to-right chronological progression
      } else {
        setError('No historical data found.');
      }
    } catch (err) {
      setError('Network communication layer unavailable.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadDashboardData(targetDomain, false); }, [targetDomain]);

  return (
    <div className="dashboard-layout">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div className="header-title" style={{ margin: 0 }}>Organic Research Dashboard</div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <input type="text" value={targetDomain} onChange={(e) => setTargetDomain(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', color: '#fff' }} />
          <button onClick={() => loadDashboardData(targetDomain, true)} style={{ padding: '8px 16px', borderRadius: '6px', backgroundColor: '#008ff8', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Live Pull</button>
        </div>
      </div>
      {loading && <div style={{ color: '#008ff8' }}>Parsing cached records...</div>}
      {error && <div style={{ color: '#ff4d4f' }}>{error}</div>}
      {!loading && !error && (
        <>
          <TrafficChart data={seoData} />
          <KeywordsChart data={seoData} />
        </>
      )}
    </div>
  );
}