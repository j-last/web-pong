
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const PADDLE_WIDTH = 25
const PADDLE_HEIGHT = 100
const PADDLE_VELOCITY = 3

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = CANVAS_WIDTH
canvas.height = CANVAS_HEIGHT

const pressedKeys = [];

class Paddle {
    #x; #y; #width; #height; #colour; #score;
    constructor(x, y, width, height, colour, score) {
        this.#x = x;
        this.#y = y;
        this.#width = width;
        this.#height = height;
        this.#colour = colour;
        this.#score = score;
    }
    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    getWidth() {
        return this.#width;
    }
    getHeight() {
        return this.#height;
    }
    getColour() {
        return this.#colour;
    }
    getScore() {
        return this.#score;
    }
    incY() {
        this.#y = Math.max(Math.floor(this.#width/2), this.#y - PADDLE_VELOCITY);
    }
    decY() {
        this.#y = Math.min(CANVAS_HEIGHT - this.#height - Math.floor(this.#width/2), this.#y + PADDLE_VELOCITY);
    }
}

class Ball {
    #x; #y; #radius; #xVel; #yVel; #colour;
    constructor(radius, xVel, yVel) {
        this.resetPos();
        this.#radius = radius;
        this.#xVel = xVel;
        this.#yVel = yVel
        this.#colour = "red"
    }
    getX() {
        return this.#x;
    }
    getY() {
        return this.#y;
    }
    getRadius() {
        return this.#radius
    }
    getColour() {
        return this.#colour
    }
    changeColour() {
        if (this.#colour == "red") {
            this.#colour = "blue";
        }
        else if (this.#colour == "blue") {
            this.#colour = "red"
        }
    }
    resetPos() {
        this.#x = Math.floor(CANVAS_WIDTH/2)
        this.#y = Math.floor(CANVAS_HEIGHT/2)
    }
    paddleCollision(paddle) {
        let middlePaddle = {
            x: Math.floor(paddle.getX() - paddle.getWidth() / 2),
            y: Math.floor(paddle.getY() + paddle.getHeight() / 2),
        };
        if (Math.abs(middlePaddle.y - this.#y) < paddle.getHeight() / 2){
            console.log(Math.abs(middlePaddle.y - this.#y) < paddle.getHeight() / 2)
        }
        if (Math.abs(paddle.getX() - this.#x) < 2 
            && Math.abs(middlePaddle.y - this.#y) < paddle.getHeight() / 2) {
            return true
        }
    }
    offSide() {
        // collisions with walls
        if (this.#x - this.#radius < 0) {
            this.resetPos();
            return "left"
        }
        if (this.#x + this.#radius > CANVAS_WIDTH) {
            this.resetPos();
            return "right"
        }
    }
    move(paddles) {
        this.#x += this.#xVel;
        this.#y += this.#yVel;
        // collision with top & bottom walls
        if (this.#y - this.#radius < 0 || this.#y + this.#radius > CANVAS_HEIGHT) {
            this.#yVel *= -1;

        paddles.foreach(paddle => {
            pad
        });
        };
    }
}

let paddle1 = new Paddle(x=PADDLE_WIDTH,  // a distance of its width away from the left wall
                        y=Math.floor(CANVAS_HEIGHT / 2), 
                        width=PADDLE_WIDTH,
                        height=PADDLE_HEIGHT,
                        colour="red",
                        score=0);

let paddle2 = new Paddle(x=CANVAS_WIDTH - PADDLE_WIDTH * 2,  // a distance of its width away from the right wall
                        y=Math.floor(CANVAS_HEIGHT / 2), 
                        width=PADDLE_WIDTH,
                        height=PADDLE_HEIGHT,
                        colour="blue",
                        score=0);

let ball = new Ball(radius=10, 3, 4)

function update() {
    // Player input
    if (pressedKeys.includes("s")) {
        paddle1.decY()
    }
    else if (pressedKeys.includes("w")) {
        paddle1.incY()
    };
    if (pressedKeys.includes("arrowdown")) {
        paddle2.decY()
    }
    else if (pressedKeys.includes("arrowup")) {
        paddle2.incY()
    };
    // move the ball (collisions with top & bottom walls dealt with in this method)
    ball.move()

    if (ball.offSide() == "left") {
        paddle2.incScore()
    }
    else {
        paddle1.incScore()
    }
    
    // clear shapes from previous frame
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // draw the paddles
    ctx.fillStyle = paddle1.getColour();
    ctx.fillRect(paddle1.getX(), paddle1.getY(), paddle1.getWidth(), paddle1.getHeight());
    ctx.fillStyle = paddle2.getColour();
    ctx.fillRect(paddle2.getX(), paddle2.getY(), paddle2.getWidth(), paddle2.getHeight());

    // draw the ball
    ctx.beginPath();
    ctx.arc(ball.getX(), ball.getY(), ball.getRadius(), 0, 360);
    ctx.fillStyle = ball.getColour();
    ctx.fill()
    ctx.stroke();

    // display the score
    ctx.font = "50px Arial";
    ctx.fillText(paddle1.getScore(), Math.floor(CANVAS_WIDTH/4), Math.floor(CANVAS_HEIGHT / 2))
    ctx.fillText(paddle2.getScore(), Math.floor(CANVAS_WIDTH*3/4), Math.floor(CANVAS_HEIGHT / 2))

    // call the main game loop again
    requestAnimationFrame(update);
};

function init() {
    // adds listeners for keyboard input & manages it inside the "pressedKeys" list
        // key pressed (add to pressedKeys)
    window.addEventListener("keydown", e => {
        if (pressedKeys.includes(e.key.toLowerCase())) return;
        pressedKeys.push(e.key.toLowerCase());
    });
        // key released (remove from pressedKeys)
    window.addEventListener("keyup", e => {
        pressedKeys.splice(pressedKeys.indexOf(e.key.toLowerCase()), 1);
    });

    // initiates main game loop
    update();
};

// ensures all content is loaded before the game starts
window.onload = init();
