class StateArchTool {
	constructor(canvas, mouse) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.mouse = mouse;
		this.name = "State Arch Tool";
		
		this.origin_x = 0;
		this.origin_y = 0;

		this.origin_selected = false;
	}

	onMouseMove(e) {
		if (this.mouse.left_down && this.origin_selected) {
			this.draw();
		}
	}

	onMouseDown(e) {
		if (this.mouse.left_down) {
			this.origin_x = this.mouse.x;
			this.origin_y = this.mouse.y;
			this.origin_selected = true;
		}
	}

	onMouseUp(e) {

	}

	onEnter() {
		this.origin_selected = false;
		this.ctx.globalAlpha = 0.2;
	}

	
	draw() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.origin_x, this.origin_y);
		this.ctx.lineTo(this.mouse.x, this.mouse.y);
		this.ctx.stroke();
	}
}