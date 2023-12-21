// chat-widget.js

(function () {
    const isMobile = () => {
      return window.innerWidth <= 768; // You may adjust the breakpoint based on your needs
    };
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

    // Create the full-screen button for mobile screens
    const fullScreenButton = document.createElement('div');
    fullScreenButton.id = 'full-screen-button';
    fullScreenButton.style.display = 'none'; // Initially hide the full-screen button
    fullScreenButton.style.position = 'fixed';
    fullScreenButton.style.bottom = '20px';
    fullScreenButton.style.right = '90px'; // Adjust the position as needed
    fullScreenButton.style.width = '40px';
    fullScreenButton.style.height = '40px';
    fullScreenButton.style.borderRadius = '50%';
    fullScreenButton.style.background = 'rgb(37, 211, 102)';
    fullScreenButton.style.color = 'white';
    fullScreenButton.style.textAlign = 'center';
    fullScreenButton.style.lineHeight = '40px';
    fullScreenButton.style.cursor = 'pointer';
    fullScreenButton.innerText = 'Fullscreen';

    // Function to toggle full screen on mobile
    const toggleFullScreen = () => {
      const chatWindow = document.getElementById('chat-window');
      if (chatWindow) {
        if (isMobile()) {
          chatWindow.style.width = '100%';
          chatWindow.style.height = '100%';
          // Add any other styles needed for full-screen mode
        }
      }
    };
    
    fullScreenButton.addEventListener('click', toggleFullScreen);
  
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
    // iframe.onload = function () {
    //   iframe.src = 'https://test-hgqq.onrender.com/';
    // };
    
    
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
  })();