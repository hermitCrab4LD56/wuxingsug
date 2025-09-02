export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只允许 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, password } = req.body;

    // 验证输入
    if (!phone || !password) {
      return res.status(400).json({ error: '手机号和密码不能为空' });
    }

    // 种子用户数据
    const seedUsers = [
      {
        id: '1',
        phone: '13800138000',
        password: 'password123',
        name: '张三',
        email: 'zhangsan@example.com'
      },
      {
        id: '2',
        phone: '13800138001',
        password: 'password123',
        name: '李四',
        email: 'lisi@example.com'
      }
    ];

    // 查找用户
    const user = seedUsers.find(u => u.phone === phone && u.password === password);

    if (!user) {
      return res.status(401).json({ error: '手机号或密码错误' });
    }

    // 生成简单的 token（实际项目中应使用 JWT）
    const token = `token_${user.id}_${Date.now()}`;

    // 返回成功响应
    return res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          phone: user.phone,
          name: user.name,
          email: user.email
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: '服务器内部错误' });
  }
}
