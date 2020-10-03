class GUI {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.ctx.font = '84px Arial Black';
		this.messages = [];
		this.margin_left = 400;
		this.margin_top = 400;
		this.fade_out_rate = 0.01;
	}
	

	displayMessage(msg, color='#ffffff') {
		this.messages = [];
		let message = {};
		message.text = msg;
		message.color = color;
		message.alpha = 1;
		this.messages.push(message);
	}
	
	update() {
		if (this.messages.length < 1) return;
		
		for (let i in this.messages) {
			this.messages[i].alpha -= this.fade_out_rate;
			if (this.messages[i].alpha <= 0) {
				this.messages.splice(i, 1);
			}
			
		}
		
		this.render();
	}
	render() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let i in this.messages) {
			this.ctx.fillStyle = this.messages[i].color;
			this.ctx.strokeStyle = '#ffffff';
			this.ctx.globalAlpha = this.messages[i].alpha;
			this.ctx.fillText(this.messages[i].text, this.margin_left, this.margin_top);
			this.ctx.strokeText(this.messages[i].text, this.margin_left, this.margin_top);
			
		}
		
	}
	


}