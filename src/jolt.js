class Jolt extends Node2d {
	constructor(src, trg) {
		super();
		this.src = src;
		this.trg = trg;

		this.midpoints = [];
		this.num_midpoints = 3;
		
		this.start_point;
		this.end_point;

		this.chaos_factor = 60;
	}

	_update() {	
		this.start_point = this.src.getGlobalPosition();	//start point
		this.end_point = this.trg.getGlobalPosition();		//end point

		let dis_x = this.end_point.x - this.start_point.x;
		let dis_y = this.end_point.y - this.start_point.y;
		dis_x = dis_x === 0 ? dis_x = 1 : dis_x; 	//make sure dis_x isn't 0 to prevent division by zero.
		dis_y = dis_y === 0 ? dis_y = 1 : dis_y; 	//make sure dis_y isn't 0 to prevent division by zero.

		const div_x = dis_x / (this.num_midpoints+1);
		const div_y = dis_y / (this.num_midpoints+1);

		for (let i = 1; i <= this.num_midpoints; i++) {
			let x = this.start_point.x + div_x * i;
			let y = this.start_point.y+ div_y * i;
			x += (Math.random()-0.5) * this.chaos_factor;
			y += (Math.random()-0.5) * this.chaos_factor;
			this.midpoints[i-1] = {x:x, y:y};
		}

		
	}

	_render() {
		ctx.strokeStyle = "magenta";
		ctx.beginPath();
		ctx.moveTo(this.start_point.x, this.start_point.y);
		
		for (let i = 0; i < this.midpoints.length; i++) {	
			ctx.lineTo(this.midpoints[i].x, this.midpoints[i].y);
			//ctx.fillRect(this.midpoints[i].x-2, this.midpoints[i].y-2, 4, 4); //debug

		}
		
		ctx.lineTo(this.end_point.x, this.end_point.y);
		ctx.stroke();
	}
}