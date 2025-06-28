import React from 'react';
import Sidebar from './Sidebar';

const VetLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f7f8fa' }}>
      <Sidebar />
      <main style={{ 
        flex: 1, 
        padding: '32px 40px',
        marginLeft: '250px', // Same as sidebar width
        minHeight: '100vh',
        background: '#f7f8fa'
      }}>
        {children}
      </main>
    </div>
  );
};

export default VetLayout; 