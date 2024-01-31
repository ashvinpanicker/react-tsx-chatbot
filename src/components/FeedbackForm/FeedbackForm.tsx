import React, { useState, useEffect } from 'react';
import { Rate, Form, Drawer } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './FeedbackForm.css';

// Modal state handled in parent
interface FeedbackFormProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  resetChat: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ isModalOpen, setIsModalOpen, resetChat }) => {
  const [rating, setRating] = useState(0);

  const desc = ['Terrible', 'Bad', 'Average', 'Good', 'Wonderful'];
  const handleSaveRating = (value: number) => {
    if (value > 0) {
      // TODO: send rating to API
      console.log(`You rated: ${value} stars`);
      setRating(value);
    } else {
      console.error('Error saving rating: ', value);
    }
  };

  const closeFeedbackForm = () => {
    setIsModalOpen(false);
    resetChat();
  };

  // Auto close modal after rating
  useEffect(() => {
    if (rating > 0) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
        setRating(0);
        resetChat();
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [rating, setIsModalOpen]);

  return (
    <Drawer
      title="Rate Your Experience"
      placement="bottom"
      closable={false}
      onClose={closeFeedbackForm}
      open={isModalOpen}
      maskClosable={false}
      extra={<CloseOutlined style={{ cursor: 'pointer' }} onClick={closeFeedbackForm} />}
      // getContainer={false}
    >
      <div className="feedback-form-container">
        {rating ? (
          <p className="thanks-para">Thank you for your feedback!</p>
        ) : (
          <Form>
            <Rate defaultValue={0} style={{ fontSize: 64 }} tooltips={desc} onChange={(value) => handleSaveRating(value)} />
          </Form>
        )}
      </div>
    </Drawer>
  );
};

export default FeedbackForm;
