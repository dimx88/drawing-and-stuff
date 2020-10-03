class AI_Player {
	constructor(id, game) {
		this.id = id;
		this.game = game;
		this.sim = {p1_balls:[], p2_balls:[], balls:[]};
		this.my_balls;
		this.enemy_balls;
		
		this.selected_move = null;
		
		this.angle_resolution = 60;
	
		this.render_paths = false;

	}
	
	initialize() {
		this.selected_move = null;
	}
	
	takeTurn() {
		let move = this.analyzeMoves();	//returns array of all moves & their results
		return move;
		// let ball = this.game.getBallById(move.id);
		// ball.velocity.set(move.move_vec);

	}
	
	analyzeMoves() {	//simulates varius moves. returns array of moves paired with their results
		let best_score = -100;
		let best_move = {move_vec:null, id:null};
 		this.syncSimulationToGameState();
		for (let i in this.my_balls) {
			this.syncSimulationToGameState();
			const ball = this.my_balls[i];
			for (let ang = 0, max_ang = Math.PI*2, rotation_per_step = max_ang/this.angle_resolution; ang < max_ang; ang += rotation_per_step) {	//rotation_per_step = max_ang/100
				let impulse = new Vector2(shot_vector_limit*0.7, 0).multiply(shot_strength);

				impulse.setAngle(ang);
				
				const move = this.simulateMove(impulse, ball.id);
				if (move.score > best_score) {
					best_score = move.score;
					best_move.move_vec = impulse;
					best_move.id = ball.id;		
				}
			}
		}
		// console.log('best move: ');
		// console.log(best_move);
		// console.log('best move score: ' + best_score);
		
		//render best move
		// this.syncSimulationToGameState();
		// test_ctx.clearRect(0, 0, canvas.width, canvas.height);
		// this.simulateMove(best_move.move_vec, best_move.id);
		//
		this.selected_move = best_move;
		return best_move;
	
	}
	
	simulateMove(impulse, ball_id) {	//returns
		this.syncSimulationToGameState();
		
		const my_balls_at_start = this.my_balls.length;
		const enemy_balls_at_start = this.enemy_balls.length;
		
		let ball = this.getSimBallById(ball_id);
		ball.velocity.set(impulse);
		
		this.runSimulation();
		
		const enemy_balls_removed = enemy_balls_at_start - this.enemy_balls.length;
		const my_balls_removed = my_balls_at_start - this.my_balls.length;
		let score = enemy_balls_removed - my_balls_removed;
		if (this.my_balls.length < 1) score = -100;
		//console.log(score);
		return {move_vec:impulse, score:score};
	}
	
	runSimulation() {
		//console.log('started running simulation');
		
		let still_moving = true;
		while (still_moving) {	//update loop goes here, until all balls are gone or stop moving;
			still_moving = false;

			this.updateSimBallPositions();
			this.checkSimCollision();
			this.checkBallsOutsideBounds();
			this.removeDeadBalls();
			for (let i in this.sim.balls) {
				if (this.sim.balls[i].moving) {
					still_moving = true;
					break;
				}
			}
		}
	}
	
	removeDeadBalls() {
		let any_balls_removed = false;
		const sim = this.sim;
		for (let i in sim.p1_balls) 
			if (sim.p1_balls[i].dead) {
				sim.p1_balls.splice(i, 1);
				any_balls_removed = true;
			}
			
		for (let i in sim.p2_balls) 
			if (sim.p2_balls[i].dead) {
				sim.p2_balls.splice(i, 1);
				any_balls_removed = true;
			}
		
		if (any_balls_removed)
			this.sim.balls = this.sim.p1_balls.concat(this.sim.p2_balls);

}
	
	checkBallsOutsideBounds() {
		for (let i in this.sim.balls) {
			let b = this.sim.balls[i];
			const margin = b.r - 5;
			if (b.position.x < -margin || b.position.x > canvas.width + margin) {
				b.dead = true;
				}
			if (b.position.y < -margin || b.position.y > canvas.height + margin) {
				b.dead = true;
			}
		}
	}
	
	checkSimCollision() {
		for (let i = 0; i < this.sim.balls.length-1; i++) {
			for (let j = i + 1; j < this.sim.balls.length; j++) {
				
				const b1 = this.sim.balls[i], b2 = this.sim.balls[j];	
				
				if (!b1.moving && !b2.moving) continue;
				
				if (ballsCollide(b1, b2)) 
					this.resolveCollision(b1, b2);
				
			}
		}
	}
	
	resolveCollision(a, b) {
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
	

	updateSimBallPositions() {
		
		for (let i in this.sim.balls) {
			const ball = this.sim.balls[i];
			ball.update();
			if (this.render_paths && ball.moving) {
				this.testLine(ball.last_position, ball.position, ball.color);
			}
		}
		
	}
	
	testLine(pos1, pos2, color='#ffffff') {
		test_ctx.strokeStyle = color;
		test_ctx.beginPath();
		test_ctx.moveTo(pos1.x, pos1.y);
		test_ctx.lineTo(pos2.x, pos2.y);
		test_ctx.stroke();
	}
	
	
	selectBestMove(moves) {
		
	}
	
	getSimBallById(id) {
		for (let i in this.sim.balls) {		
			if (this.sim.balls[i].id === id) 
				return this.sim.balls[i];
		}
		console.log('error from getSimulatedBallById: ball with id ' + id + ' was not found');
	}
	
	syncSimulationToGameState() {
		this.sim.p1_balls = this.copyBallsToSim(this.game.player1.balls);
		this.sim.p2_balls = this.copyBallsToSim(this.game.player2.balls);
		this.sim.balls = this.sim.p1_balls.concat(this.sim.p2_balls);
		this.my_balls = this.id === 1 ? this.sim.p1_balls : this.sim.p2_balls;
		this.enemy_balls = this.id === 1 ? this.sim.p2_balls : this.sim.p1_balls;
	}
	
	
	copyBallsToSim(balls) {
		let arr = [];
		for (let i in balls) {
			arr.push(new SimBall(balls[i]));
		}
		return arr;
	}

}