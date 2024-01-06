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
        duration = focusDuration;
      }

      runTimer(duration, onTimerZeroCallback);

      console.log("done");

    } else {
      console.log ("all iterations done");
    }
  }

  runTimer(duration, onTimerZeroCallback);
}

function runTimer(duration, onTimerZeroCallback) {
  var time = duration;
  var intervalId = setInterval(() => {
    time -= 1000;
    console.log(time);

    if (time === 0) {
      console.log("got to zero");
      clearInterval(intervalId);
      onTimerZeroCallback();
    }

  }, 1000);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'getTime') {
      sendResponse( time );
    }
  });
}




      /*if(intervalType === 'focus') {
        intervalType = 'break';
        chrome.storage.local.set({ 'intervalType': intervalType });

        runTimer(breakHours * 60 * 60 * 1000 + breakMinutes * 60 * 1000, intervalType, currentInterval, intervalTotal, focusHours, focusMinutes, breakHours, breakMinutes);

      } else {
        if(currentInterval == intervalTotal) {
          chrome.action.setPopup({popup: 'start.html'});
          return;
        }

        currentInterval++;
        intervalType = 'focus';
        chrome.storage.local.set({ 'currentInterval': currentInterval, 'intervalType': intervalType});

        runTimer(focusHours * 60 * 60 * 1000 + focusMinutes * 60 * 1000, intervalType, currentInterval, intervalTotal, focusHours, focusMinutes, breakHours, breakMinutes);
      }*/