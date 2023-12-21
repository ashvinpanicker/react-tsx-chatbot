// chat-widget.js

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
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.onload = function () {
      iframe.src = 'https://test-hgqq.onrender.com/';
    };
    
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