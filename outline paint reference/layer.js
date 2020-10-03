class Layer {
	constructor(canvas) {
		this.canvas = document.createElement('canvas');
		this.canvas.width = canvas.width;
		this.canvas.height = canvas.height;
		this.ctx = this.canvas.getContext('2d');

	}
}