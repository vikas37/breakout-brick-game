const canvas = document.getElementById("canvas");

const context = canvas.getContext("2d");

const WIDTH = 900;
const HEIGHT = 600;

canvas.width = WIDTH;
canvas.height = HEIGHT;

canvas.style.backgroundColor = "#013a63";

// variables//

let blockArr = [];
let blockIndex = 0;
let numBlockCol = 10;
let numBlockRow = 4;
let colWidth = WIDTH / numBlockCol;
let padding = colWidth / numBlockRow;
let isGameOver = false;
let isLeft = false;
let isRight = false;
let score = 0;
let lifeCount = 3;

let blockProp = {
  w: colWidth,
  h: padding,
};

let playerProp = {
  x: WIDTH / 2 - colWidth / 2,
  y: HEIGHT - 1.5 * padding,
  w: colWidth,
  h: padding,
};

let ballProp = {
  x: WIDTH / 2,
  y: HEIGHT / 2,
  radius: padding / 3,
};

window.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    isLeft = true;
    isRight = false;
  } else if (event.keyCode == 39) {
    isRight = true;
    isLeft = false;
  }
});

window.addEventListener("keyup", function () {
  isLeft = false;
  isRight = false;
});

initializeBlocks();

let player = new Player(playerProp.x, playerProp.y, playerProp.w, playerProp.h);
let ball = new Ball(ballProp.x, ballProp.y, ballProp.radius);

// initialize the blocks//

function initializeBlocks() {
  for (let i = 1; i < numBlockCol; i++) {
    for (let j = 0; j < numBlockRow; j++) {
      blockArr[blockIndex] = new block(
        padding / 2 + i * colWidth - colWidth / 2,
        colWidth + j * (colWidth - 2 * padding),
        blockProp.w - padding,
        blockProp.h,
        true
      );
      blockIndex++;
    }
  }
}

// block function //

function block(x, y, width, height, isShow) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.isShow = isShow;
}

//  Dispaly block//
function displayBlock() {
  blockArr.forEach((b) => {
    if (isBlockHit(ball, b) && b.isShow) {
      b.isShow = false;
      ball.yDirSpeed = -ball.yDirSpeed;
      score++;
      //document.getElementById("livscore").innerHTML = score;
      if (score == (numBlockCol - 1) * numBlockRow) {
        isGameOver = true;
        // context.fillText(
        //   "Congratulations! You've completed the game",
        //   300,
        //   450
        //);
        // document.getElementById("gameOver").innerHTML =
        //   "Congratulations! You've completed the game ";
      }
    }
    if (b.isShow) {
      context.beginPath();
      context.fillStyle = "#fb8b24";
      context.fillRect(b.x, b.y, b.width, b.height);
      context.closePath();
    }
  });
}

// player function//

function Player(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.lifeCount = 3; //life count = 3//
  this.xDirSpeed = 0;
}

Player.prototype.drawPlayer = function () {
  context.beginPath();
  context.fillStyle = "#e9190f";
  context.fillRect(this.x, this.y, this.width, this.height);
  context.closePath();
};

Player.prototype.updatePlayer = function (x) {
  this.x += x;
  this.xDirSpeed = x;
  if (this.x < 0) {
    this.x = 0;
    this.xDirSpeed = 0;
  } else if (this.x + this.width > WIDTH) {
    this.x = WIDTH - this.width;
    this.xDirSpeed = 0;
  }
};

// Ball function //
function Ball(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.xDirSpeed = Math.random() < 0.5 ? 2 : -2;
  this.yDirSpeed = Math.random() < 0.5 ? 2 : -3;
}

Ball.prototype.drawBall = function () {
  context.beginPath();
  context.fillStyle = "#89fc00";
  context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
  context.fill();
  context.closePath();
};

Ball.prototype.updateBall = function () {
  this.x += this.xDirSpeed;
  this.y += this.yDirSpeed;

  // if the ball hits the left, right or top of the canvas

  if (this.x - this.radius < 0) {
    this.xDirSpeed = -this.xDirSpeed;
  } else if (this.x + this.radius > WIDTH) {
    this.xDirSpeed = -this.xDirSpeed;
  } else if (this.y - this.radius < 0) {
    this.yDirSpeed = -this.yDirSpeed;
  }

  // if the ball hit the player //

  if (
    this.x + this.radius > player.x &&
    this.x - this.radius < player.x + player.width &&
    this.y + this.radius > HEIGHT - 1.5 * padding
  ) {
    this.yDirSpeed = -this.yDirSpeed;
    this.y += this.yDirSpeed;
    this.xDirSpeed += player.xDirSpeed / 4;
  }

  // if the ball does not hit the player//

  if (
    (this.x + this.radius < player.x ||
      this.x + this.radius > player.x + player.width) &&
    this.radius + this.y > HEIGHT
  ) {
    player.lifeCount--;
    //context.fillText(`Life Remaining: ${player.lifeCount}`, 50, 50);
    //document.getElementById("liferemaining").innerHTML = player.lifeCount;
    if (player.lifeCount <= 0) {
      isGameOver = true;
      //document.getElementById("gameOver").innerHTML = "Game Over !!";
    } else {
      this.x = WIDTH / 2;
      this.y = HEIGHT / 2;
      this.xDirSpeed = Math.random() > 0.5 ? 2 : -2;
      this.yDirSpeed = Math.random() > 0.5 ? 2 : -3;
    }
  }
};

function isBlockHit(ball, block) {
  if (
    ball.x + ball.radius > block.x &&
    ball.x - ball.radius < block.x + block.width &&
    ball.y + ball.radius > block.y &&
    ball.y - ball.radius < block.y + block.height
  ) {
    return true;
  } else {
    return false;
  }
}

function drawGame() {
  displayBlock();
  player.drawPlayer();
  context.font = "35px sans-serif";
  context.fillText(`Life Remaining: ${player.lifeCount}`, 50, 50);
  if (player.lifeCount <= 0) {
    context.fillText("Game Over!!", 400, 400);
  }
  ball.drawBall();
  if (score == (numBlockCol - 1) * numBlockRow) {
    context.fillText("You have won the game!!", 400, 400);
  }
  context.fillText(`Score: ${score}`, 600, 50);
}

function updateGame() {
  ball.updateBall(player);
  if (isLeft) {
    player.updatePlayer(-4);
  } else if (isRight) {
    player.updatePlayer(4);
  }
}

function animateGame() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  drawGame();
  if (!isGameOver) {
    updateGame();
  }

  requestAnimationFrame(animateGame);
}

animateGame();
