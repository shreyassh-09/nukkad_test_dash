import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrafficChart({ data }) {
  const [showOrganic, setShowOrganic] = useState(false);
  const [showPaid, setShowPaid] = useState(true);

  return (
    <div className="chart-card">
      <div className="chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Search Traffic Trend</span>
        <div style={{ display: 'flex', gap: '16px', fontWeight: 'normal' }}>
          <label className="custom-checkbox" style={{ color: '#50aef4' }}>
            <input type="checkbox" checked={showOrganic} onChange={(e) => setShowOrganic(e.target.checked)} /> Organic Traffic
          </label>
          <label className="custom-checkbox" style={{ color: '#ff8c43' }}>
            <input type="checkbox" checked={showPaid} onChange={(e) => setShowPaid(e.target.checked)} /> Paid Traffic
          </label>
        </div>
      </div>

      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis dataKey="formattedDate" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
            <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff', borderRadius: '6px' }} />
            
            {showOrganic && <Line type="stepAfter" dataKey="organic_traffic" name="Organic Traffic" stroke="#50aef4" strokeWidth={2} dot={false} />}
            {showPaid && <Line type="stepAfter" dataKey="paid_traffic" name="Paid Traffic" stroke="#ff8c43" strokeWidth={2} dot={false} />}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}