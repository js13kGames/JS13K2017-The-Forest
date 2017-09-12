class Narration {

	constructor(sel) {
		this.narrationHolder = sel;
		this.currentNarration = -1;
		this.currentShownNarration = null;
	}

	setNarrationContent(newContent) {
		this.content = newContent;
	}

	advanceNarration(timeBeforeNext = -1) {
		if(timeBeforeNext != -1) {
			var that = this;
			setTimeout(function(){
				that.advanceNarration();
			},timeBeforeNext);
		}

		this.currentNarration++;
		if(this.content[this.currentNarration]) {
			this.removeCurrentNarration();
			var newContent = this.content[this.currentNarration];
			var newp = document.createElement("p");
			newp.classList.add("narration-set");
			newp.innerHTML = newContent;
			var that = this;
			setTimeout(function(){
				that.animateInNarration(newp);
			}, 500);
			this.narrationHolder.appendChild(newp);
			this.currentShownNarration = newp;
		}
	}

	animateInNarration(p) {
		p.classList.add("active");
	}

	removeCurrentNarration() {
		if(this.currentShownNarration) {
			this.currentShownNarration.classList.remove("active");
			this.currentShownNarration.classList.add("inactive");
			var that = this;
			var inactiveNarration = this.currentShownNarration;
			setTimeout(function(){
				that.narrationHolder.removeChild(inactiveNarration);
			}, 500);
		}
	}
}

module.exports = Narration;