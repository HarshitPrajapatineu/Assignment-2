function timer() {
    sec = 0;
    min = 0;
    let stopWatch; 
    watchStatus = "reset"; // 0-reset; 1-running; 3-pause


    function startTimer() {
      watchStatus = "running";
      changeStartLabel();
      stopWatch = setInterval(() => {
        updateTimer();
      }, 1000);
    }

    function changeStartLabel() {
      if (watchStatus === "reset") {
        startStr = "Start";
      }else if (watchStatus === "pause") {
        startStr = "Resume"
      } else {
        startStr = "Stop"
      }
      document.getElementById('start-btn').textContent = startStr;
    }
  
    function updateTimer() {
      if (sec >= 59) {
        min ++;
        sec = 0;
      } else {
        sec++;
      }
      displayTimer(min, sec);
    }
  
    function resetTimer() {
      watchStatus = "reset";
      changeStartLabel();
      sec = 0;
      min = 0;
      clearInterval(stopWatch);
      displayTimer(min, sec);
    }
  
    function stopTimer() {
      watchStatus = "pause";
      changeStartLabel();
      clearInterval(stopWatch);
      console.log(stopWatch);
    }
  
    return {
      startTimer,
      resetTimer,
      stopTimer
    }
  }

  let t = timer();

//   t.startTimer();

  // document.getElementById("start-btn").addEventListener("click", handleStartClick());

  function handleStartClick() {
    if(watchStatus === "reset") {
        t.startTimer();
    }else if (watchStatus === "pause") {
        t.startTimer();
    } else {
      t.stopTimer();
    }
  }
  
  function displayTimer(m, s) {
      minStr = m < 10 ? `0${min}` : `${min}`; // display substring
      secStr = s < 10 ? `0${sec}` : `${sec}`; // display substring
    const stopWatchStr = `${minStr}:${secStr}`;
    document.getElementById('showtime').textContent = stopWatchStr;
  }

  function handleResetClick() {
    t.resetTimer();
  }