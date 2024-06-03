const order = [];
let playerOrder = [];
let flash;
let turn;
let good;
let compTurn;
let intervalId;
let strict = false;
let noise = true;
let on = false;
let win;

const turnCounter = document.querySelector("#turn");
const topLeft = document.querySelector("#topleft");
const topRight = document.querySelector("#topright");
const bottomLeft = document.querySelector("#bottomleft");
const bottomRight = document.querySelector("#bottomright");
const strictButton = document.querySelector("#strict");
const onButton = document.querySelector("#on");
const startButton = document.querySelector("#start");
const modeSwitch = document.querySelector("#mode-switch");

strictButton.addEventListener('click', () => strict = strictButton.checked);
onButton.addEventListener('click', togglePower);
startButton.addEventListener('click', startGame);
modeSwitch.addEventListener('click', toggleMode);

[topLeft, topRight, bottomLeft, bottomRight].forEach((el, idx) => {
  el.addEventListener('click', () => playerClick(idx + 1));
});

function togglePower() {
  on = onButton.checked;
  if (on) {
    turnCounter.innerHTML = "-";
  } else {
    turnCounter.innerHTML = "";
    clearColor();
    clearInterval(intervalId);
  }
}

function startGame() {
  if (on || win) play();
}

function play() {
  win = false;
  order.length = 0;
  playerOrder.length = 0;
  flash = 0;
  intervalId = 0;
  turn = 1;
  turnCounter.innerHTML = 1;
  good = true;

  for (let i = 0; i < 20; i++) {
    order.push(Math.floor(Math.random() * 4) + 1);
  }

  compTurn = true;
  intervalId = setInterval(gameTurn, 800);
}

function gameTurn() {
  on = false;

  if (flash === turn) {
    clearInterval(intervalId);
    compTurn = false;
    clearColor();
    on = true;
  } else if (compTurn) {
    clearColor();
    setTimeout(() => {
      playSound(order[flash]);
      flash++;
    }, 200);
  }
}

function playSound(num) {
  if (noise) {
    document.getElementById(`clip${num}`).play();
  }
  noise = true;
  const colors = ["lightgreen", "red", "yellow", "blue"];
  const buttons = [topLeft, topRight, bottomLeft, bottomRight];
  buttons[num - 1].style.backgroundColor = colors[num - 1];
}

function clearColor() {
  topLeft.style.backgroundColor = "darkgreen";
  topRight.style.backgroundColor = "darkred";
  bottomLeft.style.backgroundColor = "goldenrod";
  bottomRight.style.backgroundColor = "darkblue";
}

function flashColor() {
  topLeft.style.backgroundColor = "lightgreen";
  topRight.style.backgroundColor = "red";
  bottomLeft.style.backgroundColor = "yellow";
  bottomRight.style.backgroundColor = "blue";
}

function playerClick(color) {
  if (on) {
    playerOrder.push(color);
    check();
    playSound(color);

    if (!win) {
      setTimeout(clearColor, 300);
    }
  }
}

function check() {
  if (playerOrder[playerOrder.length - 1] !== order[playerOrder.length - 1]) {
    good = false;
  }

  if (playerOrder.length === order.length && good) {
    winGame();
  }

  if (!good) {
    flashColor();
    turnCounter.innerHTML = "NO!";
    setTimeout(() => {
      turnCounter.innerHTML = turn;
      clearColor();

      if (strict) {
        play();
      } else {
        compTurn = true;
        flash = 0;
        playerOrder.length = 0;
        good = true;
        intervalId = setInterval(gameTurn, 800);
      }
    }, 800);

    noise = false;
  }

  if (turn === playerOrder.length && good && !win) {
    turn++;
    if (turn > 20) {
      winGame();
    } else {
      playerOrder.length = 0;
      compTurn = true;
      flash = 0;
      turnCounter.innerHTML = turn;
      intervalId = setInterval(gameTurn, 800);
    }
  }
}

function winGame() {
  flashColor();
  turnCounter.innerHTML = "WIN!";
  on = false;
  win = true;
}

function toggleMode() {
  document.body.classList.toggle('dark-mode');
}
