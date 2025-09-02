// Mock data storage
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

// 模拟八字数据
const mockBaziData = {
  '13800138000': {
    year: '庚午',
    month: '辛巳',
    day: '甲子',
    hour: '戊辰',
    elements: {
      wood: 2,
      fire: 3,
      earth: 2,
      metal: 2,
      water: 1
    },
    personality: '性格坚毅，富有领导力，但有时过于固执。',
    career: '适合从事管理、教育或技术类工作。',
    health: '注意心血管健康，多运动。',
    relationship: '感情专一，但需要学会包容。'
  },
  '13900139000': {
    year: '乙丑',
    month: '己卯',
    day: '丙申',
    hour: '乙未',
    elements: {
      wood: 3,
      fire: 1,
      earth: 3,
      metal: 1,
      water: 2
    },
    personality: '温柔细腻，富有艺术天赋，善于表达情感。',
    career: '适合从事文学、艺术或咨询类工作。',
    health: '注意脾胃健康，饮食要规律。',
    relationship: '重视精神交流，追求浪漫。'
  },
  '13700137000': {
    year: '壬申',
    month: '辛亥',
    day: '戊寅',
    hour: '乙卯',
    elements: {
      wood: 2,
      fire: 0,
      earth: 1,
      metal: 2,
      water: 5
    },
    personality: '智慧深邃，善于思考，具有哲学家气质。',
    career: '适合从事研究、哲学或心理学工作。',
    health: '注意肾脏健康，避免过度劳累。',
    relationship: '理性多于感性，需要理解型伴侣。'
  },
  '13600136000': {
    year: '戊辰',
    month: '己未',
    day: '癸酉',
    hour: '壬戌',
    elements: {
      wood: 0,
      fire: 0,
      earth: 4,
      metal: 1,
      water: 5
    },
    personality: '才华横溢，乐观豁达，具有诗人气质。',
    career: '适合从事文化、传媒或创意类工作。',
    health: '注意消化系统，保持心情愉悦。',
    relationship: '风趣幽默，容易获得异性青睐。'
  }
};

// Simple API handler for Vercel deployment
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Parse request body for POST/PUT requests
  if (req.method === 'POST' || req.method === 'PUT') {
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
      } catch (e) {
        // Body is already parsed or not JSON
      }
    }
  }

  const { url, method } = req;
  const path = url.replace('/api', '');

  try {
    // Health check endpoint
    if (path === '/health') {
      return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    }

    // Authentication endpoints
    if (path.startsWith('/auth/')) {
      if (path === '/auth/login' && method === 'POST') {
        const { phone, password } = req.body;
        
        // 验证种子用户
        if (mockUsers[phone] && password === '123456') {
          const token = 'mock-jwt-token-' + phone + '-' + Date.now();
          return res.status(200).json({
            success: true,
            data: {
              token,
              user: mockUsers[phone]
            }
          });
        } else {
          return res.status(401).json({
            success: false,
            message: '手机号或密码错误'
          });
        }
      }
      
      if (path === '/auth/register' && method === 'POST') {
        return res.status(201).json({
          success: true,
          message: '注册成功',
          data: {
            token: 'mock-jwt-token',
            user: {
              id: '2',
              name: req.body.name,
              phone: req.body.phone,
              gender: req.body.gender,
              birth_date: req.body.birth_date,
              birth_time: req.body.birth_time,
              plan: 'basic'
            }
          }
        });
      }
      
      if (path === '/auth/profile' && method === 'GET') {
        // Check for Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            message: '未授权访问'
          });
        }
        
        const token = authHeader.replace('Bearer ', '');
        
        // 简化处理：从token中提取用户信息（实际应该解析JWT）
        // token格式: mock-jwt-token-{phone}-{timestamp}
        let userPhone = '13800138000'; // 默认种子用户
        
        // 尝试从token中提取手机号
        const tokenParts = token.split('-');
        if (tokenParts.length >= 4) {
          const extractedPhone = tokenParts[2]; // 手机号在第3部分（索引2）
          if (mockUsers[extractedPhone]) {
            userPhone = extractedPhone;
          }
        }
        
        const userData = mockUsers[userPhone];
        
        return res.status(200).json({
          success: true,
          data: {
            user: userData
          }
        });
      }
      
      if (path === '/auth/profile' && method === 'PUT') {
        // Check for Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
          return res.status(401).json({
            success: false,
            message: '未授权访问'
          });
        }
        
        const token = authHeader.replace('Bearer ', '');
        
        // 从token中提取用户信息
        let userPhone = '13800138000'; // 默认种子用户
        
        // 尝试从token中提取手机号
        const tokenParts = token.split('-');
        if (tokenParts.length >= 4) {
          const extractedPhone = tokenParts[2]; // 手机号在第3部分（索引2）
          if (mockUsers[extractedPhone]) {
            userPhone = extractedPhone;
          }
        }
        
        // Update user profile
        const updates = req.body;
        const userData = mockUsers[userPhone];
        
        // Update the mock user data
        Object.assign(userData, updates);
        
        return res.status(200).json({
          success: true,
          message: '个人信息更新成功',
          data: userData
        });
      }
    }

    // Bazi endpoints
    if (path.startsWith('/bazi/')) {
      // Check for Authorization header for all bazi endpoints
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: '未授权访问'
        });
      }
      
      if (path === '/bazi/info' && method === 'GET') {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        // 简化处理：从token中提取用户信息（实际应该解析JWT）
        // token格式: mock-jwt-token-{phone}-{timestamp}
        let userPhone = '13800138000'; // 默认种子用户
        
        // 尝试从token中提取手机号
        const tokenParts = token.split('-');
        if (tokenParts.length >= 4) {
          const extractedPhone = tokenParts[2]; // 手机号在第3部分（索引2）
          if (mockUsers[extractedPhone]) {
            userPhone = extractedPhone;
          }
        }
        
        const baziData = mockBaziData[userPhone];
        
        return res.status(200).json({
          success: true,
          data: baziData
        });
      }
      
      if (path === '/bazi/calculate' && method === 'POST') {
        const { birth_date, birth_time, gender } = req.body;
        
        // Mock calculation - in real app this would be complex calculation
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
            water: 1
          },
          analysis_text: `根据您的出生时间${birth_date} ${birth_time}，您的八字中火元素较旺，${gender === 'male' ? '男性' : '女性'}特质明显。`,
          detailed_analysis: {
            balance: '您的八字中火元素偏旺，需要适当补充水元素来平衡五行。',
            personality: '性格热情开朗，富有创造力和领导才能。',
            fortune: '整体运势较好，特别是在事业发展方面有不错的机遇。',
            suggestions: '建议多穿蓝色、黑色衣物，有助于运势提升。'
          }
        };
        
        // Store the calculated result
        mockBaziData['1'] = calculatedBazi;
        
        return res.status(200).json({
          success: true,
          message: '八字计算完成',
          data: calculatedBazi
        });
      }
      
      if (path === '/bazi/daily-advice' && method === 'GET') {
        return res.status(200).json({
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
      }
    }

    // Feedback endpoints
    if (path.startsWith('/feedback')) {
      // Check for Authorization header for all feedback endpoints
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: '未授权访问'
        });
      }
      
      if (path === '/feedback' && method === 'POST') {
        const { advice_id, rating, comment, tags } = req.body;
        
        console.log('📝 [Backend] 收到评价提交请求:', {
          advice_id,
          rating,
          comment,
          tags,
          timestamp: new Date().toISOString()
        });
        
        // 模拟保存评价数据
        const feedbackId = 'feedback_' + Date.now();
        
        return res.status(200).json({
          success: true,
          message: '评价提交成功',
          data: {
            id: feedbackId,
            advice_id,
            rating,
            comment,
            tags,
            created_at: new Date().toISOString()
          }
        });
      }
      
      if (path === '/feedback/history' && method === 'GET') {
        return res.status(200).json({
          success: true,
          data: {
            feedbacks: [],
            total: 0,
            page: 1,
            limit: 10
          }
        });
      }
    }

    // Default 404 response
    res.status(404).json({ error: 'API endpoint not found', path, method });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}