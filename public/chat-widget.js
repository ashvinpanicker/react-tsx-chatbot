(function () {
  const iframeURL = document.querySelector('[property="chatbot-hosted-url"]').content;
  console.log(iframeURL);
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    #floating-button-247 {
      position: fixed;
      display: flex;
      align-items: center;
      justify-content: center;
      bottom: 25px;
      right: 25px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      text-align: center;
      line-height: 60px;
      background-color: white;
      cursor: pointer;
      z-index: 9999999;
    }

    /* Right triangle placed top right flush. */
    .tri-right.border.right-bottom:before {
      content: ' ';
      position: absolute;
      width: 0;
      height: 0;
      left: auto;
      right: -40px;
      top: -8px;
      bottom: auto;
      border: 32px solid;
      border-color: #666 transparent transparent transparent;
    }
    .tri-right.right-bottom:after {
      content: ' ';
      position: absolute;
      width: 0;
      height: 0;
      left: auto;
      right: 5px;
      top: auto;
      bottom: -17px;
      border: 17px solid;
      border-left: 5px solid;
      border-color: white transparent transparent transparent;
      transform: rotate(45deg);
    }

    .dots-container {
      display: flex;
      align-items: center;
      padding: 10px;
      padding-left: 15px;
      border-radius: 5px;
    }

    .dot {
      width: 10px;
      height: 10px;
      background-color: #BEC0E6;
      border-radius: 50%;
      margin-right: 5px;
    }

    .unreadBadge {
      position: absolute;
      top: -3px;
      right: -1px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #FF719F;
    }
  `;

  document.head.appendChild(styleElement);

  // Create the floating action button
  const floatingButton = document.createElement('div');
  floatingButton.id = 'floating-button-247';
  floatingButton.classList.add('tri-right', 'right-bottom');

  // Add styles for the dots container
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'dots-container';

  // Add styles for the dots
  for (let i = 0; i < 3; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot';
    dotsContainer.appendChild(dot);
  }

  const badge = document.createElement('div');
  badge.className = 'unreadBadge';

  // Append the dots to the floating button
  floatingButton.appendChild(dotsContainer);
  floatingButton.appendChild(badge);

  // Add hover effect styles
  floatingButton.style.transition = 'transform 250ms cubic-bezier(0.33, 0, 0, 1) 0s';
  floatingButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  floatingButton.addEventListener('mouseenter', () => {
    floatingButton.style.transform = 'scale(1.1)';
  });

  floatingButton.addEventListener('mouseleave', () => {
    floatingButton.style.transform = 'scale(1)';
  });

  // Add a click event handler to the button to toggle the chat window
  floatingButton.addEventListener('click', () => {
    if (chatWindow.style.transform === 'scale(0) translateY(100%) translateX(100%)') {
      openChatWindow();
    } else {
      closeChatWindow();
    }
  });

  // Create the chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chat-window';
  chatWindow.style.display = 'block';
  chatWindow.style.position = 'fixed';
  chatWindow.style.background = 'white';
  chatWindow.style.boxShadow = 'rgba(0, 0, 0, 0.16) -5px 5px 5px';
  chatWindow.style.transition = 'transform 300ms cubic-bezier(0, 1.2, 1, 1) 0s, opacity 12ms ease-out 0s';
  // chatWindow.style.border = '1px solid #f0f0f0';
  chatWindow.style.borderRadius = '5px';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.zIndex = '99999999';
  chatWindow.style.transform = 'scale(0) translateY(100%) translateX(100%)';

  const setChatWindowSize = () => {
    chatWindow.style.bottom = '90px';
    chatWindow.style.right = '20px';
    chatWindow.style.width = '330px';
    chatWindow.style.height = '450px';
  };

  setChatWindowSize();

  const openChatWindow = () => {
    chatWindow.style.opacity = 1;
    chatWindow.style.transform = 'scale(1)';
  };

  const closeChatWindow = () => {
    chatWindow.style.opacity = 0;
    chatWindow.style.transform = 'scale(0) translateY(100%) translateX(100%)';
  };

  const enterFullscreenChat = () => {
    chatWindow.style.width = '100%';
    chatWindow.style.height = '100%';
    chatWindow.style.bottom = '0px';
    chatWindow.style.right = '0px';
  };

  const exitFullscreenChat = () => setChatWindowSize();

  // Create an iframe and add it to the chat window
  const iframe = document.createElement('iframe');
  iframe.src = iframeURL;
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  iframe.style.border = '0px none transparent';
  iframe.style.borderRadius = '5px';
  chatWindow.appendChild(iframe);

  // Append the button and chat window to the document
  document.body.appendChild(floatingButton);
  document.body.appendChild(chatWindow);

  // Iframe Parent event listener binding
  window.addEventListener('message', function (event) {
    // Check if the event origin is the expected origin
    // Add additional security checks if needed
    if (event.origin === iframeURL) {
      const chatWindow = document.getElementById('chat-window');
      if (chatWindow) {
        if (event.data === 'closeChatWindow') {
          // Handle the event to close the chat window in the parent
          closeChatWindow();
        }
        if (event.data === 'fullScreenChat') {
          // Handle the event to close the chat window in the parent
          enterFullscreenChat();
        }
        if (event.data === 'windowedChat') {
          exitFullscreenChat();
        }
      }
    }
  });
})();
