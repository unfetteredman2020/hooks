// 重新导出 desktop-kit 的组件，这样可以不用写完整路径
export { default as ClipboardText } from 'desktop-kit/components/clipboard-text/index.js';

// 如果有其他组件也可以在这里导出
// export { default as Button } from 'desktop-kit/components/button/index.js';
// export { default as Input } from 'desktop-kit/components/input/index.js';

// 或者创建一个命名空间导出
export * as DesktopKitComponents from 'desktop-kit/components/clipboard-text/index.js';