document.addEventListener("DOMContentLoaded", () => {
  /*chrome.storage.local.get('running', (data) => {
    if(data.running != undefined){
      if(!data.running) {
        chrome.action.setPopup({popup: 'timer.html'});
      } else {
        chrome.action.setPopup({popup: 'start.html'});
      }
    }
  });*/

  const intervalInput = document.querySelector('.interval-text-box input[type="interval-box"]');
  const focusInput = document.querySelector('.focus-period-container input[type="text"]');
  const breakInput = document.querySelector('.break-period-container input[type="text"]');
  const startButton = document.querySelector('.start-button button');

  startButton.addEventListener('click', () => {
    const intervalAmount = parseInt(intervalInput.value);
    const focusLength = parseInt(focusInput.value);
    const breakLength = parseInt(breakInput.value);

    if(isNaN(intervalAmount) || isNaN(focusLength) || isNaN(breakLength)) {
      alert("Please enter valid numbers in the boxes.");
      chrome.storage.local.set({'running' : false}).then(() => {
        console.log("Timer is not running");
      })

      return;
    }

    const focusHours = Math.floor(focusLength / 60);
    console.log(focusHours);
    const focusMinutes = focusLength % 60;
    console.log(focusMinutes);
    const breakHours = Math.floor(breakLength / 60);
    console.log(breakHours);
    const breakMinutes = breakLength % 60;
    console.log(breakMinutes);

    chrome.storage.local.set({'focusHours' : focusHours}).then(() => {
      console.log("Focus hours is set");
    });
    chrome.storage.local.set({'focusMinutes' : focusMinutes}).then(() => {
      console.log("Focus minutes is set");
    });
    chrome.storage.local.set({'breakHours' : breakHours}).then(() => {
      console.log("Break hours is set");
    });
    chrome.storage.local.set({'breakMinutes' : breakMinutes}).then(() => {
      console.log("Break minutes is set");
    });
    chrome.storage.local.set({'intervalAmount' : intervalAmount}).then(() => {
      console.log("Interval amount is set");
    });
    chrome.storage.local.set({'running' : false}).then(() => {
      console.log("Timer is not running");
    });

    const currentHour = focusHours;
    const currentMinute = focusMinutes;
    const duration = currentHour * 60 * 60 * 1000 + currentMinute * 60 * 1000;

    chrome.storage.local.set({'currentHour': currentHour, 'currentMinute': currentMinute, 'currentSecond': 0, 'currentInterval': 1, 'intervalType': 'focus', 'duration': duration});

  });
});