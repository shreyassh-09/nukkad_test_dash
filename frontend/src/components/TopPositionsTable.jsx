import React, { useState } from 'react';

export default function TopPositionsTable({ positionsData }) {
  const [tab, setTab] = useState('new'); // 'new' | 'lost' | 'rise' | 'fall'

  if (!positionsData) {
    return (
      <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px', color: '#888' }}>
        No Position Changes data loaded.
      </div>
    );
  }

  const activeData = positionsData[tab] || [];

  const tabButtonStyle = (targetTab) => ({
    padding: '6px 16px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
    border: '1px solid #333', transition: 'all 0.2s',
    backgroundColor: tab === targetTab ? '#1b1b1b' : '#141414',
    color: tab === targetTab ? '#50aef4' : '#888',
    borderColor: tab === targetTab ? '#50aef4' : '#333',
  });

  return (
    <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #2a2a2a', paddingBottom: '16px', marginBottom: '16px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>Top Positions Module</div>
        
        {/* Dynamic Context Multi-Tab Toggle Buttons */}
        <div style={{ display: 'flex', borderRadius: '6px', overflow: 'hidden' }}>
          <button style={{ ...tabButtonStyle('new'), borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px' }} onClick={() => setTab('new')}>New</button>
          <button style={{ ...tabButtonStyle('lost') }} onClick={() => setTab('lost')}>Lost</button>
          <button style={{ ...tabButtonStyle('rise') }} onClick={() => setTab('rise')}>Improved</button>
          <button style={{ ...tabButtonStyle('fall'), borderTopRightRadius: '6px', borderBottomRightRadius: '6px' }} onClick={() => setTab('fall')}>Declined</button>
        </div>
      </div>

      <div className="custom-scrollbar" style={{ overflowX: 'auto', maxHeight: '350px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#1b1b1b', borderBottom: '1px solid #2a2a2a' }}>
            <tr style={{ color: '#888' }}>
              <th style={{ padding: '10px 12px' }}>Keyword</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Prev</th>
              <th style={{ padding: '10px 12px', textAlign: 'center' }}>Current</th>
              <th style={{ padding: '10px 12px' }}>Volume</th>
              <th style={{ padding: '10px 12px' }}>Traffic %</th>
            </tr>
          </thead>
          <tbody>
            {activeData.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #1f1f1f', ':hover': { backgroundColor: '#222' } }}>
                <td style={{ padding: '10px 12px', color: '#50aef4', fontWeight: '600' }}>{row.keyword}</td>
                <td style={{ padding: '10px 12px', textAlign: 'center', color: '#666', fontWeight: 'bold' }}>
                  {row.previous_position === '-' || row.previous_position === '0' ? '•' : row.previous_position}
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 'bold', color: tab === 'fall' ? '#ff4d4f' : '#66c030' }}>
                  {row.current_position}
                </td>
                <td style={{ padding: '10px 12px', color: '#ccc' }}>{row.search_volume?.toLocaleString()}</td>
                <td style={{ padding: '10px 12px', color: '#fff' }}>{row.traffic_share?.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}