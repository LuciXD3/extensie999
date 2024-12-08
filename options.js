document.getElementById('save-key').addEventListener('click', () => {
    const apiKey = document.getElementById('api-key').value;
  
    if (!apiKey) {
      document.getElementById('status').innerText = 'Cheia API nu poate fi goală!';
      return;
    }
  
    chrome.storage.local.set({ apiKey: apiKey }, () => {
      document.getElementById('status').innerText = 'Cheia API a fost salvată cu succes!';
    });
  });
  
  // La încărcarea paginii, afișăm cheia API existentă (dacă există)
  chrome.storage.local.get(['apiKey'], (result) => {
    if (result.apiKey) {
      document.getElementById('api-key').value = result.apiKey;
    }
  });
  