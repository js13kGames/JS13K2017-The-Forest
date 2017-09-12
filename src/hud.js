class Hud {

	constructor(width,height) {
		this.width = width;
		this.height = height;
		this.overlayOpacity = 1;
		this.fadingToWhite = false;
		this.fadingFromWhite = false;
		this.fadingToDead = false;
		this.dead = false;
		this.fadeSpeed = 3;
	}

	update(elapsed) {
		if(this.fadingToWhite) {
			if(this.overlayOpacity < 1) {
				this.overlayOpacity += 1/this.fadeSpeed*elapsed;
			} else {
				this.fadingToWhite = false;
			}
		}

		if(this.fadingFromWhite) {
			if(this.overlayOpacity > 0) {
				this.overlayOpacity -= 1/this.fadeSpeed*elapsed;
			} else {
				this.fadingFromWhite = false;
				this.fadeSpeed = 3;
				game.narration.advanceNarration();
				setTimeout(function(){
					game.narration.advanceNarration();
				},4000);
			}
		}

		if(this.fadingToDead) {
			if(this.overlayOpacity < 1) {
				this.overlayOpacity += 1/this.fadeSpeed*elapsed;
			} else {
				this.fadingToDead = false;
				game.restart();
			}
		}
	}

	fadeToWhite() {
		this.fadingToWhite = true;
	}

	fadeFromWhite() {
		this.fadeSpeed = 4;
		this.fadingFromWhite = true;
	}

	fadeToDead() {
		this.fadingToDead = true;
		this.dead = true;
	}

	render() {
		if(this.dead) {
			ctx.fillStyle = 'rgba(255,0,0,'+this.overlayOpacity+')';
		} else {
			ctx.fillStyle = 'rgba(255,255,255,'+this.overlayOpacity+')';
		}
		ctx.beginPath();
		ctx.rect(0,0,this.width,this.height);
		ctx.closePath();
		ctx.fill();
	}
}

module.exports = Hud;