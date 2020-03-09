class Camera extends Node2d{

	constructor(target=null) {
		super();
		
		this.isCamera = true;
		this.target = target;

		this.zoom_level = 1;
		this.easing = 0.1;

		this.offset_x = canvas.width * 0.5;
		this.offset_y = canvas.height * 0.5;
		
		this.rotation_mode = true;

		
	}
	
	_update() {
		if (!this.target) return;
	
		if (this.rotation_mode) 
			this.followAndRotate();
		else		   
			this.follow();						
		
	

	}
	
	follow() {
		
		this.rotation = 0;

		this.pos.x = -this.target.pos.x;
		this.pos.y = -this.target.pos.y;

		this.pos.x += this.offset_x;
		this.pos.y += this.offset_y;

	}

	followAndRotate() {
		//this.rotation = -this.target.rotation; // instant
		
		this.rotation += (-this.target.rotation - Math.PI/2 - this.rotation) * this.easing;
		let dx = this.target.pos.x;
		let dy = this.target.pos.y;
		
		let distance = Math.sqrt(dx*dx+dy*dy);
		
		let angle_to_target = Math.atan2(dy, dx);
			
		let new_x = -Math.cos(angle_to_target -this.target.rotation - Math.PI/2)*distance;
		let new_y = -Math.sin(angle_to_target -this.target.rotation - Math.PI/2)*distance;
		
		this.pos.x += (new_x - this.pos.x + this.offset_x) * this.easing;
		this.pos.y += (new_y - this.pos.y + this.offset_y) * this.easing;

		/* instant 
		this.pos.x = new_x*this.scale.x;
		this.pos.y = new_y*this.scale.y;
		
		this.pos.x += this.offset_x;
		this.pos.y += this.offset_y;
		*/
		
	}
	
	_render() {
		//this.showCamDebug();
		
	}

	showCamDebug() {
		ctx.strokeStyle = "red";
		ctx.strokeRect(-5, -5, 10, 10);
		ctx.strokeRect(5, -2.5, 5, 5);
	
	}

	setTarget(targ) {
		this.target = targ;
	}
	
}
