import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Tag, Row, Col, Divider } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { useStore } from '../store/useStore';
import { baziAPI } from '../services/api';
import dayjs from 'dayjs';

interface DailyAdvice {
  clothing_colors: string[];
  avoid_colors: string[];
  travel_direction: string;
  lucky_times: string[];
  general_advice: string;
  wuxing_analysis: {
    dominant_element: string;
    element_strength: number;
  };
}

const DailyRecommendation: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const { user, baziInfo } = useStore();
  const [dailyAdvice, setDailyAdvice] = useState<DailyAdvice | null>(null);
  const [loading, setLoading] = useState(false);

  // 五行颜色映射
  const getWuxingColor = (element: string) => {
    const colorMap: { [key: string]: string } = {
      wood: 'green',
      fire: 'red',
      earth: 'orange',
      metal: 'blue',
      water: 'cyan'
    };
    return colorMap[element] || 'default';
  };

  // 五行名称映射
  const getWuxingName = (element: string) => {
    const nameMap: { [key: string]: string } = {
      wood: '木',
      fire: '火',
      earth: '土',
      metal: '金',
      water: '水'
    };
    return nameMap[element] || element;
  };

  // 获取指定日期的建议
  const fetchDailyAdvice = async (targetDate: string) => {
    if (!baziInfo) return;
    
    setLoading(true);
    try {
      const response = await baziAPI.getDailyAdvice(targetDate);
      if (response.data) {
        setDailyAdvice(response.data);
      }
    } catch (error) {
      console.error('获取每日建议失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (date && baziInfo) {
      fetchDailyAdvice(date);
    }
  }, [date, baziInfo]);

  // 如果用户未登录，跳转到登录页
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">请先登录查看每日建议</p>
            <Button type="primary" onClick={() => navigate('/login')}>
              立即登录
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const selectedDate = date ? dayjs(date) : dayjs();
  const formattedDate = selectedDate.format('YYYY年MM月DD日');
  const weekDay = selectedDate.format('dddd');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* 页面头部 */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            type="text" 
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/profile')}
            className="text-gray-600 hover:text-gray-800"
          >
            返回
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{formattedDate}</h1>
            <p className="text-gray-600">{weekDay}</p>
          </div>
          <div className="w-16"></div>
        </div>

        {!baziInfo ? (
          <Card>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">还未录入出生信息，无法获取个性化建议</p>
              <Button type="primary" onClick={() => navigate('/profile')}>
                立即录入
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* 五行分析卡片 */}
            <Card 
              title={<><UserOutlined className="mr-2" />当日五行分析</>}
              className="mb-6"
              loading={loading}
            >
              {dailyAdvice?.wuxing_analysis ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">主导五行</div>
                    <Tag 
                      color={getWuxingColor(dailyAdvice.wuxing_analysis.dominant_element)}
                      className="text-lg px-4 py-1"
                    >
                      {getWuxingName(dailyAdvice.wuxing_analysis.dominant_element)}
                    </Tag>
                    <div className="text-xs text-gray-500 mt-2">
                      强度: {dailyAdvice.wuxing_analysis.element_strength}%
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  正在分析当日五行属性...
                </div>
              )}
            </Card>

            <Row gutter={[16, 16]}>
              {/* 穿衣建议卡片 */}
              <Col xs={24} lg={12}>
                <Card 
                  title={<><span className="mr-2">👔</span>穿衣建议</>}
                  loading={loading}
                >
                  {dailyAdvice ? (
                    <div className="space-y-4">
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
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      正在获取穿衣建议...
                    </div>
                  )}
                </Card>
              </Col>

              {/* 出行建议卡片 */}
              <Col xs={24} lg={12}>
                <Card 
                  title={<><span className="mr-2">🧭</span>出行建议</>}
                  loading={loading}
                >
                  {dailyAdvice ? (
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold mb-2">出行方位</div>
                        <Tag color="blue" className="text-sm px-3 py-1">
                          {dailyAdvice.travel_direction}
                        </Tag>
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
                    <div className="text-center py-8 text-gray-500">
                      正在获取出行建议...
                    </div>
                  )}
                </Card>
              </Col>
            </Row>

            {/* 综合建议卡片 */}
            <Card 
              title={<><CalendarOutlined className="mr-2" />综合建议</>}
              className="mt-6"
              loading={loading}
            >
              {dailyAdvice?.general_advice ? (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {dailyAdvice.general_advice}
                  </p>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  正在生成综合建议...
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default DailyRecommendation;