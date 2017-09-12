class Compass {

	constructor() {
		this.color = '#ffffff';
		this.canvas = document.createElement('canvas');
    	this.canvas.width = 150;
    	this.canvas.height = 150;
    	this.ctx = this.canvas.getContext('2d');
    	this.currentAngle;
    	this.angleDeg = 0;
    	this.isConfused = false;
    	this.confusedSpeed = 200;
    	this.target = null;
	}

	setTarget(holder, target) {
		this.holder = holder;
		this.target = target;
	}

	update(elapsed) {
		if(this.target != null) {
			if(this.isConfused) {
				this.angleDeg = this.currentAngle + this.confusedSpeed*elapsed;
			} else {
				this.angleDeg = Math.atan2((this.target.y+this.target.height/2) - (this.holder.y+this.holder.height/2), (this.target.x+this.target.width/2) - (this.holder.x)+this.holder.height/2) * 180 / Math.PI;
			}

			this.currentAngle = this.angleDeg;
		}
	}


	render() {
		this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

		if(this.isConfused) {
			this.ctx.globalAlpha = .2;
		}
		//this.ctx.shadowBlur = 5;
		//this.ctx.shadowColor = "#f442f1";
		this.ctx.beginPath();
	    this.ctx.arc(75, 75, 50, 0, Math.PI * 2, true);
	    this.ctx.closePath();
	    this.ctx.lineWidth = 5;
	    this.ctx.strokeStyle = this.color;
	    this.ctx.fillStyle = game.patterns.compassGradient;
	    this.ctx.fill();
	    this.ctx.stroke();

	    //this.shadowBlur = 0;
	    this.ctx.beginPath();
    	this.ctx.moveTo(75, 35);
    	this.ctx.lineTo(85, 50);
    	this.ctx.lineTo(65, 50);
    	this.ctx.fillStyle = this.color;
    	this.ctx.fill();

    	engine.drawRotatedImage(ctx,this.canvas, 80, 370, this.angleDeg+90);

    	this.ctx.globalAlpha = 1;
	}
}

module.exports = Compass;