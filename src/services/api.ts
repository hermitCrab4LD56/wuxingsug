import axios from 'axios';

// 根据环境设置baseURL
const getBaseURL = () => {
  // 在生产环境中使用相对路径
  if (import.meta.env.PROD) {
    return '/api';
  }
  // 在开发环境中使用localhost
  return 'http://localhost:3001/api';
};

// 创建axios实例
const api = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储并跳转到登录页
      localStorage.removeItem('token');
      localStorage.removeItem('wuxing-app-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

// 用户相关API
export const authAPI = {
  // 用户注册
  register: (data: {
    name: string;
    phone: string;
    password: string;
    gender: 'male' | 'female';
    birth_date: string;
    birth_time: string;
  }) => api.post('/auth/register', data),

  // 用户登录
  login: (data: { phone: string; password: string }) => 
    api.post('/auth/login', data),

  // 获取用户信息
  getProfile: () => api.get('/auth/profile'),

  // 更新用户信息
  updateProfile: (data: {
    name?: string;
    gender?: 'male' | 'female';
    birth_date?: string;
    birth_time?: string;
  }) => api.put('/auth/profile', data),

  // 用户登出
  logout: () => api.post('/auth/logout'),
};

// 八字相关API
export const baziAPI = {
  // 获取八字信息
  getInfo: () => api.get('/bazi/info'),

  // 计算八字
  calculate: (data: {
    birth_date: string;
    birth_time: string;
    gender: 'male' | 'female';
  }) => api.post('/bazi/calculate', data),

  // 获取每日建议
  getDailyAdvice: (date?: string) => {
    const params = date ? { date } : {};
    return api.get('/bazi/daily-advice', { params });
  },

  // 获取建议历史
  getAdviceHistory: (params: { page?: number; limit?: number }) => 
    api.get('/bazi/advice-history', { params }),
};

// 反馈相关API
export const feedbackAPI = {
  // 提交反馈
  submit: (data: {
    advice_id: string;
    rating: number;
    comment?: string;
    tags?: string[];
  }) => api.post('/feedback', data),

  // 获取反馈历史
  getHistory: (params: { page?: number; limit?: number }) => 
    api.get('/feedback/history', { params }),

  // 更新反馈
  update: (id: string, data: {
    rating?: number;
    comment?: string;
    tags?: string[];
  }) => api.put(`/feedback/${id}`, data),

  // 删除反馈
  delete: (id: string) => api.delete(`/feedback/${id}`),
};

export default api;