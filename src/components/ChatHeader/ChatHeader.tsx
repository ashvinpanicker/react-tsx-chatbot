import React, { useState } from 'react';
import { CloseOutlined, ArrowsAltOutlined, ShrinkOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import './ChatHeader.css';

const ChatHeader: React.FC = () => {
  const [isFullScreen, setFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setFullScreen(!isFullScreen);

    if (isFullScreen) window.parent.postMessage('windowedChat', '*');
    else window.parent.postMessage('fullScreenChat', '*');
  };

  const closeChatWindow = () => {
    const chatWindow = document.getElementById('chat-window');
    if (chatWindow) {
      chatWindow.style.display = 'none';
    }

    // Notify the parent window that the chat window is closed
    window.parent.postMessage('closeChatWindow', '*');
  };

  return (
    <div className="chatbot-header">
      <div className="header-content">
        <span className="header-title">
          <span className="header-online-circle"></span>
          Arihant AI Chat
        </span>

        <div className="header-buttons">
          <Button
            type="default"
            className="full-screen-button"
            shape="circle"
            icon={isFullScreen ? <ShrinkOutlined /> : <ArrowsAltOutlined />}
            size={'small'}
            onClick={toggleFullScreen}
          />
          <Button
            type="primary"
            // danger
            className="close-button"
            shape="circle"
            icon={<CloseOutlined />}
            size={'small'}
            onClick={closeChatWindow}
          />
        </div>
        {/* <button className="close-button" >
            X
          </button> */}
      </div>
    </div>
  );
};

export default ChatHeader;
