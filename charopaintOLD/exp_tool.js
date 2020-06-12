class ExpTool {
	constructor(canvas, mouse) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.mouse = mouse;
		this.name = "Experimental Tool";

		this.num_strokes = 3;
		this.spacing = 5;

		addEventListener("mousewheel", this.onMouseWheel.bind(this));
	}

	onMouseMove(e) {
		if (this.mouse.left_down) this.draw();

	}

	onMouseDown(e) {

	}

	onMouseUp(e) {

	}

	onMouseWheel(e) {
		if (e.deltaY <= 0) {
			this.spacing += 1;
		}else {
			this.spacing -= 1;
		}
		if (this.spacing < 1) this.spacing = 1;
	}

	onEnter() {
		this.ctx.globalAlpha = 0.2;
		this.ctx.lineWidth = 2;
		//this.ctx.strokeStyle = this.getRandomColor();
	}

	getRandomColor() {
		const c = "0123456789abcdef";
		let color = "#";
		for (let i = 0; i < 6; i++) {
			color += c.charAt(~~(Math.random() * c.length));	
		}
		console.log(color);
		return color;
	}


	draw() {
		const {spacing, num_strokes} = this;
	
		let length = Math.sqrt(this.mouse.vel_x * this.mouse.vel_x + this.mouse.vel_y * this.mouse.vel_y);
		let x_factor = Math.sin(length) * spacing;
		let y_factor = Math.cos(length) * spacing;
		for (let i = -1; i < num_strokes; i++) {
			if (i === 0) continue;
			this.ctx.beginPath();
			this.ctx.moveTo(this.mouse.prev_x + i * x_factor, this.mouse.prev_y + i * y_factor);
			this.ctx.lineTo(this.mouse.x + i * x_factor, this.mouse.y + i * y_factor);
			this.ctx.stroke();	
		}
	}
}