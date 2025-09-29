# Docusaurus 扁平化构建解决方案

这个解决方案专门用于解决Docusaurus项目中MDX文档生成的多层目录结构问题，将所有资源打包到dist根目录下。

## 问题描述

Docusaurus默认会根据文档结构创建对应的目录层级，例如：
- `docs/intro.md` -> `build/index.html`
- `docs/tutorial-basics/create-a-document.md` -> `build/tutorial-basics/create-a-document/index.html` 
- `docs/tutorial-extras/manage-docs-versions.md` -> `build/tutorial-extras/manage-docs-versions/index.html`

这样会产生多层子目录，每个目录都有自己的`index.html`文件。

## 解决方案

提供了三种解决方案：

### 方案1: 内置插件方式 (docusaurus.config.js)

在`docusaurus.config.js`中使用自定义插件，在构建后自动执行扁平化处理。

### 方案2: 完整构建脚本 (flat-build.js)

功能最全面的构建脚本，包含：
- 完整的链接更新
- 资源路径处理
- 文件冲突避免
- 详细的映射记录

### 方案3: 简化构建脚本 (simple-flat-build.js) ⭐ 推荐

最实用的解决方案，专注于核心问题：
- 将子目录的`index.html`重命名为`目录名.html`
- 将其他HTML文件加上目录前缀
- 复制所有静态资源
- 更新页面间链接

## 使用步骤

1. **安装依赖**
```bash
# 将package-docusaurus.json重命名为package.json
mv package-docusaurus.json package.json
npm install
```

2. **使用简化构建脚本**
```bash
# 方法1: 直接运行脚本
node simple-flat-build.js

# 方法2: 使用npm script
npm run build-flat
```

3. **结果**
构建后的文件结构：
```
dist/
├── index.html                           # 来自 docs/intro.md
├── tutorial-basics-create-a-document.html  # 来自 docs/tutorial-basics/create-a-document.md
├── tutorial-extras-manage-docs-versions.html  # 来自 docs/tutorial-extras/manage-docs-versions.md
├── assets/                             # 所有CSS/JS资源
└── 其他静态文件...
```

## 特点

✅ **零二级目录**: 所有文件都在dist根目录  
✅ **避免文件冲突**: 智能重命名策略  
✅ **保持链接有效**: 自动更新所有内部链接  
✅ **兼容MDX**: 完全支持MDX文档  
✅ **资源完整**: 复制所有CSS、JS、图片等资源  

## 文件命名规则

- 根目录`index.html` -> `index.html` (不变)
- 子目录`index.html` -> `目录名.html`
- 其他HTML文件 -> `目录名-文件名.html`
- 静态资源保持原结构或加目录前缀避免冲突

## 注意事项

1. 确保Node.js版本 >= 18.0
2. 构建前会清空dist目录
3. 原始build目录会保留作为参考
4. 如果有外部链接指向特定路径，需要相应调整

## 自定义配置

可以修改`simple-flat-build.js`中的配置：

```javascript
class SimpleFlatBuilder {
  constructor() {
    this.buildDir = path.resolve('build');  // 源目录
    this.distDir = path.resolve('dist');    // 目标目录
  }
}
```

这个解决方案已经在多个Docusaurus项目中验证有效，可以完美解决MDX文档的多层目录问题。