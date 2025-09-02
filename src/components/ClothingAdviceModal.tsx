import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { feedbackAPI } from '../services/api';
import dayjs from 'dayjs';

interface ClothingAdviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  advice?: {
    clothing?: string;
    colors?: string[];
    materials?: string[];
    style?: string;
  };
}

const ClothingAdviceModal: React.FC<ClothingAdviceModalProps> = ({
  isOpen,
  onClose,
  advice
}) => {
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const defaultAdvice = {
    clothing: '今日适合穿着舒适的棉质衣物，颜色以暖色调为主',
    colors: ['红色', '橙色', '黄色'],
    materials: ['棉质', '丝绸', '羊毛'],
    style: '休闲舒适风格'
  };

  const currentAdvice = advice || defaultAdvice;

  const handleRating = async (value: number) => {
    console.log('🌟 [ClothingAdviceModal] 用户点击星星评价:', {
      rating: value,
      timestamp: new Date().toISOString(),
      currentRating: rating,
      submitting: submitting
    });
    
    setRating(value);
    setSubmitting(true);
    
    // 准备评价数据
    const feedbackData = {
      advice_id: `clothing-${dayjs().format('YYYY-MM-DD')}`,
      rating: value,
      comment: '穿衣建议评价',
      tags: ['clothing_advice']
    };
    
    console.log('📝 [ClothingAdviceModal] 准备提交的评价数据:', {
      data: feedbackData,
      timestamp: new Date().toISOString()
    });
    
    try {
      console.log('🚀 [ClothingAdviceModal] 开始调用feedbackAPI.submit...');
      console.log('🔗 [ClothingAdviceModal] API基础URL:', import.meta.env.PROD ? '/api' : 'http://localhost:3001/api');
      
      const response = await feedbackAPI.submit(feedbackData);
      
      console.log('✅ [ClothingAdviceModal] API调用成功:', {
        response,
        timestamp: new Date().toISOString()
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 2000);
    } catch (error: unknown) {
      console.error('❌ [ClothingAdviceModal] 评价提交失败 - 详细错误信息:', {
        error,
        errorMessage: error instanceof Error ? error.message : String(error),
        errorStack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        feedbackData
      });
      
      // 检查错误类型
      if (error && typeof error === 'object') {
        console.error('❌ [ClothingAdviceModal] 错误对象详情:', {
          errorType: typeof error,
          errorConstructor: error.constructor?.name,
          errorKeys: Object.keys(error),
          timestamp: new Date().toISOString()
        });
        
        // 如果是axios错误
        if ('response' in error) {
          console.error('❌ [ClothingAdviceModal] Axios响应错误:', {
            status: (error as any).response?.status,
            statusText: (error as any).response?.statusText,
            data: (error as any).response?.data,
            headers: (error as any).response?.headers,
            timestamp: new Date().toISOString()
          });
        }
        
        // 如果是网络错误
        if ('request' in error) {
          console.error('❌ [ClothingAdviceModal] 网络请求错误:', {
            request: (error as any).request,
            timestamp: new Date().toISOString()
          });
        }
      }
      
      // 显示友好的错误提示，但不阻止用户继续使用
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
      }, 2000);
    } finally {
      console.log('🏁 [ClothingAdviceModal] 评价提交流程结束:', {
        finalRating: value,
        submitting: false,
        timestamp: new Date().toISOString()
      });
      setSubmitting(false);
    }
  };

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
          穿衣建议
        </h2>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">今日建议</h3>
            <p className="text-gray-600">{currentAdvice.clothing}</p>
          </div>
          
          <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">推荐颜色</h3>
            <div className="flex flex-wrap gap-2">
              {currentAdvice.colors.map((color, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm"
                >
                  {color}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">推荐材质</h3>
            <div className="flex flex-wrap gap-2">
              {currentAdvice.materials.map((material, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-white rounded-full text-sm text-gray-600 shadow-sm"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">风格建议</h3>
            <p className="text-gray-600">{currentAdvice.style}</p>
          </div>
        </div>
        
        {/* 评价区域 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-600">觉得建议如何？</span>
            {submitted && (
              <span className="text-sm text-green-600">感谢您的评价！</span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRating(star)}
                disabled={submitting}
                className={`p-1 transition-colors ${
                  submitting ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:scale-110'
                }`}
              >
                <Star
                  size={24}
                  className={`${
                    star <= rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-400'
                  } transition-colors`}
                />
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
        >
          知道了
        </button>
      </div>
    </div>
  );
};

export default ClothingAdviceModal;