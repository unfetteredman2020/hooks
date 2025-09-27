import React from 'react';

const BasicComponent: React.FC = () => {
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#e8f5e8',
      border: '2px solid #4caf50',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      <h3>✅ Basic Component Loaded Successfully!</h3>
      <p>This component demonstrates:</p>
      <ul>
        <li>Dynamic import with loading state</li>
        <li>Error boundary handling</li>
        <li>Server-side rendering compatibility</li>
        <li>Configurable delay and timeout</li>
      </ul>
      <p>Loaded at: {new Date().toLocaleTimeString()}</p>
    </div>
  );
};

export default BasicComponent;