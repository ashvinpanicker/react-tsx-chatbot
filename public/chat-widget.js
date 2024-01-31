(function () {
  const iframeURL = 'https://test-hgqq.onrender.com';

  // Create the floating action button
  const floatingButton = document.createElement('div');
  floatingButton.id = 'floating-button';
  floatingButton.style.position = 'fixed';
  floatingButton.style.bottom = '20px';
  floatingButton.style.right = '20px';
  floatingButton.style.width = '60px';
  floatingButton.style.height = '60px';
  floatingButton.style.borderRadius = '50%';
  floatingButton.style.background = 'rgb(37, 211, 102)';
  floatingButton.style.color = 'white';
  floatingButton.style.textAlign = 'center';
  floatingButton.style.lineHeight = '60px';
  floatingButton.style.cursor = 'pointer';

  const iconImage = document.createElement('img');
  iconImage.src = `${iframeURL}/noun-speech-bubble-180773.svg`;
  iconImage.alt = 'Chat Icon';
  iconImage.style.width = '80%';
  iconImage.style.height = '100%';

  // Append the image to the floating button
  floatingButton.appendChild(iconImage);

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
  chatWindow.style.border = '1px solid #f0f0f0';
  chatWindow.style.borderRadius = '5px';
  chatWindow.style.overflow = 'hidden';
  chatWindow.style.zIndex = '9999';
  chatWindow.style.transform = 'scale(0) translateY(100%) translateX(100%)';

  const setChatWindowSize = () => {
    chatWindow.style.bottom = '85px';
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
