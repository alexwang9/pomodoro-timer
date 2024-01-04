chrome.storage.local.get('running', (data) => {
  if(data.running) {
    chrome.action.setPopup({popup: 'popup.html'});
  } else {
    chrome.action.setPopup({popup: 'start.html'});
  }
});