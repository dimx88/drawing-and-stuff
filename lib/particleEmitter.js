class ParticleEmitter extends Node2d{
	
	constructor(pos = {x:0, y:0}, max_p = 50, size = 10, vel = {x:0, y:-5}, spread_radius = 40, rate=2) {
		super();
		this.pos = pos;
		this.particles = [];
		this.max_particles = max_p;
		this.particle_size = size;
		this.particle_velocity = vel;
		this.creation_rate = rate;
		this.life_span = 50;
		this.spread_radius = spread_radius;
		this.active = true;

		this.creation_timer = 0;
	}

	randomizeParams() {
		this.particle_size = Math.random()*10+10;
		this.particle_velocity = {x:Math.random()*10, y:Math.random()*10};
		this.creation_rate = ~~(Math.random() * 4)+1;
		this.spread_radius = Math.random() * 70;
	}
	
	toggle_active() {
		this.active = !this.active;
	}

	generateParticle() {
		if (this.particles.length >= this.max_particles) return;
		
		let x_spreaded = this.pos.x + (Math.random() * this.spread_radius) - this.spread_radius / 2;
		let y_spreaded = this.pos.y + (Math.random() * this.spread_radius) - this.spread_radius / 2;
		let pos_spreaded = {x:x_spreaded, y:y_spreaded};
		let g_pos = this.getGlobalPosition();
		let vel = {x:this.particle_velocity.x, y:this.particle_velocity.y};
		vel.x += Math.random()*2;
		vel.y += Math.random()*2;
		this.particles.push(new Particle(pos_spreaded, vel, this.particle_size, 0, 0.4, g_pos));
	}
	
	update() {			
		if (!this.active && this.particles.length < 1) return;


		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].update();
		}
		//remove dead particles
		for (let i = 0; i < this.particles.length; i++) {
			if (this.particles[i].age >= this.life_span) {
				this.particles.splice(i, 1);
				i--;
			}	
		}
		
		this.creation_timer++;
		if (this.creation_timer % this.creation_rate === 0) {
			this.generateParticle();
		}
	
	}


	
	_render() {
		for (let i = 0; i < this.particles.length; i++) {
			this.particles[i].render(this.getGlobalPosition());
		}
	}

}


