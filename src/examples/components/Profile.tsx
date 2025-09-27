import React from 'react';

const Profile: React.FC = () => {
  return (
    <div style={{
      padding: '15px',
      backgroundColor: '#d4edda',
      border: '2px solid #28a745',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h4>👤 Profile</h4>
      <p>User Information</p>
      <div style={{ fontSize: '24px' }}>👨‍💻</div>
    </div>
  );
};

export default Profile;