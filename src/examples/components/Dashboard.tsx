import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#cce5ff',
      border: '2px solid #007bff',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h4>📊 Dashboard</h4>
      <p>Analytics & Reports</p>
      <div style={{ fontSize: '24px' }}>📈</div>
    </div>
  );
};

export default Dashboard;