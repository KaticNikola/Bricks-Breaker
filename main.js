const cvs = document.getElementById("game");
const cxt = cvs.getContext('2d');

cvs.style.border = '1px solid #0ff';

//paddle border 
cxt.lineWidth = 3;

//GAME VARs
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;

const BALL_RADIUS = 8;

let leftArrow = false;
let rightArrow = false;

let LIFE = 3;
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
let MAX_LEVEL = 5;
const GAME_OVER = false;


//GAME CONTROLS
document.addEventListener("keydown", function (e) {
	if (e.keyCode === 37) {
		leftArrow = true
	} else if (e.keyCode === 39) {
		rightArrow = true
	}
})
document.addEventListener("keyup", function (e) {
	if (e.keyCode === 37) {
		leftArrow = false
	} else if (e.keyCode === 39) {
		rightArrow = false
	}
})


//PADDLE
const paddle = {
	x: cvs.width / 2 - PADDLE_WIDTH / 2,
	y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
	width: PADDLE_WIDTH,
	height: PADDLE_HEIGHT,

	dx: 5, //define movement 
}
function drawPaddle() {
	cxt.fillStyle = '#2e3548';
	cxt.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
	cxt.strokeStyle = '#ffcd05';
	cxt.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function movePaddle() {
	if (rightArrow && paddle.x + paddle.width < cvs.width) {
		paddle.x += paddle.dx;
	} else if (leftArrow && paddle.x > 0) {
		paddle.x -= paddle.dx;
	}
}

//BALL
const ball = {
	x: cvs.width / 2,
	y: paddle.y - BALL_RADIUS,
	radius: BALL_RADIUS,
	speed: 4,
	dx: 3 * (Math.random() * 2 - 1), //random direction  ,
	dy: -3,

}

function drawBall() {
	cxt.beginPath();

	cxt.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
	cxt.fillStyle = '#ffcd05';
	cxt.fill();
	cxt.strokeStyle = '#2e3548';
	cxt.stroke();

	cxt.closePath();
}
function moveBall() {
	ball.x += ball.dx;
	ball.y += ball.dy;
}
function resetBall() {
	ball.x = cvs.width / 2,
	ball.y = paddle.y - BALL_RADIUS,
	ball.dx = 3 * (Math.random() * 2 - 1), //random direction  
	ball.dy = -3
}

//COLISION
function collisionBallWall() {
	if (ball.x + ball.radius > cvs.width || ball.x - ball.radius <= 0) {
		ball.dx = -ball.dx
	}
	if (ball.y - ball.radius <= 0) {
		ball.dy = -ball.dy;
	}
	if (ball.y + ball.radius > cvs.height) {
		LIFE_LOST.play();
		LIFE--;
		resetBall();
	}
}

function collisionBallPaddle() {
	if (ball.x < paddle.x + paddle.width &&
		ball.x > paddle.x &&
		ball.y < paddle.y + paddle.height &&
		ball.y > paddle.y) {
		PADDLE_HIT.play()
		// Where ball hit paddle
		let collidePoint = ball.x - (paddle.x + paddle.width / 2);
		collidePoint = collidePoint / (paddle.width / 2);
		//calc angle of impact
		let angle = collidePoint * Math.PI / 3 //60deg
		ball.dx = ball.speed * Math.sin(angle);
		ball.dy = -ball.speed * Math.cos(angle);
	}
}

function collisionBallBricks() {
	for (let r = 0; r < brick.row; r++) {
		for (let c = 0; c < brick.columns; c++) {
			var b = bricks[r][c];
			if (b.status) {
				if (ball.x + ball.radius > b.x &&
					ball.x - ball.radius < b.x + brick.width &&
					ball.y + ball.radius > b.y &&
					ball.y - ball.radius < b.y + brick.height) {

					BRICK_HIT.play()
					ball.dy = -ball.dy;
					b.status = false;
					SCORE += SCORE_UNIT;
				}
			}
		}
	}
}

//BRICKS 
const brick = {
	row: 2,
	columns: 8,
	width: 55,
	height: 20,
	offsetLeft: 10,
	offsetTop: 10,
	marginTop: 40,
	fillColor: "#2e3548",
	strokeColor: "#fff",
}
let bricks = [];

function createBricks() {
	for (let r = 0; r < brick.row; r++) {
		bricks[r] = []//create row
		for (let c = 0; c < brick.columns; c++) {
			bricks[r][c] = { //individual brick
				x: c * (brick.offsetLeft + brick.width) + brick.offsetLeft,
				y: r * (brick.offsetTop + brick.height) + brick.offsetTop + brick.marginTop,
				status: true
			}
		}
	}

}

createBricks();
//DRAW BRICK
function drawBricks() {
	for (let r = 0; r < brick.row; r++) {
		for (let c = 0; c < brick.columns; c++) {
			let b = bricks[r][c];//loop created brics
			if (b.status) {
				cxt.fillStyle = brick.fillColor;
				cxt.fillRect(
					b.x, b.y,//from loopCreated brick  
					brick.width, brick.height);

				cxt.strokeStyle = brick.strokeColor;
				cxt.strokeRect(
					b.x, b.y,//from loopCreated brick  
					brick.width, brick.height);
			}
		}
	}
}

//DISPLAY GAME STATS
function showGameStats(txt, txtX, txtY, img, imgX, imgY) {
	//text
	cxt.fillStyle = 'fff';
	cxt.font = '25px Germania One';
	cxt.fillText(txt, txtX, txtY);

	//image
	cxt.drawImage(img, imgX, imgY, width = 25, height = 25)
}

//GAME STATE
function gameOver() {
	if (LIFE < 0) {
		GAME_OVER = true;

	}
}
//NEXT LEVEL
function levelUp() {
	let isLevelDone = true;

	//are all bricks broken
	for (let r = 0; r < brick.row; r++) {
		for (let c = 0; c < brick.columns; c++) {
			isLevelDone = isLevelDone && !bricks[r][c].status
		}
	}
	if (isLevelDone) {
		WIN.play();
		if (LEVEL >= MAX_LEVEL) {

			GAME_OVER = true;
			return;
		}
		brick.row++;
		createBricks();
		ball.speed += 0.25;
		resetBall();
		LEVEL++;
	}
}

//DRAW
function draw() {
	drawBall();
	drawPaddle();
	drawBricks()

	//show SCORE
	showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5)
	//LIFE
	showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5)
	//LEVEL
	showGameStats(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5)
}
//UPDATE
function update() {
	movePaddle();
	moveBall()
	collisionBallWall()
	collisionBallPaddle()
	collisionBallBricks()

	levelUp()
	gameOver()

}
//LOOP
function loop() {
	cxt.drawImage(BG_IMG, 0, 0, cvs.width, cvs.height)
	draw();
	update();

	if (!GAME_OVER) {
		requestAnimationFrame(loop);
	}

}

loop()

//SOUND ON/OFF
const soundBtn = document.getElementById('soundBtn');

soundBtn.addEventListener('click', audioMenager);

function audioMenager() {
	//change soud icon src
	let imgSrc = soundBtn.getAttribute("src");
	let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";
	soundBtn.setAttribute('src', SOUND_IMG);

	WALL_HIT.muted = WALL_HIT.muted ? false : true
	LIFE_LOST.muted = LIFE_LOST.muted ? false : true
	PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true
	WIN.muted = WIN.muted ? false : true
	BRICK_HIT.muted = BRICK_HIT.muted ? false : true
}