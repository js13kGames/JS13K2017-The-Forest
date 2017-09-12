var BaseObject = require('./baseObject');
var Bullet = require('./bullet');

class Character extends BaseObject {

	constructor() {
		super();
		this.x = 0;
		this.y = 0;
		this.alive = true;
		this.health = 3;
		this.width = 40;
		this.height = 40;
		this.color = '#ffffff';
		this.colorAlive = '#ffffff';
		this.hitColor = '#960f0f';
		this.speed = 400;
		this.collisionType = "player";
		this.onMagnetic = false;
		this.shootingInterval = 0.2;
		this.shootingCooldown = 0;
		this.bulletOffset = 20;
		this.bulletSpeed = 600;
		this.init = false;
		this.trailUpdate = 0;
		this.invuln = false;
		this.invulnTimer = 0;
		this.invulnTime = .25;
		this.lastPositions = [
			{x:0,y:0},
			{x:0,y:0},
			{x:0,y:0},
			{x:0,y:0},
			{x:0,y:0},
			{x:0,y:0},
			{x:0,y:0},
			{x:0,y:0},
			{x:0,y:0},
			{x:0,y:0},
		];
	}

	setCompass(compass) {
		this.compass = compass;
		this.waypoints = gameObjects.filter(function(elem, i, array) {
	      return elem.collisionType === "trigger" && elem.triggerData.type === "waypoint";
	  	});
	  	this.compass.setTarget(this,this.getCurrentWaypoint());
	}

	getCurrentWaypoint() {
		for(var waypoint in this.waypoints) {
			if(this.waypoints[waypoint].triggerData.value == game.currentWaypoint) {
				return this.waypoints[waypoint];
			}
		}
	}

	// shoot(direction) {
	// 	if(this.shootingCooldown < 0) {
	// 		this.shootingCooldown = this.shootingInterval;
	// 		var bullet = new Bullet();
	// 		bullet.bulletType = "character";
	// 		switch(direction) {
	// 			case "up":
	// 				bullet.setPosition(this.x+this.width/2,this.y - this.bulletOffset);
	// 				bullet.setVelocity(0,-this.bulletSpeed);
	// 				break;
	// 			case "down":
	// 				bullet.setPosition(this.x+this.width/2,this.y + this.height + this.bulletOffset);
	// 				bullet.setVelocity(0,this.bulletSpeed);
	// 				break;
	// 			case "left":
	// 				bullet.setPosition(this.x - this.bulletOffset,this.y + this.height/2);
	// 				bullet.setVelocity(-this.bulletSpeed,0);
	// 				break;
	// 			case "right":
	// 				bullet.setPosition(this.x + this.width + this.bulletOffset,this.y + this.height/2);
	// 				bullet.setVelocity(this.bulletSpeed,0);
	// 				break;
	// 		}
	// 		gameObjects.push(bullet);
	// 	}
	// }

	kill() {
		this.alive = false;
	}

	update(elapsed) {
		if(this.alive) {
			this.color = this.colorAlive;

			if(!this.init) {
				this.compass.setTarget(this,this.getCurrentWaypoint());
				this.init = true;
			}

			this.shootingCooldown -= elapsed;

			this.onMagnetic = false;

			//Take in input and move character accordingly
			if(input.D || input.RIGHT) {
				this.x += this.speed*elapsed;
			} else if(input.A || input.LEFT) {
				this.x -= this.speed*elapsed;
			}

			if(input.W || input.UP) {
				this.y -= this.speed*elapsed;
			} else if(input.S || input.DOWN) {
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

			//Shooting Logic
			// if(input.LEFT) {
			// 	this.shoot("left");
			// } else if(input.RIGHT) {
			// 	this.shoot("right");
			// } else if(input.UP) {
			// 	this.shoot("up");
			// } else if(input.DOWN) {
			// 	this.shoot("down");
			// }

			//Check for static collisions
			var colliding = true;
			//while(colliding) {
				var collisionObj = super.checkForStaticEntityCollisions();
				for(var collision in collisionObj.collisions) {
					if(collisionObj.collisions[collision].value === true && collisionObj.collisions[collision].type === "static") {
						if(Math.abs(collisionObj.collisions[collision].xAmount) > Math.abs(collisionObj.collisions[collision].yAmount)) {
							this.y -= collisionObj.collisions[collision].yAmount;
						} else {
							this.x -= collisionObj.collisions[collision].xAmount;
						}
					}
				}

			//Check for triggers
			var triggerCollisionObj = super.checkForTriggerCollisions();
			if(triggerCollisionObj.value === true && triggerCollisionObj.type === "trigger") {
				var other = triggerCollisionObj.other;
				switch(other.triggerData.type) {
					case "waypoint":
						//game.currentWaypoint = other.triggerData.value;
						game.setCurrentWaypoint(game.currentWaypoint+1);
						this.compass.setTarget(this,this.getCurrentWaypoint());
						break;
					case "magnetic":
						this.onMagnetic = true;
						break;
				}

				if(other.triggerData.onetime == true) {
					other.kill();
				}
			}

			if(this.onMagnetic) {
				this.compass.isConfused = true;
				game.sounds.magnet.play();
			} else {
				this.compass.isConfused = false;
				game.sounds.magnet.pause();
			}



			if(!this.invuln) {
				var bullets = super.checkForBulletCollisions();
				if(bullets.collisions.length > 0) {
					for(var bullet in bullets.collisions) {
						var bulletObj = bullets.collisions[bullet];
						if(bulletObj.bulletType == "enemy") {
							bulletObj.kill();
							this.health --;
							//this.color = this.hitColor;
							this.invuln = true;
							game.sounds.hit.play();
							this.invulnTimer = 0;
						}
					}
				} else {
					var enemies = super.checkForEnemyCollisions();
					if(enemies.collisions.length > 0) {
						for(var enemy in enemies.collisions) {
							var enemyObj = enemies.collisions[enemy];
							this.health --;
							//this.color = this.hitColor;
							this.invuln = true;
							game.sounds.hit.play();
							this.invulnTimer = 0;
						}
					}
				}
			} else {
				this.color = this.hitColor;
				this.invulnTimer += elapsed;
				if(this.invulnTimer > this.invulnTime) {
					this.invuln = false;
				}
			}

			if(this.health <= 0) {
				game.hud.fadeToDead();
				this.kill();
			}
		}
		if(this.trailUpdate % 2 == 0) {
			this.lastPositions.unshift({x:this.x,y:this.y});
			this.lastPositions.pop();
		}
		this.trailUpdate++;
		if(this.trailUpdate > 100) {
			this.trailUpdate = 0;
		}
	}

	render() {
		if(this.alive) {
			var alpha = 1;
			if(this.invuln) {
				alpha = .5;
				ctx.globalAlpha = alpha;
			}
	    	ctx.beginPath();
    		ctx.arc(this.x-camera.x+this.width/2, this.y-camera.y+this.height/2, this.width/2, 0, Math.PI * 2, true);
    		ctx.closePath();
    		ctx.fillStyle = this.color;
    		ctx.fill();

    		for(var i = this.lastPositions.length-1; i >= 0; i--) {
	    		if(i != 0) {
		    		var alphaValue = (this.lastPositions.length-i)*.1*alpha;
		    		ctx.beginPath();
		    		ctx.arc(this.lastPositions[i].x-camera.x+this.width/2+(Math.random()*4-2), this.lastPositions[i].y-camera.y+this.height/2+(Math.random()*4-2), this.width/2*(this.lastPositions.length-i)*.1, 0, Math.PI * 2, true);
		    		ctx.closePath();
		    		ctx.fillStyle = this.color;
		    		ctx.globalAlpha = alphaValue;
		    		ctx.fill();
		    	}
	    	}
	    	ctx.globalAlpha = 1;
		}
	}
}

module.exports = Character;