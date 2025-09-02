import React, { useState } from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { PhoneOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { authAPI } from '../services/api';

interface LoginForm {
  phone: string;
  password: string;
}

const LoginDebug: React.FC = () => {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>('');

  const addDebugInfo = (info: string) => {
    console.log('Debug:', info);
    setDebugInfo(prev => prev + '\n' + new Date().toLocaleTimeString() + ': ' + info);
  };

  const onLogin = async (values: LoginForm) => {
    setLoading(true);
    setDebugInfo('开始登录流程...');
    
    try {
      addDebugInfo(`准备发送登录请求: phone=${values.phone}`);
      
      const response = await authAPI.login({
        phone: values.phone,
        password: values.password
      });
      
      addDebugInfo(`收到登录响应: ${JSON.stringify(response, null, 2)}`);
      
      // 检查响应结构
      if (!response || typeof response !== 'object') {
        throw new Error('响应格式错误: ' + JSON.stringify(response));
      }
      
      // 检查是否有token
      const token = (response as any).data?.token || (response as any).token;
      if (!token) {
        throw new Error('响应中没有找到token: ' + JSON.stringify(response));
      }
      
      addDebugInfo(`找到token: ${token}`);
      
      // 保存token
      localStorage.setItem('token', token);
      addDebugInfo('Token已保存到localStorage');
      
      // 检查用户信息
      const user = (response as any).data?.user || (response as any).user;
      if (!user) {
        addDebugInfo('警告: 响应中没有用户信息');
      } else {
        addDebugInfo(`用户信息: ${JSON.stringify(user, null, 2)}`);
        setUser(user);
        addDebugInfo('用户信息已保存到store');
      }
      
      message.success('登录成功！');
      addDebugInfo('准备跳转到首页');
      navigate('/');
      
    } catch (error: unknown) {
      addDebugInfo(`登录错误: ${JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}`);
      
      let errorMessage = '登录失败，请检查手机号和密码';
      
      if (error instanceof Error) {
        errorMessage = error.message;
        addDebugInfo(`错误类型: ${error.constructor.name}`);
        addDebugInfo(`错误消息: ${error.message}`);
        if (error.stack) {
          addDebugInfo(`错误堆栈: ${error.stack}`);
        }
      } else if (typeof error === 'object' && error !== null) {
        addDebugInfo(`错误对象: ${JSON.stringify(error, null, 2)}`);
        if ('message' in error && typeof error.message === 'string') {
          errorMessage = error.message;
        }
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
      addDebugInfo('登录流程结束');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="flex gap-4 w-full max-w-6xl">
        {/* 登录表单 */}
        <Card className="w-full max-w-md shadow-lg">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">登录调试页面</h1>
            <p className="text-gray-600">用于调试登录问题</p>
          </div>
          
          <Form
            name="login"
            onFinish={onLogin}
            autoComplete="off"
            layout="vertical"
            initialValues={{
              phone: '13800138000',
              password: '123456'
            }}
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
                {loading ? '登录中...' : '登录'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        {/* 调试信息 */}
        <Card className="flex-1 shadow-lg">
          <h3 className="text-lg font-bold mb-4">调试信息</h3>
          <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
            <pre className="text-sm whitespace-pre-wrap">{debugInfo || '等待登录操作...'}</pre>
          </div>
          <div className="mt-4">
            <Button 
              onClick={() => setDebugInfo('')} 
              size="small"
            >
              清空日志
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginDebug;