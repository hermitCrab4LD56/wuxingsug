import React from 'react';
import { Modal, Tag, Divider, Rate, Button, message } from 'antd';
import { CalendarOutlined, StarOutlined } from '@ant-design/icons';

import { DailyAdvice } from '../store/useStore';
import { feedbackAPI } from '../services/api';
import dayjs from 'dayjs';

interface DailyAdviceModalProps {
  visible: boolean;
  onClose: () => void;
  advice: DailyAdvice | null;
}

const DailyAdviceModal: React.FC<DailyAdviceModalProps> = ({ visible, onClose, advice }) => {
  const [rating, setRating] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  const handleRating = async (value: number) => {
    setRating(value);
    setSubmitting(true);
    
    try {
      // 这里需要advice的ID，暂时使用日期作为标识
      await feedbackAPI.submit({
        advice_id: advice?.date || dayjs().format('YYYY-MM-DD'),
        rating: value,
        comment: '每日建议评价',
        tags: ['daily_advice']
      });
      
      message.success('感谢您的评价！');
    } catch (error: unknown) {
      message.error(error instanceof Error ? error.message : '评价提交失败');
    } finally {
      setSubmitting(false);
    }
  };

  if (!advice) return null;

  return (
    <Modal
      title={
        <div className="flex items-center">
          <CalendarOutlined className="mr-2 text-blue-500" />
          <span>今日五行穿衣建议</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={[
        <div key="rating" className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <span className="mr-2">觉得建议如何？</span>
            <Rate
              value={rating}
              onChange={handleRating}
              disabled={submitting}
            />
          </div>
          <Button onClick={onClose}>关闭</Button>
        </div>
      ]}
      width={600}
      className="daily-advice-modal"
    >
      <div className="space-y-4">
        {/* 日期 */}
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800">
            {dayjs(advice.date).format('YYYY年MM月DD日 dddd')}
          </div>
        </div>

        <Divider />

        {/* 推荐颜色 */}
        <div>
          <h4 className="text-base font-semibold mb-3 flex items-center">
            <span className="w-1 h-4 bg-green-500 mr-2 rounded"></span>
            推荐颜色
          </h4>
          <div className="flex flex-wrap gap-2">
            {advice.clothing_colors.map((color, index) => (
              <Tag key={index} color="green" className="px-3 py-1 text-sm">
                {color}
              </Tag>
            ))}
          </div>
        </div>

        {/* 避忌颜色 */}
        <div>
          <h4 className="text-base font-semibold mb-3 flex items-center">
            <span className="w-1 h-4 bg-red-500 mr-2 rounded"></span>
            避忌颜色
          </h4>
          <div className="flex flex-wrap gap-2">
            {advice.avoid_colors.map((color, index) => (
              <Tag key={index} color="red" className="px-3 py-1 text-sm">
                {color}
              </Tag>
            ))}
          </div>
        </div>

        {/* 出行方位 */}
        <div>
          <h4 className="text-base font-semibold mb-3 flex items-center">
            <span className="w-1 h-4 bg-blue-500 mr-2 rounded"></span>
            出行方位
          </h4>
          <Tag color="blue" className="px-3 py-1 text-sm">
            {advice.travel_direction}
          </Tag>
        </div>

        {/* 吉时 */}
        <div>
          <h4 className="text-base font-semibold mb-3 flex items-center">
            <span className="w-1 h-4 bg-orange-500 mr-2 rounded"></span>
            吉时
          </h4>
          <div className="flex flex-wrap gap-2">
            {advice.lucky_times.map((time, index) => (
              <Tag key={index} color="orange" className="px-3 py-1 text-sm">
                {time}
              </Tag>
            ))}
          </div>
        </div>

        {/* 详细建议 */}
        <div>
          <h4 className="text-base font-semibold mb-3 flex items-center">
            <StarOutlined className="mr-2 text-yellow-500" />
            详细建议
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 leading-relaxed">
              {advice.suggestions}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default DailyAdviceModal;