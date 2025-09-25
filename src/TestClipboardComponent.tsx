import React from 'react';
// This import should now work without the file extension
import ClipboardText from 'desktop-kit/components/clipboard-text/index';

const TestClipboardComponent: React.FC = () => {
  return (
    <div>
      <h2>Test Clipboard Component</h2>
      <ClipboardText 
        text="Hello, World!" 
        onCopy={() => console.log('Text copied!')} 
      />
    </div>
  );
};

export default TestClipboardComponent;