document.addEventListener('DOMContentLoaded', () => {

  chrome.storage.local.get(['focusHours', 'focusMinutes', 'breakHours', 'breakMinutes', 'intervalAmount', 'currentInterval', 'intervalType', 'duration'], (result) => {
    const focusHours = result.focusHours;
    const focusMinutes = result.focusMinutes;
    const breakHours = result.breakHours;
    const breakMinutes = result.breakMinutes;
    const intervalTotal = result.intervalAmount;
    const currentInterval = result.currentInterval;
    const intervalType = result.intervalType;
    const duration = (result.duration + breakHours * 60 * 60 * 1000 + breakMinutes * 60 * 1000) * intervalTotal;
    

    setTimer(currentInterval, intervalType);
    startTimer(duration);
  });
});

function setTimer(currentInterval, intervalType) {
  const timerDisplay = document.querySelector('h1');
  const typeDisplay = document.querySelector('.focus');
  const sessionDisplay = document.querySelector('.session');

  chrome.storage.local.get(['time'], (result) => {
    timerDisplay.textContent = formatTime(result.time);
  });

  typeDisplay.textContent = (intervalType === 'focus') ? `Focus📖` : `Break🍵`;
  typeDisplay.style.background = (intervalType === 'focus') ? '#ff9a9a' : '#008a7a';
  typeDisplay.style.color = (intervalType === 'focus') ? 'black' : 'white';

  sessionDisplay.textContent = `Session ${currentInterval}`;
}

function startTimer(duration) {
  const timerDisplay = document.querySelector('h1');
  var runtime = duration;
  const intervalId = setInterval(() => {
    /*chrome.runtime.sendMessage('getTime', (response) => {
      console.log('received time', response);
      timerDisplay.textContent = formatTime(response);
    });*/

    chrome.storage.local.get(['time'], (result) => {
      timerDisplay.textContent = formatTime(result.time);
    });

    runtime -= 1000;

    if(runtime === 0){
      clearInterval(intervalId);
    }

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


/*if (remainingTime <= 0) {
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
          chrome.storage.local.set({'running': false});
          chrome.action.setPopup({popup: 'start.html'});
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

    chrome.storage.local.set({ 'duration': remainingTime});*/