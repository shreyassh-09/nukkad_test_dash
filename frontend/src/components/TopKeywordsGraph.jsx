import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TopKeywordsGraph({ keywords }) {
  const [filter, setFilter] = useState('');

  if (!keywords || keywords.length === 0) {
    return <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px', color: '#888' }}>No Keywords data loaded.</div>;
  }

  const formatCompact = (num) => {
    if (typeof num !== 'number') return num;
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  // Helper styling for single-letter intent tags
  const getIntentConfig = (char) => {
    switch(char) {
      case 'I': return { bg: '#cbe6ff', color: '#006dca' }; // Informational (Blue)
      case 'C': return { bg: '#fef0cd', color: '#b27b00' }; // Commercial (Yellow)
      case 'N': return { bg: '#ebd6ff', color: '#7a00ba' }; // Navigational (Purple)
      case 'T': return { bg: '#d6f3db', color: '#1e7e34' }; // Transactional (Green)
      default:  return { bg: '#333', color: '#fff' };
    }
  };

  // Dynamic filter matching search keyword buffer
  const filteredKeywords = keywords.filter(k => 
    k.keyword?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* TOP PANE: Original Graph retained perfectly */}
      <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px' }}>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>
          Top Keywords Distribution (Volume vs. Difficulty)
        </div>
        <div style={{ height: 280, width: '100%' }}>
          <ResponsiveContainer>
            <BarChart data={keywords.slice(0, 20)} margin={{ top: 10, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
              <XAxis dataKey="keyword" stroke="#888" tick={{ fontSize: 11 }} angle={-25} textAnchor="end" height={50} />
              <YAxis yAxisId="left" stroke="#50aef4" tick={{ fontSize: 11 }} tickFormatter={formatCompact} />
              <YAxis yAxisId="right" orientation="right" stroke="#fdc23c" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444', borderRadius: '6px' }} formatter={(val, name) => [name === 'Search Volume' ? formatCompact(val) : `${val}%`, name]} />
              <Bar yAxisId="left" dataKey="search_volume" name="Search Volume" fill="#50aef4" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="difficulty" name="Keyword Difficulty" fill="#fdc23c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOTTOM PANE: Advanced Data Table matching image 2 */}
      <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>
            Organic Search Positions: <span style={{ color: '#50aef4' }}>{filteredKeywords.length.toLocaleString()}</span>
          </div>
          <input 
            type="text" placeholder="Filter search terms..." value={filter} onChange={e => setFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: '4px', border: '1px solid #333', backgroundColor: '#141414', color: '#fff', fontSize: '12px', outline: 'none' }}
          />
        </div>

        <div className="custom-scrollbar" style={{ overflowX: 'auto', maxHeight: '420px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#1b1b1b', borderBottom: '1px solid #2a2a2a', zIndex: 1 }}>
              <tr style={{ color: '#888' }}>
                <th style={{ padding: '10px 12px' }}>Keyword</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Intent</th>
                <th style={{ padding: '10px 12px', textAlign: 'center' }}>Position</th>
                <th style={{ padding: '10px 12px' }}>Traffic</th>
                <th style={{ padding: '10px 12px' }}>Traffic %</th>
                <th style={{ padding: '10px 12px' }}>Volume</th>
                <th style={{ padding: '10px 12px' }}>KD %</th>
                <th style={{ padding: '10px 12px' }}>URL</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywords.map((row, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #1f1f1f', ':hover': { backgroundColor: '#222' } }}>
                  
                  {/* Keyword Column */}
                  <td style={{ padding: '12px 12px', fontWeight: '600', color: '#fff' }}>
                    <span style={{ color: '#50aef4', marginRight: '6px' }}>⊕</span> {row.keyword}
                  </td>
                  
                  {/* Visual UI Intent Tag Arrays */}
                  <td style={{ padding: '12px 12px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center' }}>
                      {row.parsed_intents?.map((char, cIdx) => {
                        const cfg = getIntentConfig(char);
                        return (
                          <span key={cIdx} style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', backgroundColor: cfg.bg, color: cfg.color }}>
                            {char}
                          </span>
                        );
                      })}
                    </div>
                  </td>
                  
                  {/* Dynamic Posture Link Matrix */}
                  <td style={{ padding: '12px 12px', textAlign: 'center', fontWeight: 'bold', color: row.position <= 3 ? '#66c030' : '#fff' }}>
                    🔗 {row.position}
                  </td>
                  
                  <td style={{ padding: '12px 12px', color: '#e0e0e0', fontWeight: '500' }}>
                    {formatCompact(Math.round((row.search_volume || 0) * ((row.traffic_share || 0) / 100)))}
                  </td>
                  
                  <td style={{ padding: '12px 12px', color: '#fff' }}>{row.traffic_share?.toFixed(2)}</td>
                  <td style={{ padding: '12px 12px', color: '#aaa' }}>{formatCompact(row.search_volume)}</td>
                  
                  {/* Colored Difficulty Dot Indicator */}
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#fff', fontWeight: '500' }}>{Math.round(row.difficulty || 0)}</span>
                      <span style={{ 
                        height: '8px', width: '8px', borderRadius: '50%', display: 'inline-block',
                        backgroundColor: (row.difficulty || 0) <= 25 ? '#66c030' : (row.difficulty || 0) <= 50 ? '#fdc23c' : '#ff4d4f' 
                      }} />
                    </div>
                  </td>

                  {/* Clean Host Link Routing */}
                  <td style={{ padding: '12px 12px', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    <a href={row.url} target="_blank" rel="noreferrer" style={{ color: '#50aef4', textDecoration: 'none', fontSize: '11px' }}>
                      {row.url?.replace('https://www.', '')?.replace('https://', '')} ↗
                    </a>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}