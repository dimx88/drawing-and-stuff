class Node2d {

	constructor(pos={x:0, y:0}, id=null) {        //remove id when done testing
		this.id = id;
		this.parent = null;
		this.pos = pos;
		this.rotation = 0;
		this.scale = {x:1, y:1};
		this.children = new Array();
		this.size = {w:0, h:0};
		this.pivot = {x:0, y:0};

	}

	clearTree() {
		this.children = [];
	}

	addChild(child) {
		this.children.push(child);
		child.setParent(this);
	}

	setParent(parent) {
		this.parent = parent;
	}

	removeChild(child) {
		let target_index = this.children.indexOf(child);
		if (target_index > -1) {
			this.children.splice(target_index, 1);	
			child.parent = null;
		}
	}

	getRoot() {
		if (!this.parent) return this;
		
		let temp_parent = this.parent;
		while (true) {
			if (!temp_parent.parent) return temp_parent;
			
			temp_parent = temp_parent.parent;
		}
	}

	getGlobalPosition() {
		if (!this.parent) {
			return this.pos;
		}
		return this.addPos(this.pos, this.parent.getGlobalPosition());
	}

	getGlobalRotation() {
		if (!this.parent) {
			return this.rotation;
		}
		return (this.rotation + this.parent.getGlobalRot());
	}



	addPos(pos1, pos2) {
		return {x:pos1.x+pos2.x, y:pos1.y+pos2.y};
	}

	
	update() {
		this._update();
		for (let i in this.children) {
			if (this.children[i].update) {
				this.children[i].update();
			}
		}
		
	}


	_update(){
		//.....implemented by extending classes
	}
	
	render() {			/////////temp func
		ctx.save();

		ctx.translate(this.pos.x - this.pivot.x, this.pos.y - this.pivot.y);
		ctx.scale(this.scale.x, this.scale.y);
		ctx.rotate(this.rotation);
		
		this._render();
		
		
		for (let i in this.children) {
			if (this.children[i].render) {
				this.children[i].render();
			}
		}
		
		ctx.restore();
		
	}

	_render() {
		//.....implemented by extending classes
	}
	
}


