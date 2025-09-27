import React from 'react';

const SimpleComponent: React.FC = () => {
  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#fff3cd',
      border: '2px solid #ffc107',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3>⚡ Simple Component</h3>
      <p>This is a minimally configured dynamic import example.</p>
      <p>Perfect for quick setups with default behaviors.</p>
    </div>
  );
};

export default SimpleComponent;