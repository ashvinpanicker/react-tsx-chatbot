import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import TypingChatMessage from './components/TypingChatMessage';
import './Chatbot.css';
import ChatHeader from './components/ChatHeader';

interface ChatMessage {
  id: number;
  text?: string;
  isUser: boolean;
  isTyping?: boolean;
}

const serverURL = 'https://api.sell247.ai/v2';
const credentials = {
  username: 'ashvin',
  password: '94531Achu',
  apiKey: '950148f6-38c0-46cb-b075-afa2c716dc61'
}

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [sessionToken, setSessionToken] = useState<string | null>(null); // Store the session token
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Call the /login endpoint on initialization
    const login = async () => {
      try {
        const response = await fetch(`${serverURL}/login`, {
          method: 'POST',
          headers: new Headers({
            'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`), // Add your username and password
            'Content-Type': 'application/json',
          }),
        });

        if (response.ok) {
          const { data } = await response.json();
          // Store the session token
          console.log(data)
          setSessionToken(data.session_token);
        } else {
          console.error('Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    login();
  }, []); // Run once on component mount

  useEffect(() => {
    // Display introductory message only if there are no existing messages
    if (messages.length === 0) {
      addMessage({
        id: 1,
        text: 'Welcome! How can I assist you today?',
        isUser: false,
      });
    }
  }, [messages]);

  useLayoutEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  const addMessage = (message: ChatMessage) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputText.trim() === '') return;
    let question = inputText;
    setInputText('');

    // Display user message
    const userMessage: ChatMessage = { id: messages.length + 1, text: question, isUser: true };
    addMessage(userMessage);

    // Display typing animation
    const typingMessage: ChatMessage = { id: messages.length + 2, isTyping: true, isUser: false };
    addMessage(typingMessage);

    const responseText = await askEndpoint(question);

    // Remove the typing status widget message and replace it with the response message
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) =>
        msg.id === typingMessage.id ? { id: msg.id, text: responseText, isUser: false } : msg
      );

      return updatedMessages;
    });
  };

  const askEndpoint = async (question: string): Promise<string> => {
    try {
      const response = await fetch(`${serverURL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionToken}`,
          'Apikey': credentials.apiKey
        },
        body: JSON.stringify({ question }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.message;
      } else {
        console.error('Ask endpoint failed');
        return 'Sorry, I encountered an error.';
      }
    } catch (error) {
      console.error('Error:', error);
      return 'Sorry, I encountered an error.';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      <ChatHeader />
      <div className="chatbot-messages" ref={chatContainerRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={message.isUser ? 'user-message' : 'bot-message'}
            style={{ animationDelay: message.isTyping ? '0s' : '0.5s' }}
          >
            {message.isTyping ? <TypingChatMessage /> : message.text}
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          value={inputText}
          onChange={handleUserInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
