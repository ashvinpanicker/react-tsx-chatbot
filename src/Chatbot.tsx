import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { ApiOutlined, LoadingOutlined } from '@ant-design/icons';
import TypingChatMessage from './components/TypingChatMessage';
import ChatHeader from './components/ChatHeader';
import FeedbackForm from './components/FeedbackForm';
import { extractTags, credentials } from './utils';
import './Chatbot.css';

interface ChatMessage {
  id: number;
  text?: string;
  isUser: boolean;
  isTyping?: boolean;
  className?: string;
  timestamp?: Date;
}

interface ButtonAction {
  type: 'openLink';
  link: string;
  text: string;
}

interface ButtonChatMessage extends ChatMessage {
  action?: ButtonAction;
}

// TODO get from backend
const calendlyPropertyOrder = ['Vipassana', 'Tiara', 'Vilaya', 'Vanya Vilas'];

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAPIAlive, setIsAPIAlive] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  // const [sessionTimeoutSeconds, setSessionTimeoutSeconds] = useState<number>(0);
  const [idleTimeoutSeconds, setIdleTimeoutSeconds] = useState<number>(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [botIntroMessage, setBotIntroMessage] = useState<string>('Welcome! How can I assist you today?');
  const [botIntroSuggestions, setBotIntroSuggestions] = useState<Array<string>>([
    'What properties are available for sale?',
    'I am looking for a new home for a family of 4',
    'Show me properties in Chennai',
  ]);

  const initializeChatbot = () => {
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
          credentials: 'include',
          headers: new Headers({
            'Content-Type': 'application/json',
            // 'Authorization': 'Basic ' + btoa(`${credentials.username}:${credentials.password}`),
            Authorization: `Bearer ${credentials.apiKey}`,
          }),
        });

        if (response.ok) {
          const { data } = await response.json();
          // console.log(data);
          // Store the userId
          setUserId(data.user_id);
          setIdleTimeoutSeconds(data.idle_timeout_seconds);
          if (data.welcome_message) {
            setBotIntroMessage(data.welcome_message);
          }
          if (data.sample_intros) {
            const questionsList = data.sample_intros.intros;
            // Select 3 suggested questions randomly from the list
            if (questionsList >= 3) {
              const selectedQuestionSuggestions = questionsList
                .slice() // Create a shallow copy of the array
                .sort(() => Math.random() - 0.5) // Shuffle the array randomly
                .slice(0, 3); // Select the first 3 elements
              console.log('selectedQuestionSuggestions: ', selectedQuestionSuggestions);
              setBotIntroSuggestions(selectedQuestionSuggestions);
            }
          }

          // Schedule token refresh before it expires
          const refreshTimeout = setTimeout(refreshToken, (data.session_timeout_seconds - 60) * 1000);

          setIsLoading(false);

          // Cleanup the timeout on component unmount
          return () => clearTimeout(refreshTimeout);
        } else {
          console.error('Login failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setIsLoading(false);
      }
    };

    const refreshToken = async () => {
      try {
        // Make a request to refresh the token
        const refreshResponse = await fetch(`${credentials.serverURL}/refresh`, {
          method: 'POST',
          credentials: 'include',
          headers: new Headers({
            Authorization: `Bearer ${credentials.apiKey}`,
            'Content-Type': 'application/json',
          }),
        });

        if (refreshResponse.ok) {
          const { data } = await refreshResponse.json();
          setUserId(data.user_id);

          // Schedule the next refresh before the new token expires
          const refreshTimeout = setTimeout(refreshToken, (data.session_timeout_seconds - 60) * 1000);

          // Cleanup the previous timeout on every refresh
          clearTimeout(refreshTimeout);
        } else {
          console.error('Token refresh failed');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    // Call ping endpoint on initialization
    pingServer();
  };

  useEffect(() => {
    initializeChatbot();
  }, []); // Run once on component mount

  useEffect(() => {
    // Display introductory message only if there are no existing messages
    if (messages.length === 0) {
      addMessage({
        id: 1,
        text: botIntroMessage,
        isUser: false,
        timestamp: new Date(),
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

  const handleSendMessage = async (suggestion?: string) => {
    let question = inputText;
    if (suggestion) question = suggestion;
    if (!question && (inputText.trim() === '' || !userId)) return;
    setInputText('');

    // Display user message
    const userMessage: ChatMessage = { id: messages.length + 1, text: question, isUser: true, timestamp: new Date() };
    addMessage(userMessage);

    // Display typing animation
    const typingMessage: ChatMessage = { id: messages.length + 2, isTyping: true, isUser: false };
    addMessage(typingMessage);

    const responseText = await askEndpoint(question);

    // Remove the typing status widget message and replace it with the response message
    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.map((msg) =>
        msg.id === typingMessage.id ? { id: msg.id, text: responseText, isUser: false, timestamp: new Date() } : msg,
      );

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
      timestamp: new Date(),
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
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json',
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
          return jsonResponse.data.answer_without_tags || jsonResponse.message;
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
        credentials: 'include',
        headers: new Headers({
          Authorization: `Bearer ${credentials.apiKey}`,
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
    let timeoutIdle: number | undefined;

    const resetIdleTimeout = () => {
      clearTimeout(timeoutIdle);
      if (idleTimeoutSeconds > 0) timeoutIdle = window.setTimeout(logout, idleTimeoutSeconds * 1000);
    };

    const logout = () => {
      console.log('Logging out...');
      const timeoutMessage: ChatMessage = {
        id: messages.length + 1,
        text: 'You were timed out due to inactivity.',
        isUser: false,
        timestamp: new Date(),
      };
      addMessage(timeoutMessage);
      setUserId(null);
      removeActivityEventListeners();
      setIsModalVisible(true);
      logoutEndpoint(); // Close session on idle timeout

      // TODO Add reload window functionality for the iframe
    };

    const handleActivity = () => {
      resetIdleTimeout();
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
    resetIdleTimeout();

    // Add event listeners for user activity
    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('scroll', handleActivity);

    // Add event listener for user inactivity
    // window.addEventListener('blur', handleInactivity);

    // Clean up event listeners on component unmount
    return () => {
      clearTimeout(timeoutIdle);
      removeActivityEventListeners();
      // window.removeEventListener('blur', handleInactivity);
    };
  }, [idleTimeoutSeconds, userId]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getTime = (timeStamp: Date | undefined) => timeStamp?.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  function renderMessage(message: ButtonChatMessage): React.ReactNode {
    if (message.action && message.action.type === 'openLink') {
      return (
        <div className={`site-visit-message`} key={message.id} title={message.timestamp ? getTime(message.timestamp) : ''}>
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

  const resetChat = () => {
    console.log('resetChat');
    setMessages([]);
    initializeChatbot();
  };

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
                title={message.timestamp ? getTime(message.timestamp) : ''}
              >
                {message.isTyping ? <TypingChatMessage /> : renderMessage(message)}
              </div>
            ))}
            <div className="chatbot-suggestions">
              {
                // After the intro message display 3 suggested questions
                messages.length === 1 &&
                  botIntroSuggestions.map((msg, index) => (
                    <button key={`suggestion_${index + 1}`} className="user-message question-suggestion" onClick={() => handleSendMessage(msg)}>
                      {msg}
                    </button>
                  ))
              }
            </div>
          </div>
          <div className="chatbot-input">
            <input type="text" value={inputText} onChange={handleUserInput} onKeyDown={handleKeyDown} placeholder="Type your message..." autoFocus />
            <button disabled={!userId} style={userId ? {} : { cursor: 'not-allowed', background: 'gray' }} onClick={() => handleSendMessage()}>
              Send
            </button>
          </div>
          <FeedbackForm isModalOpen={isModalVisible} setIsModalOpen={setIsModalVisible} resetChat={resetChat} />
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
