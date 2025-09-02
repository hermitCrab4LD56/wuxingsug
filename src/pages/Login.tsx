import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { authAPI } from '../services/api';

interface LoginForm {
  phone: string;
  password: string;
}

interface RegisterForm {
  name: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender?: 'male' | 'female';
  birth_date?: string;
  birth_time?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // 根据路径设置默认标签页
  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('register');
    } else {
      setActiveTab('login');
    }
  }, [location.pathname]);

  useEffect(() => {
    console.log('🔐 Login页面加载');
    console.log('📱 当前localStorage token:', localStorage.getItem('token'));
    console.log('💾 当前localStorage storage:', localStorage.getItem('wuxing-app-storage'));
    
    // 临时清除缓存功能（用于测试）
    const clearCache = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('wuxing-app-storage');
      console.log('🧹 已清除所有缓存数据');
      window.location.reload();
    };
    
    // 在控制台中提供清除缓存的方法
    (window as any).clearCache = clearCache;
    console.log('🧹 可以在控制台中调用 clearCache() 来清除缓存');
  }, []);

  const onLogin = async (values: LoginForm) => {
    setLoading(true);
    try {
      console.log('🔐 Login attempt:', { phone: values.phone });
      
      const response = await authAPI.login({
        phone: values.phone,
        password: values.password
      });
      
      console.log('✅ Login response received:', {
        success: (response as any).success,
        data: (response as any).data,
        token: (response as any).data?.token ? 'Token exists' : 'No token',
        user: (response as any).data?.user
      });
      
      // 保存token
      localStorage.setItem('token', response.data.token);
      console.log('💾 Token saved to localStorage');
      
      // 设置用户信息
      setUser(response.data.user);
      console.log('👤 User set in store:', response.data.user);
      
      message.success('登录成功！');
      navigate('/home');
    } catch (error: unknown) {
      console.error('❌ Login error:', error);
      const errorMessage = error instanceof Error ? error.message : '登录失败，请检查手机号和密码';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (values: RegisterForm) => {
    setLoading(true);
    try {
      console.log('📝 Register attempt:', { name: values.name, phone: values.phone });
      
      const response = await authAPI.register({
        name: values.name,
        phone: values.phone,
        password: values.password,
        gender: values.gender,
        birth_date: values.birth_date,
        birth_time: values.birth_time
      });
      
      console.log('✅ Register response received:', {
        success: (response as any).success,
        data: (response as any).data,
        token: (response as any).data?.token ? 'Token exists' : 'No token',
        user: (response as any).data?.user
      });
      
      // 保存token
      localStorage.setItem('token', response.data.token);
      console.log('💾 Token saved to localStorage');
      
      // 设置用户信息
      setUser(response.data.user);
      console.log('👤 User set in store:', response.data.user);
      
      message.success('注册成功！');
      navigate('/home');
    } catch (error: unknown) {
      console.error('❌ Register error:', error);
      const errorMessage = error instanceof Error ? error.message : '注册失败，请稍后重试';
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">五行穿衣建议系统</h1>
          <p className="text-gray-600">传统智慧，现代生活</p>
        </div>
        
        <Tabs 
          activeKey={activeTab} 
          onChange={setActiveTab} 
          centered
          items={[
            {
              key: 'login',
              label: '登录',
              children: (
                <Form
                  name="login"
                  onFinish={onLogin}
                  autoComplete="off"
                  layout="vertical"
                >
                  <Form.Item
                    name="phone"
                    rules={[
                      { required: true, message: '请输入手机号！' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号！' }
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="手机号"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码！' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="密码"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      className="w-full"
                    >
                      登录
                    </Button>
                  </Form.Item>
                </Form>
              )
            },
            {
              key: 'register',
              label: '注册',
              children: (
                <Form
                  name="register"
                  onFinish={onRegister}
                  autoComplete="off"
                  layout="vertical"
                >
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: '请输入姓名！' }]}
                  >
                    <Input
                      prefix={<UserOutlined />}
                      placeholder="姓名"
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="phone"
                    rules={[
                      { required: true, message: '请输入手机号！' },
                      { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号！' }
                    ]}
                  >
                    <Input
                      prefix={<PhoneOutlined />}
                      placeholder="手机号"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: '请输入密码！' },
                      { min: 6, message: '密码至少6位！' }
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="密码"
                      size="large"
                    />
                  </Form.Item>
                  
                  <Form.Item
                    name="confirmPassword"
                    rules={[{ required: true, message: '请确认密码！' }]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="确认密码"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      size="large"
                      className="w-full"
                    >
                      注册
                    </Button>
                  </Form.Item>
                </Form>
              )
            }
          ]}
        />
      </Card>
    </div>
  );
};

export default Login;