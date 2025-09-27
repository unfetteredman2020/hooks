import React from 'react';

const Settings: React.FC = () => {
  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#f8d7da',
      border: '2px solid #dc3545',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h4>⚙️ Settings</h4>
      <p>Configuration Panel</p>
      <div style={{ fontSize: '24px' }}>🔧</div>
    </div>
  );
};

export default Settings;