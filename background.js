chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.startTimer) {
    chrome.storage.local.set({timerRunning: true});

    const focusDuration = request.focusHours * 60 * 60 * 1000 + request.focusMinutes * 60 * 1000;
    const breakDuration = request.breakHours * 60 * 60 * 1000 + request.breakMinutes * 60 * 1000;

    run(request.duration, request.intervalType, request.intervalTotal, focusDuration, breakDuration);
  } 
});

function run(duration, intervalType, intervalTotal, focusDuration, breakDuration){
  let currentIndex = 0;
  let currentInterval = 1;

  function onTimerZeroCallback() {
    console.log("Timer zero callback");

    currentIndex++;
    
    if(currentIndex < intervalTotal * 2) {
      console.log(currentIndex);

      if(intervalType === 'focus') {
        intervalType = 'break';
        duration = breakDuration;
      } else {
        intervalType = 'focus';
        currentInterval++;
        duration = focusDuration;
      }

      runTimer(duration, onTimerZeroCallback);

      chrome.storage.local.set({ 'intervalType': intervalType });
      chrome.storage.local.set({ 'currentInterval': currentInterval });

      console.log("done");

    } else {
      //chrome.runtime.sendMessage({updateDOM: true});
      console.log ("all iterations done");
    }
  }

  runTimer(duration, onTimerZeroCallback);
}

function runTimer(duration, onTimerZeroCallback) {
  var time = duration;
  var intervalId = setInterval(() => {
    console.log(time);

    if (time === 0) {
      console.log("got to zero");
      clearInterval(intervalId);
      onTimerZeroCallback();
    }

    chrome.storage.local.set({'time': time});
    time -= 1000;
  }, 1000);

}
