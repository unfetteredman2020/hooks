#!/usr/bin/env node

/**
 * Docusaurus扁平化构建脚本 - 修复版
 * 专门解决MDX文档在子目录中生成多层结构的问题
 * 
 * 使用方法：
 * 1. 先运行正常构建: npm run build 或 docusaurus build
 * 2. 然后运行此脚本: node build-flat.js
 * 
 * 或者直接运行: node build-flat.js --build
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class FlatBuilder {
  constructor() {
    this.buildDir = path.resolve('build');
    this.distDir = path.resolve('dist');
    this.urlMapping = new Map(); // 原始URL -> 新文件名的映射
  }

  async run() {
    try {
      // 检查是否需要先构建
      const shouldBuild = process.argv.includes('--build');
      
      if (shouldBuild) {
        console.log('🏗️  开始Docusaurus构建...');
        execSync('npx docusaurus build', { stdio: 'inherit' });
      }

      // 检查build目录是否存在
      if (!(await fs.pathExists(this.buildDir))) {
        throw new Error(`构建目录 ${this.buildDir} 不存在。请先运行 'npx docusaurus build'`);
      }

      console.log('📁 开始扁平化目录结构...');

      // 清空并创建dist目录
      await fs.ensureDir(this.distDir);
      await fs.emptyDir(this.distDir);

      // 处理所有文件
      await this.processDirectory(this.buildDir, '');

      // 更新所有HTML文件中的链接
      await this.updateAllLinks();

      console.log('✅ 扁平化构建完成！');
      console.log(`📁 输出目录: ${this.distDir}`);
      console.log(`📊 处理了 ${this.urlMapping.size} 个页面`);

    } catch (error) {
      console.error('❌ 构建失败:', error.message);
      process.exit(1);
    }
  }

  async processDirectory(sourceDir, relativePath) {
    const items = await fs.readdir(sourceDir);

    for (const item of items) {
      const itemPath = path.join(sourceDir, item);
      const currentRelativePath = relativePath ? `${relativePath}/${item}` : item;
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory()) {
        await this.processDirectory(itemPath, currentRelativePath);
      } else {
        await this.processFile(itemPath, currentRelativePath);
      }
    }
  }

  async processFile(sourcePath, relativePath) {
    const fileName = path.basename(relativePath);
    const dirPath = path.dirname(relativePath);

    if (fileName.endsWith('.html')) {
      await this.processHtmlFile(sourcePath, relativePath, dirPath, fileName);
    } else {
      await this.processAssetFile(sourcePath, relativePath);
    }
  }

  async processHtmlFile(sourcePath, relativePath, dirPath, fileName) {
    let targetFileName;
    let originalUrl;

    if (fileName === 'index.html') {
      if (dirPath === '.') {
        // 根目录的index.html
        targetFileName = 'index.html';
        originalUrl = '/';
      } else {
        // 子目录的index.html -> 目录名.html
        const cleanDirPath = dirPath.replace(/\//g, '-');
        targetFileName = `${cleanDirPath}.html`;
        originalUrl = `/${dirPath}/`;
      }
    } else {
      if (dirPath === '.') {
        // 根目录的其他HTML文件
        targetFileName = fileName;
        originalUrl = `/${fileName}`;
      } else {
        // 子目录的其他HTML文件
        const cleanDirPath = dirPath.replace(/\//g, '-');
        targetFileName = `${cleanDirPath}-${fileName}`;
        originalUrl = `/${dirPath}/${fileName}`;
      }
    }

    // 复制文件
    const targetPath = path.join(this.distDir, targetFileName);
    await fs.copy(sourcePath, targetPath);

    // 记录URL映射
    this.urlMapping.set(originalUrl, targetFileName);
    this.urlMapping.set(originalUrl.replace(/\/$/, ''), targetFileName); // 同时记录不带尾部斜杠的版本

    console.log(`📄 ${relativePath} -> ${targetFileName}`);
  }

  async processAssetFile(sourcePath, relativePath) {
    // 对于非HTML文件，保持原有的目录结构或者根据需要进行调整
    const targetPath = path.join(this.distDir, relativePath);
    
    // 确保目标目录存在
    await fs.ensureDir(path.dirname(targetPath));
    await fs.copy(sourcePath, targetPath);

    // 如果是根目录的资源文件，也可以选择直接复制到根目录
    if (path.dirname(relativePath) === '.' || relativePath.startsWith('assets/')) {
      console.log(`📦 ${relativePath} -> ${relativePath}`);
    }
  }

  async updateAllLinks() {
    console.log('🔗 更新页面链接...');

    const htmlFiles = await this.getHtmlFiles(this.distDir);

    for (const htmlFile of htmlFiles) {
      await this.updateHtmlFileLinks(htmlFile);
    }
  }

  async getHtmlFiles(dir) {
    const files = [];
    const items = await fs.readdir(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = await fs.stat(itemPath);

      if (stat.isDirectory()) {
        const subFiles = await this.getHtmlFiles(itemPath);
        files.push(...subFiles);
      } else if (item.endsWith('.html')) {
        files.push(itemPath);
      }
    }

    return files;
  }

  async updateHtmlFileLinks(filePath) {
    let content = await fs.readFile(filePath, 'utf8');

    // 更新页面间的链接
    for (const [originalUrl, newFileName] of this.urlMapping.entries()) {
      // 创建正则表达式来匹配链接
      const patterns = [
        `href="${originalUrl}"`,
        `href="${originalUrl}/"`,
        `href="${originalUrl.replace(/\/$/, '')}"`,
      ];

      for (const pattern of patterns) {
        const regex = new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
        content = content.replace(regex, `href="/${newFileName}"`);
      }
    }

    // 修复资源路径
    content = content.replace(/href="(\/[^"]*\.(css|js))"/g, (match, url) => {
      // 保持资源路径不变
      return match;
    });

    content = content.replace(/src="(\/[^"]*\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot))"/g, (match, url) => {
      // 保持资源路径不变
      return match;
    });

    await fs.writeFile(filePath, content);
  }
}

// 运行脚本
if (require.main === module) {
  const builder = new FlatBuilder();
  builder.run().catch(console.error);
}

module.exports = FlatBuilder;