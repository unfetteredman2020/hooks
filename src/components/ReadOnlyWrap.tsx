import React from 'react';

interface ReadOnlyWrapProps {
  children: React.ReactNode;
  readOnly?: boolean;
}

const ReadOnlyWrap: React.FC<ReadOnlyWrapProps> = ({ children, readOnly = false }) => {
  return (
    <div style={{ opacity: readOnly ? 0.6 : 1, pointerEvents: readOnly ? 'none' : 'auto' }}>
      {children}
    </div>
  );
};

export default ReadOnlyWrap;