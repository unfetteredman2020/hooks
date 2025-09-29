#!/usr/bin/env node

/**
 * 简化版Docusaurus扁平化构建脚本
 * 
 * 这个脚本专门解决MDX文档在子目录中生成index.html的问题
 * 将所有页面都移动到dist根目录，并重命名避免冲突
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class SimpleFlatBuilder {
  constructor() {
    this.buildDir = path.resolve('build');
    this.distDir = path.resolve('dist');
    this.pageMapping = new Map(); // 原路径 -> 新文件名
  }

  async build() {
    try {
      console.log('🏗️ Building with Docusaurus...');
      
      // 1. 正常构建
      execSync('npm run build', { stdio: 'inherit' });
      
      // 2. 创建dist目录
      await fs.ensureDir(this.distDir);
      await fs.emptyDir(this.distDir);
      
      console.log('📁 Flattening structure...');
      
      // 3. 复制所有静态资源到根目录
      await this.copyStaticAssets();
      
      // 4. 处理HTML文件
      await this.processHtmlFiles();
      
      // 5. 更新链接
      await this.updateLinks();
      
      console.log('✅ Flat build completed!');
      
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      process.exit(1);
    }
  }

  async copyStaticAssets() {
    const assetsDir = path.join(this.buildDir, 'assets');
    if (await fs.pathExists(assetsDir)) {
      await fs.copy(assetsDir, path.join(this.distDir, 'assets'));
      console.log('📦 Copied assets directory');
    }

    // 复制其他静态文件（CSS, JS, images等）
    const items = await fs.readdir(this.buildDir);
    for (const item of items) {
      const itemPath = path.join(this.buildDir, item);
      const stat = await fs.stat(itemPath);
      
      if (!stat.isDirectory() || item === 'assets') {
        if (!stat.isDirectory()) {
          await fs.copy(itemPath, path.join(this.distDir, item));
          console.log(`📄 Copied ${item}`);
        }
        continue;
      }
      
      // 对于其他目录，需要检查是否包含静态资源
      await this.copyDirAssets(itemPath, item);
    }
  }

  async copyDirAssets(dirPath, dirName) {
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = await fs.stat(itemPath);
      
      if (stat.isDirectory()) {
        await this.copyDirAssets(itemPath, `${dirName}-${item}`);
      } else if (!item.endsWith('.html')) {
        // 复制非HTML文件，添加目录前缀避免冲突
        const targetName = `${dirName}-${item}`;
        await fs.copy(itemPath, path.join(this.distDir, targetName));
        console.log(`📄 Copied ${dirName}/${item} -> ${targetName}`);
      }
    }
  }

  async processHtmlFiles() {
    await this.findHtmlFiles(this.buildDir, '');
  }

  async findHtmlFiles(dir, relativePath) {
    const items = await fs.readdir(dir);
    
    for (const item of items) {
      const itemPath = path.join(dir, item);
      const currentRelativePath = relativePath ? `${relativePath}/${item}` : item;
      const stat = await fs.stat(itemPath);
      
      if (stat.isDirectory()) {
        await this.findHtmlFiles(itemPath, currentRelativePath);
      } else if (item.endsWith('.html')) {
        await this.processHtmlFile(itemPath, currentRelativePath);
      }
    }
  }

  async processHtmlFile(filePath, relativePath) {
    let targetName;
    const fileName = path.basename(relativePath);
    const dirPath = path.dirname(relativePath);
    
    if (fileName === 'index.html') {
      if (dirPath === '.') {
        targetName = 'index.html'; // 根目录index保持不变
      } else {
        // 子目录的index.html重命名
        targetName = `${dirPath.replace(/\//g, '-')}.html`;
      }
    } else {
      if (dirPath === '.') {
        targetName = fileName; // 根目录其他html文件保持不变
      } else {
        // 子目录的其他html文件加前缀
        targetName = `${dirPath.replace(/\//g, '-')}-${fileName}`;
      }
    }
    
    const targetPath = path.join(this.distDir, targetName);
    await fs.copy(filePath, targetPath);
    
    // 记录映射关系
    this.pageMapping.set(relativePath, targetName);
    
    console.log(`📄 ${relativePath} -> ${targetName}`);
  }

  async updateLinks() {
    console.log('🔗 Updating links...');
    
    const htmlFiles = await fs.readdir(this.distDir);
    
    for (const file of htmlFiles) {
      if (file.endsWith('.html')) {
        await this.updateHtmlLinks(path.join(this.distDir, file));
      }
    }
  }

  async updateHtmlLinks(filePath) {
    let content = await fs.readFile(filePath, 'utf8');
    
    // 更新页面链接
    for (const [originalPath, newFileName] of this.pageMapping.entries()) {
      // 生成可能的URL格式
      const possibleUrls = [
        `/${originalPath}`,
        `/${originalPath.replace('index.html', '')}`,
        `/${path.dirname(originalPath)}/`,
        `/${path.dirname(originalPath)}`
      ].filter((url, index, arr) => arr.indexOf(url) === index); // 去重

      for (const url of possibleUrls) {
        const cleanUrl = url.replace(/\/$/, '') || '/';
        const regex = new RegExp(`href="${cleanUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g');
        content = content.replace(regex, `href="/${newFileName}"`);
      }
    }
    
    // 确保资源路径正确
    content = content.replace(/href="([^"]*\.(css|js))"/g, (match, url) => {
      if (url.startsWith('http') || url.startsWith('//')) return match;
      return `href="/${url.replace(/^\/+/, '')}"`;
    });
    
    content = content.replace(/src="([^"]*\.(js|css|png|jpg|jpeg|gif|svg|ico))"/g, (match, url) => {
      if (url.startsWith('http') || url.startsWith('//')) return match;
      return `src="/${url.replace(/^\/+/, '')}"`;
    });
    
    await fs.writeFile(filePath, content);
  }
}

// 运行脚本
if (require.main === module) {
  const builder = new SimpleFlatBuilder();
  builder.build();
}

module.exports = SimpleFlatBuilder;