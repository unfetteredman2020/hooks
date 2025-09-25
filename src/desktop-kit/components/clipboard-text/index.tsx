import React from 'react';

export interface ClipboardTextProps {
  text: string;
  onCopy?: () => void;
}

const ClipboardText: React.FC<ClipboardTextProps> = ({ text, onCopy }) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      onCopy?.();
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <div className="clipboard-text">
      <span>{text}</span>
      <button onClick={handleCopy}>Copy</button>
    </div>
  );
};

export default ClipboardText;