const {themes} = require('prism-react-renderer');
const lightTheme = themes.github;
const darkTheme = themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'My Site',
  tagline: 'Dinosaurs are cool',
  favicon: 'img/favicon.ico',
  
  // Set the production url of your site here
  url: 'https://your-docusaurus-test-site.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // 关键配置：将docs路径设置为根路径
          routeBasePath: '/',
        },
        blog: false, // 禁用blog功能避免冲突
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      navbar: {
        title: 'My Site',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Tutorial',
          },
          {
            href: 'https://github.com/facebook/docusaurus',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Tutorial',
                to: '/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightTheme,
        darkTheme: darkTheme,
      },
    }),

  // 自定义webpack配置
  plugins: [
    function(context, options) {
      return {
        name: 'flat-structure-plugin',
        configureWebpack(config, isServer, utils) {
          return {
            plugins: [
              // 可以在这里添加自定义插件
            ],
          };
        },
        
        // 在构建完成后执行扁平化处理
        async postBuild({siteConfig, routesPaths, outDir}) {
          console.log('Post-build: Flattening directory structure...');
          
          const fs = require('fs-extra');
          const path = require('path');
          
          // 创建临时目录来存储扁平化的文件
          const tempDir = path.join(outDir, '../temp-flat');
          await fs.ensureDir(tempDir);
          
          // 收集所有HTML文件和资源
          async function collectFiles(dir, basePath = '') {
            const files = await fs.readdir(dir);
            
            for (const file of files) {
              const filePath = path.join(dir, file);
              const stat = await fs.stat(filePath);
              
              if (stat.isDirectory()) {
                // 递归处理子目录
                await collectFiles(filePath, path.join(basePath, file));
              } else {
                // 处理文件
                const relativePath = path.join(basePath, file);
                let targetName = file;
                
                // 如果是index.html，重命名为目录名.html
                if (file === 'index.html' && basePath) {
                  const dirName = basePath.replace(/[\/\\]/g, '-');
                  targetName = `${dirName}.html`;
                }
                // 如果是其他HTML文件且在子目录中，加上路径前缀
                else if (file.endsWith('.html') && basePath) {
                  const dirName = basePath.replace(/[\/\\]/g, '-');
                  targetName = `${dirName}-${file}`;
                }
                
                const targetPath = path.join(tempDir, targetName);
                await fs.copy(filePath, targetPath);
                
                // 如果是HTML文件，需要更新其中的链接
                if (file.endsWith('.html')) {
                  await updateHtmlLinks(targetPath, basePath);
                }
              }
            }
          }
          
          // 更新HTML文件中的链接
          async function updateHtmlLinks(filePath, originalPath) {
            let content = await fs.readFile(filePath, 'utf8');
            
            // 更新CSS和JS文件的路径为绝对路径
            content = content.replace(/href="([^"]*\.css)"/g, 'href="/$1"');
            content = content.replace(/src="([^"]*\.js)"/g, 'src="/$1"');
            
            // 更新文档间的链接
            content = content.replace(/href="\/([^"\/]*\/[^"]*)"/, (match, p1) => {
              const newPath = p1.replace(/\//g, '-');
              if (newPath.endsWith('/')) {
                return `href="/${newPath.slice(0, -1)}.html"`;
              }
              return `href="/${newPath}.html"`;
            });
            
            await fs.writeFile(filePath, content);
          }
          
          // 开始收集文件
          await collectFiles(outDir);
          
          // 将原构建目录备份并替换为扁平化结构
          const backupDir = path.join(outDir, '../build-backup');
          await fs.move(outDir, backupDir);
          await fs.move(tempDir, outDir);
          
          console.log('✅ Directory structure flattened successfully!');
        },
      };
    },
  ],
};

module.exports = config;