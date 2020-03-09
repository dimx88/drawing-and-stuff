class Mouse {

	constructor(observer=null) {
		this.observer = observer;
		this.x = 0;
		this.y = 0;
		this.left_down = false;
		this.right_down = false;
		this.middle_down = false;
		addEventListener("mousedown", this.onMouseDown.bind(this));
		addEventListener("mouseup", this.onMouseUp.bind(this));
		addEventListener("mousemove", this.onMouseMove.bind(this));
		addEventListener("contextmenu", this.onContextMenu.bind(this));
	}
	
	onMouseDown(e) {
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
		this.x = e.clientX - canvas.getBoundingClientRect().left;
		this.y = e.clientY - canvas.getBoundingClientRect().top;
	}
	
	onContextMenu(e) {
		e.preventDefault();
	}

}
