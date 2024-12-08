chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
      id: 'ask-ai',
      title: 'Întreabă AI: "%s"',
      contexts: ['selection']
    });
  });
  
  chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'ask-ai' && info.selectionText) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'showPopup',
        question: info.selectionText
      });
    }
  });
  