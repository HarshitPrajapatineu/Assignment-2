
let questionList = []; // list of questions
var currQUestion = 0; // index of ongoing question
let firstLoad = true;
var score = 0;
const defaultTimer = 2;
var attemptHistory = [];
let isSubmitEvent = true;
var scoreCard = {
  name: "",
  email: "",
  scoreList: [[]]
};
const quizText = document.querySelector('.quiz_text');

var tim = timer(defaultTimer);

const questionEL = document.getElementById("question");
const answerButtonsEL = document.getElementById("answer-buttons");

function showInstruction() {

}

function prepareAttempt() {
  const params = new URLSearchParams(window.location.search);
  const name = params.get("n");
  document.getElementById("name-tag").textContent = (name ? `Hi, ${name}` : ``);
  // clearInterval(timer);
  tim.startTimer();
  fetchQuestions();
  currQUestion = 0;
  if (firstLoad) {
    firstLoad = false;
    document.getElementById("next-btn").addEventListener("click", () => {
      if (currQUestion < questionList.length) {
        handleNextButton();
      }
    })
    document.getElementById("prev-btn").addEventListener("click", () => {
      if (currQUestion > 0) {
        handlePrevButton();
      }
    })
    document.getElementById("submit-btn").addEventListener("click", () => {
      handleSubmitButton(false);
    })
  }

}

function fetchQuestions() {
  fetch("./../questions.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {

      questionList = data.data.questions;
      attemptHistory = Array(questionList.length).fill(0);
      showQuestion();
      min = questionList.length;
      // timer = setInterval(() => setTimer(), 1000);
    });

}

function showQuestion() {
  resetState();
  let currentQuestion = questionList[currQUestion];
  let questionNo = currQUestion + 1;
  questionEL.textContent = questionNo + ". " + currentQuestion ? currentQuestion.title : '';

  currentQuestion.choices.forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice.content;
    button.classList.add("btn");
    answerButtonsEL.appendChild(button);

    document.getElementById("question-count").textContent = (currQUestion + 1) + '/' + questionList.length;
    button.dataset.id = choice.id;
    button.dataset.point = currentQuestion.points;
    if (choice.id == currentQuestion.answers[0]) {
      button.dataset.correct = "true";
    } else {
      button.dataset.correct = "false";
    }
    button.addEventListener("click", selectAnswer,);

    showAttemptedAnswer(button);
  });
}

function showAttemptedAnswer(button) {
  if (attemptHistory[currQUestion]) {
    if (attemptHistory[currQUestion] === button.dataset.id) {
      if (button.dataset.correct === "true") {
        button.classList.add("correct");
      } else {
        button.classList.add("incorrect");
      }
    }
    Array.from(answerButtonsEL.children).forEach(button => {
      if (button.dataset.correct === "true") {
        button.classList.add("correct");
      }
      button.disabled = true;
    });
  }
}

function resetState() {
  while (answerButtonsEL.firstChild) {
    answerButtonsEL.removeChild(answerButtonsEL.firstChild);
  }
}

function selectAnswer(e) {
  tim.stopTimer();
  e.stopPropagation();
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  attemptHistory[currQUestion] = selectedBtn.dataset.id;

  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score += parseInt(selectedBtn.dataset.point);
    // update score
  } else {
    selectedBtn.classList.add("incorrect");
  }
  displayCorrectAnswer();
  document.getElementById("next-btn").style.visibility = "visible";
}

function displayCorrectAnswer() {
  Array.from(answerButtonsEL.children).forEach(button => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
}

function showScore() {
  resetState();
  questionEL.textContent = `You scored ${score} out of ${questionList.length}!`;
}

function handleNextButton(timeUp = false) {
  currQUestion++;
  if (currQUestion < questionList.length) {
    console.log("122" + currQUestion);
    tim.resetTimer();
    showQuestion();
    tim.startTimer();
  } else {
    if (timeUp) {
      tim.stopTimer();
      alert("Time Up!!");
    }
    handleSubmitButton(true);
  }
}

function handlePrevButton() {
  if (currQUestion === questionList.length) {
    currQUestion--;
  }
  if (currQUestion > 0) {
    currQUestion--;
    showQuestion();
  }
}

function handleSubmitButton(isTimeUp) {

  if (isSubmitEvent) {
    if (isTimeUp || confirm("Are you sure?")) {
      isSubmitEvent = !isSubmitEvent;
      document.getElementById("submit-btn").textContent = "Play Again";
      document.getElementById("next-btn").style.visibility = "hidden";
      document.getElementById("question-count").style.visibility = "hidden";
      document.getElementById("prev-btn").style.visibility = "hidden";
      document.getElementById("showtime").style.visibility = "hidden";
      showScore();
    }
  } else {
    location.href = `./../index.html`;
  }
}

function timer(t) {
  sec = t;
  let countdown; 

  function startTimer() {
    sec = t;
    countdown = setInterval(() => {
      updateTimer();
    }, 1000);
  }

  function displayTimer() {
    const countdownString = sec < 10 ? `00:0${sec}` : `00:${sec}`;
    document.getElementById('showtime').textContent = countdownString;
  }

  function updateTimer() {
    if (sec < 0) {
      attemptHistory[currQUestion] = 'NA'
      displayCorrectAnswer();
      resetTimer();
      handleNextButton(true);
    } else {
      displayTimer();
    }
    sec--;
  }

  function resetTimer() {
    clearInterval(countdown);
    sec = t;
    displayTimer();
    // startTimer();
  }

  function stopTimer() {
    clearInterval(countdown);
    countdown = null;

  }

  return {
    startTimer,
    resetTimer,
    stopTimer
  }
}

prepareAttempt();