import React, { FC } from 'react';
import './TypingChatMessage.css';

interface TypingChatMessageProps {
  payload?: {
    theme: string;
  };
}

const TypingChatMessage: FC<TypingChatMessageProps> = () => {
  const { botMessageBox } = { botMessageBox: { backgroundColor: '#3498db', loadingDotColor: '#444' } };

  return (
    <div className="typing-status-widget">
      <div className="dots-container">
        <div className="dot dot-1" style={{ backgroundColor: botMessageBox?.loadingDotColor }}></div>
        <div className="dot dot-2" style={{ backgroundColor: botMessageBox?.loadingDotColor }}></div>
        <div className="dot dot-3" style={{ backgroundColor: botMessageBox?.loadingDotColor }}></div>
      </div>
    </div>
  );
};

export default TypingChatMessage;
