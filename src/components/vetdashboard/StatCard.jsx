import React from 'react';

const StatCard = ({ label, value, highlighted }) => {
  return (
    <div style={{
      background: highlighted ? '#f0f5ff' : '#fff',
      border: highlighted ? '2px solid #4f8cff' : '1px solid #e5e7eb',
      borderRadius: 12,
      padding: '28px 0',
      flex: 1,
      textAlign: 'center',
      boxShadow: highlighted ? '0 2px 12px rgba(79,140,255,0.08)' : '0 1px 4px rgba(0,0,0,0.03)',
      color: highlighted ? '#4f8cff' : '#222',
      fontWeight: 600,
      fontSize: 18,
      transition: 'all 0.2s',
    }}>
      <div style={{ fontSize: 38, fontWeight: 700, marginBottom: 8 }}>{value}</div>
      <div style={{ fontSize: 16 }}>{label}</div>
    </div>
  );
};

export default StatCard; 