var BaseObject = require('./BaseObject');

class Bullet extends BaseObject {

	constructor() {
		super();
		this.x = 0;
		this.y = 0;
		this.xVel = 0;
		this.yVel = 0;
		this.width = 5;
		this.height = 5;
		this.color = '#ffffff';
		this.speed = 400;
		this.collisionType = "bullet";
		this.bulletType = "";
	}

	setPosition(x,y) {
		this.x = x;
		this.y = y;
	}

	setVelocity(xVel,yVel) {
		this.xVel = xVel;
		this.yVel = yVel;
	}

	update(elapsed) {
		this.x += this.xVel*elapsed;
		this.y += this.yVel*elapsed;

		if(!engine.isOnScreen(this)) {
			this.kill();
		}
	}

	render() {
		ctx.beginPath();
	    ctx.rect(this.x-camera.x, this.y-camera.y, this.width, this.height);
	    ctx.closePath();
	    ctx.fillStyle = this.color;
	    ctx.fill();
	}

	kill() {
		var i = gameObjects.indexOf(this);
    	gameObjects.splice(i, 1);
	}
}

module.exports = Bullet;