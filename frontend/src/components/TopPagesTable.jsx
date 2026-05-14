import React from 'react';

export default function TopPagesTable({ pages }) {
  if (!pages || pages.length === 0) {
    return (
      <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px', color: '#888' }}>
        No Top Pages data loaded.
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#1b1b1b', border: '1px solid #2a2a2a', borderRadius: '8px', padding: '20px' }}>
      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff', marginBottom: '16px' }}>Top Organic Landing Pages</div>
      <div className="custom-scrollbar" style={{ overflowX: 'auto', maxHeight: '350px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead style={{ position: 'sticky', top: 0, backgroundColor: '#1b1b1b', borderBottom: '2px solid #2a2a2a', zIndex: 1 }}>
            <tr style={{ color: '#98aaaf' }}>
              <th style={{ padding: '12px 16px', width: '45%' }}>URL</th>
              <th style={{ padding: '12px 12px' }}>Traffic Share</th>
              <th style={{ padding: '12px 12px' }}>Est. Traffic</th>
              <th style={{ padding: '12px 12px' }}>Keywords</th>
            </tr>
          </thead>
          <tbody>
            {pages.map((p, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #1f1f1f', ':hover': { backgroundColor: '#222' } }}>
                <td style={{ padding: '12px 16px', maxWidth: '350px', wordBreak: 'break-all' }}>
                  <a href={p.url} target="_blank" rel="noreferrer" style={{ color: '#50aef4', textDecoration: 'none', fontWeight: '500' }}>
                    {p.url?.replace('https://www.', '')?.replace('https://', '')}
                  </a>
                </td>
                <td style={{ padding: '12px 12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '45px', color: '#fff', fontWeight: 'bold' }}>{p.traffic_share?.toFixed(1)}%</span>
                    <div style={{ width: '60px', height: '6px', backgroundColor: '#2a2a2a', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${Math.min(p.traffic_share || 0, 100)}%`, height: '100%', backgroundColor: '#008ff8' }} />
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 12px', fontWeight: '700', color: '#e0e0e0' }}>
                  {p.traffic?.toLocaleString()}
                </td>
                <td style={{ padding: '12px 12px', color: '#008ff8', fontWeight: '600' }}>
                  {p.keywords_count?.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}