var BaseObject = require('./BaseObject');

class Trigger extends BaseObject {

	constructor(x,y,width,height) {
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = '#5daf46';
		this.collisionType = "trigger";
		this.renderLayer = 2;
		this.active = true;
		this.triggerWaypoint = -1;
	}

	setTriggerData(obj) {
		this.triggerData = obj;
	}

	update(elapsed) {

	}

	render() {
		if(engine.isOnScreen(this) && this.triggerData.type != "waypoint") {
			ctx.beginPath();
	    	ctx.rect(this.x-camera.x, this.y-camera.y, this.width, this.height);
	    	ctx.closePath();
	    	ctx.fillStyle = this.color;

	    	ctx.save();
			ctx.translate(this.x-camera.x, this.y-camera.y);
			ctx.fill();
			ctx.restore();
		}
	}

	kill() {
		var i = gameObjects.indexOf(this);
    	gameObjects.splice(i, 1);
	}
}

module.exports = Trigger;