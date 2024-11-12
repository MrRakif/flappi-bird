const bird = document.getElementById('bird');
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');

let birdY = 250;
let gravity = 2;
let isGameOver = false;
let pipes = [];
let score = 0;

// Start game
function startGame() {
    document.addEventListener('keydown', flap);
    document.addEventListener('click', flap);

    setInterval(updateGame, 20); // Update the game every 20ms
    setInterval(createPipe, 2000); // Create a pipe every 2 seconds
}

// Flap the bird
function flap() {
    if (!isGameOver) birdY -= 50;
}

// Create pipes
function createPipe() {
    if (isGameOver) return;

    let pipeGap = 150;
    let pipeHeight = Math.floor(Math.random() * (300 - 100 + 1)) + 100;

    let pipeTop = document.createElement('div');
    pipeTop.classList.add('pipe', 'pipe-top');
    pipeTop.style.height = pipeHeight + 'px';
    pipeTop.style.right = '0px';
    game.appendChild(pipeTop);

    let pipeBottom = document.createElement('div');
    pipeBottom.classList.add('pipe', 'pipe-bottom');
    pipeBottom.style.height = (600 - pipeHeight - pipeGap) + 'px';
    pipeBottom.style.right = '0px';
    game.appendChild(pipeBottom);

    pipes.push({ pipeTop, pipeBottom });
}

// Update game logic
function updateGame() {
    if (isGameOver) return;

    // Apply gravity to the bird
    birdY += gravity;
    bird.style.top = birdY + 'px';

    // Move pipes and check for collisions
    pipes.forEach((pipePair, index) => {
        let pipeTop = pipePair.pipeTop;
        let pipeBottom = pipePair.pipeBottom;

        // Move pipes from right to left
        let pipeLeft = parseInt(window.getComputedStyle(pipeTop).getPropertyValue('right'));
        pipeLeft += 5;
        pipeTop.style.right = pipeLeft + 'px';
        pipeBottom.style.right = pipeLeft + 'px';

        // Check for collision
        if (checkCollision(pipeTop, pipeBottom)) {
            endGame();
        }

        // Remove pipe after it passes out of the screen
        if (pipeLeft > 450) {
            pipeTop.remove();
            pipeBottom.remove();
            pipes.splice(index, 1);
            updateScore();
        }
    });

    // Check if bird hits the ground
    if (birdY > 570) {
        endGame();
    }
}

// Check for collision with pipes
function checkCollision(pipeTop, pipeBottom) {
    let birdRect = bird.getBoundingClientRect();
    let pipeTopRect = pipeTop.getBoundingClientRect();
    let pipeBottomRect = pipeBottom.getBoundingClientRect();

    return (
        birdRect.right > pipeTopRect.left &&
        birdRect.left < pipeTopRect.right &&
        (birdRect.top < pipeTopRect.bottom || birdRect.bottom > pipeBottomRect.top)
    );
}

// Update score when the bird passes through pipes
function updateScore() {
    score++;
    scoreDisplay.textContent = 'Score: ' + score;
}

// End the game
function endGame() {
    isGameOver = true;
    gameOverDisplay.style.display = 'block';
}

// Restart the game
function restartGame() {
    isGameOver = false;
    birdY = 250;
    pipes.forEach(pipe => {
        pipe.pipeTop.remove();
        pipe.pipeBottom.remove();
    });
    pipes = [];
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    gameOverDisplay.style.display = 'none';
}

// Start the game on load
startGame();
