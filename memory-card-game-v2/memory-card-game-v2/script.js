const symbols = ["🍎", "🚀", "⚽", "🎮", "🐯", "🍩", "⭐", "💎"];

const board = document.getElementById("gameBoard");
const movesEl = document.getElementById("moves");
const timerEl = document.getElementById("timer");
const pairsEl = document.getElementById("pairs");
const messageEl = document.getElementById("message");
const restartBtn = document.getElementById("restartBtn");
const shuffleBtn = document.getElementById("shuffleBtn");

let cards = [];
let first = null;
let second = null;
let locked = false;
let moves = 0;
let pairs = 0;
let seconds = 0;
let timer = null;

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatTime(value) {
  const minutes = String(Math.floor(value / 60)).padStart(2, "0");
  const secs = String(value % 60).padStart(2, "0");
  return `${minutes}:${secs}`;
}

function startTimer() {
  if (timer) return;
  timer = setInterval(() => {
    seconds++;
    timerEl.textContent = formatTime(seconds);
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
  timer = null;
}

function makeCard(symbol, index) {
  const card = document.createElement("button");
  card.className = "card";
  card.type = "button";
  card.textContent = "?";
  card.dataset.symbol = symbol;
  card.dataset.index = index;
  card.addEventListener("click", () => openCard(card));
  return card;
}

function openCard(card) {
  if (locked) return;
  if (card.classList.contains("open")) return;
  if (card.classList.contains("matched")) return;

  startTimer();

  card.classList.add("open");
  card.textContent = card.dataset.symbol;

  if (!first) {
    first = card;
    return;
  }

  second = card;
  moves++;
  movesEl.textContent = moves;

  if (first.dataset.symbol === second.dataset.symbol) {
    first.classList.add("matched");
    second.classList.add("matched");
    pairs++;
    pairsEl.textContent = pairs;
    resetSelection();

    if (pairs === symbols.length) {
      stopTimer();
      messageEl.textContent = `You won! Moves: ${moves}, Time: ${formatTime(seconds)}`;
    }
  } else {
    locked = true;
    setTimeout(() => {
      first.classList.remove("open");
      second.classList.remove("open");
      first.textContent = "?";
      second.textContent = "?";
      resetSelection();
    }, 800);
  }
}

function resetSelection() {
  first = null;
  second = null;
  locked = false;
}

function newGame() {
  stopTimer();
  cards = shuffle([...symbols, ...symbols]);
  board.innerHTML = "";
  messageEl.textContent = "";
  first = null;
  second = null;
  locked = false;
  moves = 0;
  pairs = 0;
  seconds = 0;
  movesEl.textContent = "0";
  pairsEl.textContent = "0";
  timerEl.textContent = "00:00";

  cards.forEach((symbol, index) => {
    board.appendChild(makeCard(symbol, index));
  });
}

restartBtn.addEventListener("click", newGame);
shuffleBtn.addEventListener("click", newGame);

newGame();
