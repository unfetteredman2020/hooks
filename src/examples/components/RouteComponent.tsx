import React from 'react';

const RouteComponent: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#e2e3e5',
      border: '2px solid #6c757d',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3>🛣️ Route Component</h3>
      <p>This component is optimized for routing scenarios:</p>
      <ul>
        <li>Automatic idle-time preloading</li>
        <li>Route-level code splitting</li>
        <li>Enhanced user experience</li>
      </ul>
      <div style={{ 
        marginTop: '15px', 
        padding: '10px', 
        backgroundColor: '#f8f9fa',
        borderRadius: '4px'
      }}>
        <strong>🎯 Use Case:</strong> Perfect for React Router lazy loading
      </div>
    </div>
  );
};

export default RouteComponent;