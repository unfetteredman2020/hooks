import React from 'react';

interface ClipboardTextProps {
  text: string;
  onCopy?: () => void;
}

const ClipboardText: React.FC<ClipboardTextProps> = ({ text, onCopy }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    onCopy?.();
  };

  return (
    <div>
      <span>{text}</span>
      <button onClick={handleCopy}>Copy</button>
    </div>
  );
};

export default ClipboardText;