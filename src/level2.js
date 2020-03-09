class Level2 extends Node2d {
	constructor() {
		super();
		this.a = new Node2d({x:30, y:30}, ':d');
		this.b = new Node2d({x:30, y:30}, ':]');
		this.c = new Node2d({x:30, y:30}, ':D');
		this.d = new Node2d({x:30, y:30}, '>:)');
		
		this.a.addChild(this.b);
		this.b.addChild(this.c);
		this.c.addChild(this.d);


		this.addChild(this.a);
	

	}

	_update() {
		this.a.pos.x += 0.1;
		this.b.rotation += 0.01;
			
		
			
	}


}