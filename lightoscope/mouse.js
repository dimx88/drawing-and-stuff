class Mouse {

	constructor(_canvas, observer=null) {
		this.canvas = _canvas;
		this.observer = observer;
		this.x = 0;
		this.y = 0;
		this.prev_x = 0;
		this.prev_y = 0;
		this.vel_x = 0;
		this.vel_y = 0;
		
		this.left_down = false;
		this.right_down = false;
		this.middle_down = false;
		addEventListener("mousedown", this.onMouseDown.bind(this));
		addEventListener("mouseup", this.onMouseUp.bind(this));
		addEventListener("mousemove", this.onMouseMove.bind(this));
		addEventListener("contextmenu", this.onContextMenu.bind(this));
	}
	
	onMouseDown(e) {
		e.preventDefault();
		if (this.canvas != e.target) return; 
		
		switch (e.button) {
			case 0:
				this.left_down = true; break;
			case 1:
				this.middle_down = true; break;
			case 2:
				this.right_down = true; break;
			
		}
	}
	
	onMouseUp(e) {
		switch (e.button) {
			case 0:
				this.left_down = false; break;
			case 1:
				this.middle_down = false; break;
			case 2:
				this.right_down = false; break;
			
		}
	}

	onMouseMove(e) {
		this.prev_x = this.x;
		this.prev_y = this.y;
		this.x = e.clientX - this.canvas.getBoundingClientRect().left;
		this.y = e.clientY - this.canvas.getBoundingClientRect().top;
		this.vel_x = this.x - this.prev_x;
		this.vel_y = this.y - this.prev_y;
	}
	
	onContextMenu(e) {
		//e.preventDefault();
	}
	
	reset() {
		this.left_down = false;
		this.right_down = false;
		this.middle_down = false;		
	}

}
