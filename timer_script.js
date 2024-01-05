document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['focusHours', 'focusMinutes', 'breakHours', 'breakMinutes', 'intervalAmount', 'running', 'currentHour', 'currentMinute', 'currentSecond', 'currentInterval', 'intervalType', 'duration'], (result) => {
    const focusHours = result.focusHours;
    const focusMinutes = result.focusMinutes;
    const breakHours = result.breakHours;
    const breakMinutes = result.breakMinutes;
    const intervalTotal = result.intervalAmount;
    const running = result.running;
    const currentInterval = result.currentInterval;
    const intervalType = result.intervalType;
    const duration = result.duration;
    
    if(currentInterval < intervalTotal || (currentInterval == intervalTotal && intervalType === 'focus')){
      setTimer(duration, currentInterval, intervalType);
      startTimer(duration, intervalType, currentInterval, intervalTotal, focusHours, focusMinutes, breakHours, breakMinutes);
    }
  });
});

function setTimer(duration, currentInterval, intervalType) {
  const timerDisplay = document.querySelector('h1');
  const typeDisplay = document.querySelector('.focus');
  const sessionDisplay = document.querySelector('.session');
  timerDisplay.textContent = formatTime(duration);
  typeDisplay.textContent = (intervalType === 'focus') ? `Focus📖` : `Break🍵`;
  typeDisplay.style.background = (intervalType === 'focus') ? '#ff9a9a' : '#008a7a';
  typeDisplay.style.color = (intervalType === 'focus') ? 'black' : 'white';
  sessionDisplay.textContent = `Session ${currentInterval}`;
}

function startTimer(duration, intervalType, currentInterval, intervalTotal, focusHours, focusMinutes, breakHours, breakMinutes) {
  const timerDisplay = document.querySelector('h1');
  const startTime = new Date().getTime();
  chrome.storage.local.set({ 'startTime': startTime, 'intervalType': intervalType });

  const intervalId = setInterval(() => {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    const remainingTime = duration - elapsedTime;

    if (remainingTime <= 0) {
      clearInterval(intervalId);

      if(intervalType === 'focus') {
        

        intervalType = 'break';

        chrome.storage.local.set({ 'intervalType': intervalType });
        setTimer(breakHours * 60 * 60 * 1000 + breakMinutes * 60 * 1000, currentInterval, intervalType);
        startTimer(breakHours * 60 * 60 * 1000 + breakMinutes * 60 * 1000, intervalType, currentInterval, intervalTotal, focusHours, focusMinutes, breakHours, breakMinutes);

      } else {
        if(currentInterval == intervalTotal) {
          document.querySelector('.focus').textContent = `Done!`;
          document.querySelector('.focus').style.background = '#ebcc34';
          document.querySelector('.focus').style.color = 'black';
          return;
        }

        currentInterval++;
        intervalType = 'focus';

        chrome.storage.local.set({ 'currentInterval': currentInterval, 'intervalType': intervalType});
        setTimer(focusHours * 60 * 60 * 1000 + focusMinutes * 60 * 1000, currentInterval, intervalType);
        startTimer(focusHours * 60 * 60 * 1000 + focusMinutes * 60 * 1000, intervalType, currentInterval, intervalTotal, focusHours, focusMinutes, breakHours, breakMinutes);
      }

    } else {
      timerDisplay.textContent = formatTime(remainingTime);
    }

    chrome.storage.local.set({ 'duration': remainingTime});
  }, 1000);

  chrome.storage.local.set({'intervalId': intervalId, 'running': true});
}

function formatTime(milliseconds) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(value) {
  return value < 10 ? `0${value}` : value;
}