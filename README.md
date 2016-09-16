# 微乐卡券

### 项目背景
 推出"微乐乐商web版"后，但反馈回来的效果并不理想，主要有以下几点：
    1. 慢，页面初次加载慢，页面响应慢，接口请求慢
    2. 流程复杂，注册流程复杂
    3. 许多细节没有处理，页面粗糙（此处前端应该检讨）
  为了解决以上问题，特提出全新的解决方案，发起"微乐卡券web版"项目。致力于达到以下目标：
    1. 单页面，初次加载后不再请求非接口资源
    2. 采用react技术，不再直接渲染dom，加速页面渲染
    3. 采用express + node，构建前端小后台，与后端项目解耦
    4. 采用grunt进行项目构建，加速开发流程，项目部署准备
    1. 突出卡券，弱化乐商
    2. 简化注册流程

### 目录介绍
  app       // 项目后台，主要承担接口中转
    controllers
    routes  // 后台路由
    server
    views   // 服务端渲染页面
  config    // 项目配置，包括公共配置，开发环境配置，生产环境配置
  logs      // 日志
  public    // 项目前台
    app     // 
      actions       // reflux action
      components    // react 组件
      stores        // reflux stores 
      index.js      // js 入口文件，包含前台全局路由，
    stylus  // css 预编译
    favicon.ico     // 
    weile.appcache  // app cache 配置文件
  app.js            // 项目入口，项目通过运行此文件启动
  gruntfile.js      // grunt 配置文件
  package.json      // 
  README.md         // 

### 运行环境配置
  1. 安装[Node.js](https://nodejs.org/)
  2. 安装[MongoDB](https://www.mongodb.org/)
  3. 安装Grunt   npm install -g grunt-cli
  3. 在package.json所在目录下运行npm install命令，加载项目依赖的node_modules

### 启动
  1. 启动MongoDB, mongod --config /usr/local/etc/mongod.conf
  2. 开发模式启动（默认）grunt
  3. 调试模式启动 grunt debug
  4. 产品模式启动 先执行 grunt build 再执行 node app.js

### 相关文档
  * [Express](http://expressjs.com/4x/api.html)
  * [React](http://reactjs.cn/react/docs/getting-started.html)
  * [React-Router](http://rackt.github.io/react-router/)
  * [Stylus](http://learnboost.github.io/stylus/)

### 备注
  1. 线上采用[PM2](https://github.com/Unitech/PM2)运行项目



