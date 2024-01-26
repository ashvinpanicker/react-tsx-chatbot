import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ApiOutlined, LoadingOutlined } from '@ant-design/icons';
import TypingChatMessage from './components/TypingChatMessage';
import './Chatbot.css';
import ChatHeader from './components/ChatHeader';
import { extractTags, credentials } from './utils';

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

const calendlyPropertyOrder = ['Vipassana', 'Tiara', 'Vilaya', 'Vanya Vilas'];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAPIAlive, setIsAPIAlive] = useState<boolean>(false);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [idleTimeoutSeconds, setIdleTimeoutSeconds] = useState<number>(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    const pingServer = async () => {
      try {
        const response = await fetch(`${credentials.serverURL}/ping`, {
          method: 'GET',
        });

        if (response.ok) {
          // const { data } = await response.json();
          // console.log('Ping response', response, data);
          setIsAPIAlive(true);
          login();
        } else {
          console.error('Ping Server failed', response);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error connecting to Server:', error);
      }
    };

    const login = async () => {
      try {
        const response = await fetch(`${credentials.serverURL}/login`, {
          method: 'POST',
          headers: new Headers({
            // Authorization: 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),
            apikey: credentials.apiKey,
            'Content-Type': 'application/json',
          }),
        });

        if (response.ok) {
          const { data } = await response.json();
          // console.log(data);
          // Store the session token
          setSessionToken(data.session_token);
          setIdleTimeoutSeconds(data.idle_timeout_seconds);
          setIsLoading(false);
        } else {
          console.error('Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    // Call ping endpoint on initialization
    pingServer();
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
    if (inputText.trim() === '' || !sessionToken) return;
    const question = inputText;
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
      const updatedMessages = prevMessages.map((msg) => (msg.id === typingMessage.id ? { id: msg.id, text: responseText, isUser: false } : msg));

      return updatedMessages;
    });
  };

  const promptSiteVisit = (interestedProperty: string) => {
    // To prefill calendly page with interested property
    const a2 = calendlyPropertyOrder.indexOf(interestedProperty) + 1;
    const siteVisitButton: ButtonChatMessage = {
      id: messages.length + 1,
      text: `Experience the magic on our site at ${interestedProperty} - your gateway to a world of possibilities awaits. Come and explore for yourself!`,
      isUser: false,
      className: 'site-visit-button',
      action: {
        type: 'openLink',
        link: `https://calendly.com/arihanthomes/site-visit?a2=${a2}`,
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

  const askEndpoint = async (question: string): Promise<any> => {
    try {
      const response = await fetch(`${credentials.serverURL}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
          Apikey: credentials.apiKey,
        },
        body: JSON.stringify({ question }),
      });

      if (response) {
        const jsonResponse = await response.json();
        // HTTP 200
        if (response.ok) {
          // Check answer for tags
          const tagsData = extractTags(jsonResponse.data.answer);
          console.log('Tags Found: ', tagsData);
          const interestedTags = tagsData.filter((d) => d.tag == 'interest');
          if (interestedTags.length > 0) {
            // Interest Tag found
            console.log('User is interested in -> ', interestedTags);
            promptSiteVisit(interestedTags[0].content);
          }
          return jsonResponse.data.answer_without_tags;
        } else {
          console.error('Ask endpoint failed', jsonResponse);
          return jsonResponse.message;
        }
      }
    } catch (error) {
      console.error('Error:', error);
      return `Error: ${error}`;
      // return 'Sorry, I encountered an unexpected error.';
    }
  };

  const logoutEndpoint = async () => {
    try {
      const response = await fetch(`${credentials.serverURL}/logout`, {
        method: 'POST',
        headers: new Headers({
          Authorization: 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),
          apikey: credentials.apiKey,
          'Content-Type': 'application/json',
        }),
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        // console.log(data);
        // Store the session token
        return jsonResponse.message;
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error:', error);
      return `Error while logging out: ${error}`;
    }
  };

  useEffect(() => {
    let timeoutId: number | undefined;

    const resetTimeout = () => {
      clearTimeout(timeoutId);
      if (idleTimeoutSeconds > 0) timeoutId = window.setTimeout(logout, idleTimeoutSeconds * 1000);
    };

    const logout = () => {
      console.log('Logging out...');
      const timeoutMessage: ChatMessage = {
        id: messages.length + 1,
        text: 'You were timed out due to inactivity. Please refresh the page to restart the chat',
        isUser: false,
      };
      addMessage(timeoutMessage);
      setSessionToken(null);
      removeActivityEventListeners();
      logoutEndpoint(); // Close session on idle timeout

      // TODO Add reload window functionality for the iframe
    };

    const handleActivity = () => {
      resetTimeout();
    };

    // const handleInactivity = () => {
    //   setIsActive(false);
    // };

    const removeActivityEventListeners = () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('scroll', handleActivity);
    };

    // Set up initial timeout
    resetTimeout();

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Add event listener for user inactivity
    // window.addEventListener('blur', handleInactivity);

    // Clean up event listeners on component unmount
    return () => {
      clearTimeout(timeoutId);
      removeActivityEventListeners();
      // window.removeEventListener('blur', handleInactivity);
    };
  }, [idleTimeoutSeconds]);

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
      {isAPIAlive && !isLoading ? (
        <>
          <ChatHeader />
          <div className="chatbot-messages" ref={chatContainerRef}>
            {messages.map((message, index) => (
              <div
                key={`${message.id}_${index}`}
                className={`${message.isUser ? 'user-message' : 'bot-message'}`}
                style={{ animationDelay: message.isTyping ? '0s' : '0.5s' }}
              >
                {message.isTyping ? <TypingChatMessage /> : renderMessage(message)}
              </div>
            ))}
          </div>
          <div className="chatbot-input">
            <input type="text" value={inputText} onChange={handleUserInput} onKeyDown={handleKeyDown} placeholder="Type your message..." autoFocus />
            <button disabled={!sessionToken} style={sessionToken ? {} : { cursor: 'not-allowed', background: 'gray' }} onClick={handleSendMessage}>
              Send
            </button>
          </div>
        </>
      ) : isLoading ? (
        <div className="chatbot-status-container">
          <LoadingOutlined style={{ fontSize: '72px', color: '#444', marginBottom: 40 }} />
          <p className="chatbot-status-message">Connecting to server...</p>
        </div>
      ) : (
        <div className="chatbot-status-container">
          <ApiOutlined style={{ fontSize: '72px', color: '#444', marginBottom: 40 }} />
          <p className="chatbot-status-message">Could not establish connection to server</p>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
