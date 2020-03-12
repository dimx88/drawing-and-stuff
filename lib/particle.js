class Particle {
	constructor(initial_pos, initial_velocity, initial_size, initial_alpha, resize_factor, g_pos=null) {
		this.pos = initial_pos;
		this.velocity = initial_velocity;
		this.size = initial_size;
		this.resize_factor = resize_factor;
		this.alpha = 1;
		this.age = 0;
		this.g_pos = g_pos;
		this.parent = null;
	}

	update() {
		this.pos.x += this.velocity.x;
		this.pos.y += this.velocity.y;
		this.size += this.resize_factor;
		this.alpha -= 0.02;
		this.alpha = this.alpha >= 0 ? this.alpha : 0;
		this.age+= 0.5;
		
	}
	
	render(offset = {x:0, y:0}) {
		ctx.save();
		ctx.globalAlpha = this.alpha;
		ctx.fillRect(	this.pos.x - this.size * 0.5 - offset.x + this.g_pos.x, 
				this.pos.y - this.size * 0.5 - offset.y + this.g_pos.y, 
				this.size, 
				this.size);
		ctx.restore();
	}

}


