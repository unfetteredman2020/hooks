declare module 'desktop-kit/components/clipboard-text/index' {
  export interface ClipboardTextProps {
    // 根据实际组件属性定义
    text?: string;
    onCopy?: (text: string) => void;
    children?: React.ReactNode;
  }
  
  const ClipboardText: React.FC<ClipboardTextProps>;
  export default ClipboardText;
}

declare module 'desktop-kit/components/clipboard-text' {
  export interface ClipboardTextProps {
    text?: string;
    onCopy?: (text: string) => void;
    children?: React.ReactNode;
  }
  
  const ClipboardText: React.FC<ClipboardTextProps>;
  export default ClipboardText;
}

declare module 'desktop-kit/*' {
  const content: any;
  export default content;
}