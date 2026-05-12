import React, { useEffect, useState } from 'react';
import { fetchSeoHistory } from './services/api';
import MetricCard from './components/MetricCard';
import TrafficChart from './components/TrafficChart';
import KeywordsChart from './components/KeywordsChart';

export default function App() {
  const [targetDomain, setTargetDomain] = useState('gonukkad.com');
  const [seoData, setSeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchSeoHistory(targetDomain);
        if (res.status === 'success' && res.data.length > 0) {
          // Format Dt strings (e.g. "202604") into simple visual X-Axis labels ("Apr 26")
          const formatted = res.data.map((item) => {
            const year = item.date.substring(2, 4);
            const monthNum = parseInt(item.date.substring(4, 6), 10);
            const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            return {
              ...item,
              formattedDate: `${monthNames[monthNum - 1] || ''} '${year}`
            };
          });
          // Semrush returns array chronological latest-first usually; reverse for left-to-right graphs
          setSeoData(formatted.reverse());
        } else {
          setError(res.message || 'No historical data found.');
        }
      } catch (err) {
        setError('Failed to connect to backend server.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [targetDomain]);

  // Derive aggregate totals from the most recent historical snapshot (last array item after reversing)
  const latestSnapshot = seoData.length > 0 ? seoData[seoData.length - 1] : null;
  const totalKeywords = latestSnapshot 
    ? latestSnapshot.top_3 + latestSnapshot.top_10 + latestSnapshot.top_20 + latestSnapshot.top_50 + latestSnapshot.top_100 
    : 0;

  return (
    <div className="dashboard-layout">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="header-title">Organic Research Dashboard</div>
        <input 
          type="text" 
          value={targetDomain} 
          onChange={(e) => setTargetDomain(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '6px', backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', color: '#fff' }}
        />
      </div>

      {loading && <div style={{ color: '#008ff8', fontSize: '18px' }}>Loading live Semrush engine...</div>}
      {error && <div style={{ color: '#ff4d4f', fontSize: '16px', marginBottom: '20px' }}>{error}</div>}

      {!loading && !error && latestSnapshot && (
        <>
          {/* Top Metric Cards */}
          <div className="metrics-grid">
            <MetricCard title="Target Domain" value={targetDomain} />
            <MetricCard title="Est. Organic Traffic" value={latestSnapshot.organic_traffic} />
            <MetricCard title="Ranking Keywords Footprint" value={totalKeywords} />
            <MetricCard title="Triggered SERP Features" value={latestSnapshot.features_keywords} />
          </div>

          {/* Main Analytics Graphs */}
          <TrafficChart data={seoData} />
          <KeywordsChart data={seoData} />
        </>
      )}
    </div>
  );
}