//		SPACE MARBLES GAME
//-----


//"use strict";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const gui = new GUI(document.getElementById('gui_canvas'));

const mouse = new Mouse(canvas);

let start_clicked = false;

let first_run = true; //prevent update function from doubling every time start() is called

const left_score = document.getElementById('left_score');
const right_score = document.getElementById('right_score');
 
//--------

const debug = false;

const states = {AIMING:'aiming', RUNNING:'running', BALL_SELECTION:'ballSelection', VICTORY:'victory', INTRO:'intro'};
let state, updateCurrentState;



const balls_per_player = 15; //15
const ball_radius = 20;
const aim_vector = new Vector2();


let num_collision_checks = 0;			//435



global_friction = 0.988; //0.992;
const shot_strength = 0.1; //0.075
const shot_vector_limit = 210;

let default_ball_radius = 20;

let current_player = 1;
let turn_count = 0;

let selected_ball;
let ball_under_mouse;
let prev_ball_under_mouse;
const ball_mouse_hover_color = '#e6e600';


let player1 = {id:1, balls:[], color:'#9966ff'};
let player2 = {id:2, balls:[], color:'#29a3a3'};

left_score.style.color = player2.color;
right_score.style.color = player1.color;

let balls = [];





const SFX = {
			beep : 	  new Sound('sfx/beep.wav'),
			victory : new Sound('sfx/victory.wav', 0.8),
			turn :    new Sound('sfx/turn.wav', 0.7),
			click :   new Sound('sfx/click.wav', 0.7)
			}









start();
//-----------------------------------
function Sound(src, volume=1) {
  this.sound = document.createElement("audio");
  this.sound.volume = volume;
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function(){
	//this.sound.load();
	this.sound.currentTime = 0;
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}



//-----------------------------------
//-- Main Game States

function aimingState() {
	if (mouse.right_down) {
		setState(states.BALL_SELECTION);
		selected_ball = null;
		ball_under_mouse = null;
		return;
	}
	
	if (!mouse.left_held) {
		shootSelectedBall();
		ball_under_mouse = null;
		setState(states.RUNNING);
	}
	
	
	for (let i in balls) {
		balls[i].update();
	}
	
	render();
}


function ballSelectionState() {
	let none = true;
	for (let i in balls) {
		if (balls[i].mouseOver() && balls[i].owner === current_player.toString()) {
			ball_under_mouse = balls[i];
			none = false;
			if (mouse.left_down) {
				selected_ball = ball_under_mouse;
				setState(states.AIMING);
				SFX.click.play();
			}
		} 
		
	}
	if (none) ball_under_mouse = null;
	mouse.reset();
	
	render();
}




function runningState() {
	if (allBallsAreStopped()) {
		let result = checkVictory();
		
		if (result) { 
			if (result.text === 'draw') 
				gui.displayMessage(`It's a Draw`, result.color);
			else
				gui.displayMessage(result.text + ' Wins!', result.color);	
			
			setState(states.VICTORY);
			SFX.victory.play();
			setTimeout(() => {gui.displayMessage(':]', result.color);}, 3500);
			balls.forEach((b) => {b.velocity.x = (Math.random() > 0.5 ? 7 : -7) * Math.random(); b.velocity.y = -10});
			return;
		}
		setState(states.BALL_SELECTION);
		advanceTurn();
	}
	
	

	for (let i in balls) 
		balls[i].update();
		

	//applyWallCollision();
	applyBallCollision();
	checkBallsOutsideBounds();
	removeDeadBalls();
	
	
	render();
}

function victoryState() {
	balls.forEach((b) => {
		b.velocity.y += 0.15; 
		b.position.add(b.velocity);
		});
	applyWallCollision();
		
	
	render();
}


function introState() {
	if (!start_clicked) return;
	for (let i in balls) {
		const b = balls[i];
		if (b.r < ball_radius - 0.5) {
			b.r = lerp(b.r, ball_radius, 0.5);
			break;
		}else {
			b.r = ball_radius;
			if (b.flash_value === 0) {b.flash(); SFX.click.play();};
			if (i >= balls.length-1) {
				setState(states.BALL_SELECTION);
				gui.displayMessage('Player ' + current_player, eval('player' + current_player).color);
			}
		}
	}
	
	render();
}



//----------------------------------------
//	Helper Functions

function updateScoreDisplay() {
	left_score.innerHTML = player2.balls.length;
	right_score.innerHTML = player1.balls.length;
}

function checkVictory() {
	if (player1.balls.length < 1 && player2.balls.length > 0) return {text:'player2', color:player2.color};
	if (player2.balls.length < 1 && player1.balls.length > 0) return {text:'player1', color:player1.color};
	if (player1.balls.length + player2.balls.length < 1) return {text:'draw', color:'white'};
	return false;
}

function advanceTurn() {
	turn_count++;
	current_player = current_player % 2 === 0 ? 1 : 2;
	gui.displayMessage('Player ' + current_player, eval('player' + current_player).color);
	SFX.turn.play();
}


function resolveCollision(a, b) {
	SFX.beep.play();
	a.flash();
	b.flash();
	const diff = Vector2.between(a.position, b.position);
	const mid = a.position.copy().add(b.position).multiply(0.5);
	const normal = diff.normalized();
	
	//seperate balls
	a.position.set(mid.x - normal.x * a.r, mid.y - normal.y * a.r);	
	b.position.set(mid.x + normal.x * b.r, mid.y + normal.y * a.r);
	
	//bounce off
	let power = (a.velocity.x - b.velocity.x) * normal.x;
	power += (a.velocity.y - b.velocity.y) * normal.y;
	const displacement = normal.multiply(power);
	a.velocity.subtract(displacement);
	b.velocity.add(displacement);


	
}

function applyBallCollision() {
	num_collision_checks = 0;
	for (let i = 0; i < balls.length-1; i++) {
		for (let j = i + 1; j < balls.length; j++) {
			const b1 = balls[i], b2 = balls[j];
			
			if (!b1.moving && !b2.moving) continue;
			
			num_collision_checks++;
			if (ballsCollide(b1, b2)) {
				resolveCollision(b1, b2);
			}
		}
	}
}

function applyWallCollision() {
	for (let i in balls) {
		let b = balls[i];
		if (b.position.x < b.r || b.position.x > canvas.width - b.r) {
			b.position.x = clamp(b.position.x, b.r, canvas.width - b.r);
			b.velocity.x *= -1;
			b.flash();
			SFX.beep.play();
			}
		if (b.position.y < b.r || b.position.y > canvas.height - b.r) {
			b.position.y = clamp(b.position.y, b.r, canvas.height - b.r);
			b.velocity.y *= -1;
			b.flash();
			SFX.beep.play();
		}
	}
}

function clamp(val, min, max) {
	return Math.min(Math.max(val, min), max);

}

function checkBallsOutsideBounds() {
	for (let i in balls) {
		let b = balls[i];
		const margin = b.r - 5;
		if (b.position.x < -margin || b.position.x > canvas.width + margin) {
			b.dead = true;
			}
		if (b.position.y < -margin || b.position.y > canvas.height + margin) {
			b.dead = true;
		}
	}
}

function removeDeadBalls() {
		for (let i in player1.balls) {
			if (player1.balls[i].dead) {
				player1.balls.splice(i, 1);
				updateScoreDisplay();
			}
		}
		for (let i in player2.balls) {
			if (player2.balls[i].dead) {
				player2.balls.splice(i, 1);
				updateScoreDisplay();
			}
		}
		balls = player1.balls.concat(player2.balls);

}

function shootSelectedBall() {
	let impulse = aim_vector.multiply(shot_strength);
	selected_ball.velocity.set(impulse);
}

function allBallsAreStopped() {
	for (let i in balls) {
		if (balls[i].moving) return false;
	}
	return true;
}

function ballsCollide(ball1, ball2) {
	const 	sum_radii = ball1.r + ball2.r;
			return getDistanceSquared(ball1.position, ball2.position) < sum_radii*sum_radii;
}

function getDistance(p1, p2) {
	const 	dx = p2.x - p1.x,
			dy = p2.y - p1.y;
			return Math.sqrt(dx*dx + dy*dy);
}

function getDistanceSquared(p1, p2) {
	const 	dx = p2.x - p1.x,
			dy = p2.y - p1.y;
			return dx*dx + dy*dy;
}

function randomColor() {
	const c = '0123456789abcdef';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += c[~~(Math.random() * c.length)];
	}
	return color;
}

function randRange(n1, n2) {
	return n1 + Math.random()*(n2-n1);
}


function createBalls() {
	const margin = 100;
	balls = [];
	player1.balls = [];
	player2.balls = [];

	for (let i = 0; i < balls_per_player; i++) {
		let ball = new Ball(randRange(margin, canvas.width-margin), randRange(margin, canvas.height-margin));
		while(true) {
			let collides = false;
			for (let i in balls) {
				if (getDistanceSquared(ball.position, balls[i].position) < Math.pow(ball_radius * 5, 2)) {
					ball.position.set(randRange(margin, canvas.width-margin), randRange(margin, canvas.height-margin));
					collides = true;
					break;
				}
			}
			if (!collides) break;
		}
		ball.owner = '1';
		ball.color = player1.color;
		player1.balls.push(ball);
		balls.push(ball)
	}

	for (let i = 0; i < balls_per_player; i++) {
		let ball = new Ball(randRange(margin, canvas.width-margin), randRange(margin, canvas.height-margin));
		while(true) {
			let collides = false;
			for (let i in balls) {
				if (getDistanceSquared(ball.position, balls[i].position) < Math.pow(ball_radius * 5, 2)) {
					ball.position.set(randRange(margin, canvas.width-margin), randRange(margin, canvas.height-margin));
					collides = true;
					break;
				}
			}
			if (!collides) break;
		}
		ball.owner = '2';
		ball.color = player2.color;
		player2.balls.push(ball);
		balls.push(ball)
	}
	
	//balls = player1.balls.concat(player2.balls);
} 

function lerp(n1, n2, v) {
	return n1 + (n2-n1)*v; 
}


//----------------------------
//	Main Functions

function setState(_state) {
	state = _state;
	//updateCurrentState = eval(_state + 'State');
	updateCurrentState = window[_state + 'State']; //safer & faster than eval
	//console.log('state set to ' + state);
}

function start() {
	createBalls();
	current_player = 1;
	setState(states.INTRO);
	updateScoreDisplay();
	if (first_run) {
		update(); //prevent update function from doubling every time start() is called
		gui.displayMessage('Click to Play!', '#000000');
		first_run = false;
		render();
	}
}


function update() {
	updateCurrentState();
	requestAnimationFrame(update);
	
}

function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	if (ball_under_mouse) highlightBallUnderMouse();
	
	for (let i in balls) {
		balls[i].render();
	}
	
	if (debug) showDebug();
	
	if (state === states.AIMING && selected_ball) showAimLine();
	
	
	
	
	gui.update();
}

function highlightBallUnderMouse() {
	const b = ball_under_mouse;
	ctx.save();
	ctx.fillStyle = state === states.AIMING ? '#ff6699' : ball_mouse_hover_color;
	ctx.globalAlpha = 0.8;
	ctx.beginPath();
	ctx.arc(b.position.x, b.position.y, default_ball_radius + 5, 0, Math.PI * 2);
	ctx.fill();
	ctx.restore();
}


function showAimLine() {
	aim_vector.set(mouse);
	aim_vector.subtract(selected_ball.position.x, selected_ball.position.y);
	aim_vector.clip(shot_vector_limit);
	
	ctx.strokeStyle = '#ffffff';
	ctx.lineCap= 'round';
	ctx.lineWidth = 5;

	ctx.beginPath();
	ctx.moveTo(selected_ball.position.x, selected_ball.position.y);
	ctx.lineTo(selected_ball.position.x + aim_vector.x, selected_ball.position.y + aim_vector.y);
	ctx.stroke();
	
}

function showDebug() {
	ctx.font = '14px Arial';
	ctx.fillStyle = '#ffffff';
	const margin_left = 20;
	const margin_top = 20;
	const spacing = 14;
	const messages = [];
	messages.push('Game State: ' + state);
	
	const selected_ball_id = selected_ball ? selected_ball.id : 'none';
	messages.push('Selected Ball: ' + selected_ball_id);
	
	messages.push('Current Player: ' + current_player);
	const undermouseid = ball_under_mouse ? ball_under_mouse.id : 'none';
	messages.push('Ball under mouse: ' + undermouseid);
	messages.push('P1 balls: ' + player1.balls.length);
	messages.push('P2 balls: ' + player2.balls.length);
	messages.push('Total balls: ' + balls.length);
	messages.push('Collision checks: ' + num_collision_checks);
	for (let i in messages) {
		ctx.fillText(messages[i], margin_left, i * spacing + margin_top);
	}
}


//-------------------------------
// User Input

this.onmousedown = function(e) {
	start_clicked = true;
}

this.onmouseup = function(e) {
	if (state === states.VICTORY) 
		start();
}

this.onmousemove = function(e) {
	
}

this.oncontextmenu = function(e) {
	e.preventDefault();
}