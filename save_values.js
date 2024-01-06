document.addEventListener("DOMContentLoaded", () => {
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
    const focusMinutes = focusLength % 60;
    const breakHours = Math.floor(breakLength / 60);
    const breakMinutes = breakLength % 60;

    chrome.storage.local.set({'focusHours': focusHours, 'focusMinutes': focusMinutes, 'breakHours': breakHours, 'breakMinutes': breakMinutes, 'intervalAmount': intervalAmount, 'running': true, 'timerDone': false}).then(() => {
      console.log("Focus hours is set");
    });

    const duration = focusHours * 60 * 60 * 1000 + focusMinutes * 60 * 1000;

    chrome.storage.local.set({'currentInterval': 1, 'intervalType': 'focus', 'duration': duration, 'time': duration});

    chrome.runtime.sendMessage({startTimer: true, duration: duration, intervalType: 'focus', currentInterval: 1, intervalTotal: intervalAmount, focusHours: focusHours, focusMinutes: focusMinutes, breakHours: breakHours, breakMinutes: breakMinutes});
  });

  /*chrome.storage.local.get('running', (data) => {
    if(data.running === undefined) {
      chrome.storage.local.set({'running' : false});
    }

    if(data.running === true) {
      chrome.action.setPopup({popup: 'timer.html'});
    } else {
      chrome.action.setPopup({popup: 'start.html'});
    }
  });*/

  chrome.storage.local.get('running', (data) => {
    if (data.running === undefined) {
      chrome.storage.local.set({'running': false}, () => {
        setPopupPage();
      });
    } else {
      setPopupPage();
    }
  });

  function setPopupPage() {
    chrome.storage.local.get('running', (data) => {
      if (data.running === true) {
        chrome.action.setPopup({ popup: 'timer.html' });
      } else {
        chrome.action.setPopup({ popup: 'start.html' });
      }
    });
  }
});