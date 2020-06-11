class ExpTool {
	constructor(canvas, mouse) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.mouse = mouse;
		this.name = "Experimental Tool";
	}

	onMouseMove(e) {
		if (this.mouse.left_down) this.draw();

	}

	onMouseDown(e) {

	}

	onMouseUp(e) {

	}

	onEnter() {
		this.ctx.globalAlpha = 0.2;
		this.ctx.lineWidth = 2;
	}

	draw() {
		
		const num_strokes = 3;
		const spacing = 5;
		let length = Math.sqrt(this.mouse.vel_x * this.mouse.vel_x + this.mouse.vel_y * this.mouse.vel_y);
		let x_factor = Math.sin(length) * spacing;
		let y_factor = Math.cos(length) * spacing;
		for (let i = 1; i < num_strokes; i++) {
			this.ctx.beginPath();
			this.ctx.moveTo(this.mouse.prev_x + i * x_factor, this.mouse.prev_y + i * y_factor);
			this.ctx.lineTo(this.mouse.x + i * x_factor, this.mouse.y + i * y_factor);
			this.ctx.stroke();	
		}
	}
}