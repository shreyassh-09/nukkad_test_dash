import React from 'react';

export default function MetricCard({ title, value, suffix = '' }) {
  // Simple formatter for massive traffic numbers (e.g., 73200 -> 73.2K)
  const formatValue = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  return (
    <div className="widget-card">
      <div className="widget-title">{title}</div>
      <div className="widget-value">
        {typeof value === 'number' ? formatValue(value) : value} {suffix}
      </div>
    </div>
  );
}