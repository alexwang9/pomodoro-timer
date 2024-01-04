document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['focusHours', 'focusMinutes', 'breakHours', 'breakMinutes', 'intervalAmount', 'running', 'startTime', 'currentInterval'], (result) => {
    const focusHours = result.focusHours;
    const focusMinutes = result.focusMinutes;
    const breakHours = result.breakHours;
    const breakMinutes = result.breakMinutes;
    const intervalAmount = result.intervalAmount;
    const running = result.running || false;
    const startTime = result.startTime || null;
    const currentInterval = result.currentInterval;
    
    setTimer(focusHours, focusMinutes, currentInterval);
    
    if(running) {
      startTimer(focusHours, focusMinutes, breakHours, breakMinutes, currentInterval, intervalAmount);
    }
  });
});

function setTimer(hours, minutes, currentInterval) {
  const timerDisplay = document.querySelector('h1');
  const sessionDisplay = document.querySelector('.session');
  timerDisplay.textContent = formatTime(hours, minutes, 0);
  sessionDisplay.textContent = `Session ${currentInterval}`;
}

function startTimer(focusHours, focusMinutes, breakHours, breakMinutes, currentInterval, intervalAmount) {
  return;
}

function formatTime(hours, minutes, seconds) {
  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(value) {
  return value < 10 ? `0${value}` : value;
}