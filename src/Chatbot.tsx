import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ApiOutlined } from '@ant-design/icons';
import TypingChatMessage from './components/TypingChatMessage';
import './Chatbot.css';
import ChatHeader from './components/ChatHeader';
import { extractTags } from './utils';

interface ChatMessage {
  id: number;
  text?: string;
  isUser: boolean;
  isTyping?: boolean;
  className?: string;
}

interface ButtonAction {
  type: 'openLink';
  link: string;
  text: string;
}

interface ButtonChatMessage extends ChatMessage {
  action?: ButtonAction;
}

const serverURL = 'https://api.sell247.ai/v2';
const credentials = {
  username: 'ashvin',
  password: '94531Achu',
  apiKey: '950148f6-38c0-46cb-b075-afa2c716dc61',
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isAPIAlive, setIsAPIAlive] = useState<boolean>(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null); // Store the session token
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pingServer = async () => {
      try {
        const response = await fetch(`${serverURL}/ping`, {
          method: 'GET',
        });

        if (response.ok) {
          const { data } = await response.json();
          console.log('Ping response', response, data);
          setIsAPIAlive(true);
        } else {
          console.error('Ping Server failed', response);
        }
      } catch (error) {
        console.error('Error connecting to Server:', error);
      }
    };

    const login = async () => {
      try {
        const response = await fetch(`${serverURL}/login`, {
          method: 'POST',
          headers: new Headers({
            // Authorization: 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),
            apikey: credentials.apiKey,
            'Content-Type': 'application/json',
          }),
        });

        if (response.ok) {
          const { data } = await response.json();
          // Store the session token
          // console.log(data);
          setSessionToken(data.session_token);
        } else {
          console.error('Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    // Call ping endpoint on initialization
    pingServer();
    // Login if /ping was successful
    if (isAPIAlive) login();
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
    const question = inputText;
    setInputText('');

    // Display user message
    const userMessage: ChatMessage = { id: messages.length + 1, text: question, isUser: true };
    addMessage(userMessage);

    // TODO remove this temp test stuff
    if (question.toLowerCase() === 'interested') {
      promptSiteVisit();
      return;
    }
    // Display typing animation
    const typingMessage: ChatMessage = { id: messages.length + 2, isTyping: true, isUser: false };
    addMessage(typingMessage);

    const responseText = await askEndpoint(question);

    // Remove the typing status widget message and replace it with the response message
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) => (msg.id === typingMessage.id ? { id: msg.id, text: responseText, isUser: false } : msg));

      return updatedMessages;
    });
  };

  const promptSiteVisit = () => {
    const siteVisitButton: ButtonChatMessage = {
      id: messages.length + 1,
      text: 'Come to our site and take a look for yourself.',
      isUser: false,
      className: 'site-visit-button',
      action: {
        type: 'openLink',
        link: 'https://calendly.com/arihanthomes/site-visit',
        text: 'Book a Site Visit',
      },
    };

    addMessage(siteVisitButton);
  };

  const handleButtonClick = (action: ButtonAction) => {
    if (action.type === 'openLink') {
      window.open(action.link, '_blank'); // Open link in a new tab
    }
  };

  const askEndpoint = async (question: string): Promise<string> => {
    try {
      const response = await fetch(`${serverURL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          Apikey: credentials.apiKey,
        },
        body: JSON.stringify({ question }),
      });

      if (response.ok) {
        const { data } = await response.json();
        const tagsData = extractTags(data.answer);
        console.log('Tags Found: ', tagsData);
        const interestedTags = tagsData.filter((d) => d.tag == 'interest');
        if (interestedTags.length > 0) {
          // Interest Tag found
          console.log('User is interested in -> ', interestedTags);
          promptSiteVisit();
        }
        return data.answer_without_tags;
      } else {
        console.error('Ask endpoint failed', response.json());
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

  function renderMessage(message: ButtonChatMessage): React.ReactNode {
    if (message.action && message.action.type === 'openLink') {
      return (
        <div className={`site-visit-message`} key={message.id}>
          {message.text}
          <button className={message.className} onClick={() => handleButtonClick(message.action!)}>
            {message.action.text}
          </button>
        </div>
      );
    } else {
      return message.text;
    }
  }

  return (
    <div className="chatbot-container">
      {isAPIAlive ? (
        <>
          <ChatHeader />
          <div className="chatbot-messages" ref={chatContainerRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`${message.isUser ? 'user-message' : 'bot-message'}`}
                style={{ animationDelay: message.isTyping ? '0s' : '0.5s' }}
              >
                {message.isTyping ? <TypingChatMessage /> : renderMessage(message)}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input type="text" value={inputText} onChange={handleUserInput} onKeyDown={handleKeyDown} placeholder="Type your message..." autoFocus />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </>
      ) : (
        <div className="chatbot-error-container">
          <ApiOutlined style={{ fontSize: '72px', color: '#444', marginBottom: 40 }} />
          <p style={{ fontSize: '20px', color: '#444', paddingBottom: 20 }}>Could not establish connection to server</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
