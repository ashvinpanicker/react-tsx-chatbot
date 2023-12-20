import React from "react";
import "./ChatHeader.css";

const ChatHeader: React.FC = () => {
    const closeChatWindow = () => {
        const chatWindow = document.getElementById('chat-window');
        if (chatWindow) {
          chatWindow.style.display = 'none';
        }
    };
    return (
      <div className="chatbot-header">
        <div className="header-content">
          <span className="header-title">Chatbot</span>
          <button className="close-button" onClick={() => closeChatWindow()}>
            X
          </button>
        </div>
      </div>
    );
};
  
  export default ChatHeader;