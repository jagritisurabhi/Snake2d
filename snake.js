// Snake game logic
const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

const boxSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = "right";

// ... (Previous code)

// Add the following variables for scoring
let score = 0;
const scoreElement = document.getElementById("scoreValue");

function move() {
    const head = { ...snake[0] };

    // ... (Previous move logic)

    // Check if the snake ate the food
    if (collision(head, food)) {
        // Generate new food
        food = generateFood();

        // Increase the score
        score += 10;

        // Update the score on the screen
        scoreElement.textContent = score;
    } else {
        // Remove the tail
        snake.pop();
    }

    draw();
}

// ... (Rest of the code)

function draw() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the snake
    snake.forEach((segment, index) => {
        const snakeColor = index === 0 ? "#2ecc71" : "#27ae60"; // Head is a different color

        // Draw the snake segment as a rounded rectangle
        const cornerRadius = 8;
        ctx.fillStyle = snakeColor;
        ctx.beginPath();
        ctx.moveTo(segment.x * boxSize + cornerRadius, segment.y * boxSize);
        ctx.arcTo((segment.x + 1) * boxSize, segment.y * boxSize, (segment.x + 1) * boxSize, (segment.y + 1) * boxSize, cornerRadius);
        ctx.arcTo((segment.x + 1) * boxSize, (segment.y + 1) * boxSize, segment.x * boxSize, (segment.y + 1) * boxSize, cornerRadius);
        ctx.arcTo(segment.x * boxSize, (segment.y + 1) * boxSize, segment.x * boxSize, segment.y * boxSize, cornerRadius);
        ctx.arcTo(segment.x * boxSize, segment.y * boxSize, (segment.x + 1) * boxSize, segment.y * boxSize, cornerRadius);
        ctx.fill();
    });

    // Draw the tongue for the snake's head
    const head = snake[0];
    ctx.fillStyle = "#ffcc00"; // Yellow color for the tongue
    if (direction === "up" || direction === "down") {
        ctx.fillRect((head.x + 0.4) * boxSize, (head.y + 1) * boxSize, 0.2 * boxSize, 0.5 * boxSize);
    } else {
        ctx.fillRect((head.x + 1) * boxSize, (head.y + 0.4) * boxSize, 0.5 * boxSize, 0.2 * boxSize);
    }

    // Draw the eyes on the snake's head
    const eyeSize = 4;
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc((head.x + 0.5) * boxSize, (head.y + 0.3) * boxSize, eyeSize, 0, 2 * Math.PI);
    ctx.fill();

    // Draw the food
    ctx.fillStyle = "#e74c3c";
    ctx.beginPath();
    const foodRadius = boxSize / 2;
    const foodX = (food.x + 0.5) * boxSize;
    const foodY = (food.y + 0.5) * boxSize;
    ctx.arc(foodX, foodY, foodRadius, 0, 2 * Math.PI);
    ctx.fill();
}




function move() {
    const head = { ...snake[0] };

    // Move the head based on the direction
    switch (direction) {
        case "up":
            head.y -= 1;
            break;
        case "down":
            head.y += 1;
            break;
        case "left":
            head.x -= 1;
            break;
        case "right":
            head.x += 1;
            break;
    }

    // Check for collisions with walls or itself
    if (
        head.x < 0 || head.x >= canvas.width / boxSize ||
        head.y < 0 || head.y >= canvas.height / boxSize ||
        collision(head, snake)
    ) {
        // Game over
        resetGame();
    } else {
        snake.unshift(head);

        // Check if the snake ate the food
        if (collision(head, food)) {
            // Generate new food
            food = generateFood();
        } else {
            // Remove the tail
            snake.pop();
        }

        draw();
    }
}

function collision(a, b) {
    return a.x === b.x && a.y === b.y;
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / boxSize)),
        y: Math.floor(Math.random() * (canvas.height / boxSize))
    };
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = "right";
}

// Handle touch events
let touchStartX, touchStartY;

canvas.addEventListener("touchstart", function (event) {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
});

canvas.addEventListener("touchmove", function (event) {
    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        direction = deltaX > 0 ? "right" : "left";
    } else {
        // Vertical swipe
        direction = deltaY > 0 ? "down" : "up";
    }
});

document.addEventListener("keydown", function (event) {
    // Handle arrow key events as well for non-touch devices
    switch (event.key) {
        case "ArrowUp":
            direction = "up";
            break;
        case "ArrowDown":
            direction = "down";
            break;
        case "ArrowLeft":
            direction = "left";
            break;
        case "ArrowRight":
            direction = "right";
            break;
    }
});


// Game loop
setInterval(move, 200);

