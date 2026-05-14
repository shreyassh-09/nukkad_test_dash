import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrafficSection({ trafficData }) {
  // Chart 1 Toggles (Traffic Line Chart)
  const [showOrganic, setShowOrganic] = useState(true);
  const [showPaid, setShowPaid] = useState(true);
  const [showBranded, setShowBranded] = useState(true);

  // Chart 2 Toggles (Keywords Area Chart)
  const [keywordMode, setKeywordMode] = useState('organic'); // 'organic' | 'paid'
  const [layers, setLayers] = useState({
    top3: true, top10: true, top20: true, top50: true, top100: true, ai: true, serp: true
  });

  const toggleLayer = (key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  if (!trafficData || trafficData.length === 0) {
    return (
      <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px', color: '#888' }}>
        No Traffic dashboard data loaded.
      </div>
    );
  }

  // Safely format large Y-axis metric integers
  const formatCompact = (num) => {
    if (typeof num !== 'number') return num;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Reusable custom layout styling controls
  const checkboxLabelStyle = (color) => ({
    display: 'flex', alignItems: 'center', gap: '6px', color: '#fff', 
    cursor: 'pointer', fontSize: '12px', fontWeight: '500'
  });

  const modeBtnStyle = (active) => ({
    padding: '5px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer',
    border: '1px solid #333', transition: 'all 0.2s',
    backgroundColor: active ? '#1b1b1b' : '#141414',
    color: active ? '#50aef4' : '#888',
    borderColor: active ? '#50aef4' : '#333',
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* ================= CHART 1: TRAFFIC LINE GRAPH ================= */}
      <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '14px' }}>Traffic</div>
        
        {/* Controls Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <label style={checkboxLabelStyle('#50aef4')}>
            <input type="checkbox" checked={showOrganic} onChange={e => setShowOrganic(e.target.checked)} style={{ accentColor: '#50aef4' }} />
            <span style={{ color: '#50aef4' }}>■</span> Organic Traffic
          </label>
          <label style={checkboxLabelStyle('#ff8c43')}>
            <input type="checkbox" checked={showPaid} onChange={e => setShowPaid(e.target.checked)} style={{ accentColor: '#ff8c43' }} />
            <span style={{ color: '#ff8c43' }}>■</span> Paid Traffic
          </label>
          {/* <label style={checkboxLabelStyle('#00bfa5')}>
            <input type="checkbox" checked={showBranded} onChange={e => setShowBranded(e.target.checked)} style={{ accentColor: '#00bfa5' }} />
            <span style={{ color: '#00bfa5' }}>■</span> Branded Traffic
          </label> */}
          
          {/* <div style={{ borderLeft: '1px solid #333', paddingLeft: '14px', color: '#888', fontSize: '12px', cursor: 'pointer' }}>
            🗎 Notes ⌄
          </div> */}
        </div>

        {/* Render Graph Container */}
        <div style={{ height: 220, width: '100%' }}>
          <ResponsiveContainer>
            <LineChart data={trafficData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="formattedDate" stroke="#888" tick={{ fontSize: 11 }} />
              <YAxis stroke="#888" tick={{ fontSize: 11 }} tickFormatter={formatCompact} />
              <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444', borderRadius: '6px' }} />
              
              {showOrganic && <Line type="monotone" dataKey="organic_traffic" name="Organic Traffic" stroke="#50aef4" strokeWidth={2.5} dot={false} />}
              {showPaid && <Line type="monotone" dataKey="paid_traffic" name="Paid Traffic" stroke="#ff8c43" strokeWidth={2} dot={false} />}
              {/* Plot a clean baseline for Branded Traffic if not natively present in export arrays */}
              {/* {showBranded && <Line type="monotone" dataKey="branded_traffic" name="Branded Traffic" stroke="#00bfa5" strokeWidth={2} dot={false} strokeDasharray="4 4" />} */}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* ================= CHART 2: KEYWORDS STACKED AREA GRAPH ================= */}
      <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '14px' }}>Keywords</div>
        
        {/* Toggle Pills Layout */}
        <div style={{ display: 'flex', borderRadius: '5px', overflow: 'hidden', marginBottom: '16px', width: 'fit-content' }}>
          <button style={{ ...modeBtnStyle(keywordMode === 'organic'), borderTopLeftRadius: '5px', borderBottomLeftRadius: '5px' }} onClick={() => setKeywordMode('organic')}>
            Organic
          </button>
          <button style={{ ...modeBtnStyle(keywordMode === 'paid'), borderTopRightRadius: '5px', borderBottomRightRadius: '5px' }} onClick={() => setKeywordMode('paid')}>
            Paid
          </button>
        </div>

        {/* Dynamic Multi-Layer Checkboxes */}
        <div style={{ display: 'flex', gap: '14px', fontSize: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
          <label style={{ color: '#FDC23C', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={layers.top3} onChange={() => toggleLayer('top3')} style={{ accentColor: '#FDC23C' }} /> Top 3
          </label>
          <label style={{ color: '#006DCA', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={layers.top10} onChange={() => toggleLayer('top10')} style={{ accentColor: '#006DCA' }} /> 4-10
          </label>
          <label style={{ color: '#008FF8', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={layers.top20} onChange={() => toggleLayer('top20')} style={{ accentColor: '#008FF8' }} /> 11-20
          </label>
          <label style={{ color: '#2BB3FF', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={layers.top50} onChange={() => toggleLayer('top50')} style={{ accentColor: '#2BB3FF' }} /> 21-50
          </label>
          <label style={{ color: '#8ECDFF', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={layers.top100} onChange={() => toggleLayer('top100')} style={{ accentColor: '#8ECDFF' }} /> 51-100
          </label>
          <label style={{ color: '#ab6cfe', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={layers.ai} onChange={() => toggleLayer('ai')} style={{ accentColor: '#ab6cfe' }} /> AI Overviews
          </label>
          <label style={{ color: '#66c030', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="checkbox" checked={layers.serp} onChange={() => toggleLayer('serp')} style={{ accentColor: '#66c030' }} /> Other SERP Features
          </label>
        </div>

        {/* Stacked Layout Mapping */}
        <div style={{ height: 260, width: '100%' }}>
          <ResponsiveContainer>
            <AreaChart data={trafficData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="formattedDate" stroke="#888" tick={{ fontSize: 11 }} />
              <YAxis stroke="#888" tick={{ fontSize: 11 }} tickFormatter={formatCompact} />
              <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444', borderRadius: '6px' }} />
              
              {/* Sequentially Stacked Metric Layers */}
              {layers.top100 && <Area type="monotone" dataKey="top_100" stackId="1" stroke="#8ECDFF" fill="#8ECDFF" />}
              {layers.top50 && <Area type="monotone" dataKey="top_50" stackId="1" stroke="#2BB3FF" fill="#2BB3FF" />}
              {layers.top20 && <Area type="monotone" dataKey="top_20" stackId="1" stroke="#008FF8" fill="#008FF8" />}
              {layers.top10 && <Area type="monotone" dataKey="top_10" stackId="1" stroke="#006DCA" fill="#006DCA" />}
              {layers.top3 && <Area type="monotone" dataKey="top_3" stackId="1" stroke="#FDC23C" fill="#FDC23C" />}
              {layers.ai && <Area type="monotone" dataKey="ai_overviews" stackId="2" stroke="#ab6cfe" fill="#ab6cfe" fillOpacity={0.6} />}
              {layers.serp && <Area type="monotone" dataKey="features_keywords" stackId="3" stroke="#66c030" fill="#66c030" fillOpacity={0.4} />}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* ================= PERSISTENT HISTORICAL METRICS TABLE ================= */}
      <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>Historical Snapshot Logs</div>
        <div className="custom-scrollbar" style={{ overflowY: 'auto', maxHeight: '250px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#1b1b1b', borderBottom: '1px solid #2a2a2a' }}>
              <tr style={{ color: '#888' }}>
                <th style={{ padding: '10px 12px' }}>Date</th>
                <th style={{ padding: '10px 12px' }}>Organic Traffic</th>
                <th style={{ padding: '10px 12px' }}>Paid Traffic</th>
                <th style={{ padding: '10px 12px' }}>Top 3</th>
                <th style={{ padding: '10px 12px' }}>Top 100</th>
                <th style={{ padding: '10px 12px' }}>AI Overviews</th>
                <th style={{ padding: '10px 12px' }}>SERP Features</th>
              </tr>
            </thead>
            <tbody>
              {trafficData.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1f1f1f', ':hover': { backgroundColor: '#222' } }}>
                  <td style={{ padding: '10px 12px', color: '#fff', fontWeight: 'bold' }}>{row.formattedDate || row.date}</td>
                  <td style={{ padding: '10px 12px', color: '#50aef4', fontWeight: '600' }}>{row.organic_traffic?.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', color: '#ff8c43' }}>{row.paid_traffic?.toLocaleString() || 0}</td>
                  <td style={{ padding: '10px 12px', color: '#fdc23c' }}>{row.top_3?.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', color: '#8ECDFF' }}>{row.top_100?.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px', color: '#ab6cfe' }}>{row.ai_overviews?.toLocaleString() || 0}</td>
                  <td style={{ padding: '10px 12px', color: '#66c030' }}>{row.features_keywords?.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}