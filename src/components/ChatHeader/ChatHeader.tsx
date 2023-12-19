import React from "react";
import "./ChatHeader.css";

const ChatHeader: React.FC = () => {
    return (
      <div className="chatbot-header">
        <div className="header-content">
          <span className="header-title">Chatbot</span>
          <button className="close-button" onClick={() => console.log('Close button clicked')}>
            X
          </button>
        </div>
      </div>
    );
};
  
  export default ChatHeader;