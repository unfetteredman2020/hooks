#!/usr/bin/env node

/**
 * 自定义构建脚本 - 将Docusaurus构建输出扁平化
 * 
 * 使用方法: node flat-build.js
 * 
 * 这个脚本会：
 * 1. 执行正常的docusaurus build
 * 2. 将所有生成的HTML文件移动到根目录
 * 3. 重命名子目录中的index.html文件
 * 4. 更新所有链接引用
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class DocusaurusFlatBuilder {
  constructor(buildDir = 'build', outputDir = 'dist') {
    this.buildDir = path.resolve(buildDir);
    this.outputDir = path.resolve(outputDir);
    this.fileMap = new Map(); // 原路径 -> 新路径的映射
  }

  async build() {
    try {
      console.log('🏗️ Starting Docusaurus build...');
      
      // 1. 执行正常的docusaurus构建
      execSync('npm run build', { stdio: 'inherit' });
      
      console.log('📁 Flattening directory structure...');
      
      // 2. 创建输出目录
      await fs.ensureDir(this.outputDir);
      await fs.emptyDir(this.outputDir);
      
      // 3. 收集和处理所有文件
      await this.collectAndFlattenFiles(this.buildDir);
      
      // 4. 更新所有HTML文件中的链接
      await this.updateAllLinks();
      
      console.log('✅ Build completed! All files are now in the dist directory root.');
      console.log(`📊 Processed ${this.fileMap.size} files`);
      
    } catch (error) {
      console.error('❌ Build failed:', error.message);
      process.exit(1);
    }
  }

  async collectAndFlattenFiles(sourceDir, relativePath = '') {
    const items = await fs.readdir(sourceDir);
    
    for (const item of items) {
      const sourcePath = path.join(sourceDir, item);
      const stat = await fs.stat(sourcePath);
      const currentRelativePath = path.join(relativePath, item);
      
      if (stat.isDirectory()) {
        // 递归处理子目录
        await this.collectAndFlattenFiles(sourcePath, currentRelativePath);
      } else {
        await this.processFile(sourcePath, currentRelativePath);
      }
    }
  }

  async processFile(sourcePath, relativePath) {
    const fileName = path.basename(relativePath);
    const dirPath = path.dirname(relativePath);
    
    let targetFileName = fileName;
    
    // 特殊处理规则
    if (fileName === 'index.html') {
      if (dirPath === '.') {
        // 根目录的index.html保持不变
        targetFileName = 'index.html';
      } else {
        // 子目录的index.html重命名为 目录名.html
        const dirName = dirPath.replace(/[\/\\]/g, '-');
        targetFileName = `${dirName}.html`;
      }
    } else if (fileName.endsWith('.html') && dirPath !== '.') {
      // 其他HTML文件加上路径前缀
      const dirName = dirPath.replace(/[\/\\]/g, '-');
      targetFileName = `${dirName}-${fileName}`;
    } else if (dirPath !== '.') {
      // 非HTML文件，如果在子目录中，也可以选择加前缀或保持原名
      // 这里我们保持原文件名，但需要注意可能的冲突
      if (this.hasNameConflict(targetFileName)) {
        const dirName = dirPath.replace(/[\/\\]/g, '-');
        const ext = path.extname(fileName);
        const nameWithoutExt = path.basename(fileName, ext);
        targetFileName = `${dirName}-${nameWithoutExt}${ext}`;
      }
    }
    
    const targetPath = path.join(this.outputDir, targetFileName);
    
    // 复制文件
    await fs.copy(sourcePath, targetPath);
    
    // 记录映射关系
    this.fileMap.set(relativePath, targetFileName);
    
    console.log(`📄 ${relativePath} -> ${targetFileName}`);
  }

  hasNameConflict(fileName) {
    // 检查是否已存在同名文件
    return Array.from(this.fileMap.values()).includes(fileName);
  }

  async updateAllLinks() {
    console.log('🔗 Updating links in HTML files...');
    
    const htmlFiles = Array.from(this.fileMap.values()).filter(f => f.endsWith('.html'));
    
    for (const htmlFile of htmlFiles) {
      await this.updateHtmlFile(path.join(this.outputDir, htmlFile));
    }
  }

  async updateHtmlFile(filePath) {
    let content = await fs.readFile(filePath, 'utf8');
    
    // 更新资源路径
    content = this.updateResourcePaths(content);
    
    // 更新页面间链接
    content = this.updatePageLinks(content);
    
    await fs.writeFile(filePath, content);
  }

  updateResourcePaths(content) {
    // 更新CSS文件路径
    content = content.replace(/href="([^"]*\.css)"/g, (match, url) => {
      if (url.startsWith('http') || url.startsWith('//')) return match;
      const cleanUrl = url.replace(/^\/+/, '');
      return `href="/${cleanUrl}"`;
    });
    
    // 更新JS文件路径
    content = content.replace(/src="([^"]*\.js)"/g, (match, url) => {
      if (url.startsWith('http') || url.startsWith('//')) return match;
      const cleanUrl = url.replace(/^\/+/, '');
      return `src="/${cleanUrl}"`;
    });
    
    // 更新图片和其他资源路径
    content = content.replace(/(src|href)="([^"]*\.(png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))"/g, (match, attr, url) => {
      if (url.startsWith('http') || url.startsWith('//')) return match;
      const cleanUrl = url.replace(/^\/+/, '');
      return `${attr}="/${cleanUrl}"`;
    });
    
    return content;
  }

  updatePageLinks(content) {
    // 查找所有原始路径到新文件名的映射
    const reversedMap = new Map();
    for (const [originalPath, newFileName] of this.fileMap.entries()) {
      if (newFileName.endsWith('.html')) {
        // 创建可能的URL格式
        const url1 = '/' + originalPath.replace(/\\/g, '/').replace('index.html', '');
        const url2 = '/' + originalPath.replace(/\\/g, '/');
        reversedMap.set(url1.replace(/\/$/, '') || '/', newFileName);
        reversedMap.set(url2, newFileName);
      }
    }
    
    // 更新链接
    content = content.replace(/href="([^"#]*)"/g, (match, url) => {
      if (url.startsWith('http') || url.startsWith('//') || url.startsWith('#')) {
        return match;
      }
      
      // 清理URL
      const cleanUrl = url.replace(/\/$/, '') || '/';
      
      if (reversedMap.has(cleanUrl)) {
        return `href="/${reversedMap.get(cleanUrl)}"`;
      }
      
      return match;
    });
    
    return content;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  const builder = new DocusaurusFlatBuilder();
  builder.build();
}

module.exports = DocusaurusFlatBuilder;