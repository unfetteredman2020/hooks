# Docusaurus 扁平化构建指南

本指南说明如何配置Docusaurus项目，使所有构建的资源都放在`dist`根目录下，避免任何二级目录结构。

## 关键配置

### 1. 修改 docusaurus.config.ts

```typescript
const config: Config = {
  // ... 其他配置
  
  // 禁用尾部斜杠，确保所有页面都在根目录
  trailingSlash: false,
  
  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // 关键：配置文档路径，移除 /docs 前缀
          routeBasePath: '/',
          // ... 其他配置
        },
        // ... 其他配置
      },
    ],
  ],
  
  // ... 其他配置
};
```

### 2. 构建命令

使用以下命令构建到`dist`目录：

```bash
npm run build -- --out-dir dist
```

## 实现效果

### 构建前（默认行为）
```
dist/
├── docs/
│   ├── intro.html
│   ├── api/
│   │   └── index.html
│   └── guides/
│       ├── getting-started.html
│       └── configuration.html
└── index.html
```

### 构建后（扁平化结构）
```
dist/
├── intro.html
├── api.html
├── guides/
│   ├── getting-started.html
│   └── configuration.html
└── index.html
```

## 重要说明

1. **routeBasePath: '/'** - 这是关键配置，将文档从 `/docs` 路径移动到根路径
2. **trailingSlash: false** - 确保URL不包含尾部斜杠
3. **更新所有内部链接** - 需要将 `/docs/xxx` 更新为 `/xxx`
4. **更新导航配置** - 确保导航栏和页脚中的链接正确

## 文件结构示例

```
docs/
├── intro.md                    → dist/intro.html
├── api/
│   └── index.mdx              → dist/api.html
└── guides/
    ├── getting-started.mdx    → dist/guides/getting-started.html
    └── configuration.mdx      → dist/guides/configuration.html
```

## 注意事项

- 所有MDX文件都会按照其目录结构构建到对应的HTML文件
- 子目录中的`index.mdx`文件会构建为目录名的HTML文件
- 静态资源（CSS、JS、图片）仍然在`assets`目录中
- 博客文章仍然在`blog`目录中

这种配置确保了所有文档页面都在`dist`根目录下，满足了扁平化构建的需求。