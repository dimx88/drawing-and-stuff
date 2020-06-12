class LineTool {
	constructor(canvas, mouse) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.mouse = mouse;
		this.name = "Line Tool";
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
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.mouse.prev_x, this.mouse.prev_y);
		this.ctx.lineTo(this.mouse.x, this.mouse.y);
		this.ctx.stroke();
	}
}