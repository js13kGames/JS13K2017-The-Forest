class Entity {

	constructor() {
		super();
		this.x = 0;
		this.y = 0;
		//this.width = 40;
		//this.height = 40;
		this.speed = 200;
	};

	update(elapsed) {

		//Take in input and move character accordingly
		if(input.RIGHT) {
			this.x += this.speed*elapsed;
		} else if(input.LEFT) {
			this.x -= this.speed*elapsed;
		}

		if(input.UP) {
			this.y -= this.speed*elapsed;
		} else if(input.DOWN) {
			this.y += this.speed*elapsed;
		}


		//Clamp to camera bounds
		if(this.x + this.width > camera.x+camera.width) {
			this.x = camera.x + camera.width - this.width;
		} else if(this.x < camera.x) {
			this.x = camera.x;
		}

		if(this.y + this.height > camera.y+camera.height) {
			this.y = camera.y + camera.height - this.height;
		} else if(this.y < camera.y) {
			this.y = camera.y;
		}
	}

	render() {
		ctx.beginPath();
	    ctx.rect(this.x-camera.x, this.y-camera.y, this.width, this.height);
	    ctx.closePath();
	    ctx.fillStyle = '#7FDBFF';
	    ctx.fill();
	}
}

module.exports = Entity;