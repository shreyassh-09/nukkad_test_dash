import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TrafficChart({ data }) {
  return (
    <div className="chart-card">
      <div className="chart-header">Organic Search Traffic Trend</div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" vertical={false} />
            <XAxis dataKey="formattedDate" stroke="#888" tick={{ fontSize: 12 }} />
            <YAxis stroke="#888" tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#222', borderColor: '#444', color: '#fff', borderRadius: '6px' }} 
            />
            <Line 
              type="monotone" 
              dataKey="organic_traffic" 
              name="Organic Traffic"
              stroke="#50aef4" 
              strokeWidth={3}
              dot={{ fill: '#50aef4', r: 4 }}
              activeDot={{ r: 6 }} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}