const player = document.getElementById('player');
const subtitlesElement = document.getElementById('subtitles');
const volumeSlider = document.getElementById('volumeSlider');
const fontSizeSlider = document.getElementById('fontSizeSlider');
const gameArea = document.getElementById('gameArea');
let playerPositionX = 50;
let playerPositionY = 20;
let volume = 1;
let fontSize = 16;
let obstacles = [];
let gameInterval;

function startGame() {
  playerPositionX = 50;
  playerPositionY = 20;
  player.style.left = `${playerPositionX}%`;
  player.style.bottom = `${playerPositionY}px`;
  speak("O jogo começou. Use as teclas de seta para mover o jogador e evitar os obstáculos.");
  showSubtitle("O jogo começou. Use as teclas de seta para mover o jogador.");
  obstacles = [];
  createObstacles();
  gameInterval = setInterval(updateGame, 100);
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = volume;
  speechSynthesis.speak(utterance);
}

function showSubtitle(text) {
  subtitlesElement.textContent = text;
  subtitlesElement.style.fontSize = `${fontSize}px`;
}

function movePlayer(dx, dy) {
  playerPositionX += dx;
  playerPositionY += dy;

  if (playerPositionX < 0) playerPositionX = 0;
  if (playerPositionX > 100) playerPositionX = 100;
  if (playerPositionY < 0) playerPositionY = 0;
  if (playerPositionY > 80) playerPositionY = 80;

  player.style.left = `${playerPositionX}%`;
  player.style.bottom = `${playerPositionY}px`;
}

function createObstacles() {
  for (let i = 0; i < 3; i++) {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${Math.random() * 90}%`;
    gameArea.appendChild(obstacle);
    obstacles.push(obstacle);
  }
}

function updateGame() {
  obstacles.forEach((obstacle, index) => {
    let obstacleTop = parseFloat(window.getComputedStyle(obstacle).top);
    if (obstacleTop > gameArea.offsetHeight) {
      obstacleTop = -40;
      obstacle.style.left = `${Math.random() * 90}%`;
    }
    obstacle.style.top = `${obstacleTop + 2}px`;

    if (detectCollision(obstacle)) {
      speak("Você colidiu com um obstáculo!");
      showSubtitle("Você colidiu com um obstáculo!");
      clearInterval(gameInterval);
    }
  });
}

function detectCollision(obstacle) {
  const playerRect = player.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();
  return !(playerRect.right < obstacleRect.left || 
           playerRect.left > obstacleRect.right || 
           playerRect.bottom < obstacleRect.top || 
           playerRect.top > obstacleRect.bottom);
}

window.addEventListener("keydown", function(event) {
  if (event.key === "ArrowUp") {
    movePlayer(0, 10);
    speak("Você subiu.");
    showSubtitle("Você subiu.");
  } else if (event.key === "ArrowDown") {
    movePlayer(0, -10);
    speak("Você desceu.");
    showSubtitle("Você desceu.");
  } else if (event.key === "ArrowLeft") {
    movePlayer(-10, 0);
    speak("Você moveu para a esquerda.");
    showSubtitle("Você moveu para a esquerda.");
  } else if (event.key === "ArrowRight") {
    movePlayer(10, 0);
    speak("Você moveu para a direita.");
    showSubtitle("Você moveu para a direita.");
  }
});

volumeSlider.addEventListener('input', function() {
  volume = volumeSlider.value;
});

fontSizeSlider.addEventListener('input', function() {
  fontSize = fontSizeSlider.value;
  subtitlesElement.style.fontSize = `${fontSize}px`;
});
