import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Button, Card, DatePicker, TimePicker, Radio, message, Divider, Row, Col, Tag } from 'antd';
import { UserOutlined, CalendarOutlined, ClockCircleOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { authAPI, baziAPI } from '../services/api';
import Calendar from '../components/Calendar';

import dayjs from 'dayjs';

interface ProfileForm {
  name: string;
  gender: 'male' | 'female';
  birth_date: dayjs.Dayjs;
  birth_time: dayjs.Dayjs;
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, baziInfo, setUser, setBaziInfo } = useStore();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);


  const fetchBaziInfo = useCallback(async () => {
    try {
      console.log('🔍 fetchBaziInfo: 开始获取八字信息');
      const response = await baziAPI.getInfo();
      if (response.data) {
        console.log('✅ fetchBaziInfo: 获取到八字信息', {
          has_detailed_analysis: !!response.data.detailed_analysis,
          wuxing_analysis: response.data.wuxing_analysis,
          detailed_analysis_keys: response.data.detailed_analysis ? Object.keys(response.data.detailed_analysis) : null
        });
        setBaziInfo(response.data);
      }
    } catch {
        // 如果没有八字信息，不显示错误
        console.log('❌ fetchBaziInfo: No bazi info found');
      }
  }, [setBaziInfo]);

  useEffect(() => {
    console.log('👤 Profile页面加载');
    console.log('📱 当前localStorage token:', localStorage.getItem('token'));
    console.log('💾 当前localStorage storage:', localStorage.getItem('wuxing-app-storage'));
    console.log('🏪 Store中的用户数据:', {
      user,
      hasUser: !!user,
      userName: user?.name,
      userGender: user?.gender,
      userBirthDate: user?.birth_date,
      userBirthTime: user?.birth_time
    });
    
    // 临时清除缓存功能（用于测试）
    const clearCache = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('wuxing-app-storage');
      console.log('🧹 已清除所有缓存数据');
      window.location.href = '/login';
    };
    
    // 在控制台中提供清除缓存的方法
    (window as any).clearCache = clearCache;
    console.log('🧹 可以在控制台中调用 clearCache() 来清除缓存并返回登录页');
    
    console.log('=== Profile useEffect 开始 ===');
    console.log('当前用户数据:', user);
    console.log('用户数据类型:', typeof user);
    console.log('用户是否存在:', !!user);
    
    if (user) {
      console.log('--- 开始处理用户数据 ---');
      console.log('用户姓名:', user.name, '类型:', typeof user.name);
      console.log('用户性别:', user.gender, '类型:', typeof user.gender);
      console.log('出生日期:', user.birth_date, '类型:', typeof user.birth_date);
      console.log('出生时间:', user.birth_time, '类型:', typeof user.birth_time);
      
      // 处理出生日期
      let processedBirthDate = null;
      if (user.birth_date) {
        console.log('处理出生日期:', user.birth_date);
        try {
          processedBirthDate = dayjs(user.birth_date);
          console.log('dayjs解析结果:', processedBirthDate);
          console.log('dayjs是否有效:', processedBirthDate.isValid());
          console.log('dayjs格式化:', processedBirthDate.format('YYYY-MM-DD'));
        } catch (error) {
          console.error('dayjs解析出生日期失败:', error);
        }
      }
      
      // 处理出生时间
      let processedBirthTime = null;
      if (user.birth_time) {
        console.log('处理出生时间:', user.birth_time);
        try {
          processedBirthTime = dayjs(user.birth_time, 'HH:mm');
          console.log('dayjs时间解析结果:', processedBirthTime);
          console.log('dayjs时间是否有效:', processedBirthTime.isValid());
          console.log('dayjs时间格式化:', processedBirthTime.format('HH:mm'));
        } catch (error) {
          console.error('dayjs解析出生时间失败:', error);
        }
      }
      
      const formValues = {
        name: user.name || '',
        gender: user.gender || 'male',
        birth_date: processedBirthDate,
        birth_time: processedBirthTime,
      };
      
      console.log('--- 准备设置表单值 ---');
      console.log('处理后的表单值:', formValues);
      console.log('表单值详细信息:');
      console.log('  name:', formValues.name, '类型:', typeof formValues.name);
      console.log('  gender:', formValues.gender, '类型:', typeof formValues.gender);
      console.log('  birth_date:', formValues.birth_date, '是否为dayjs对象:', formValues.birth_date && formValues.birth_date._isAMomentObject);
      console.log('  birth_time:', formValues.birth_time, '是否为dayjs对象:', formValues.birth_time && formValues.birth_time._isAMomentObject);
      
      // 获取设置前的表单值
      const beforeValues = form.getFieldsValue();
      console.log('设置前的表单值:', beforeValues);
      
      // 设置表单值
      form.setFieldsValue(formValues);
      
      // 获取设置后的表单值
      const afterValues = form.getFieldsValue();
      console.log('--- 表单值设置完成 ---');
      console.log('设置后的表单值:', afterValues);
      console.log('表单值变化对比:');
      console.log('  name: 前:', beforeValues.name, '后:', afterValues.name);
      console.log('  gender: 前:', beforeValues.gender, '后:', afterValues.gender);
      console.log('  birth_date: 前:', beforeValues.birth_date, '后:', afterValues.birth_date);
      console.log('  birth_time: 前:', beforeValues.birth_time, '后:', afterValues.birth_time);
      
      fetchBaziInfo();
    } else {
      console.log('用户数据不存在，跳过表单预填');
    }
    console.log('=== Profile useEffect 结束 ===');
  }, [user, form, fetchBaziInfo]);

  const calculateBazi = async (birthDate: string, birthTime: string, gender: 'male' | 'female') => {
    setCalculating(true);
    try {
      console.log('🧮 calculateBazi: 开始计算八字', { birthDate, birthTime, gender });
      const response = await baziAPI.calculate({
        birth_date: birthDate,
        birth_time: birthTime,
        gender
      });
      
      console.log('✅ calculateBazi: 八字计算完成', {
        has_detailed_analysis: !!response.data.detailed_analysis,
        wuxing_analysis: response.data.wuxing_analysis,
        detailed_analysis_keys: response.data.detailed_analysis ? Object.keys(response.data.detailed_analysis) : null
      });
      
      setBaziInfo(response.data);
      message.success('八字计算完成！');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '计算失败，请稍后重试';
      message.error(errorMessage);
      console.error('❌ calculateBazi: 计算失败', error);
    } finally {
      setCalculating(false);
    }
  };

  const handleSubmit = async (values: ProfileForm) => {
    console.log('🚀 Profile - handleSubmit: 开始提交表单');
    console.log('📋 Profile - 提交的表单值:', {
      name: values.name,
      gender: values.gender,
      birth_date: values.birth_date ? values.birth_date.format('YYYY-MM-DD') : null,
      birth_time: values.birth_time ? values.birth_time.format('HH:mm') : null,
      birth_date_valid: values.birth_date ? values.birth_date.isValid() : false,
      birth_time_valid: values.birth_time ? values.birth_time.isValid() : false
    });
    
    setLoading(true);
    try {
      if (!values.birth_date || !values.birth_time) {
        console.error('❌ Profile - 表单验证失败: 缺少出生日期或时间');
        message.error('请选择出生日期和时间！');
        setLoading(false);
        return;
      }
      
      const birthDate = values.birth_date.format('YYYY-MM-DD');
      const birthTime = values.birth_time.format('HH:mm');
      
      console.log('📤 Profile - 准备发送的API数据:', {
        name: values.name,
        gender: values.gender,
        birth_date: birthDate,
        birth_time: birthTime
      });
      
      // 更新用户信息
      const response = await authAPI.updateProfile({
        name: values.name,
        gender: values.gender,
        birth_date: birthDate,
        birth_time: birthTime,
      });
      
      console.log('📥 Profile - API响应数据:', response.data);
      setUser(response.data);
      message.success('个人信息更新成功！');
      
      // 自动计算八字
      await calculateBazi(birthDate, birthTime, values.gender);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : '更新失败，请稍后重试';
      console.error('❌ Profile - 提交失败:', error);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getWuxingColor = (element: string) => {
    const colors = {
      wood: '#52c41a',
      fire: '#ff4d4f',
      earth: '#faad14',
      metal: '#1890ff',
      water: '#722ed1'
    };
    return colors[element as keyof typeof colors] || '#666';
  };

  const getWuxingName = (element: string) => {
    const names = {
      wood: '木',
      fire: '火',
      earth: '土',
      metal: '金',
      water: '水'
    };
    return names[element as keyof typeof names] || element;
  };

  const handleDateSelect = (date: Date) => {
    // 使用本地时间格式化日期，避免时区问题
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    navigate(`/daily/${dateString}`);
  };



  return (
    <div className="min-h-screen bg-gray-50 p-4 relative">
      {/* 左上角返回按钮 */}
      <div className="fixed top-4 left-4 z-10">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/home')}
          className="text-gray-600 hover:text-gray-800"
        >
          返回
        </Button>
      </div>
      
      {/* 右上角日历组件 */}
      <div className="fixed top-4 right-4 z-10">
        <Calendar onDateClick={handleDateSelect} />
      </div>
      
      <div className="max-w-4xl mx-auto pr-80">
        <Card title="个人信息管理" className="mb-6">
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            autoComplete="off"
          >
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="name"
                  label="姓名"
                  rules={[{ required: true, message: '请输入姓名！' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="请输入姓名"
                    size="large"
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  name="gender"
                  label="性别"
                  rules={[{ required: true, message: '请选择性别！' }]}
                >
                  <Radio.Group size="large">
                    <Radio value="male">男</Radio>
                    <Radio value="female">女</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
            
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  name="birth_date"
                  label="出生日期"
                  rules={[{ required: true, message: '请选择出生日期！' }]}
                >
                  <DatePicker
                    placeholder="选择出生日期"
                    size="large"
                    className="w-full"
                    suffixIcon={<CalendarOutlined />}
                  />
                </Form.Item>
              </Col>
              
              <Col xs={24} sm={12}>
                <Form.Item
                  name="birth_time"
                  label="出生时间"
                  rules={[{ required: true, message: '请选择出生时间！' }]}
                >
                  <TimePicker
                    placeholder="选择出生时间"
                    size="large"
                    className="w-full"
                    format="HH:mm"
                    suffixIcon={<ClockCircleOutlined />}
                  />
                </Form.Item>
              </Col>
            </Row>
            
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading || calculating}
                size="large"
                className="w-full sm:w-auto"
              >
                {calculating ? '正在计算八字...' : '保存并计算八字'}
              </Button>
            </Form.Item>
          </Form>
        </Card>
        
        {baziInfo && (
          <Card title="八字信息" className="mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">生辰八字</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600">年柱</div>
                    <div className="text-xl font-bold text-blue-600">{baziInfo.year_pillar}</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-sm text-gray-600">月柱</div>
                    <div className="text-xl font-bold text-green-600">{baziInfo.month_pillar}</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-gray-600">日柱</div>
                    <div className="text-xl font-bold text-yellow-600">{baziInfo.day_pillar}</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-gray-600">时柱</div>
                    <div className="text-xl font-bold text-red-600">{baziInfo.hour_pillar}</div>
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <h3 className="text-lg font-semibold mb-3">五行分析</h3>
                
                {baziInfo.detailed_analysis ? (
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-blue-800">五行平衡状况</h4>
                      <p className="text-gray-700 leading-relaxed">{baziInfo.detailed_analysis.balance}</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-green-800">性格特点</h4>
                      <p className="text-gray-700 leading-relaxed">{baziInfo.detailed_analysis.personality}</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-purple-800">运势分析</h4>
                      <p className="text-gray-700 leading-relaxed">{baziInfo.detailed_analysis.fortune}</p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2 text-orange-800">建议改善</h4>
                      <p className="text-gray-700 leading-relaxed">{baziInfo.detailed_analysis.suggestions}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {Object.entries(baziInfo.wuxing_analysis).map(([element, count]) => (
                        <Tag
                          key={element}
                          color={getWuxingColor(element)}
                          className="px-3 py-1 text-sm"
                        >
                          {getWuxingName(element)}: {String(count)}
                        </Tag>
                      ))}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">命理解读</h4>
                      <p className="text-gray-700 leading-relaxed">{baziInfo.analysis_text}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
      

    </div>
  );
};

export default Profile;