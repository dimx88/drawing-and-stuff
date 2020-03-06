class Rect extends Node2d{
	constructor(size={w:30, h:30}) {
		super();
		this.pos = {x:0, y:0};
		this.size = size;
		this.pivot = {x:this.size.w*0.5, y:this.size.h*0.5};
		this.color = "#000000";
	}
	
	_update() {

	}

	setColor(color) {
		this.color = color;
	}

	_render() {
		ctx.strokeStyle = this.color;
		ctx.strokeRect(0, 0, this.size.w, this.size.h);
	}
}