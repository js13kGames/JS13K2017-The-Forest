class Field {

	constructor(width, height) {
		this.x = 0;
		this.y = 0;
		this.width = width;
		this.height = height;
		this.color = '#333333';
	}


	render() {
		ctx.beginPath();
	    ctx.rect(this.x-camera.x, this.y-camera.y, this.width, this.height);
	    ctx.closePath();
	    ctx.fillStyle = this.color;
	    ctx.fill();
	}
}

module.exports = Field;