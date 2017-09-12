class Camera {

	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = 800;
		this.height = 450;
		this.pocket = {
			x:275,
			y:100,
			width:250,
			height:250,
			color:'#cccccc'
		}
	};

	setTarget(target) {
		this.target = target;
	}

	setField(field) {
		this.field = field;
	}

	update(elapsed) {

		//Keep target in camera pocket if possible
		if(this.target.x + this.target.width > this.x+this.pocket.x+this.pocket.width) { //East
			this.x = this.target.x + this.target.width - this.pocket.x - this.pocket.width;
		}
		if(this.target.x < this.x + this.pocket.x) { //West
			this.x = this.target.x - this.pocket.x;
		}
		if(this.target.y < this.y + this.pocket.y) { //North
			this.y = this.target.y - this.pocket.y;
		}
		if(this.target.y + this.target.height > this.y + this.pocket.y + this.pocket.height) { //South
			this.y = this.target.y + this.target.height - this.pocket.y - this.pocket.height;
		}

		//Don't let the camera go outside of the field
		if(this.x < this.field.x) { //West
			this.x = this.field.x;
		}

		if(this.x + this.width > this.field.x + this.field.width) { //East
			this.x = this.field.x+this.field.width - this.width;
		}

		if(this.y < this.field.y) { //North
			this.y = this.field.y;
		}

		if(this.y + this.height > this.field.y + this.field.height) { //South
			this.y = this.field.y+this.field.height - this.height;
		}

	}

	render() {
		// ctx.beginPath();
	 //    ctx.rect(this.pocket.x, this.pocket.y, this.pocket.width, this.pocket.height);
	 //    ctx.closePath();
	 //    ctx.fillStyle = this.pocket.color;
	 //    ctx.fill();
	}
}

module.exports = Camera;