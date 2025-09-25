const { features } = require("process");

const buildType = process.env.BUILD_TYPE;

module.exports = {
  title: "Desktop Kit", // 改为您的项目名称
  tagline: "助力开发者「更灵活」地搭建出「更美」的产品，让用户「快乐工作」～", // 改为您的标语
  url: "https://your-docusaurus-site.example.com", // 改为您的实际域名
  // 修正 baseUrl：根据您的部署需求选择
  baseUrl: "/",
  // 或者如果部署到 GitHub Pages 子路径：
  // baseUrl: buildType === "preview" ? "/" : "/desktop-kit/",

  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  future: {
    v4: true,
    experimental_faster: true,
  },
  // 修正组织名和项目名
  organizationName: "JT", // 改为您的 GitHub 用户名
  projectName: "desktop-kit", // 改为您的仓库名

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  themeConfig: {
    navbar: {
      title: "KIT", // 改为您的导航栏标题
      logo: {
        alt: "Desktop Kit Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/packages/intro",
          activeBasePath: "docs",
          label: "文档",
          position: "left",
        },
        {
          href: "https://github.com/JT/desktop-kit", // 改为您的仓库地址
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "文档",
          items: [
            {
              label: "入门指南",
              to: "docs/packages/intro",
            },
          ],
        },
        {
          title: "社区",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/JT/desktop-kit", // 改为您的仓库地址
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Desktop Kit. Built with Docusaurus.`,
    },
  },

  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.ts"),
          editUrl: "https://github.com/JT/desktop-kit/edit/main/", // 改为您的仓库地址
        },
        blog: {
          showReadingTime: true,
          editUrl: "https://github.com/JT/desktop-kit/edit/main/", // 改为您的仓库地址
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],

  themes: [
    [
      "@easyops-cn/docusaurus-search-local",
      {
        hashed: true,
        language: ["en", "zh"],
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
  ],

  // 添加自定义插件
  plugins: [
    // 方法 1: 使用外部插件文件
    './plugins/webpack-plugin',
    
    // 方法 2: 使用高级插件（带选项）
    ['./plugins/advanced-webpack-plugin', {
      // 插件选项
      enableAnalyzer: false,
    }],
    
    // 方法 3: 内联插件定义
    function myInlinePlugin(context, options) {
      return {
        name: 'inline-webpack-plugin',
        configureWebpack(config, isServer) {
          const webpack = require('webpack');
          return {
            plugins: [
              new webpack.BannerPlugin({
                banner: 'Desktop Kit - Built with Docusaurus',
                entryOnly: true,
              }),
            ],
          };
        },
      };
    },
  ],
};