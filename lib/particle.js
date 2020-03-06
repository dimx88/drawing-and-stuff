class Particle {
	constructor(initial_pos, initial_velocity, initial_size, initial_alpha, resize_factor) {
		this.pos = initial_pos;
		this.velocity = initial_velocity;
		this.size = initial_size;
		this.resize_factor = resize_factor;
		this.alpha = initial_alpha;
		this.age = 0;
		this.parent = null;
	}

	update() {
		this.pos.x += this.velocity.x;
		this.pos.y += this.velocity.y;
		this.size += this.resize_factor;
		this.age++;
		
	}
	
	render() {
		ctx.save();
		ctx.fillRect(this.pos.x - this.size * 0.5, this.pos.y - this.size * 0.5, this.size, this.size);
		ctx.restore();
	}

}


