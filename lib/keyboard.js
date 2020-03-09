class Keyboard {

	constructor(observer=null) {
		this.observer = observer;
		this.left_down = false;
		this.right_down = false;

		this.key = {ArrowLeft:false, ArrowRight:false, ArrowUp:false, ArrowDown:false, Space:false, ControlLeft:false};
		addEventListener("keydown", this.onKeyDown.bind(this));
		addEventListener("keyup", this.onKeyUp.bind(this));
	}
	
	onKeyDown(e) {
		if(!this.key.hasOwnProperty(e.code)) return //return if input is not listed in key object
		
		this.key[e.code] = true;
		e.preventDefault();
		//console.log(e.code + ': ' + this.key[e.code]);
	}
	
	onKeyUp(e) {
		if(!this.key.hasOwnProperty(e.code)) return //return if input is not listend in key object
		
		this.key[e.code] = false;
		//console.log(e.code + ': ' + this.key[e.code]);
	}
	
	reset() {
		for (let i in this.key) {
			this.key[i] = false;
		}
	}
	
}
