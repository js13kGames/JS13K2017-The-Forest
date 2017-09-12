var FalseWall = require('./falseWall');
var Trigger = require('./trigger');

class Engine13 {
	constructor(context) {
		this.currentWaypoint = 0;
		this.onMagnetic = false;
		this.context = context;
		this.initialized = false;
		this.noiseCanvas = null;
		this.noiseCanvasA0 = null;
		this.noiseCanvasA1 = null;
		this.imagesToLoad = {
			trees:false,
			metal:false
		};
		this.noiseFrameIndex = 0;
		this.noiseFramesNum = 10;
		this.noiseFrames = [];
		this.ready = false;

		var that = this;
		this.patterns = {};
		this.patterns.metal = new Image();
		this.patterns.metal.onload = function() {
			that.imagesToLoad.metal = true;
			that.checkIfLoaded();
		}
		this.patterns.metal.src = 'data:image/gif;base64,R0lGODlhMgAyAIAAAAAAADMzMyH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU0OTExLCAyMDEzLzEwLzI5LTExOjQ3OjE2ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEFGQ0U1Qzk4ODYwMTFFN0EyNDY5NzA0MDlGQjUwQjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEFGQ0U1Q0E4ODYwMTFFN0EyNDY5NzA0MDlGQjUwQjgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4QUZDRTVDNzg4NjAxMUU3QTI0Njk3MDQwOUZCNTBCOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QUZDRTVDODg4NjAxMUU3QTI0Njk3MDQwOUZCNTBCOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAAAAAAALAAAAAAyADIAAAJljI+py+0Po5y02uuA3hyoDn4gh5Xmiabqio5k4m7iyNb2jedVrM2uT9MJh8TijeeB8YAvo/MJHSKZHWozis1qj0tlzJrcisdkxNT7QwfL7Lb7bO7G1+66HQc/5A37u/+f0yfoUgAAOw==';
		//this.patterns.metal.data = context.createPattern(this.patterns.metal, 'repeat');
		this.patterns.trees = new Image();
		this.patterns.trees.onload = function() {
			that.imagesToLoad.trees = true;
			that.checkIfLoaded();
		}
		this.patterns.trees.src = 'data:image/gif;base64,R0lGODlhMgAyAIAAAAAAADMzMyH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS41LWMwMjEgNzkuMTU0OTExLCAyMDEzLzEwLzI5LTExOjQ3OjE2ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEFGQ0U1QzU4ODYwMTFFN0EyNDY5NzA0MDlGQjUwQjgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEFGQ0U1QzY4ODYwMTFFN0EyNDY5NzA0MDlGQjUwQjgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4QUZDRTVDMzg4NjAxMUU3QTI0Njk3MDQwOUZCNTBCOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4QUZDRTVDNDg4NjAxMUU3QTI0Njk3MDQwOUZCNTBCOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgH//v38+/r5+Pf29fTz8vHw7+7t7Ovq6ejn5uXk4+Lh4N/e3dzb2tnY19bV1NPS0dDPzs3My8rJyMfGxcTDwsHAv769vLu6ubi3trW0s7KxsK+urayrqqmop6alpKOioaCfnp2cm5qZmJeWlZSTkpGQj46NjIuKiYiHhoWEg4KBgH9+fXx7enl4d3Z1dHNycXBvbm1sa2ppaGdmZWRjYmFgX15dXFtaWVhXVlVUU1JRUE9OTUxLSklIR0ZFRENCQUA/Pj08Ozo5ODc2NTQzMjEwLy4tLCsqKSgnJiUkIyIhIB8eHRwbGhkYFxYVFBMSERAPDg0MCwoJCAcGBQQDAgEAACH5BAAAAAAALAAAAAAyADIAAAK0jI8Gyc3rYgJU2kDhbbnu131T54kYqX1oZq6lSJpILJ90i8pueu3wzosAg5whcTRUuXCrn2+T7BmlUaHxBbpar9gDl7UFUsWSb5kb1hbN2W/QDfbC47Y5tMuszfBOvfyoBHgnKGjjp8BnuHWo2AZIVwOJeIPEmBZiqUeZyYTJ6ZTzObgkelZV6vCEerm5+kfm+nq6ChcrS2pbN4ta6zpXqPkL/CmZu2ZMhWxRrPzXvPh8bFkAADs=';
		//this.patterns.trees.data = context.createPattern(this.patterns.trees, 'repeat');

		this.patterns.compassGradient = context.createRadialGradient(75, 75, 100, 75, 75, 0);
		this.patterns.compassGradient.addColorStop(0, '#333333');
		this.patterns.compassGradient.addColorStop(1, '#cccccc');
	}

	static rectIntersect(x1,y1,width1,height1,x2,y2,width2,height2) {
		return !(x2 > x1 + width1 || x2 + width2 < x1 || y2 > y1 + height1 || y2 + height2 < y1);
	}

	static radiusDetect(x1,y1,x2,y2,radius) {
		return (Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1)) < radius);
	}

	static drawRotatedImage(context, image, x, y, angle) {
		var TO_RADIANS = Math.PI / 180;
	    context.save();
	    context.translate(x, y);
	    context.rotate(angle * TO_RADIANS);
	    context.drawImage(image, -(image.width / 2), -(image.height / 2), image.width, image.height);
	    context.restore();
	}

	static isOnScreen(obj) {
		return engine.rectIntersect(obj.x,obj.y,obj.width,obj.height,camera.x,camera.y,camera.width,camera.height);
	}

	restart() {
		//console.log("restarting now");
		location.reload();
	}

	generateNoiseFrames(width, height, opacity) {
		for(var frameCount = 0; frameCount < this.noiseFramesNum; frameCount++) {
			var newNoiseCanvas = document.createElement("canvas");
			newNoiseCanvas.width = width;
			newNoiseCanvas.height = height;

			var newNoiseContext = newNoiseCanvas.getContext('2d');
			newNoiseContext.clearRect(0,0,width,height);


			//TODO: Create a canvas in a namespace, create this data and draw it when needed with a multiple, maybe add an 'animated' option for whether to generate a new noise field each frame or not to give it a 'moving film grain' effect
			var imageData = newNoiseContext.getImageData(0, 0, width, height);
			var pixels = imageData.data;
			for (var i = 0, il = pixels.length; i < il; i += 4) {
				var color = Math.round(Math.random() * 255);
	  		
	  			// Because the noise is monochromatic, we should put the same value in the R, G and B channels
	  			pixels[i] = pixels[i + 1] = pixels[i + 2] = color;
	  			// Make sure pixels are opaque
	  			pixels[i + 3] = (255*opacity);

			}
			// Put pixels back into canvas
			newNoiseContext.putImageData(imageData, 0, 0);
			this.noiseFrames.push(newNoiseCanvas);
		}
		//this.noiseCanvas.created = true;

		// if(!this.noiseCanvas) {
		// 	this.noiseCanvas = document.createElement("canvas");
		// 	this.noiseCanvas.width = width;
		// 	this.noiseCanvas.height = height;
		// 	this.noiseCanvas0 = document.createElement("canvas");
		// 	this.noiseCanvas0.width = width;
		// 	this.noiseCanvas0.height = height;
		// 	this.noiseCanvas1 = document.createElement("canvas");
		// 	this.noiseCanvas1.width = width;
		// 	this.noiseCanvas1.height = height;
		// 	//CE.noiseCanvas.context = CE.noiseCanvas.getContext('2d');
		// }

		// if(animated || !this.noiseCanvas.created) {
		// 	// var context0 = this.noiseCanvas0.getContext('2d');
		// 	// context0.clearRect(0, 0, width, height);
		// 	// var context1 = this.noiseCanvas1.getContext('2d');
		// 	// context1.clearRect(0, 0, width, height);

		// 	//TODO: Create a canvas in a namespace, create this data and draw it when needed with a multiple, maybe add an 'animated' option for whether to generate a new noise field each frame or not to give it a 'moving film grain' effect
		// 	var imageData = context0.getImageData(0, 0, this.noiseCanvas0.width, this.noiseCanvas0.height);
		// 	var pixels = imageData.data;
		// 	for (var i = 0, il = pixels.length; i < il; i += 4) {
		// 		var color = Math.round(Math.random() * 255);
	  		
	 //  			// Because the noise is monochromatic, we should put the same value in the R, G and B channels
	 //  			pixels[i] = pixels[i + 1] = pixels[i + 2] = color;
	 //  			// Make sure pixels are opaque
	 //  			pixels[i + 3] = (255*opacity);

		// 	}
		// 	// Put pixels back into canvas
		// 	context0.putImageData(imageData, 0, 0);

		// 	var imageData1 = context1.getImageData(0, 0, this.noiseCanvas1.width, this.noiseCanvas1.height);
		// 	var pixels1 = imageData1.data;
		// 	for (var i = 0, il = pixels1.length; i < il; i += 4) {
		// 		var color = Math.round(Math.random() * 255);
	  		
	 //  			// Because the noise is monochromatic, we should put the same value in the R, G and B channels
	 //  			pixels1[i] = pixels1[i + 1] = pixels1[i + 2] = color;
	 //  			// Make sure pixels are opaque
	 //  			pixels1[i + 3] = (255*opacity);

		// 	}
		// 	// Put pixels back into canvas
		// 	context1.putImageData(imageData1, 0, 0);



		// 	this.noiseCanvas.created = true;
		// 	//console.log("woot!");
		// }
	}

	renderNoise(ctx, opacity, animated) {
		ctx.globalAlpha = opacity;

		if(animated) {
			this.noiseFrameIndex++;
			if(this.noiseFrameIndex == this.noiseFramesNum) {
				this.noiseFrameIndex = 0;
			}
			ctx.drawImage(this.noiseFrames[this.noiseFrameIndex],0,0);
		} else {
			ctx.drawImage(this.noiseFrames[0],0,0);
		}

		ctx.globalAlpha = 1;
	}

	checkIfLoaded() {
		if(this.imagesToLoad.trees == true && this.imagesToLoad.metal == true) {
			//console.log("All loaded!");
			this.patterns.metal.data = this.context.createPattern(this.patterns.metal, 'repeat');
			this.patterns.trees.data = this.context.createPattern(this.patterns.trees, 'repeat');
			this.ready = true;
		} else {
			//console.log("Nope not yet");
		}
	}

	setCurrentWaypoint(newWaypoint) {

		this.currentWaypoint = newWaypoint;
		this.narration.advanceNarration();

		if(newWaypoint == this.totalWaypoints) {
			game.hud.fadeToWhite();
			setTimeout(function() {
				game.narration.advanceNarration();
			}, 5000);
			return;
		}

		var falseWalls = this.gameObjects.filter(function(elem, i, array) {
	      return elem instanceof FalseWall && elem.triggerWaypoint === newWaypoint;
	  	});

		for(var falseWall in falseWalls) {
			switch(falseWalls[falseWall].stateChangeType) {
				case "disappear":
					falseWalls[falseWall].kill();
					break;
				case "appear":
					falseWalls[falseWall].setVisible(true);
					break;
			}
		}

		var triggers = this.gameObjects.filter(function(elem, i, array) {
	      return elem instanceof Trigger && elem.triggerWaypoint === newWaypoint;
	  	});

	  	for(var trigger in triggers) {
	  		triggers[trigger].active = true;
	  	}
	}
}


module.exports = Engine13;