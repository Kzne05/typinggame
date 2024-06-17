const TIME_LIMIT = 60;

const quotes = [
  "Now I am become Death, the destroyer of worlds.",
  "We don't talk anymore, like we used to do",
  "I've been waiting on this for a long time",
  "Cause girl you're perfect, you're always worth it",
  "I remember when I first noticed that you liked me back",
  "The only way to do great work is to love what you do."
];

let timerText = document.querySelector(".curr_time");
let accuracyText = document.querySelector(".curr_accuracy");
let errorText = document.querySelector(".curr_errors");
let cpmText = document.querySelector(".curr_cpm");
let wpmText = document.querySelector(".curr_wpm");
let quoteText = document.querySelector(".quote");
let inputArea = document.querySelector(".input_area");
let restartBtn = document.querySelector(".restart_btn");
let cpmGroup = document.querySelector(".cpm");
let wpmGroup = document.querySelector(".wpm");

let timer, quoteIndex, timeLeft, timeElapsed, totalErrors, errors, accuracy, charactersTyped;
let isGameStarted = false; 

function initializeGame() {
  quoteIndex = 0;
  timeLeft = TIME_LIMIT;
  timeElapsed = 0;
  totalErrors = 0;
  errors = 0;
  accuracy = 100;
  charactersTyped = 0;

  inputArea.disabled = true; // Disable input area initially
  inputArea.value = "";
  quoteText.textContent = 'Click on the area below to start the game.';
  accuracyText.textContent = "100%";
  timerText.textContent = `${timeLeft}s`;
  errorText.textContent = "0";
  cpmGroup.style.display = "none";
  wpmGroup.style.display = "none";
  restartBtn.style.display = "none";

  loadNewQuote();
}

function loadNewQuote() {
  quoteText.textContent = null;
  let currentQuote = quotes[quoteIndex].split('');
  currentQuote.forEach(char => {
    let charSpan = document.createElement('span');
    charSpan.innerText = char;
    quoteText.appendChild(charSpan);
  });

  quoteIndex = (quoteIndex + 1) % quotes.length;
}

function updateText() {
  let input = inputArea.value.split('');
  charactersTyped++;
  errors = 0;

  let quoteSpans = quoteText.querySelectorAll('span');
  quoteSpans.forEach((char, index) => {
    let typedChar = input[index];
    if (!typedChar) {
      char.classList.remove('correct_char', 'incorrect_char');
    } else if (typedChar === char.innerText) {
      char.classList.add('correct_char');
      char.classList.remove('incorrect_char');
    } else {
      char.classList.add('incorrect_char');
      char.classList.remove('correct_char');
      errors++;
    }
  });

  errorText.textContent = totalErrors + errors;
  accuracyText.textContent = `${Math.round((charactersTyped - (totalErrors + errors)) / charactersTyped * 100)}%`;

  if (input.length === quoteText.textContent.length) {
    totalErrors += errors;
    inputArea.value = "";
    loadNewQuote();
  }
}

function updateTimer() {
  if (timeLeft > 0) {
    timeLeft--;
    timeElapsed++;
    timerText.textContent = `${timeLeft}s`;
  } else {
    endGame();
  }
}

function endGame() {
  clearInterval(timer);
  inputArea.disabled = true;
  quoteText.textContent = "Click on restart to start a new game.";
  restartBtn.style.display = "block";

  let cpm = Math.round((charactersTyped / timeElapsed) * 60);
  let wpm = Math.round((charactersTyped / 5 / timeElapsed) * 60);

  cpmText.textContent = cpm;
  wpmText.textContent = wpm;
  cpmGroup.style.display = "block";
  wpmGroup.style.display = "block";
}

function startGame() {
  if (!isGameStarted) {
    isGameStarted = true;
    inputArea.disabled = false; 
    inputArea.focus(); 
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    inputArea.addEventListener("input", updateText);
  }
}


function removeInputEventListener() {
  inputArea.removeEventListener("input", updateText);
  isGameStarted = false; 
}

quoteText.addEventListener("click", startGame);

restartBtn.addEventListener("click", () => {
  removeInputEventListener();
  initializeGame();
  isGameStarted = false; 
});

initializeGame();
