// Type declarations for desktop-kit package
declare module 'desktop-kit/components/clipboard-text' {
  interface ClipboardTextProps {
    text: string;
    children?: React.ReactNode;
    onCopy?: () => void;
    className?: string;
    // 根据实际组件的 props 添加更多类型
  }
  
  const ClipboardText: React.FC<ClipboardTextProps>;
  export default ClipboardText;
}

// 为其他组件添加类型声明
declare module 'desktop-kit/components/button' {
  interface ButtonProps {
    onClick?: () => void;
    children?: React.ReactNode;
    variant?: 'primary' | 'secondary';
    disabled?: boolean;
  }
  
  const Button: React.FC<ButtonProps>;
  export default Button;
}

// 通用声明（如果你不想为每个组件单独声明）
declare module 'desktop-kit/components/*' {
  const Component: React.ComponentType<any>;
  export default Component;
}