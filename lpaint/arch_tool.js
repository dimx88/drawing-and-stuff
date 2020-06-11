class ArchTool {
	constructor(canvas, mouse) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.mouse = mouse;
		this.name = "Arch Tool";
		
		this.origin_x = 0;
		this.origin_y = 0;
	}

	onMouseMove(e) {
		if (this.mouse.left_down) {
			this.draw();
		}
	}

	onMouseDown(e) {
		
		if (this.mouse.right_down) {
			this.origin_x = this.mouse.x;
			this.origin_y = this.mouse.y;
		}
	}

	onMouseUp(e) {

	}

	onEnter() {
		this.origin_x = this.mouse.x;
		this.origin_y = this.mouse.y;
		this.ctx.globalAlpha = 0.2;
	}

	
	draw() {
		this.ctx.beginPath();
		this.ctx.moveTo(this.origin_x, this.origin_y);
		this.ctx.lineTo(this.mouse.x, this.mouse.y);
		this.ctx.stroke();
	}
}