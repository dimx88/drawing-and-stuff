class SimBall {


	constructor(ball) {
		this.id = ball.id;
		this.position = ball.position.copy();
		this.velocity = ball.velocity.copy();
		this.min_speed = ball.min_speed;
		this.r = ball.r;
		this.friction = ball.friction;
		this.slow_friction = ball.slow_friction;
		this.dead = ball.dead;	
		this.moving = ball.moving;
		this.last_position = new Vector2();
		this.color = ball.color;
	}
	
	
	
	update() {
		this.last_position.set(this.position);
		
		this.position.add(this.velocity);
		
		if (this.velocity.isLessThan(1)) {
			this.velocity.multiply(this.slow_friction);
		} else {
			this.velocity.multiply(this.friction);
		}
		
		if (this.velocity.isLessThan(this.min_speed)) {
			this.moving = false;
			this.velocity.init();
		} else {
			this.moving = true;
		}
		
		
	}
}