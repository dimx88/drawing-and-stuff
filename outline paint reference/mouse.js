class Mouse {
	constructor(canvas) {
		this.canvas = canvas;
		this.x = 0;
		this.y = 0;
		this.prev_x = 0;
		this.prev_y = 0;
		this.left_down = false;
		this.right_down = false;
		this.middle_down = false;
		addEventListener('mousedown', this.onMouseDown.bind(this));
		addEventListener('mouseup', this.onMouseUp.bind(this));
		addEventListener('mousemove', this.onMouseMove.bind(this));
	}

	onMouseDown(e) {
		if (e.button === 0) {
			this.left_down = true;
		}else if (e.button === 2) {
			this.right_down = true;
		}else if (e.button === 1) {
			this.middle_down = true;
		}
	}

	onMouseUp(e) {
		if (e.button === 0) {
			this.left_down = false;
		}else if (e.button === 2) {
			this.right_down = false;
		}else if (e.button === 1) {
			this.middle_down = false;
		}
	}

	onMouseMove(e) {
		this.prev_x = this.x;
		this.prev_y = this.y;
		this.x = e.clientX - canvas.getBoundingClientRect().left;
		this.y = e.clientY - canvas.getBoundingClientRect().top;
	}

	get vel_x() {
		return this.x - this.prev_x;
	}

	
	get vel_y() {
		return this.y - this.prev_y;
	}

	resetButtons() {
		this.left_down = this.right_down = false;
	}
}