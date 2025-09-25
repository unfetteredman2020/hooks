import React from 'react';
// This import should work without the .tsx extension
import ClipboardText from 'desktop-kit/components/clipboard-text/index';

const TestImport: React.FC = () => {
  return (
    <div>
      <h1>Testing Import Without Extension</h1>
      <ClipboardText text="Hello, World!" onCopy={() => console.log('Copied!')} />
    </div>
  );
};

export default TestImport;