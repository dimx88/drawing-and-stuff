class BrushDisplay {
	constructor(canvas, global) {
		this.global = global;
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		
		this.minimum_alpha = 0.5;
		
		this.updateDisplay();

	}
	updateDisplay() {
		
		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.ctx.globalAlpha = this.global.alpha > this.minimum_alpha ? this.global.alpha : this.minimum_alpha;
		
		this.drawGrid();
		
		if (!global.round_brush) {
			this.drawSquare();
			return;
		}
		this.drawInnerCircle();
		if (this.global.brush_outer_radius > 0.5)	
			this.drawOuterCircle();

	}
	
	drawSquare() {
		const size = global.brush_inner_radius * 2;
		this.ctx.fillStyle = this.global.inline_color;
		this.ctx.fillRect(this.canvas.width/2 - size/2, this.canvas.height/2 - size/2, size, size);	
	}
	
	drawInnerCircle() {
	
		this.ctx.fillStyle = this.global.inline_color;
	
		this.ctx.beginPath(); // Inner Circle
		this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.global.brush_inner_radius, 0, Math.PI * 2);
		
		this.ctx.fill();
		
	}
	
	drawOuterCircle() {
		this.ctx.save();
		this.ctx.fillStyle = this.global.outline_color;
		
		this.ctx.beginPath(); // OuterCircle
		//this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.global.brush_outer_radius + this.global.brush_inner_radius, 0, Math.PI * 2);
		
		this.ctx.beginPath()
		this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.global.brush_outer_radius + this.global.brush_inner_radius, 0, Math.PI * 2, false); // outer (filled)
		this.ctx.arc(this.canvas.width/2, this.canvas.height/2, this.global.brush_inner_radius, 0, Math.PI * 2, true); // outer (unfills it)
		this.ctx.fill();
		
		this.ctx.fill();
		this.ctx.restore();
	}
	
	drawGrid() {
		let size = 20;
		this.ctx.save();
		this.ctx.fillStyle = this.ctx.strokeStyle = '#eeeeee';
		this.ctx.globalAlpha = 1;
		for (let i = 0; i < 20; i++) {
			for (let j = 0; j < 10; j++) {
				if ((i + j) % 2 === 0) this.ctx.fillRect(i * size, j * size, size, size);
				this.ctx.strokeRect(i * size, j * size, size, size);
			}
		}
		this.ctx.restore();
	}
}