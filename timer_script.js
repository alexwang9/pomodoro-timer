document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['focusHours', 'focusMinutes', 'breakHours', 'breakMinutes', 'intervalAmount', 'running', 'startTime', 'currentInterval'], (result) => {
    const focusHours = result.focusHours || 0;
    const focusMinutes = result.focusMinutes || 25;
    const breakHours = result.breakHours || 0;
    const breakMinutes = result.breakMinutes || 5;
    const intervalAmount = result.intervalAmount || 1;
    const running = result.running || false;
    const startTime = result.startTime || null;
    const currentInterval = result.currentInterval || 'focus';
    
    setTimer(focusHours, focusMinutes, intervalAmount);
    
    if(running) {
      startTimer(focusHours, focusMinutes, breakHours, breakMinutes, currentInterval, intervalAmount);
    }
  });
});

function setTimer(hours, minutes, intervalAmount) {
  const timerDisplay = document.querySelector('h1');
  timerDisplay.textContent = formatTime(hours, minutes, 0);
}

function startTimer(focusHours, focusMinutes, breakHours, breakMinutes, currentInterval, intervalAmount) {
  
}