#!/bin/bash

# Docusaurus扁平化构建解决方案 - 快速设置脚本
# 使用方法: bash setup-flat-docusaurus.sh

echo "🚀 开始设置Docusaurus扁平化构建环境..."

# 检查Node.js版本
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ $NODE_VERSION -lt 18 ]; then
    echo "❌ 需要Node.js 18+，当前版本: $(node -v)"
    exit 1
fi

echo "✅ Node.js版本检查通过: $(node -v)"

# 检查是否在Docusaurus项目目录
if [ ! -f "docusaurus.config.js" ]; then
    echo "❌ 未找到docusaurus.config.js，请确保在Docusaurus项目根目录运行此脚本"
    exit 1
fi

echo "✅ 检测到Docusaurus项目"

# 备份原有配置
if [ -f "docusaurus.config.js" ]; then
    cp docusaurus.config.js docusaurus.config.js.backup
    echo "📋 已备份原配置文件为 docusaurus.config.js.backup"
fi

# 检查package.json中是否有fs-extra依赖
if ! grep -q "fs-extra" package.json; then
    echo "📦 安装fs-extra依赖..."
    npm install --save-dev fs-extra
fi

# 创建扁平化构建脚本（如果不存在）
if [ ! -f "build-flat.js" ]; then
    echo "📄 创建build-flat.js脚本..."
    # 这里可以下载或复制脚本内容
    # curl -o build-flat.js https://your-repo/build-flat.js
    echo "请确保build-flat.js文件存在于项目根目录"
fi

# 更新package.json scripts（如果需要）
if ! grep -q "build-flat" package.json; then
    echo "📝 更新package.json scripts..."
    # 使用Node.js来更新package.json
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['build-flat'] = 'node build-flat.js --build';
    pkg.scripts['build-flat-only'] = 'node build-flat.js';
    pkg.scripts['serve-flat'] = 'cd dist && python3 -m http.server 3001';
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    console.log('✅ package.json scripts已更新');
    "
fi

# 检查docusaurus.config.js中的关键配置
echo "🔍 检查Docusaurus配置..."

# 检查baseUrl
if ! grep -q "baseUrl.*:.*'/'," docusaurus.config.js && ! grep -q 'baseUrl.*:.*"/",' docusaurus.config.js; then
    echo "⚠️  建议将baseUrl设置为'/' 以确保扁平化构建正常工作"
fi

# 测试构建
echo "🧪 进行测试构建..."
if npm run build; then
    echo "✅ Docusaurus构建成功"
    
    # 测试扁平化
    if node build-flat.js; then
        echo "✅ 扁平化构建成功！"
        echo "📁 输出目录: dist/"
        
        # 显示结果
        echo ""
        echo "📊 构建结果预览:"
        ls -la dist/ | head -10
        
        echo ""
        echo "🎉 设置完成！使用方法："
        echo "  npm run build-flat      # 一键构建并扁平化"
        echo "  npm run build-flat-only # 仅扁平化（需要先有build目录）"
        echo "  npm run serve-flat      # 启动本地服务器测试"
        
    else
        echo "❌ 扁平化构建失败，请检查错误信息"
    fi
else
    echo "❌ Docusaurus构建失败，请先解决构建问题"
fi

echo ""
echo "📚 完整文档请查看: README-docusaurus-flat.md"