# Docusaurus 扁平化构建方案

这个项目实现了 Docusaurus 的扁平化构建功能，能够将所有构建产物输出到 dist 目录的根目录下，没有任何二级目录。

## 功能特点

- ✅ 所有 HTML 文件都被扁平化到根目录
- ✅ 自动更新所有内部链接
- ✅ 保持资源文件（CSS、JS、图片）的目录结构
- ✅ 支持 MDX 文件和 React 组件
- ✅ 处理深层嵌套的目录结构

## 使用方法

### 1. 安装依赖

```bash
npm install
```

### 2. 运行扁平化构建

```bash
npm run build:flat
```

这个命令会：
1. 执行标准的 Docusaurus 构建
2. 运行扁平化脚本，将所有文件重新组织到 dist 目录

### 3. 本地测试

```bash
npm run serve:flat
```

访问 http://localhost:3000 查看扁平化后的网站。

## 实现原理

### 文件名转换规则

- `index.html` → `index.html`（保持不变）
- `docs/intro/index.html` → `intro.html`
- `docs/nested/deep-nested/test-deep/index.html` → `nested-deep-nested-test-deep.html`
- `blog/welcome/index.html` → `blog-welcome.html`

### 链接更新

脚本会自动更新所有内部链接，例如：
- `/docs/intro` → `intro.html`
- `../` → 对应的扁平化文件名
- 资源路径（CSS、JS、图片）会被更新为相对于根目录的路径

### 项目结构

```
my-docusaurus-site/
├── scripts/
│   └── flattenBuild.js      # 扁平化构建脚本
├── docs/                    # 文档源文件
├── build/                   # 标准构建输出
└── dist/                    # 扁平化构建输出
    ├── index.html
    ├── intro.html
    ├── nested-deep-nested-test-deep.html
    ├── assets/              # CSS 和 JS 资源
    └── img/                 # 图片资源
```

## 配置说明

### docusaurus.config.ts

主要配置：
- 将文档路由设置为根路径：`routeBasePath: '/'`
- 更新所有链接以匹配新的路由结构

### 自定义修改

如果需要自定义扁平化规则，可以修改 `scripts/flattenBuild.js` 文件中的：
- `urlMappings` - URL 映射规则
- 文件名生成逻辑
- 链接更新规则

## 注意事项

1. **链接格式**：确保文档中的内部链接使用相对路径或绝对路径
2. **资源引用**：图片和其他静态资源应该使用正确的路径
3. **构建顺序**：必须先运行标准构建，再运行扁平化脚本
4. **浏览器兼容性**：扁平化不影响浏览器兼容性

## 故障排除

### 链接失效
如果发现链接失效，检查：
1. 原始文档中的链接格式是否正确
2. `flattenBuild.js` 中的 URL 映射是否完整

### 资源加载失败
如果 CSS、JS 或图片加载失败：
1. 检查资源路径是否正确更新
2. 确保 assets 和 img 目录被正确复制

### 构建失败
如果构建失败：
1. 确保先修复所有的断链（broken links）
2. 检查 Node.js 版本是否满足要求（>= 20.0）