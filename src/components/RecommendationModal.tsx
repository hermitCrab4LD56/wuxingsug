import React from 'react';
import { X } from 'lucide-react';

interface DailyRecommendation {
  date: string;
  wuxing_element: string;
  element_description: string;
  clothing_colors: string[];
  diet_suggestions: string[];
  behavior_advice: string[];
  personalized_tips: string[];
}

interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: DailyRecommendation | null;
  selectedDate: Date | null;
  loading: boolean;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({
  isOpen,
  onClose,
  recommendation,
  selectedDate,
  loading
}) => {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  };

  const getElementColor = (element: string) => {
    const colors = {
      '金': 'text-yellow-600 bg-yellow-50',
      '木': 'text-green-600 bg-green-50',
      '水': 'text-blue-600 bg-blue-50',
      '火': 'text-red-600 bg-red-50',
      '土': 'text-amber-600 bg-amber-50'
    };
    return colors[element as keyof typeof colors] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              每日五行推荐
            </h2>
            {selectedDate && (
              <p className="text-sm text-gray-600 mt-1">
                {formatDate(selectedDate)}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">正在生成推荐...</span>
            </div>
          ) : recommendation ? (
            <div className="space-y-6">
              {/* 当日五行属性 */}
              <div className="text-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full ${getElementColor(recommendation.wuxing_element)}`}>
                  <span className="text-lg font-bold">{recommendation.wuxing_element}</span>
                  <span className="ml-2 text-sm">属性日</span>
                </div>
                <p className="text-gray-600 mt-2">{recommendation.element_description}</p>
              </div>

              {/* 穿衣颜色推荐 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  穿衣颜色推荐
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recommendation.clothing_colors.map((color, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 shadow-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* 饮食建议 */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  饮食建议
                </h3>
                <ul className="space-y-2">
                  {recommendation.diet_suggestions.map((suggestion, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 行为建议 */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  行为建议
                </h3>
                <ul className="space-y-2">
                  {recommendation.behavior_advice.map((advice, index) => (
                    <li key={index} className="text-gray-700 flex items-start">
                      <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {advice}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 个性化建议 */}
              {recommendation.personalized_tips.length > 0 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-amber-500 rounded-full mr-2"></span>
                    个性化建议
                  </h3>
                  <ul className="space-y-2">
                    {recommendation.personalized_tips.map((tip, index) => (
                      <li key={index} className="text-gray-700 flex items-start">
                        <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无推荐数据</p>
            </div>
          )}
        </div>

        {/* 底部 */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationModal;