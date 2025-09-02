import React from 'react';
import { Link } from 'react-router-dom';
import { Shirt, Calendar, Compass, Star, ArrowRight, User, LogIn } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <Shirt className="w-8 h-8" />,
      title: "五行穿衣建议",
      description: "根据您的生辰八字，为您推荐每日最适合的穿衣颜色，助您提升运势。"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "每日运势指导",
      description: "获取个性化的每日运势分析，包括幸运时辰、方位和注意事项。"
    },
    {
      icon: <Compass className="w-8 h-8" />,
      title: "出行方位建议",
      description: "基于五行理论，为您推荐最佳的出行方向和时间安排。"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "个人命理分析",
      description: "深度解析您的八字命盘，了解五行属性和性格特征。"
    }
  ];

  const colorExamples = [
    { color: "红色", element: "火", description: "适合火旺日，增强活力与热情" },
    { color: "绿色", element: "木", description: "适合木旺日，促进成长与发展" },
    { color: "蓝色", element: "水", description: "适合水旺日，增强智慧与灵感" },
    { color: "黄色", element: "土", description: "适合土旺日，稳定情绪与财运" },
    { color: "白色", element: "金", description: "适合金旺日，提升决断力与贵人运" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Star className="w-8 h-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">五行穿衣助手</h1>
            </div>

          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            传统智慧遇见现代生活
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            基于千年五行理论，为您提供个性化的穿衣建议和运势指导。
            <br />
            让古老的智慧助您在现代生活中趋吉避凶，提升每日运势。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
            >
              立即开始体验
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 border-2 border-purple-600 text-purple-600 text-lg font-semibold rounded-xl hover:bg-purple-50 transition-all"
            >
              已有账号？登录
            </Link>
          </div>
        </div>
      </section>

      {/* What is Wuxing Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">什么是五行穿衣？</h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              五行穿衣是基于中国传统五行理论的穿衣指导方法，通过分析个人八字和每日五行旺衰，
              推荐最适合的穿衣颜色，以达到调和五行、提升运势的目的。
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {colorExamples.map((item, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 shadow-md"
                  style={{
                    backgroundColor: 
                      item.color === '红色' ? '#ef4444' :
                      item.color === '绿色' ? '#22c55e' :
                      item.color === '蓝色' ? '#3b82f6' :
                      item.color === '黄色' ? '#eab308' : '#6b7280'
                  }}
                ></div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.color}</h4>
                <p className="text-sm text-purple-600 font-medium mb-2">五行属{item.element}</p>
                <p className="text-xs text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">核心功能特色</h3>
            <p className="text-lg text-gray-600">
              专业的命理分析系统，为您提供全方位的生活指导
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all hover:transform hover:scale-105">
                <div className="text-purple-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h4>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">如何使用？</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">注册账号</h4>
              <p className="text-gray-600">填写您的基本信息和准确的出生时间</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">生成八字</h4>
              <p className="text-gray-600">系统自动计算您的八字命盘和五行属性</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">获取建议</h4>
              <p className="text-gray-600">每日获取个性化的穿衣和运势指导</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">
            开启您的五行穿衣之旅
          </h3>
          <p className="text-lg text-gray-600 mb-8">
            加入我们，让传统智慧为您的现代生活增添色彩
          </p>
          <Link
            to="/register"
            className="inline-flex items-center px-8 py-4 bg-purple-600 text-white text-lg font-semibold rounded-xl hover:bg-purple-700 transition-all transform hover:scale-105 shadow-lg"
          >
            免费注册体验
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-6 h-6 text-purple-400" />
                <h4 className="text-lg font-semibold">五行穿衣助手</h4>
              </div>
              <p className="text-gray-400">
                传承千年智慧，服务现代生活
              </p>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">功能特色</h5>
              <ul className="space-y-2 text-gray-400">
                <li>个性化穿衣建议</li>
                <li>每日运势分析</li>
                <li>八字命理解读</li>
                <li>出行方位指导</li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-semibold mb-4">快速开始</h5>
              <div className="space-y-2">
                <Link to="/register" className="block text-purple-400 hover:text-purple-300 transition-colors">
                  注册账号
                </Link>
                <Link to="/login" className="block text-purple-400 hover:text-purple-300 transition-colors">
                  用户登录
                </Link>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 五行穿衣助手. 传统文化与现代科技的完美结合.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;