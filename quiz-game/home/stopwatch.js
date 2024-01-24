function timer() {
    sec = 0;
    min = 0;
    let stopWatch; 
  
    function startTimer() {
      stopWatch = setInterval(() => {
        updateTimer();
      }, 1000);
    }
  
    function displayTimer() {
        minStr = min; // display substring
        secStr = sec; // display substring
      const stopWatchStr = sec < 10 ? `0${min}:0${sec}` : `0${min}:${sec}`;
      document.getElementById('showtime').textContent = stopWatchStr;
    }
  
    function updateTimer() {
      if (sec >= 10) {
        min ++;
        sec = 0;
      } else {
        sec++;
      }
      displayTimer();
    }
  
    function resetTimer() {
      clearInterval(stopWatch);
      sec = t;
      displayTimer();
      startTimer();
    }
  
    function stopTimer() {
      clearInterval(stopWatch);
      stopWatch = null;
  
    }
  
    return {
      startTimer,
      resetTimer,
      stopTimer
    }
  }

  let t = timer();

  t.startTimer();