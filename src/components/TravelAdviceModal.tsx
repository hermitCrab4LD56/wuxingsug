import React from 'react';
import { X, MapPin, Clock, Compass } from 'lucide-react';

interface TravelAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  advice?: {
    travel?: string;
    directions?: string[];
    timeSlots?: string[];
    activities?: string[];
    precautions?: string;
  };
}

const TravelAdviceModal: React.FC<TravelAdviceModalProps> = ({
  isOpen,
  onClose,
  advice
}) => {
  if (!isOpen) return null;

  const defaultAdvice = {
    travel: '今日适合短途出行，选择阳光充足的路线',
    directions: ['东方', '南方', '东南方'],
    timeSlots: ['上午9-11点', '下午2-4点'],
    activities: ['散步', '购物', '拜访朋友'],
    precautions: '注意保暖，携带雨具以防天气变化'
  };

  const currentAdvice = advice || defaultAdvice;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          出行建议
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-100 to-indigo-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
              <MapPin size={16} className="mr-2" />
              今日建议
            </h3>
            <p className="text-gray-600">{currentAdvice.travel}</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
              <Compass size={16} className="mr-2" />
              吉利方向
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentAdvice.directions.map((direction, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm"
                >
                  {direction}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-100 to-red-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2 flex items-center">
              <Clock size={16} className="mr-2" />
              最佳时间
            </h3>
            <div className="flex flex-wrap gap-2">
              {currentAdvice.timeSlots.map((time, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm"
                >
                  {time}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">推荐活动</h3>
            <div className="flex flex-wrap gap-2">
              {currentAdvice.activities.map((activity, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm"
                >
                  {activity}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-100 to-amber-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">注意事项</h3>
            <p className="text-gray-600">{currentAdvice.precautions}</p>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full mt-6 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-colors"
        >
          知道了
        </button>
      </div>
    </div>
  );
};

export default TravelAdviceModal;