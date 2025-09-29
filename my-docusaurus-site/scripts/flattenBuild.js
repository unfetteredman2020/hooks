#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const cheerio = require('cheerio');

const buildDir = path.join(__dirname, '..', 'build');
const distDir = path.join(__dirname, '..', 'dist');

async function flattenBuild() {
  console.log('开始扁平化构建输出...\n');
  
  // 确保dist目录存在
  await fs.ensureDir(distDir);
  
  // 清空dist目录
  await fs.emptyDir(distDir);
  
  // 1. 处理所有HTML文件
  const htmlFiles = glob.sync('**/*.html', {
    cwd: buildDir,
    absolute: false,
  });
  
  const urlMappings = new Map();
  
  // 第一步：建立URL映射关系
  for (const htmlFile of htmlFiles) {
    let newFileName;
    const originalUrl = '/' + htmlFile.replace(/\/index\.html$/, '').replace(/\.html$/, '');
    
    if (htmlFile === 'index.html') {
      newFileName = 'index.html';
      urlMappings.set('/', '/index.html');
    } else if (htmlFile.endsWith('/index.html')) {
      const dirPath = htmlFile.slice(0, -11);
      newFileName = dirPath.replace(/\//g, '-') + '.html';
      urlMappings.set(originalUrl, '/' + newFileName);
      urlMappings.set(originalUrl + '/', '/' + newFileName);
    } else {
      const baseName = path.basename(htmlFile, '.html');
      const dirPath = path.dirname(htmlFile);
      if (dirPath === '.') {
        newFileName = htmlFile;
      } else {
        newFileName = dirPath.replace(/\//g, '-') + '-' + baseName + '.html';
      }
      urlMappings.set(originalUrl, '/' + newFileName);
    }
  }
  
  // 第二步：处理每个HTML文件
  for (const htmlFile of htmlFiles) {
    const originalPath = path.join(buildDir, htmlFile);
    const fileContent = await fs.readFile(originalPath, 'utf-8');
    
    // 使用cheerio解析HTML
    const $ = cheerio.load(fileContent);
    
    // 生成新的文件名
    let newFileName;
    if (htmlFile === 'index.html') {
      newFileName = 'index.html';
    } else if (htmlFile.endsWith('/index.html')) {
      const dirPath = htmlFile.slice(0, -11);
      newFileName = dirPath.replace(/\//g, '-') + '.html';
    } else {
      const baseName = path.basename(htmlFile, '.html');
      const dirPath = path.dirname(htmlFile);
      if (dirPath === '.') {
        newFileName = htmlFile;
      } else {
        newFileName = dirPath.replace(/\//g, '-') + '-' + baseName + '.html';
      }
    }
    
    // 修正所有链接
    $('a[href]').each((i, elem) => {
      const href = $(elem).attr('href');
      if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#')) {
        // 解析相对链接
        let absoluteHref = href;
        if (!href.startsWith('/')) {
          // 相对链接转绝对链接
          const currentDir = '/' + path.dirname(htmlFile);
          absoluteHref = path.posix.resolve(currentDir, href);
        }
        
        // 查找映射
        const cleanHref = absoluteHref.replace(/#.*$/, '');
        const mappedUrl = urlMappings.get(cleanHref);
        
        if (mappedUrl) {
          const hash = href.includes('#') ? href.substring(href.indexOf('#')) : '';
          $(elem).attr('href', mappedUrl.replace(/^\//, '') + hash);
        }
      }
    });
    
    // 修正资源路径（CSS、JS、图片等）
    $('link[href], script[src], img[src]').each((i, elem) => {
      const attr = elem.name === 'link' ? 'href' : 'src';
      const url = $(elem).attr(attr);
      
      if (url && !url.startsWith('http') && !url.startsWith('//')) {
        // 计算相对于根目录的路径
        if (url.startsWith('/')) {
          $(elem).attr(attr, url.substring(1));
        } else {
          const depth = htmlFile.split('/').length - 1;
          let cleanUrl = url;
          
          // 移除所有 ../ 前缀
          while (cleanUrl.startsWith('../')) {
            cleanUrl = cleanUrl.substring(3);
          }
          
          $(elem).attr(attr, cleanUrl);
        }
      }
    });
    
    // 修正base标签（如果有）
    $('base').remove();
    
    // 写入新文件
    const destPath = path.join(distDir, newFileName);
    await fs.writeFile(destPath, $.html());
    console.log(`✓ ${htmlFile} -> ${newFileName}`);
  }
  
  // 2. 复制所有静态资源
  console.log('\n复制静态资源...');
  
  const staticDirs = ['assets', 'img', 'js', 'css'];
  for (const dir of staticDirs) {
    const srcDir = path.join(buildDir, dir);
    if (await fs.pathExists(srcDir)) {
      const destDir = path.join(distDir, dir);
      await fs.copy(srcDir, destDir);
      console.log(`✓ 复制 ${dir}/`);
    }
  }
  
  // 复制其他文件（如 sitemap.xml, robots.txt 等）
  const otherFiles = glob.sync('*', {
    cwd: buildDir,
    absolute: false,
    nodir: true,
    ignore: ['*.html'],
  });
  
  for (const file of otherFiles) {
    const srcPath = path.join(buildDir, file);
    const destPath = path.join(distDir, file);
    await fs.copy(srcPath, destPath);
    console.log(`✓ 复制 ${file}`);
  }
  
  console.log('\n✅ 构建输出扁平化完成！');
  console.log(`所有文件已输出到: ${distDir}`);
}

// 运行脚本
flattenBuild().catch(error => {
  console.error('❌ 扁平化失败:', error);
  process.exit(1);
});