require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 添加对表单数据的支持

// 静态文件服务
app.use(express.static(path.join(__dirname, 'public')));

// 临时存储用户数据
let users = [];
// 初始化一个测试用户
users.push({
    id: '1',
    email: 'test@example.com',
    password: 'password123',
    name: '测试用户',
    phone: '1234567890',
    createdAt: new Date()
});

console.log('初始化测试用户:', users);

// 临时存储律师数据
const admins = [
    {
        id: 'admin1',
        email: 'lawyer@weilawoffices.com',
        password: 'lawyer123',
        name: '魏律师',
        role: 'admin',
        createdAt: new Date()
    }
];

// 连接MongoDB
/*
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
})
    .then(() => console.log('已连接到MongoDB'))
    .catch(err => console.error('MongoDB连接失败:', err));
*/
console.log('使用本地内存存储代替MongoDB');

// 直接实现认证API，不使用routes/auth.js

// 注册接口
app.post('/api/auth/register', (req, res) => {
    try {
        console.log('收到注册请求 - 请求体:', req.body);
        console.log('收到注册请求 - Content-Type:', req.headers['content-type']);
        
        const { email, password, name, phone } = req.body;
        
        if (!email || !password) {
            console.log('注册失败: 邮箱或密码为空', { email, password });
            return res.status(400).json({ error: '邮箱和密码是必填项' });
        }
        
        // 检查用户是否已存在
        if (users.find(user => user.email === email)) {
            console.log('注册失败: 用户已存在', email);
            return res.status(400).json({ error: '用户已存在' });
        }
        
        // 添加新用户
        const newUser = {
            id: Date.now().toString(),
            email,
            password,
            name: name || '',
            phone: phone || '',
            createdAt: new Date()
        };
        
        users.push(newUser);
        console.log('新用户注册成功:', email);
        console.log('当前用户数量:', users.length);
        console.log('所有用户:', users);
        
        // 返回用户信息(不含密码)和token
        const { password: pwd, ...userWithoutPassword } = newUser;
        res.status(201).json({
            user: userWithoutPassword,
            token: 'fake-jwt-token-' + Math.random().toString(36).substring(2)
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ error: '注册失败: ' + error.message });
    }
});

// 登录接口
app.post('/api/auth/login', (req, res) => {
    try {
        console.log('收到登录请求:', req.body);
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: '邮箱和密码是必填项' });
        }
        
        // 查找用户
        const user = users.find(u => u.email === email && u.password === password);
        console.log('现有用户数量:', users.length);
        
        if (!user) {
            return res.status(401).json({ error: '邮箱或密码不正确' });
        }
        
        console.log('用户登录成功:', email);
        
        // 返回用户信息(不含密码)
        const { password: pwd, ...userWithoutPassword } = user;
        res.json({
            user: userWithoutPassword,
            token: 'fake-jwt-token-' + Math.random().toString(36).substring(2)
        });
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ error: '登录失败' });
    }
});

// 律师登录接口
app.post('/api/auth/admin-login', (req, res) => {
    try {
        console.log('收到律师登录请求:', req.body);
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: '邮箱和密码是必填项' });
        }
        
        // 查找律师
        const admin = admins.find(a => a.email === email && a.password === password);
        
        if (!admin) {
            return res.status(401).json({ error: '邮箱或密码不正确，或您不是律师账户' });
        }
        
        console.log('律师登录成功:', email);
        
        // 返回律师信息(不含密码)
        const { password: pwd, ...adminWithoutPassword } = admin;
        res.json({
            user: adminWithoutPassword,
            token: 'admin-jwt-token-' + Math.random().toString(36).substring(2)
        });
    } catch (error) {
        console.error('律师登录错误:', error);
        res.status(500).json({ error: '登录失败' });
    }
});

// 获取当前用户信息接口
app.get('/api/auth/me', (req, res) => {
    // 简化版的用户认证，实际应用中应该验证JWT
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: '未授权，请登录' });
    }
    
    // 假设token是有效的，返回一个模拟用户
    res.json({
        user: {
            id: '123',
            email: 'user@example.com',
            name: '模拟用户',
            role: 'user'
        }
    });
});

// 测试接口 - 用于检查服务器状态
app.get('/api/auth/status', (req, res) => {
    res.json({ 
        status: 'online',
        usersCount: users.length,
        message: '服务器正常运行'
    });
});

// 开发测试接口 - 获取所有用户（仅在开发环境使用）
app.get('/api/auth/users', (req, res) => {
    // 返回用户列表，但不包含密码字段
    const safeUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    
    res.json({ 
        users: safeUsers,
        count: safeUsers.length
    });
});

// 主页路由
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 律师后台路由
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error('服务器错误:', err.stack);
    res.status(500).json({ error: '服务器内部错误' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log('使用本地内存存储模式');
});