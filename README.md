# 魏律师移民法律服务网站

## 项目说明
这是魏律师移民法律服务的网站源代码，包括客户前台和律师后台系统。

## 文件结构
- 客户端页面：直接位于根目录下的HTML文件
- 服务器端：位于server目录
- 静态资源：位于server/public目录

## 登录信息

### 律师登录
- 路径：/admin
- 用户名：lawyer@weilawoffices.com 
- 密码：lawyer123

### 客户登录
- 路径：/login.html
- 用户可以在注册页面注册后登录

## 启动服务器
在server目录下执行以下命令：
```
npm start
```

服务器默认运行在5000端口。访问 http://localhost:5000 即可打开网站。

## 注意事项
1. 登录路径正确
   - 律师登录页面：/admin
   - 客户登录页面：/login.html

2. 文件存放位置
   - 所有HTML文件都应放在server/public目录下才能被访问到
   - styles.css也应放在server/public目录下

3. 路由映射
   - 主页：/ 映射到 index.html
   - 律师登录：/admin 映射到 admin-login.html

如有登录问题，请检查用户名和密码，以及确保服务器正常运行。