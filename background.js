let intervalId;

function startBackgroundTimer(duration, intervalType, currentInterval, intervalTotal, focusHours, focusMinutes, breakHours, breakMinutes) {
  const startTime = new Date().getTime();
  intervalId = setInterval(() => {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const remainingTime = duration - elapsedTime;

    if (remainingTime <= 0) {
      clearInterval(intervalId);

      if(intervalType === 'focus') {
        intervalType = 'break';
        chrome.storage.local.set({ 'intervalType': intervalType });
        startBackgroundTimer(breakHours * 60 * 60 * 1000 + breakMinutes * 60 * 1000, intervalType, currentInterval, intervalTotal, focusHours, focusMinutes, breakHours, breakMinutes);

      } else {
        if(currentInterval == intervalTotal) {
          chrome.storage.local.set({'running': false});
          return;
        }

        currentInterval++;
        intervalType = 'focus';
        chrome.storage.local.set({ 'currentInterval': currentInterval, 'intervalType': intervalType});

        startBackgroundTimer(focusHours * 60 * 60 * 1000 + focusMinutes * 60 * 1000, intervalType, currentInterval, intervalTotal, focusHours, focusMinutes, breakHours, breakMinutes);
      }

    }

    chrome.storage.local.set({ 'duration': remainingTime});
  }, 1000);
}

chrome.runtime.onInstalled.addListener(() => {

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startTimer') {
    startBackgroundTimer(message.duration, message.intervalType, message.currentInterval, message.intervalTotal, message.focusHours, message.focusMinutes, message.breakHours, message.breakMinutes);
  }
});