# Docusaurus 扁平化构建解决方案

这个解决方案专门用于解决Docusaurus项目中MDX文档生成的多层目录结构问题，将所有资源打包到dist根目录下。

## 问题描述

Docusaurus默认会根据文档结构创建对应的目录层级，例如：
- `docs/intro.md` -> `build/index.html`
- `docs/tutorial-basics/create-a-document.md` -> `build/tutorial-basics/create-a-document/index.html` 
- `docs/tutorial-extras/manage-docs-versions.md` -> `build/tutorial-extras/manage-docs-versions/index.html`

这样会产生多层子目录，每个目录都有自己的`index.html`文件，不符合需要所有资源在根目录的需求。

## ⭐ 推荐解决方案：build-flat.js

经过测试和优化的最佳解决方案，已修复所有已知问题。

## 快速使用

### 方法1: 一键构建（推荐）
```bash
# 直接构建并扁平化
npm run build-flat
```

### 方法2: 分步执行
```bash
# 1. 先正常构建
npm run build

# 2. 再扁平化处理
npm run build-flat-only
```

### 方法3: 直接运行脚本
```bash
# 构建并扁平化
node build-flat.js --build

# 仅扁平化（需要先有build目录）
node build-flat.js
```

## 构建结果

扁平化后的文件结构：
```
dist/
├── index.html                                    # 来自根目录docs
├── tutorial-basics-create-a-document.html        # 来自子目录
├── tutorial-extras-manage-docs-versions.html     # 来自子目录
├── assets/                                      # CSS/JS等资源
│   ├── css/
│   └── js/
└── 其他静态文件...
```

## 功能特点

✅ **完全扁平**: 所有HTML页面都在dist根目录  
✅ **智能重命名**: 避免文件名冲突  
✅ **链接自动更新**: 页面间链接自动修复  
✅ **资源完整保留**: CSS、JS、图片等资源完整复制  
✅ **MDX完全兼容**: 支持所有MDX特性  
✅ **错误处理**: 完善的错误检查和提示  

## 文件重命名规则

| 原始路径 | 扁平化后 |
|---------|---------|
| `build/index.html` | `dist/index.html` |
| `build/tutorial-basics/create-a-document/index.html` | `dist/tutorial-basics-create-a-document.html` |
| `build/tutorial-extras/manage-docs-versions/index.html` | `dist/tutorial-extras-manage-docs-versions.html` |
| `build/assets/css/styles.css` | `dist/assets/css/styles.css` |

## 测试构建

```bash
# 启动本地服务器测试扁平化结果
npm run serve-flat

# 访问 http://localhost:3001 查看效果
```

## 故障排除

### 1. 构建错误 `plugin.apply is not a function`
**原因**: Docusaurus配置中的自定义插件格式不正确  
**解决**: 使用修复后的`docusaurus.config.js`，已移除有问题的插件

### 2. `build目录不存在`
**原因**: 没有先运行Docusaurus构建  
**解决**: 
```bash
npm run build  # 或者
node build-flat.js --build
```

### 3. 链接失效
**原因**: 页面间链接没有正确更新  
**解决**: 脚本会自动处理所有链接更新，如有遗漏请检查控制台输出

### 4. 静态资源加载失败
**原因**: 资源路径配置问题  
**解决**: 检查`baseUrl`配置，确保设置为`/`

## 配置选项

可以在`build-flat.js`中自定义：

```javascript
class FlatBuilder {
  constructor() {
    this.buildDir = path.resolve('build');     // 源构建目录
    this.distDir = path.resolve('dist');       // 扁平化输出目录
    this.urlMapping = new Map();              // URL映射表
  }
}
```

## Docusaurus配置要点

确保你的`docusaurus.config.js`包含：

```javascript
module.exports = {
  baseUrl: '/',                    // 重要：设置为根路径
  trailingSlash: false,           // 可选：不使用尾部斜杠
  
  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',      // 将文档设置为根路径
        },
        blog: false,              // 如果不需要博客功能
      },
    ],
  ],
};
```

## 版本兼容性

- ✅ Docusaurus 3.x
- ✅ Node.js 18+
- ✅ 支持MDX
- ✅ 支持所有主题

这个解决方案经过实际项目验证，可以完美解决MDX文档的多层目录结构问题，同时保持所有功能正常工作。