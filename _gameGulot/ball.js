class Ball {
	static count = 0;


	constructor(x=0, y=0) {
		this.id = Ball.addCount();
		this.position = new Vector2(x, y);
		this.velocity = new Vector2();
		this.moving = false;
		this.min_speed = 0.04;
		this.r = 0;
		this.friction = window.global_friction;
		this.slow_friction = 0.96;
		this.color = '#000000';
		this.show_player_id = false;
		this.dead = false;
		this.flash_value = 0;
		this.flash_speed = 0.075;
		
	}
	
	static addCount() {
		return this.count++;
	}
	
	
	update() {
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
	
	flash() {
		this.flash_value = 0.8;
	}
	
	stop() {
		this.velocity.init();
		this.moving = false;
	}
	
	mouseOver() {
		let dist = getDistanceSquared(this.position, mouse);
		return dist < this.r*this.r;
	}
	
	render() {
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI*2);
		ctx.fill();
		ctx.clip();
		
		ctx.fillStyle = '#000000';
		ctx.globalAlpha = 0.2;
		ctx.beginPath();
		ctx.arc(this.position.x - 7, this.position.y - 1, this.r*0.7, 0, Math.PI*2);
		ctx.fill();
		
		ctx.fillStyle = '#ffffff';
		ctx.globalAlpha = 0.4;
		ctx.beginPath();
		ctx.arc(this.position.x + 8, this.position.y + 1, this.r*0.4, 0, Math.PI*2);
		ctx.fill();
		ctx.restore();
		
		//flash
		if (this.flash_value > 0) {
		ctx.fillStyle = '#ffffff';
		ctx.globalAlpha = this.flash_value;
		ctx.beginPath();
		ctx.arc(this.position.x, this.position.y, this.r, 0, Math.PI*2);
		ctx.fill();
		ctx.globalAlpha = 1;
		this.flash_value -= this.flash_speed;
		}
		

		

		
		if (this.show_player_id) {
			ctx.fillStyle = 'black';
			ctx.fillText(this.owner, this.position.x - 3, this.position.y + 3);
		}
		
	}
}