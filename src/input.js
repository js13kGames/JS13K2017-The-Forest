class Input {

	constructor() {
		this.UP = false;
		this.RIGHT = false;
		this.DOWN = false;
		this.LEFT = false;
		this.W = false;
		this.A = false;
		this.S = false;
		this.D = false;

		var context = this;
		this.keyDown = function(e) {
			e.preventDefault();

		    e = e || window.event;

		    if (e.keyCode == '38') {
		        // up arrow
		        context.UP = true;
		    }
		    else if (e.keyCode == '40') {
		        // down arrow
		        context.DOWN = true;
		    }
		    else if (e.keyCode == '37') {
		       // left arrow
		       context.LEFT = true;
		    }
		    else if (e.keyCode == '39') {
		       // right arrow
		       context.RIGHT = true;
		    }
		    else if (e.keyCode == '87') {
		       // W key
		       context.W = true;
		    }
		    else if (e.keyCode == '65') {
		       // A key
		       context.A = true;
		    }
		    else if (e.keyCode == '83') {
		       // S key
		       context.S = true;
		    }
		    else if (e.keyCode == '68') {
		       // D key
		       context.D = true;
		    }

		}

		this.keyUp = function(e) {
			e.preventDefault();

		    e = e || window.event;

		    if (e.keyCode == '38') {
		        // up arrow
		        context.UP = false;
		    }
		    else if (e.keyCode == '40') {
		        // down arrow
		        context.DOWN = false;
		    }
		    else if (e.keyCode == '37') {
		       // left arrow
		       context.LEFT = false;
		    }
		    else if (e.keyCode == '39') {
		       // right arrow
		       context.RIGHT = false;
		    }
		    else if (e.keyCode == '87') {
		       // W key
		       context.W = false;
		    }
		    else if (e.keyCode == '65') {
		       // A key
		       context.A = false;
		    }
		    else if (e.keyCode == '83') {
		       // S key
		       context.S = false;
		    }
		    else if (e.keyCode == '68') {
		       // D key
		       context.D = false;
		    }

		}


		document.onkeydown = this.keyDown;
		document.onkeyup = this.keyUp;
	}
}

module.exports = Input;