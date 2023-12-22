(function () {
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
  floatingButton.innerText = 'Chat';

  // Add hover effect styles
  floatingButton.style.transition = 'background-color 0.3s, box-shadow 0.3s';
  floatingButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  floatingButton.addEventListener('mouseenter', () => {
    floatingButton.style.backgroundColor = 'rgb(27, 188, 155)';
    floatingButton.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
  });

  floatingButton.addEventListener('mouseleave', () => {
    floatingButton.style.backgroundColor = 'rgb(37, 211, 102)';
    floatingButton.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
  });

  // Create the chat window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chat-window';
  chatWindow.style.display = 'none';
  chatWindow.style.position = 'fixed';
  chatWindow.style.bottom = '80px';
  chatWindow.style.right = '20px';
  chatWindow.style.width = '300px';
  chatWindow.style.height = '400px';
  chatWindow.style.background = 'white';
  chatWindow.style.boxShadow = '0 10px 10px rgba(0, 0, 0, 0.2)';
  chatWindow.style.zIndex = '9999';

  // Create an iframe and add it to the chat window
  const iframe = document.createElement('iframe');
  iframe.src = 'https://test-hgqq.onrender.com/';
  iframe.style.width = '100%';
  iframe.style.height = '100%';
  chatWindow.appendChild(iframe);

  // Append the button and chat window to the document
  document.body.appendChild(floatingButton);
  document.body.appendChild(chatWindow);

  // Add a click event handler to the button to toggle the chat window
  floatingButton.addEventListener('click', () => {
    if (chatWindow.style.display === 'none') {
      chatWindow.style.display = 'block';
    } else {
      chatWindow.style.display = 'none';
    }
  });

  // Iframe Parent event listener binding
  window.addEventListener('message', function (event) {
    // Check if the event origin is the expected origin
    // Add additional security checks if needed
    if (event.origin === 'https://test-hgqq.onrender.com') {
      const chatWindow = document.getElementById('chat-window');
      if (chatWindow) {
        if (event.data === 'closeChatWindow') {
          // Handle the event to close the chat window in the parent
          chatWindow.style.display = 'none';
        }
        if (event.data === 'fullScreenChat') {
          // Handle the event to close the chat window in the parent
          chatWindow.style.width = '100%';
          chatWindow.style.height = '100%';
          chatWindow.style.position = 'absolute';
          chatWindow.style.bottom = '0px';
          chatWindow.style.right = '0px';
        }
        if (event.data === 'windowedChat') {
          chatWindow.style.position = 'fixed';
          chatWindow.style.bottom = '80px';
          chatWindow.style.right = '20px';
          chatWindow.style.width = '300px';
          chatWindow.style.height = '400px';
        }
      }
    }
  });
})();
