import React, { useState, useEffect } from 'react';

const AdvancedComponent: React.FC = () => {
  const [counter, setCounter] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
    const timer = setInterval(() => {
      setCounter(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{
      padding: '20px',
      background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      borderRadius: '12px',
      margin: '10px 0',
      transform: isAnimated ? 'scale(1)' : 'scale(0.9)',
      transition: 'transform 0.3s ease-in-out',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
    }}>
      <h3>🎛️ Advanced Component</h3>
      <p>This component showcases advanced features:</p>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '15px', 
        marginTop: '15px' 
      }}>
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '10px', 
          borderRadius: '8px' 
        }}>
          <strong>🖱️ Hover Preloading</strong>
          <p>Component preloads on hover</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '10px', 
          borderRadius: '8px' 
        }}>
          <strong>🖥️ Client-Only</strong>
          <p>Renders only on client side</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '10px', 
          borderRadius: '8px' 
        }}>
          <strong>🎨 Custom Loading</strong>
          <p>Custom loading & error UI</p>
        </div>
        
        <div style={{ 
          backgroundColor: 'rgba(255,255,255,0.1)', 
          padding: '10px', 
          borderRadius: '8px' 
        }}>
          <strong>⏱️ Live Counter</strong>
          <p>Active for: {counter}s</p>
        </div>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: 'rgba(255,255,255,0.1)', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h4>🚀 React 19 Features Demonstrated</h4>
        <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '10px' }}>
          <span>✅ Pure Functions</span>
          <span>✅ SSR Compatible</span>
          <span>✅ Type Safe</span>
          <span>✅ Performance Optimized</span>
        </div>
      </div>
    </div>
  );
};

export default AdvancedComponent;