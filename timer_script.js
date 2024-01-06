document.addEventListener('DOMContentLoaded', () => {

  chrome.storage.local.get(['focusHours', 'focusMinutes', 'breakHours', 'breakMinutes', 'intervalAmount', 'currentInterval', 'intervalType', 'duration'], (result) => {
    const breakHours = result.breakHours;
    const breakMinutes = result.breakMinutes;
    const intervalTotal = result.intervalAmount;
    const currentInterval = result.currentInterval;
    const intervalType = result.intervalType;
    const totalDuration = (result.duration + breakHours * 60 * 60 * 1000 + breakMinutes * 60 * 1000) * intervalTotal;

    setTimer(currentInterval, intervalType);
    startTimer(totalDuration);
  });


  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.updateDOM){
      document.querySelector('.focus').textContent = 'Done!';
      document.querySelector('.focus').style.background = '#ebcc34';
      document.querySelector('.focus').style.color = 'black';
    }
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

function startTimer(totalDuration) {
  const timerDisplay = document.querySelector('h1');
  const typeDisplay = document.querySelector('.focus');
  const sessionDisplay = document.querySelector('.session');

  var runtime = totalDuration + 3000;
  const intervalId = setInterval(() => {

    chrome.storage.local.get(['time', 'intervalType', 'currentInterval'], (result) => {
      timerDisplay.textContent = formatTime(result.time);
      typeDisplay.textContent = (result.intervalType === 'focus') ? `Focus📖` : `Break🍵`;
      typeDisplay.style.background = (result.intervalType === 'focus') ? '#ff9a9a' : '#008a7a';
      typeDisplay.style.color = (result.intervalType === 'focus') ? 'black' : 'white';

      sessionDisplay.textContent = `Session ${result.currentInterval}`;
    });

    runtime -= 1000;

    if(runtime === 0){
      clearInterval(intervalId);
    }

  }, 1000);
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

/*chrome.storage.local.get(['done'], (result) => {
    if(result.done) {
      typeDisplay.style.textContent = 'Done!';
      typeDisplay.style.background = '#ebcc34';
      typeDisplay.style.color = 'black';
    }
  });*/