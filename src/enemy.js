var BaseObject = require('./baseObject');
var Bullet = require('./bullet');

class Enemy extends BaseObject {

	constructor() {
		super();
		this.x = 0;
		this.y = 0;
		this.width = 40;
		this.height = 40;
		this.radiusActivate = 200;
		this.radiusDeactivate = 350;
		this.colorActive = '#ff0000';
		this.colorInactive = '#000000';
		this.hitColor = '#a442f4';
		this.active = false;
		this.color = '#000000';
		this.speed = 75;
		this.health = 2;
		this.collisionType = "enemy";
		this.shootingInterval = .8;
		this.shootingCooldown = 0;
		this.bulletOffset = 20;
		this.bulletSpeed = 600;
		this.currentlyHit = false;
		this.radarPulseTime = 3;
		this.radarPulseDistance = 200;
		this.radarPulseTimer = 0;
	}

	shoot(direction) {
		if(this.shootingCooldown < 0) {
			this.shootingCooldown = this.shootingInterval;
			var bullet = new Bullet();
			bullet.bulletType = "enemy";
			switch(direction) {
				case "up":
					bullet.setPosition(this.x+this.width/2,this.y - this.bulletOffset);
					bullet.setVelocity(0,-this.bulletSpeed);
					break;
				case "down":
					bullet.setPosition(this.x+this.width/2,this.y + this.height + this.bulletOffset);
					bullet.setVelocity(0,this.bulletSpeed);
					break;
				case "left":
					bullet.setPosition(this.x - this.bulletOffset,this.y + this.height/2);
					bullet.setVelocity(-this.bulletSpeed,0);
					break;
				case "right":
					bullet.setPosition(this.x + this.width + this.bulletOffset,this.y + this.height/2);
					bullet.setVelocity(this.bulletSpeed,0);
					break;
			}
			gameObjects.push(bullet);
			game.sounds.shoot.play();
		}
	}

	kill() {
		var i = gameObjects.indexOf(this);
    	gameObjects.splice(i, 1);
	}

	update(elapsed) {

		this.shootingCooldown -= elapsed;

		//Take in input and move character accordingly
		// if(input.D) {
		// 	this.x += this.speed*elapsed;
		// } else if(input.A) {
		// 	this.x -= this.speed*elapsed;
		// }

		// if(input.W) {
		// 	this.y -= this.speed*elapsed;
		// } else if(input.S) {
		// 	this.y += this.speed*elapsed;
		// }

		//update radar pulse
		this.radarPulseTimer += elapsed;
		if(this.radarPulseTimer > this.radarPulseTime) {
			this.radarPulseTimer = 0;
		}



		if(!this.active) {
			if(engine.radiusDetect(game.character.x+game.character.width/2,game.character.y+game.character.height/2, this.x+this.width/2, this.y+this.height/2,this.radiusActivate)) {
				this.active = true;
			}
		} else {
			if(!engine.radiusDetect(game.character.x+game.character.width/2,game.character.y+game.character.height/2, this.x+this.width/2, this.y+this.height/2,this.radiusDeactivate)) {
				this.active = false;
			}
		}


		if(this.active) {
			this.color = this.colorActive;
		} else {
			this.color = this.colorInactive;
		}

		if(this.active) {
			this.radarPulseTimer = 0;
			if(Math.abs(game.character.x - this.x) > Math.abs(game.character.y - this.y)) { //Check if horizontal or vertical distance is bigger and shoot based on that determination
				if(game.character.x > this.x) {
					this.shoot("right");
				} else if(game.character.x < this.x) {
					this.shoot("left");
				}
			} else {
				if(game.character.y < this.y) {
					this.shoot("up");
				} else if(game.character.y > this.y) {
					this.shoot("down");
				}
			}

			if(game.character.x > this.x) {
				this.x += this.speed*elapsed;
			} else if(game.character.x < this.x) {
				this.x -= this.speed*elapsed;
			}

			if(game.character.y < this.y) {
				this.y -= this.speed*elapsed;
			} else if(game.character.y > this.y) {
				this.y += this.speed*elapsed;
			}
		}

		//Check for static collisions
		var colliding = true;
		var collisionObj = super.checkForStaticEntityCollisions();
		if(collisionObj.collisions.length > 0) {
			//console.log(collisionObj.collisions);
		}
		for(var collision in collisionObj.collisions) {
			if(collisionObj.collisions[collision].value === true && collisionObj.collisions[collision].type === "static") {
				if(Math.abs(collisionObj.collisions[collision].xAmount) > Math.abs(collisionObj.collisions[collision].yAmount)) {
					this.y -= collisionObj.collisions[collision].yAmount;
				} else {
					this.x -= collisionObj.collisions[collision].xAmount;
				}
			}
		}

		this.currentlyHit = false;
		var bullets = super.checkForBulletCollisions();
		if(bullets.collisions.length > 0) {
			for(var bullet in bullets.collisions) {
				var bulletObj = bullets.collisions[bullet];
				if(bulletObj.bulletType == "character") {
					bulletObj.kill();
					this.health --;
					this.currentlyHit = true;
					this.color = this.hitColor;
				}
			}
		}

		if(this.health <= 0) {
			this.kill();
		}
	}

	render() {
		//Deactivate Radius
		// ctx.beginPath();
		// ctx.arc(this.x-camera.x+this.width/2,this.y-camera.y+this.height/2,this.radiusDeactivate,0*Math.PI,2*Math.PI);
	 //    ctx.closePath();
	 //    ctx.fillStyle = 'rgba(255, 0, 0, .3)';
	 //    ctx.fill();

	    //Activate Radius
	 //    ctx.beginPath();
		// ctx.arc(this.x-camera.x+this.width/2,this.y-camera.y+this.height/2,this.radiusActivate,0*Math.PI,2*Math.PI);
	 //    ctx.closePath();
	 //    ctx.fillStyle = 'rgba(255, 0, 0, .7)';
	 //    ctx.fill();
	 	//what percentage much of the radar pulse time has passed?
		var pulsePercent = this.radarPulseTimer/this.radarPulseTime;
		var opacity = 1-pulsePercent;

		if(!this.active) {
		 	ctx.beginPath();
			ctx.arc(this.x-camera.x+this.width/2,this.y-camera.y+this.height/2,this.radarPulseDistance*pulsePercent,0*Math.PI,2*Math.PI);
			ctx.closePath();
		    ctx.fillStyle = 'rgba(255, 0, 0, '+opacity+')';
		    ctx.fill();
		}


	    //Rect
	    ctx.beginPath();
		ctx.arc(this.x-camera.x+this.width/2, this.y-camera.y+this.height/2, this.width/2, 0, Math.PI * 2, true);
	    ctx.closePath();
	    ctx.fillStyle = this.color;
	    ctx.fill();
	}
}

module.exports = Enemy;