import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = () => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      background: '#ffffff',
      borderRadius: '8px',
      padding: '8px 16px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      marginBottom: '24px',
      border: '1px solid #e5e7eb'
    }}>
      <FaSearch style={{ 
        color: '#9ca3af',
        marginRight: '12px',
        fontSize: '16px'
      }} />
      <input
        type="text"
        placeholder="Search anything..."
        style={{
          border: 'none',
          outline: 'none',
          width: '100%',
          fontSize: '14px',
          color: '#1f2937',
          background: 'transparent',
          '&::placeholder': {
            color: '#9ca3af'
          }
        }}
      />
    </div>
  );
};

export default SearchBar; 