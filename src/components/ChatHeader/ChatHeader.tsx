import React, { useState } from 'react';
import { CloseOutlined, FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import './ChatHeader.css';

const ChatHeader: React.FC = () => {
  const [isFullScreen, setFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setFullScreen(!isFullScreen);
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
        <span className="header-title">Chatbot</span>
        <Button
          type="default"
          className="full-screen-button"
          shape="circle"
          icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
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
        {/* <button className="close-button" >
            X
          </button> */}
      </div>
    </div>
  );
};

export default ChatHeader;
