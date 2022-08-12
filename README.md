### 安装插件
- 在vscode应用商店搜索 td-vite-vscode 进行安装

### 在工程里面添加特殊配置
- 根目录新加vite.config.js文件（如果不需要则不需要添加）
- 2个特殊配置，html & entry， 其他配置请参考vite官网 https://cn.vitejs.dev/
``` javascript
module.exports = {
    html: './src/index.html', // 默认值 html的地址（相对于根目录）
    entry: '/src/app.js' // 默认值 入口js的地址（相对于根目录）
}
```

### 启动 & 关闭

![启动&关闭](https://raw.githubusercontent.com/TDFE/td-vite-vscode/main/vite.jpg)
