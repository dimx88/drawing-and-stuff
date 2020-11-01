class ImageCropper {	
	
	
	constructor(canvas, width, height) {
		this.canvas = canvas;
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext('2d');
		
		
		this.mouse = {x:0, y:0, prev_x:0, prev_y:0, left_down:false, right_down:false};
		this.image = new Image();
		
		this.image_offset = {x:0, y:0};
		
		
		this.buffer_canvas = this.createBufferCanvas();
		this.buffer_ctx = this.buffer_canvas.getContext('2d');
		
		this.ctx.imageSmoothingEnabled = this.buffer_ctx.imageSmoothingEnabled = global.image_smoothing;
		
		
		this.path = [];
		
		
		this.state;
		this.states = {IDLE:'idle', CROPPING:'cropping', PANNING:'panning'};
		this.setState(this.states.IDLE);
		
		
		addEventListener('mousedown', this.onMouseDown.bind(this));
		addEventListener('mouseup', this.onMouseUp.bind(this));
		addEventListener('mousemove', this.onMouseMove.bind(this));
		addEventListener('mousewheel', this.onMouseWheel.bind(this));
		
		this.ctx.fillStyle = 'white';
		this.ctx.strokeStyle = 'white';
		
		this.ctx.lineWidth = 4
		
		this.selection_bounding_box = null;
		
		this.midpoint = {x:0, y:0};
		
		this.zoom = 1;
		this.max_zoom = 20;
		this.min_zoom = 0.1;
	}
	
	setImage(img) {
			this.image.src = img;
			this.image.onload = function() {
					this.image_offset = {x:0, y:0};
					this.zoom = 1;
					this.path = [];
					this.redrawImage();
				}.bind(this);
	}
	

	
	update(e) {
		if (e.target !== this.canvas) return;
		switch(this.state) {
			case this.states.IDLE:
				this.idleState();
			break;
			
			case this.states.CROPPING:
				this.croppingState();
			break;
			
			case this.states.PANNING:
				this.panningState();
			break;
		}
		
		
	}
	
	getMidPoint() {
		return this.midpoint;
	}
	
	updateMidPoint() {
		let avg = {x:0, y:0};
		for (let i in this.path) {
			avg.x += this.path[i].x;
			avg.y += this.path[i].y;
		}
		avg.x /= this.path.length;
		avg.y /= this.path.length;
		this.midpoint = avg;
		return this.midpoint;
	
	}
	
	copySelectionToBuffer(path) {
		this.buffer_ctx.save();
		
		this.drawPath(path, this.buffer_ctx, false);
		this.buffer_ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.buffer_ctx.clip();	
		//this.buffer_ctx.drawImage(this.image, this.image_offset.x, this.image_offset.y);
			this.buffer_ctx.translate(this.canvas.width/2, this.canvas.height/2);
			this.buffer_ctx.translate(-this.image.width/2*this.zoom, -this.image.height/2*this.zoom);
			this.buffer_ctx.translate(this.image_offset.x*this.zoom, this.image_offset.y*this.zoom);
			this.buffer_ctx.scale(this.zoom, this.zoom);
			this.buffer_ctx.drawImage(this.image, 0, 0);
			
			this.ctx.restore();
		
		this.buffer_ctx.restore();
	}
	
	idleState() {
		if (this.mouse.left_down && !this.mouse.right_down) {
			this.path = [];
			this.setState(this.states.CROPPING);
			this.redrawImage();
			
		}
		
		if (this.mouse.right_down && !this.mouse.left_down) {
			this.setState(this.states.PANNING);
		}
		
		if (!this.mouse.left_down && !this.mouse.right_down) {
			
		}
	}
	
	panningState() {
		if (!this.mouse.right_down) {
			this.setState(this.states.IDLE);
			return;
		}
		this.image_offset.x += (this.mouse.x - this.mouse.prev_x)/this.zoom;
		this.image_offset.y += (this.mouse.y - this.mouse.prev_y)/this.zoom;
		
		this.redrawImage();
		
	}
	
	redrawImage() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.save();
		this.ctx.translate(this.canvas.width/2, this.canvas.height/2);
		this.ctx.translate(-this.image.width/2*this.zoom, -this.image.height/2*this.zoom);
		this.ctx.translate(this.image_offset.x*this.zoom, this.image_offset.y*this.zoom);
		this.ctx.scale(this.zoom, this.zoom);
		this.ctx.drawImage(this.image, 0, 0);
		//this.ctx.strokeRect(0, 0, this.image.width, this.image.height);
		this.ctx.restore();
		
	}
	
	lerp(n1, n2, val) {
		return n1 + (n2 - n1) * val;
	}
	
	
	croppingState() {
		if (!this.mouse.left_down) {
			if (this.path.length > 3) {
				this.drawPath(this.path, this.ctx, true);
				this.updateMidPoint();
				this.copySelectionToBuffer(this.path);
			}
			this.setState(this.states.IDLE);
			//this.setSelectionBoundingBox(this.path);
			
		}
		
		this.path.push({x:this.mouse.x, y:this.mouse.y});
		this.ctx.beginPath();
		this.ctx.moveTo(this.mouse.prev_x, this.mouse.prev_y);
		this.ctx.lineTo(this.mouse.x, this.mouse.y);
		this.ctx.stroke();
		
		
		
	}
	
	hitTestPointBox(mx, my, box) {
		return ( mx >= box.x1 && mx <= box.x2 && my > box.y1 && my < box.y2 );
	}
	
	setSelectionBoundingBox(path) {
		let leftmost = canvas.width;
		let rightmost = 0;
		let top = canvas.height;
		let bottom = 0;
		for (let i in path) {
			leftmost = path[i].x < leftmost ? path[i].x : leftmost;
			rightmost = path[i].x > rightmost ? path[i].x : rightmost;
			top = path[i].y < top ? path[i].y : top;
			bottom = path[i].y > bottom ? path[i].y : bottom;
		}
		this.selection_bounding_box = {x1:leftmost, y1:top, x2:rightmost, y2:bottom};
		let box = this.selection_bounding_box;
		//this.ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
	}
	
	drawPath(path, _ctx, fill=false) {
		_ctx.beginPath();
		_ctx.moveTo(path[0].x, path[0].y);
		for (let i = 1; i < path.length; i++) {
			_ctx.lineTo(path[i].x, path[i].y);
		}
		_ctx.closePath();
		if (fill) _ctx.stroke();
	}
	
	setState(state) {
		this.state = state;
		
	}
	
	createBufferCanvas() {
		let _canvas = document.createElement('canvas');
		_canvas.width = this.canvas.width;
		_canvas.height = this.canvas.height;
		return _canvas;
		
	}

	onMouseDown(e) {
		if (e.target !== this.canvas) return;
		
		if (e.button === 0) this.mouse.left_down = true;
		if (e.button === 2) { 
			this.mouse.right_down = true;
			if (e.target === this.canvas) {
				this.path = [];
				this.redrawImage();
			}
			
		}
		this.update(e);
	
	}

	onMouseUp(e) {
		if (e.button === 0) {
			this.mouse.left_down = false;
			if (this.state === this.states.CROPPING && this.path.length < 3) {
				this.path = [];
			}
		}
		if (e.button === 2) {
			this.mouse.right_down = false;
			if (this.path.length > 3) {		
				this.drawPath(this.path, this.ctx, true);
				this.copySelectionToBuffer(this.path);
			}
			this.setState(this.states.IDLE);
			this.setSelectionBoundingBox(this.path);
			
		
			
		}
			
			
		this.update(e);
	}

	onMouseMove(e) {
		this.mouse.prev_x = this.mouse.x;
		this.mouse.prev_y = this.mouse.y;
		this.mouse.x = e.clientX - this.canvas.getBoundingClientRect().left;
		this.mouse.y = e.clientY - this.canvas.getBoundingClientRect().top;
		
		/*
		if (this.state === this.states.IDLE && this.selection_bounding_box) {
			if (this.hitTestPointBox(this.mouse.x, this.mouse.y, this.selection_bounding_box)) {
				document.body.style.cursor = "move"; //"pointer";
			}else {
				document.body.style.cursor = "default";	
			}
		}
		*/
		
		this.update(e);
	}
	
	onMouseWheel(e) {
		if (e.target !== this.canvas) return;
		const zoom_step_ratio = 1.2;
		this.zoom = e.deltaY < 0 ? this.zoom * zoom_step_ratio : this.zoom / zoom_step_ratio;
		this.zoom = this.zoom > this.max_zoom ? this.max_zoom : this.zoom;
		this.zoom = this.zoom < this.min_zoom ? this.min_zoom : this.zoom;
		this.path = [];
		this.redrawImage();
	}

}