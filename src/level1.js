class Level1 extends Node2d {
	constructor() {
		super();
		this.input = new Keyboard();
		this.mouse = new Mouse();

		// player setup //

		this.player = new Node2d({x:0, y:0}, 'player');
		let player_rect = new Rect();
		let player_rect2 = new Rect(); //smaller rect to indicate player's diretion
		player_rect2.pos = {x:30, y:8};
		player_rect2.size = {w:15, h:15};

		player_rect.setColor("green");
		player_rect2.setColor("green");
		this.player.addChild(player_rect);
		this.player.addChild(player_rect2);
		



		//some random entities //
		
		this.b = new Node2d({x:100, y:50});
		this.b.addChild(new Rect());
		
		this.c = new Node2d({x:140, y:100});
		this.c.addChild(new Rect());
		
		//

		
		this.cam = new Camera(this.player);
		this.cam.id = 'cam';

		this.cam.addChild(this.player);
		this.cam.addChild(this.b);
		this.cam.addChild(this.c);
		
		if (this.cast) this.cam.addChild(this.cast);
		
		this.addChild(this.cam);
		


	}

	_update() {
		this.processInput();
			
		this.movePlayer();
		if (this.cast) this.projectPlayerCaster();
		
	}

	projectPlayerCaster() {
		this.cast.pos.x = -this.player.pos.x;
		this.cast.pos.y = -this.player.pos.y;
		this.cast.rotation = -this.player.rotation;
	}

	processInput() {
		if (this.input.key.ArrowLeft) {
			this.player.rotation -= 0.03;
		}

		if (this.input.key.ArrowRight) {
			this.player.rotation += 0.03;
		}

		if (this.input.key.ArrowDown) {
			const vel_x = Math.cos(this.player.rotation) * 1;
			const vel_y = Math.sin(this.player.rotation) * 1;
			this.player.pos.x -= vel_x;
			this.player.pos.y -= vel_y;
		}

		if (this.input.key.ArrowUp) {
			const vel_x = Math.cos(this.player.rotation) * 2;
			const vel_y = Math.sin(this.player.rotation) * 2;
			this.player.pos.x += vel_x;
			this.player.pos.y += vel_y;

			
		}

		if (this.mouse.left_down) {
			this.mouse.reset();
			this.cam.rotation_mode = !this.cam.rotation_mode;
		}
	}

	movePlayer() {
		return;
	}

	_render() {
		const debug1 = "player rotation: " + this.player.rotation.toFixed(2);
		const debug2 = "player position: " + this.player.pos.x.toFixed(2) + ", " + this.player.pos.y.toFixed(2);
		const debug3 = "rotation mode: " + this.cam.rotation_mode;
		ctx.fillText(debug1, 5, 15);
		ctx.fillText(debug2, 5, 30);
		ctx.fillText(debug3, 5, 45);
		
	}


}