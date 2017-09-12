class BaseObject {

	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = 80;
		this.height = 80;
		this.color = '#ff4500';
		this.collisionType = "static";
		this.renderLayer = 5;
	}

	update(elapsed) {
	}

	render() {
		if(engine.isOnScreen(this)) {
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

	setColor(color) {
		this.color = color;
	}

	checkForStaticEntityCollisions() {
		var collides = {
			"value":false,
			"collisions":[]
		};

		var staticObjects = gameObjects.filter(function(elem, i, array) {
		    return elem.collisionType === "static";
		});

		for(var i = 0; i < staticObjects.length; i++) {
		 	var staticEntity = staticObjects[i];
			if(engine.rectIntersect(this.x,this.y,this.width,this.height,staticEntity.x,staticEntity.y,staticEntity.width,staticEntity.height)) {
		 		var newCollision = {};
		 		newCollision.value = true;
		 		newCollision.type = "static";

		 		//Calculate x overlap
		 		var leftSide = (this.x+this.width) - staticEntity.x;
		 		var rightSide = (staticEntity.x+staticEntity.width) - this.x;
				if(Math.min(leftSide,rightSide) == leftSide) {
					newCollision.xAmount = leftSide;
				} else {
					newCollision.xAmount = rightSide*-1;
				}

				//Calculate y overlap
				var topSide = (this.y + this.height) - (staticEntity.y);
				var bottomSide = (staticEntity.y+staticEntity.height) - (this.y);
				if(Math.min(topSide,bottomSide) == topSide) {
					newCollision.yAmount = topSide;
				} else {
					newCollision.yAmount = bottomSide*=-1;
				}
				collides.collisions.push(newCollision);
		 	}
		}
		return collides;
	}

	checkForTriggerCollisions() {
		var collides = {"value":false};

		var triggerObjects = gameObjects.filter(function(elem, i, array) {
			return elem.collisionType === "trigger";
		});

		for(var i = 0; i < triggerObjects.length; i++) {
			var triggerEntity = triggerObjects[i];
			if(engine.rectIntersect(this.x,this.y,this.width,this.height,triggerEntity.x,triggerEntity.y,triggerEntity.width,triggerEntity.height) && triggerEntity.active == true) {
		 		collides.value = true;
		 		collides.type = "trigger";
		 		collides.other = triggerEntity;
		 	}
		}

		return collides;
	}

	checkForBulletCollisions() {
		var collides = {
			"value":false,
			"collisions":[]
		};

		var bulletObjects = gameObjects.filter(function(elem, i, array) {
			return elem.collisionType === "bullet";
		});

		for(var bullet in bulletObjects) {
			var bulletObj = bulletObjects[bullet];
			if(engine.rectIntersect(this.x,this.y, this.width, this.height,bulletObj.x,bulletObj.y,bulletObj.width,bulletObj.height)) {
				collides.collisions.push(bulletObj);
			}
		}

		return collides;
	}

	checkForEnemyCollisions() {
		var collides = {
			"value":false,
			"collisions":[]
		};

		var bulletObjects = gameObjects.filter(function(elem, i, array) {
			return elem.collisionType === "enemy";
		});

		for(var bullet in bulletObjects) {
			var bulletObj = bulletObjects[bullet];
			if(engine.rectIntersect(this.x,this.y, this.width, this.height,bulletObj.x,bulletObj.y,bulletObj.width,bulletObj.height)) {
				collides.collisions.push(bulletObj);
			}
		}

		return collides;
	}
}

module.exports = BaseObject;