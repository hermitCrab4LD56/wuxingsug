import React, { useEffect, useState, useCallback } from 'react';
import { Card, Button, Tag, Divider, message, Row, Col, Dropdown, Menu } from 'antd';
import { UserOutlined, CalendarOutlined, BellOutlined, DownOutlined, LogoutOutlined, SwapOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { baziAPI } from '../services/api';
import DailyAdviceModal from '../components/DailyAdviceModal';
import ClothingAdviceModal from '../components/ClothingAdviceModal';
import TravelAdviceModal from '../components/TravelAdviceModal';
import dayjs from 'dayjs';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, baziInfo, dailyAdvice, setBaziInfo, setDailyAdvice, setShowDailyPopup, logout } = useStore();
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isClothingModalOpen, setIsClothingModalOpen] = useState(false);
  const [isTravelModalOpen, setIsTravelModalOpen] = useState(false);

  const fetchBaziInfo = useCallback(async () => {
    try {
      const response = await baziAPI.getInfo();
      if (response.data) {
        setBaziInfo(response.data);
      }
    } catch {
      // 如果没有八字信息，不显示错误
      console.log('No bazi info found');
    }
  }, [setBaziInfo]);

  const fetchDailyAdvice = useCallback(async () => {
    setLoading(true);
    try {
      const response = await baziAPI.getDailyAdvice();
      setDailyAdvice(response.data);
      
      // 显示每日建议弹窗
      setTimeout(() => {
        setShowDailyPopup(true);
      }, 1000);
    } catch (error: unknown) {
      // 如果没有八字信息，不显示错误
      if (error instanceof Error && error.message?.includes('八字信息')) {
        console.log('No bazi info for daily advice');
      } else {
        message.error(error instanceof Error ? error.message : '获取每日建议失败');
      }
    } finally {
      setLoading(false);
    }
  }, [setDailyAdvice, setShowDailyPopup]);

  // 处理切换账号
  const handleSwitchAccount = useCallback(() => {
    console.log('🔄 Home handleSwitchAccount: 开始切换账号流程');
    console.log('🔄 Home - 切换前用户状态:', { user, isAuthenticated: !!user });
    console.log('🔄 Home - 切换前localStorage token:', localStorage.getItem('token')?.substring(0, 20) + '...');
    
    // 先跳转到登录页面，再清除用户状态
    console.log('🔄 Home - 准备跳转到登录页面 /login');
    navigate('/login');
    
    // 延迟清除状态，确保跳转完成
    setTimeout(() => {
      logout();
      localStorage.removeItem('token');
      console.log('🔄 Home - 切换后用户状态:', { user: null });
      console.log('🔄 Home - 切换后localStorage token:', localStorage.getItem('token'));
    }, 100);
    
    message.success('已切换账号，请重新登录');
  }, [logout, navigate, user]);

  // 处理退出账号
  const handleLogout = useCallback(() => {
    console.log('🚪 Home handleLogout: 开始退出账号流程');
    console.log('🚪 Home - 退出前用户状态:', { user, isAuthenticated: !!user });
    console.log('🚪 Home - 退出前localStorage token:', localStorage.getItem('token')?.substring(0, 20) + '...');
    console.log('🚪 Home - 退出前localStorage storage:', localStorage.getItem('wuxing-app-storage'));
    
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('wuxing-app-storage');
    
    console.log('🚪 Home - 退出后用户状态:', { user: null });
    console.log('🚪 Home - 退出后localStorage token:', localStorage.getItem('token'));
    console.log('🚪 Home - 退出后localStorage storage:', localStorage.getItem('wuxing-app-storage'));
    console.log('🚪 Home - 准备跳转到根路径 /');
    
    message.success('已退出账号');
    navigate('/');
  }, [logout, navigate, user]);

  useEffect(() => {
    // 调试信息
    console.log('🏠 Home useEffect: 组件初始化/更新');
    console.log('📱 Home - localStorage token:', localStorage.getItem('token')?.substring(0, 50) + '...');
    console.log('💾 Home - localStorage storage:', localStorage.getItem('wuxing-app-storage'));
    console.log('👤 Home - 当前用户:', {
      user,
      hasUser: !!user,
      userName: user?.name,
      userGender: user?.gender,
      userBirthDate: user?.birth_date,
      userBirthTime: user?.birth_time
    });
    
    if (user) {
      // 获取八字信息
      fetchBaziInfo();
    }
  }, [user, fetchBaziInfo]);

  useEffect(() => {
    if (baziInfo) {
      // 只有在有八字信息时才获取每日建议
      fetchDailyAdvice();
    }
  }, [baziInfo, fetchDailyAdvice]);

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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4">欢迎使用五行穿衣建议系统</h1>
          <p className="text-gray-600 mb-6">请先登录以获取个性化建议</p>
          <Button type="primary" size="large" onClick={() => navigate('/login')}>
            立即登录
          </Button>
        </Card>
      </div>
    );
  }

  // 如果用户已登录但没有八字信息，引导用户填写出生信息
  if (user && !baziInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <UserOutlined className="text-6xl text-blue-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">欢迎，{user.name}！</h1>
          <p className="text-gray-600 mb-6">
            为了为您提供精准的五行穿衣建议，请先完善您的出生信息
          </p>
          <Button 
            type="primary" 
            size="large" 
            icon={<CalendarOutlined />}
            onClick={() => navigate('/profile')}
          >
            填写出生信息
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* 用户欢迎区域 */}
        <Card className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">你好，{user.name}！</h1>
              <p className="text-blue-100">今天是 {dayjs().format('YYYY年MM月DD日 dddd')}</p>
            </div>
            <div className="text-right">
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="member-type" disabled>
                      <Tag color={user.plan === 'vip' ? 'gold' : 'blue'} className="border-0">
                        {user.plan === 'vip' ? 'VIP会员' : '普通会员'}
                      </Tag>
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item 
                      key="switch" 
                      icon={<SwapOutlined />}
                      onClick={handleSwitchAccount}
                    >
                      切换账号
                    </Menu.Item>
                    <Menu.Item 
                      key="logout" 
                      icon={<LogoutOutlined />}
                      onClick={handleLogout}
                    >
                      退出账号
                    </Menu.Item>
                  </Menu>
                }
                trigger={['click']}
              >
                <div className="cursor-pointer hover:opacity-80 transition-opacity">
                  <Tag color="default" className="flex items-center gap-1 bg-white/20 border-white/30 text-white">
                    会员
                    <DownOutlined className="text-xs" />
                  </Tag>
                </div>
              </Dropdown>
            </div>
          </div>
        </Card>

        <Row gutter={[16, 16]}>
          {/* 八字信息卡片 */}
          <Col xs={24} lg={12}>
            <Card 
              title={<><UserOutlined className="mr-2" />个人八字信息</>}
              extra={
                <Button 
                  type="link" 
                  onClick={() => navigate('/profile')}
                >
                  编辑信息
                </Button>
              }
            >
              {baziInfo ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <div className="text-xs text-gray-600">年柱</div>
                      <div className="font-bold text-blue-600">{baziInfo.year_pillar}</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="text-xs text-gray-600">月柱</div>
                      <div className="font-bold text-green-600">{baziInfo.month_pillar}</div>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <div className="text-xs text-gray-600">日柱</div>
                      <div className="font-bold text-yellow-600">{baziInfo.day_pillar}</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="text-xs text-gray-600">时柱</div>
                      <div className="font-bold text-red-600">{baziInfo.hour_pillar}</div>
                    </div>
                  </div>
                  
                  <Divider className="my-3" />
                  
                  <div>
                    <div className="text-sm font-semibold mb-2">五行属性</div>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(baziInfo.wuxing_analysis).map(([element, count]) => (
                        <Tag
                          key={element}
                          color={getWuxingColor(element)}
                          className="text-xs"
                        >
                          {getWuxingName(element)}: {count}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">还未录入出生信息</p>
                  <Button type="primary" onClick={() => navigate('/profile')}>
                    立即录入
                  </Button>
                </div>
              )}
            </Card>
          </Col>

          {/* 今日建议卡片 */}
          <Col xs={24} lg={12}>
            <Card 
              title={<><CalendarOutlined className="mr-2" />今日建议</>}
              extra={
                dailyAdvice && (
                  <Button 
                    type="link" 
                    icon={<BellOutlined />}
                    onClick={() => setModalVisible(true)}
                  >
                    查看详情
                  </Button>
                )
              }
              loading={loading}
            >
              {dailyAdvice ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-semibold mb-2">推荐颜色</div>
                    <div className="flex flex-wrap gap-1">
                      {dailyAdvice.clothing_colors.map((color, index) => (
                        <Tag key={index} color="green" className="text-xs">
                          {color}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold mb-2">避忌颜色</div>
                    <div className="flex flex-wrap gap-1">
                      {dailyAdvice.avoid_colors.map((color, index) => (
                        <Tag key={index} color="red" className="text-xs">
                          {color}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold mb-2">出行方位</div>
                    <Tag color="blue">{dailyAdvice.travel_direction}</Tag>
                  </div>
                  
                  <div>
                    <div className="text-sm font-semibold mb-2">吉时</div>
                    <div className="flex flex-wrap gap-1">
                      {dailyAdvice.lucky_times.map((time, index) => (
                        <Tag key={index} color="orange" className="text-xs">
                          {time}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">
                    {baziInfo ? '正在获取今日建议...' : '请先完善个人信息'}
                  </p>
                  {!baziInfo && (
                    <Button type="primary" onClick={() => navigate('/profile')}>
                      完善信息
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* 快速操作区域 */}
        <Card title="快速操作" className="mt-6">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={12}>
              <Button 
                type="default" 
                block 
                onClick={() => setIsClothingModalOpen(true)}
                className="h-16 flex flex-col items-center justify-center"
              >
                <span className="text-lg mb-1">👔</span>
                <span className="text-xs">穿衣建议</span>
              </Button>
            </Col>
            <Col xs={12} sm={12}>
              <Button 
                type="default" 
                block 
                onClick={() => setIsTravelModalOpen(true)}
                className="h-16 flex flex-col items-center justify-center"
              >
                <span className="text-lg mb-1">🧭</span>
                <span className="text-xs">出行建议</span>
              </Button>
            </Col>
          </Row>
        </Card>
      </div>
      
      <DailyAdviceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        advice={dailyAdvice}
      />
      
      <ClothingAdviceModal
        isOpen={isClothingModalOpen}
        onClose={() => setIsClothingModalOpen(false)}
        advice={dailyAdvice ? {
          clothing: '根据今日五行属性选择合适的服装颜色',
          colors: dailyAdvice.clothing_colors,
          materials: ['棉质', '丝绸', '羊毛'],
          style: '根据五行搭配的舒适风格'
        } : undefined}
      />
      
      <TravelAdviceModal
        isOpen={isTravelModalOpen}
        onClose={() => setIsTravelModalOpen(false)}
        advice={dailyAdvice ? {
          travel: '根据今日五行属性选择合适的出行方向和时间',
          directions: [dailyAdvice.travel_direction],
          timeSlots: dailyAdvice.lucky_times,
          activities: ['散步', '购物', '拜访朋友'],
          precautions: '根据五行理论选择合适的出行时间和方向'
        } : undefined}
      />
    </div>
  );
};

export default Home;