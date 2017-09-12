var BaseObject = require('./BaseObject');

class FalseWall extends BaseObject {

	constructor(x,y,width,height) {
		super();
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.color = '#000045';
		this.stateChangeType = "";
		this.triggerWaypoint = 0;
		this.visible = true;
		this.renderLayer = 4;
	}

	update(elapsed) {

	}

	setStateChange(stateChangeType, triggerWaypoint) {
		this.stateChangeType = stateChangeType;
		this.triggerWaypoint = triggerWaypoint;
		if(stateChangeType == "appear") {
			this.setVisible(false);
		}
	}

	setVisible(visible) {
		if(visible) {
			this.visible = true;
			this.collisionType = "static";
		} else {
			this.visible = false;
			this.collisionType = "none";
		}
	}

	render() {
		if(this.visible && engine.isOnScreen(this)) {
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

module.exports = FalseWall;