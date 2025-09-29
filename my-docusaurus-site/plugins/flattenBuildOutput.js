const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');

module.exports = function (context, options) {
  return {
    name: 'flatten-build-output',
    
    // 在构建完成后执行
    async postBuild({ siteDir, outDir }) {
      console.log('开始扁平化构建输出...');
      
      // 临时目录，用于存储扁平化后的文件
      const tempDir = path.join(siteDir, '.docusaurus-temp-flat');
      await fs.ensureDir(tempDir);
      
      try {
        // 查找所有HTML文件
        const htmlFiles = glob.sync('**/*.html', {
          cwd: outDir,
          absolute: false,
        });
        
        // 处理每个HTML文件
        for (const htmlFile of htmlFiles) {
          const originalPath = path.join(outDir, htmlFile);
          const fileContent = await fs.readFile(originalPath, 'utf-8');
          
          // 生成新的文件名（将路径转换为文件名）
          let newFileName;
          if (htmlFile === 'index.html') {
            newFileName = 'index.html';
          } else if (htmlFile.endsWith('/index.html')) {
            // 将目录路径转换为文件名，例如：docs/intro/index.html -> docs-intro.html
            const dirPath = htmlFile.slice(0, -11); // 移除 '/index.html'
            newFileName = dirPath.replace(/\//g, '-') + '.html';
          } else {
            // 其他HTML文件，保持原名但移除路径
            newFileName = path.basename(htmlFile);
          }
          
          // 修正HTML中的资源引用路径
          let modifiedContent = fileContent;
          
          // 修正CSS和JS引用
          modifiedContent = modifiedContent.replace(
            /(href|src)="(\.\.\/)*assets\//g,
            '$1="assets/'
          );
          
          // 修正图片引用
          modifiedContent = modifiedContent.replace(
            /(href|src)="(\.\.\/)*img\//g,
            '$1="img/'
          );
          
          // 修正其他静态资源引用
          modifiedContent = modifiedContent.replace(
            /(href|src)="(\.\.\/)+(.*?)"/g,
            (match, attr, dots, path) => {
              // 如果是绝对路径或外部链接，保持不变
              if (path.startsWith('http') || path.startsWith('//') || path.startsWith('/')) {
                return match;
              }
              // 否则转换为相对于根目录的路径
              return `${attr}="${path}"`;
            }
          );
          
          // 修正内部链接
          modifiedContent = modifiedContent.replace(
            /href="\/docs\/(.*?)"/g,
            (match, path) => {
              const newPath = 'docs-' + path.replace(/\//g, '-');
              // 移除末尾的斜杠（如果有）
              const cleanPath = newPath.endsWith('/') ? newPath.slice(0, -1) : newPath;
              return `href="${cleanPath}.html"`;
            }
          );
          
          // 修正博客链接
          modifiedContent = modifiedContent.replace(
            /href="\/blog\/(.*?)"/g,
            (match, path) => {
              const newPath = 'blog-' + path.replace(/\//g, '-');
              const cleanPath = newPath.endsWith('/') ? newPath.slice(0, -1) : newPath;
              return `href="${cleanPath}.html"`;
            }
          );
          
          // 写入到临时目录
          await fs.writeFile(path.join(tempDir, newFileName), modifiedContent);
          console.log(`处理文件: ${htmlFile} -> ${newFileName}`);
        }
        
        // 复制所有非HTML资源（CSS、JS、图片等）
        const nonHtmlFiles = glob.sync('**/*', {
          cwd: outDir,
          absolute: false,
          nodir: true,
          ignore: ['**/*.html'],
        });
        
        for (const file of nonHtmlFiles) {
          const originalPath = path.join(outDir, file);
          const destPath = path.join(tempDir, file);
          
          // 确保目标目录存在
          await fs.ensureDir(path.dirname(destPath));
          
          // 复制文件
          await fs.copy(originalPath, destPath);
        }
        
        // 清空原输出目录
        await fs.emptyDir(outDir);
        
        // 将临时目录内容移动到输出目录
        await fs.copy(tempDir, outDir);
        
        // 删除临时目录
        await fs.remove(tempDir);
        
        console.log('构建输出扁平化完成！');
        
      } catch (error) {
        console.error('扁平化构建输出时出错:', error);
        // 清理临时目录
        await fs.remove(tempDir);
        throw error;
      }
    },
    
    // 配置webpack以支持扁平化输出
    configureWebpack(config, isServer, utils) {
      return {
        output: {
          // 将所有chunk输出到根目录
          chunkFilename: '[name].[contenthash].js',
          filename: '[name].[contenthash].js',
        },
        optimization: {
          // 配置代码分割
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // 将所有vendor代码合并到一个文件
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendor',
                priority: 10,
              },
              // 将所有公共代码合并到一个文件
              common: {
                minChunks: 2,
                priority: 5,
                reuseExistingChunk: true,
              },
            },
          },
        },
      };
    },
  };
};