import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body;
  
  // Check if it's one of the seed users
  const seedUserPhones = ['13800138000', '13900139000', '13700137000', '13600136000'];
  
  if (seedUserPhones.includes(phone) && password === '123456') {
    const seedUser = mockUsers[phone];
    if (seedUser) {
      res.status(200).json({
        success: true,
        message: '登录成功',
        data: {
          token: `mock-jwt-token-${phone}-${Date.now()}`,
          user: seedUser
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: '用户数据不存在'
      });
    }
  } else {
    // For other users, return basic info
    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token: 'mock-jwt-token',
        user: {
          id: 1,
          name: '测试用户',
          phone: req.body.phone
        }
      }
    });
  }
});

app.post('/api/auth/register', (req, res) => {
  res.status(201).json({
    success: true,
    message: '注册成功',
    data: {
      token: 'mock-jwt-token',
      user: {
        id: 1,
        name: req.body.name,
        phone: req.body.phone
      }
    }
  });
});

// Mock user data storage
let mockUsers = {
  '13800138000': {
    id: '1',
    name: '张三丰',
    phone: '13800138000',
    gender: 'male',
    birth_date: '1990-05-15',
    birth_time: '08:30',
    plan: 'vip'
  },
  '13900139000': {
    id: '2',
    phone: '13900139000',
    name: '李小龙',
    gender: 'male',
    birth_date: '1985-03-22',
    birth_time: '14:15',
    plan: 'basic'
  },
  '13700137000': {
    id: '3',
    phone: '13700137000',
    name: '王阳明',
    gender: 'male',
    birth_date: '1992-11-08',
    birth_time: '06:45',
    plan: 'basic'
  },
  '13600136000': {
    id: '4',
    phone: '13600136000',
    name: '孔子',
    gender: 'male',
    birth_date: '1988-07-30',
    birth_time: '20:20',
    plan: 'basic'
  }
};

// Mock bazi data storage
let mockBaziData = {
  '13800138000': {
    year_pillar: '庚午',
    month_pillar: '辛巳',
    day_pillar: '甲子',
    hour_pillar: '戊辰',
    wuxing_analysis: {
      wood: 2,
      fire: 3,
      earth: 2,
      metal: 2,
      water: 1
    },
    primary_element: 'fire',
    analysis_text: '五行火旺，木为用神，宜穿绿色、青色服装',
    personality: '性格坚毅，富有领导力，但有时过于固执。',
    career: '适合从事管理、教育或技术类工作。',
    health: '注意心血管健康，多运动。',
    relationship: '感情专一，但需要学会包容。'
  },
  '13900139000': {
    year_pillar: '乙丑',
    month_pillar: '己卯',
    day_pillar: '丙申',
    hour_pillar: '乙未',
    wuxing_analysis: {
      wood: 3,
      fire: 1,
      earth: 3,
      metal: 1,
      water: 2
    },
    primary_element: 'earth',
    analysis_text: '五行土金旺，火为用神，宜穿红色、橙色服装',
    personality: '勇敢果断，富有武者精神，追求完美。',
    career: '适合从事体育、武术或表演类工作。',
    health: '注意肌肉骨骼健康，适度训练。',
    relationship: '重视忠诚，但需要学会温柔。'
  },
  '13700137000': {
    year_pillar: '壬申',
    month_pillar: '辛亥',
    day_pillar: '戊寅',
    hour_pillar: '乙卯',
    wuxing_analysis: {
      wood: 2,
      fire: 0,
      earth: 1,
      metal: 2,
      water: 5
    },
    primary_element: 'water',
    analysis_text: '五行水旺缺火，金为用神，宜穿白色、银色服装',
    personality: '智慧深邃，善于思考，具有哲学家气质。',
    career: '适合从事研究、哲学或心理学工作。',
    health: '注意肾脏健康，避免过度劳累。',
    relationship: '理性多于感性，需要理解型伴侣。'
  },
  '13600136000': {
    year_pillar: '戊辰',
    month_pillar: '己未',
    day_pillar: '癸酉',
    hour_pillar: '壬戌',
    wuxing_analysis: {
      wood: 0,
      fire: 0,
      earth: 4,
      metal: 1,
      water: 5
    },
    primary_element: 'earth',
    analysis_text: '五行土水旺，木为用神，宜穿绿色、青色服装',
    personality: '博学多才，温文尔雅，具有教育家风范。',
    career: '适合从事教育、文化或学术研究工作。',
    health: '注意脾胃健康，保持规律作息。',
    relationship: '重视精神交流，追求和谐。'
  }
};

app.get('/api/auth/profile', (req, res) => {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    });
  }
  
  // Extract phone from token (mock implementation)
  const token = authHeader.split(' ')[1];
  // Token format: mock-jwt-token-{phone}-{timestamp}
  const tokenParts = token.split('-');
  let phone = '13800138000'; // default
  
  if (tokenParts.length >= 4 && tokenParts[0] === 'mock' && tokenParts[1] === 'jwt' && tokenParts[2] === 'token') {
    phone = tokenParts[3]; // phone is the 4th part
  }
  
  if (mockUsers[phone]) {
    const seedUser = mockUsers[phone];
    
    if (seedUser) {
      res.status(200).json({
        success: true,
        data: {
          user: seedUser
        }
      });
    } else {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
  } else {
    // Fallback for old tokens
    const seedUser = mockUsers['13800138000'];
    res.status(200).json({
      success: true,
      data: {
        user: seedUser
      }
    });
  }
});

app.put('/api/auth/profile', (req, res) => {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    });
  }
  
  // Extract phone from token (mock implementation)
  const token = authHeader.split(' ')[1];
  // Token format: mock-jwt-token-{phone}-{timestamp}
  const tokenParts = token.split('-');
  let phone = '13800138000'; // default
  
  if (tokenParts.length >= 4 && tokenParts[0] === 'mock' && tokenParts[1] === 'jwt' && tokenParts[2] === 'token') {
    phone = tokenParts[3]; // phone is the 4th part
  }
  
  if (mockUsers[phone]) {
    const existingUser = mockUsers[phone];
    
    if (existingUser) {
      const { name, gender, birth_date, birth_time } = req.body;
      
      // Update user data
      const updatedUser = {
        ...existingUser,
        name,
        gender,
        birth_date,
        birth_time
      };
      
      mockUsers[phone] = updatedUser;
      
      res.status(200).json({
        success: true,
        message: '个人信息更新成功',
        data: updatedUser
      });
    } else {
      res.status(404).json({
        success: false,
        message: '用户不存在'
      });
    }
  } else {
    // Fallback for old tokens
    const { name, gender, birth_date, birth_time } = req.body;
    const phone = '13800138000';
    const existingUser = mockUsers[phone];
    
    const updatedUser = {
      ...existingUser,
      name,
      gender,
      birth_date,
      birth_time
    };
    
    mockUsers[phone] = updatedUser;
    
    res.status(200).json({
      success: true,
      message: '个人信息更新成功',
      data: updatedUser
    });
  }
});

// Bazi endpoints
app.get('/api/bazi/info', (req, res) => {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    });
  }
  
  // Extract phone from token (mock implementation)
  const token = authHeader.split(' ')[1];
  // Token format: mock-jwt-token-{phone}-{timestamp}
  const tokenParts = token.split('-');
  let phone = '13800138000'; // default
  
  if (tokenParts.length >= 4 && tokenParts[0] === 'mock' && tokenParts[1] === 'jwt' && tokenParts[2] === 'token') {
    phone = tokenParts[3]; // phone is the 4th part
  }
  
  if (mockBaziData[phone]) {
    const baziInfo = mockBaziData[phone];
    
    if (baziInfo) {
      res.status(200).json({
        success: true,
        data: baziInfo
      });
    } else {
      res.status(404).json({
        success: false,
        message: '未找到八字信息'
      });
    }
  } else {
    // Fallback for old tokens
    const baziInfo = mockBaziData['13800138000'];
    if (baziInfo) {
      res.status(200).json({
        success: true,
        data: baziInfo
      });
    } else {
      res.status(404).json({
        success: false,
        message: '未找到八字信息'
      });
    }
  }
});

app.post('/api/bazi/calculate', (req, res) => {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    });
  }
  
  const { birth_date, birth_time, gender } = req.body;
  
  // Mock calculation - return the same bazi data
  const calculatedBazi = {
    year_pillar: '庚午',
    month_pillar: '辛巳',
    day_pillar: '甲子',
    hour_pillar: '丁卯',
    wuxing_analysis: {
      wood: 2,
      fire: 3,
      earth: 1,
      metal: 2,
      water: 0
    },
    analysis_text: '此命五行火旺缺水，日主天干为甲木，生于夏季，必须有水助，但忌土太多。',
    detailed_analysis: {
      balance: '五行火旺缺水，需要补水以平衡五行。',
      personality: '性格热情开朗，但有时过于急躁，需要培养耐心。',
      fortune: '事业运势较好，但需注意人际关系的处理。',
      suggestions: '建议多接触水元素，如游泳、养鱼等，有助于平衡五行。'
    }
  };
  
  // Store the calculated bazi data
  mockBaziData[1] = calculatedBazi;
  
  res.status(200).json({
    success: true,
    message: '八字计算完成',
    data: calculatedBazi
  });
});

app.get('/api/bazi/daily-advice', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      date: new Date().toISOString().split('T')[0],
      clothing_colors: ['红色', '橙色', '黄色'],
      avoid_colors: ['黑色', '蓝色'],
      travel_direction: '东南方',
      lucky_times: ['上午9-11点', '下午2-4点'],
      suggestions: '今日五行属火，适合穿着暖色调衣物，向东南方出行较为吉利。'
    }
  });
});

// Feedback endpoints
app.post('/api/feedback', (req, res) => {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    });
  }
  
  const { rating, comment, type } = req.body;
  
  // Mock feedback submission - just log and return success
  console.log('Feedback received:', { rating, comment, type, timestamp: new Date().toISOString() });
  
  res.status(200).json({
    success: true,
    message: '评价提交成功',
    data: {
      id: Date.now(),
      rating,
      comment,
      type,
      submitted_at: new Date().toISOString()
    }
  });
});

app.get('/api/feedback/history', (req, res) => {
  // Check for Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    });
  }
  
  // Mock feedback history - return empty array
  res.status(200).json({
    success: true,
    data: {
      feedbacks: [],
      total: 0,
      page: 1,
      limit: 10
    }
  });
});

// Default 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found', path: req.originalUrl, method: req.method });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;