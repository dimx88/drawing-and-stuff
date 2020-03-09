class Level1 extends Node2d {
	constructor() {
		super();

		this.input = new Keyboard();
		this.mouse = new Mouse();
		this.players = [];
		this.cam = new Camera();
		
		this.pointer = new Rect();
		this.pointer.size = {w:10, h:10};
		this.cam.addChild(this.pointer);
		
		
		for (let i = 0; i < 10; i++) {
			let ply = this.createPlayer();
			ply.pos.x = Math.random()*500;
			ply.pos.y = Math.random()*500;
			this.players.push(ply);
			
				
		}
	
		
		
		this.control = this.players[0];

		//random obstacles
		let spread = 1000;
		for (let i = 0; i < 60; i++) {
			let tmp = new Node2d({x:Math.random()*spread, y:Math.random()*spread});
			tmp.addChild(new Rect());
			//tmp.children[0].setColor("#dddddd");
			this.cam.addChild(tmp);
		}
		
		
		for (let i = 0; i < 10; i++) {
			this.cam.addChild(this.players[i]);	
		}
		this.cam.setTarget(this.players[0]);
		this.addChild(this.cam);
	}


	_update() {
		this.processInput();
		this.displayPointer();

	}

	displayPointer() {
		let {x, y} = this.mouse;
		this.pointer.pos.x = x;
		this.pointer.pos.y = y;
		
		
	}

	processInput() {
		if (this.input.key.ArrowLeft) {
			this.control.rotation -= 0.04;
		}

		if (this.input.key.ArrowRight) {
			this.control.rotation += 0.04;
		}

		if (this.input.key.ArrowDown) {
			const vel_x = Math.cos(this.control.rotation) * 3;
			const vel_y = Math.sin(this.control.rotation) * 3;
			this.control.pos.x -= vel_x;
			this.control.pos.y -= vel_y;
		}

		if (this.input.key.ArrowUp) {
			const vel_x = Math.cos(this.control.rotation) * 3;
			const vel_y = Math.sin(this.control.rotation) * 3;
			this.control.pos.x += vel_x;
			this.control.pos.y += vel_y;

			
		}

		if (this.input.key.Space) {
			this.switchCharacter();
			//this.cam.rotation_mode = !this.cam.rotation_mode;
			this.input.reset();
		}
	}

	switchCharacter() {
		let n = ~~(Math.random()*9);
		this.control = this.players[n];
		this.cam.setTarget(this.players[n]);
	}



	createPlayer() {


			let player = new Node2d({x:0, y:0}, 'player');
			let player_rect = new Rect();
			let player_rect2 = new Rect();
			player_rect2.pos = {x:30, y:8}; //offset from main rect
			player_rect2.size = {w:15, h:15};
			
			let color = this.getRandomRGB();
			player_rect.setColor(color);
			player_rect2.setColor(color);
			player.addChild(player_rect);
			player.addChild(player_rect2);
			
			return player;

		}

	_render() {
		return;
		
	}

	
	getRandomRGB() {
		let values = '0123456789abcdef';
		let rgb = '#';
		for (let j = 0; j < 6; j++) {
			rgb += values[~~(Math.random()*(values.length - 1))];
		}
		return rgb;
	}

}