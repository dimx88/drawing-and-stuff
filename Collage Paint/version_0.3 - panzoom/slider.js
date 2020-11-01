class Slider {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = this.canvas.getContext('2d');
		this.mouse = new Mouse(this.canvas);
		addEventListener('mousemove', this.onMouseMove.bind(this));
		addEventListener('mousedown', this.onMouseDown.bind(this));
		addEventListener('mouseup', this.onMouseUp.bind(this));
		this.dragging = false;
		this.slider_button = {x:0, y:canvas.height-40, width:this.canvas.width, height:40};
		
	
		this.ctx.strokeStyle = '#bbbbbb';
		
		
		this.render();
		
	}
	
	onMouseMove(e) {
		if (!this.dragging) return;
		this.update();
	}
	
	onMouseDown(e) {
		this.render();
		if (e.target !== this.canvas) return;
		
		this.dragging = true;
		this.update()
		
	}
	
	update() {
		this.slider_button.y = this.clamp(this.mouse.y, 0, this.canvas.height - this.slider_button.height);
		this.value = this.clamp(this.slider_button.y / (this.canvas.height - this.slider_button.height), 0, 1);

		this.render();
	}
	onMouseUp(e) {
		this.dragging = false;
	}
	
	clamp(number, min, max) {
		return Math.max(min, Math.min(number, max));
	}
	
	

	render() {
		//this.ctx.globalAlpha = this.value * 2;
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = global.selected_color;
		this.ctx.fillRect(this.slider_button.x, this.slider_button.y, this.slider_button.width, this.slider_button.height);
		//this.ctx.globalAlpha = 1;
		//this.ctx.strokeRect(this.slider_button.x, this.slider_button.y, this.slider_button.width, this.slider_button.height);
	}
	
}