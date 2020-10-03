class ReferenceModule {
	constructor() {
		this.image_container = document.getElementById('reference');
		this.image_container.style.backgroundColor = 'lightgrey';
		this.image_container.style.backgroundSize = '100%';
		this.image_container.style.backgroundPosition = '0px 0px';
		this.size = 100;
		this.xpos = 0;
		this.ypos = 0;
		
		this.mouse = {oldx:null, oldy:null, xspeed:0, yspeed:0, x:0, y:0};
		this.mouse_right_down = false;
		this.mouse_right_left = false;
		this.dragging = false;
		
		this.display_mode_flag = false;
		
		this.transition_speed_display_change = '0.5s';
		this.transition_speed_navigation = '0.1s';
		this.transition_speed_zoomn = '0.5s';
		
		addEventListener('mousedown', this.onMouseDown.bind(this));
		addEventListener('mouseup', this.onMouseUp.bind(this));
		addEventListener('mousewheel', this.onMouseWheel.bind(this));
		addEventListener('mousemove', this.onMouseMove.bind(this));
		addEventListener('dblclick', this.onDoubleClick.bind(this));
		addEventListener('contextmenu', this.onContextMenu.bind(this));
	}
	
	
	
	
	
	
//---------------------   EVENTS   ---------------------------
	onDoubleClick(e) {
		if (e.target.id != 'reference') return;
		
		this.resetImage();
		
	}

	onMouseDown(e) {
		if (e.target.id != 'reference') return;
		
		if (e.button === 0) {
			this.mouse_down_left = true;
			this.dragging = true;
			this.image_container.style.transition = this.transition_speed_navigation; //
			
		}
		
		if (e.button === 2) {
			this.mouse_right_down = true;
		}
		
	
		
	}
	
	
	
	onMouseUp(e) {
		this.dragging = false;
		this.mouse.oldx = null;
		this.mouse.oldy = null;
		
		if (e.button === 0) this.mouse_down_left = false;
		if (e.button === 2) this.mouse_down_right = false;
	
	
	if (!this.mouse_down_left && e.button === 2 && e.target.id === 'reference') {
			this.image_container.style.transition = this.transition_speed_display_change; //
			this.toggleDisplayMode();
		}
	}
	
	onMouseMove(e) {
		this.mouse.x = e.clientX;
		this.mouse.y = e.clientY;
		
		
		
		if (!this.dragging) return;
		
		if (this.mouse.oldx === null) {
			this.mouse.oldx = this.mouse.x;
			this.mouse.oldy = this.mouse.y;
		}
		
		this.mouse.xspeed = this.mouse.x - this.mouse.oldx;
		this.mouse.yspeed = this.mouse.y - this.mouse.oldy;
		
		this.mouse.oldx = this.mouse.x;
		this.mouse.oldy = this.mouse.y;
	
		this.xpos += this.mouse.xspeed;
		this.ypos += this.mouse.yspeed;
		
		this.image_container.style.backgroundPosition = this.xpos + 'px ' + this.ypos + 'px';
		
		
	}
	
	onMouseWheel(e) {
			
			if (e.target.id != 'reference') return;
		
			if (e.deltaY < 0) 			{   //up
				
				this.size *= 1.2;
				this.size = ~~this.size;
				
				
				this.image_container.style.backgroundSize = this.size + '%';
				
				this.xpos -= this.size/10;
				this.ypos -= this.size/10;
				this.image_container.style.backgroundPosition = this.xpos + 'px ' + this.ypos + 'px';
	
			}
			
			
			if (e.deltaY > 0) 			{   //downscroll
			
				this.size /= 1.2;
				this.size = ~~this.size;
				
				this.image_container.style.backgroundSize = this.size + '%';
				this.xpos += this.size/10;
				this.ypos += this.size/10;
				this.image_container.style.backgroundPosition = this.xpos + 'px ' + this.ypos + 'px';
			}
			
			
			
	}
	
	onContextMenu(e) {
		
		if (e.target.id != 'reference') return;
		
		//this.resetImage();
		
	}
	
	
	
	resetImage() {
		this.xpos = this.ypos = 0;
		this.image_container.style.backgroundPosition = '0px 0px';
		this.size = 100;
		this.image_container.style.backgroundSize = '100%';
	}
	
	toggleDisplayMode() {
		return;
		if (!this.display_mode_flag) {
			this.image_container.style.width = '280px';
			this.image_container.style.left = '550px';
		}else {
			this.image_container.style.width = '200px';
			this.image_container.style.left = '580px';
		}
		
		this.display_mode_flag = !this.display_mode_flag;
	}
	


}  