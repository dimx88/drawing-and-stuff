class Vector2 {
	constructor(x=0, y=0) {
		this.x = x;
		this.y = y;
	}
	
	static between(v1, v2) {
		return new Vector2(v2.x - v1.x, v2.y - v1.y);
	}
	
	set(p1, p2) {
		if (p2) {
			this.x = p1;
			this.y = p2;
		} else {
			this.x = p1.x;
			this.y = p1.y;
		}
		return this;
	}
	
	add(p1, p2) {
		if (p2) {
			this.x += p1;
			this.y += p2;
		} else {
			this.x += p1.x;
			this.y += p1.y;
		}
		return this;
	}
	

	
	subtract(p1, p2) {
		if (p2) {
			this.x -= p1;
			this.y -= p2;
		} else {
			this.x -= p1.x;
			this.y -= p1.y;
		}
		return this;
	}
	

	
	multiply(num) {
		this.x *= num;
		this.y *= num;
		return this;
	}
	
	divide(num) {
		this.x /= num;
		this.y /= num;
		return this;
	}
	
	normalize() {
		const mag = this.mag();
		this.x /= mag;
		this.y /= mag;
		return this;
	}
	
	normalized() {
		const mag = this.mag();
		return new Vector2(this.x/mag, this.y/mag);
	}
	
	normalL() {
		return new Vector2(this.y, -this.x);
	}
	
	normalR() {
		return new Vector2(-this.y, this.x);
	}
	
	rotate(num) {
		const 	angle = this.angle() + num, 
				mag = this.mag();
		this.x = Math.cos(angle) * mag;
		this.y = Math.sin(angle) * mag;
		return this;
	}
	
	rotated(num) {
		const 	angle = this.angle() + num, 
				mag = this.mag(),
				x = Math.cos(angle) * mag,
				y = Math.sin(angle) * mag;
		return new Vector2(x, y);
	}
	
	setAngle(ang) {
		const mag = this.mag();
		this.x = Math.cos(angle) * mag;
		this.y = Math.sin(angle) * mag;
		return this;
	}
	
	angle() {
		return Math.atan2(this.y, this.x);
	}
	
	dot(vec) {
		return this.x * vec.x + this.y * vec.y;
	}
	
	clip(mag) {
		const mag_sq = this.magSquared();
		if (mag_sq > mag*mag) 
			this.normalize().multiply(mag);
		
		return this;
	}
	
	projected(vec) {
		const dot = this.dot(vec);
		return new Vector2(vec.x * dot, vec.y * dot);
	}
	
	mag() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	}
	
	magSquared() {
		return this.x*this.x + this.y*this.y;
	}
	isZero() {
		return (this.x + this.y === 0);
	}
	
	isLessThan(num) {
		return (this.x * this.x) + (this.y * this.y) < (num*num) 
	}
	
	reverse() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	}
	
	reversed() {
		return new Vector2(-this.x, -this.y);
	}
	
	init() {
		this.x = this.y = 0;
		return this;
	}
	
	copy() {
		return new Vector2(this.x, this.y);
	}
	
	render() {
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
	}


}