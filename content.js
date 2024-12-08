function createPopup(question, answer) {
    const existingPopup = document.getElementById('ai-popup');
    if (existingPopup) existingPopup.remove();
  
    const popup = document.createElement('div');
    popup.id = 'ai-popup';
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.width = '250px'; 
    popup.style.height = '150px';
    popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    popup.style.color = 'white';
    popup.style.fontSize = '14px'; 
    popup.style.padding = '10px';
    popup.style.borderRadius = '12px';
    popup.style.zIndex = '9999';
    popup.style.display = 'flex';
    popup.style.flexDirection = 'column';
    popup.style.justifyContent = 'center';
    popup.style.alignItems = 'center';
    popup.style.overflow = 'auto';
  
    const questionElem = document.createElement('div');
    questionElem.style.marginBottom = '8px';
    questionElem.innerText = "Î: " + question;
  
    const answerElem = document.createElement('div');
    answerElem.innerText = "R: " + answer;
  
    popup.appendChild(questionElem);
    popup.appendChild(answerElem);
    document.body.appendChild(popup);
  
    popup.addEventListener('click', () => {
      popup.style.display = 'none';
    });
  
    setTimeout(() => {
      popup.style.opacity = '0';
      setTimeout(() => popup.remove(), 500);
    }, 15000);
  }
  
  function getAIResponse(question) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(['apiKey'], (result) => {
        const apiKey = result.apiKey;
  
        if (!apiKey) {
          resolve('Cheia API nu este setată. Accesează opțiunile extensiei.');
          return;
        }
  
        fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: question }],
            max_tokens: 150
          })
        })
        .then(response => response.json())
        .then(data => {
          if (data.choices && data.choices.length > 0) {
            resolve(data.choices[0].message.content);
          } else {
            resolve('Răspunsul nu a fost găsit.');
          }
        })
        .catch(error => {
          console.error('Eroare la cererea API:', error);
          resolve('Eroare la cererea API.');
        });
      });
    });
  }
  
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'showPopup' && message.question) {
      getAIResponse(message.question).then((response) => {
        createPopup(message.question, response);
        sendResponse({ status: 'success' });
      });
      return true; // Asincron
    }
  });
  