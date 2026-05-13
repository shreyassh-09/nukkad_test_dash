import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function KeywordsChart({ data }) {
  const [activeTab, setActiveTab] = useState('organic');
  const [layers, setLayers] = useState({ top3: true, top10: true, top20: true, top50: true, top100: true });

  const toggleLayer = (key) => setLayers(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="chart-card">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
        <div className="chart-header" style={{ margin: 0 }}>Keywords Footprint</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', backgroundColor: '#141414', padding: '2px', borderRadius: '6px', border: '1px solid #2a2a2a' }}>
            <button onClick={() => setActiveTab('organic')} style={{ padding: '4px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', backgroundColor: activeTab === 'organic' ? '#008ff8' : 'transparent', color: activeTab === 'organic' ? '#fff' : '#888' }}>Organic</button>
            <button onClick={() => setActiveTab('paid')} style={{ padding: '4px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', backgroundColor: activeTab === 'paid' ? '#008ff8' : 'transparent', color: activeTab === 'paid' ? '#fff' : '#888' }}>Paid</button>
          </div>

          {activeTab === 'organic' ? (
            <div style={{ display: 'flex', gap: '12px' }}>
              <label className="custom-checkbox" style={{ color: '#FDC23C' }}><input type="checkbox" checked={layers.top3} onChange={() => toggleLayer('top3')} /> Top 3</label>
              <label className="custom-checkbox" style={{ color: '#006DCA' }}><input type="checkbox" checked={layers.top10} onChange={() => toggleLayer('top10')} /> 4-10</label>
              <label className="custom-checkbox" style={{ color: '#008FF8' }}><input type="checkbox" checked={layers.top20} onChange={() => toggleLayer('top20')} /> 11-20</label>
              <label className="custom-checkbox" style={{ color: '#2BB3FF' }}><input type="checkbox" checked={layers.top50} onChange={() => toggleLayer('top50')} /> 21-50</label>
              <label className="custom-checkbox" style={{ color: '#8ECDFF' }}><input type="checkbox" checked={layers.top100} onChange={() => toggleLayer('top100')} /> 51-100</label>
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: '#ff8c43' }}>Displaying historical Paid Search metrics context</div>
          )}
        </div>
      </div>

      <div style={{ width: '100%', height: 280 }}>
        <ResponsiveContainer>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis dataKey="formattedDate" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff', borderRadius: '6px' }} />
            
            {activeTab === 'organic' ? (
              <>
                {layers.top100 && <Area type="monotone" dataKey="top_100" name="Pos 51-100" stackId="1" stroke="#8ECDFF" fill="#8ECDFF" />}
                {layers.top50 && <Area type="monotone" dataKey="top_50" name="Pos 21-50" stackId="1" stroke="#2BB3FF" fill="#2BB3FF" />}
                {layers.top20 && <Area type="monotone" dataKey="top_20" name="Pos 11-20" stackId="1" stroke="#008FF8" fill="#008FF8" />}
                {layers.top10 && <Area type="monotone" dataKey="top_10" name="Pos 4-10" stackId="1" stroke="#006DCA" fill="#006DCA" />}
                {layers.top3 && <Area type="monotone" dataKey="top_3" name="Top 3" stackId="1" stroke="#FDC23C" fill="#FDC23C" />}
              </>
            ) : (
              <Area type="stepAfter" dataKey="paid_traffic" name="Paid Ads Volume" fill="#ff8c43" stroke="#ff8c43" fillOpacity={0.2} />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}