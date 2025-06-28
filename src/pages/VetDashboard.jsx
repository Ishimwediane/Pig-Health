import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import StatCard from '../components/dashboard/StatCard';
import LineChartWidget from '../components/dashboard/LineChartWidget';
import BarChartWidget from '../components/dashboard/BarChartWidget';
import DonutChartWidget from '../components/dashboard/DonutChartWidget';
import RecentActivity from '../components/dashboard/RecentActivity';
import SearchBar from '../components/dashboard/SearchBar';

const VetDashboard = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f8fa' }}>
      <Sidebar />
      {/* Main content */}
      <main style={{ 
        flex: 1, 
        padding: '32px 40px',
        marginLeft: '250px' // Same as sidebar width
      }}>
        <SearchBar />
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          <StatCard label="Pigs Under Care" value={156} />
          <StatCard label="Assigned Farmers" value={23} highlighted />
          <StatCard label="Pending Requests" value={8} />
          <StatCard label="Upcoming Appointments" value={12} />
        </div>
        <div style={{ display: 'flex', gap: 24, marginBottom: 32 }}>
          <div style={{ flex: 1 }}><LineChartWidget /></div>
          <div style={{ flex: 1 }}><BarChartWidget /></div>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          <div style={{ flex: 1 }}><RecentActivity /></div>
          <div style={{ flex: 1 }}><DonutChartWidget /></div>
        </div>
      </main>
    </div>
  );
};

export default VetDashboard; 