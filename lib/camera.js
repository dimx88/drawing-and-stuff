class Camera extends Node2d{

	constructor(target) {
		super();
		
		this.isCamera = true;
		this.target = target;

		this.zoom_level = 1;
		this.easing = 0.2;

		this.offset_x = canvas.width * 0.5;
		this.offset_y = canvas.height * 0.5;
		
		this.rotation_mode = false;
	}
	
	_update() {
		
		if (!this.rotation_mode) 
			this.follow();
		else 
			this.followAndRotate();	
		
	}
	
	follow() {
		this.pos.x = -this.target.pos.x;
		this.pos.y = -this.target.pos.y;
			
		this.pos.x += this.offset_x; //center target on screen
		this.pos.y += this.offset_y; //.........................
	}
	
	followAndRotate() {
		this.rotation = -this.target.rotation;
		this.pos.x = -this.target.pos.x;
		this.pos.y = -this.target.pos.y;
		
		this.pos.x += this.offset_x; //center target on screen
		this.pos.y += this.offset_y; //.........................

	}
	
	_render() {
		ctx.strokeStyle = "red";
		ctx.strokeRect(-5, -5, 10, 10);
		ctx.strokeRect(5, -2.5, 5, 5);
	
	}
	
}
