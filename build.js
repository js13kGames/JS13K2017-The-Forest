(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var raf = require('./raf');

var Engine13 = require('./engine13');
var BaseObject = require('./BaseObject');
var Character = require('./character');
var Enemy = require('./enemy');
var Input = require('./input');
var Camera = require('./camera');
var Field = require('./field');
var Compass = require('./compass');
var Trigger = require('./trigger');
var Hud = require('./hud');
var FalseWall = require('./falseWall');
var Narration = require('./narration');
var CPlayer = require('./CPlayer');
var JSFXR = require('./jsfxr');

var canvas = document.querySelector('#game');
var ctx = canvas.getContext('2d');

var input = new Input();
var camera = new Camera();
var compass = new Compass();
var game = new Engine13(ctx);
var narration = new Narration(document.querySelector('#narration_holder'));
var hud = new Hud(canvas.width,canvas.height);

var mapMultiplier = 200;
var triggerCount = 0;
var wakeupButton = document.querySelector('#wakeup_button');

window.engine = Engine13;
window.game = game;
window.camera = camera;
window.input = input;
window.ctx = ctx;
window.gameObjects = [];
game.gameObjects = gameObjects;
game.totalWaypoints = 5;
game.narration = narration;
game.hud = hud;
game.sounds = {};




var map = [
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
  [ 0, 0,13, 4, 4, 0, 0, 1, 1, 0, 0, 0, 4,10, 4, 0, 0, 0 ],
  [ 0, 0, 4, 4, 4,23, 1, 1, 1, 1, 4, 4, 4, 4, 4, 1, 1, 0 ],
  [ 0, 0, 4, 4,20,20, 1, 1, 1, 1, 1, 1, 4, 4, 4, 0, 1, 0 ],
  [ 0, 0, 4, 4,20, 1, 1,42,52,42,1 ,1 , 4,20 ,0 ,0, 1, 0 ],
  [ 0, 0, 1, 4,23, 1, 1,42,42,42,42, 1, 1,20,32,32,32, 0 ],
  [ 0, 0,20,20,20, 1, 1, 1, 1, 1, 1, 1, 1,22, 1, 1, 0, 0 ],
  [ 0, 0, 4,20,20, 1, 3, 1, 1, 1, 1, 1, 1,22, 1, 1, 1, 0 ],
  [ 0,99, 4, 4,20,20,24,20,20,20,20,20,20,20, 4, 4, 1, 0 ],
  [ 0, 4, 4, 4, 4, 0, 1, 0, 1, 1, 1,11, 4, 4, 4, 4, 1, 0 ],
  [ 0, 4, 4, 4, 0, 0, 1, 0, 0, 0, 0, 4, 4, 4 ,4 ,0 ,0 ,0 ],
  [ 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 4, 4, 4, 4, 0, 0, 0 ],
  [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
];

var enemyLocations = [
  [8.5,6.5],
  [3.5,2.5],
  [4.5,11.5],
  [8.5,2.5],
  [15.5,7.5],
  [15.5,2.5],
  [8.5,9.5]
]

//Shoot sound
var soundShoot = JSFXR([3,,0.0578,,0.1221,0.15,,-0.4372,,,,,,,,,,,1,,,,,0.5]);
var soundHit = JSFXR([3,,0.01,,0.2704,0.4699,,-0.6722,,,,,,,,,,,1,,,0.2931,,0.5]);
var soundMagnet = JSFXR([0,0.0422,0.1465,0.1342,0.9937,0.2932,0.0938,0.0213,0.0727,0.7955,0.2427,-0.6525,0.0033,0.102,0.0256,0.6207,0.0547,0.0231,0.1191,-0.0123,0.0268,0.0492,-0.3791,0.22]);
game.sounds.shoot = new Audio();
game.sounds.hit = new Audio();
game.sounds.magnet = new Audio();
game.sounds.magnet.loop = true;
game.sounds.shoot.src = soundShoot;
game.sounds.hit.src = soundHit;
game.sounds.magnet.src = soundMagnet;

// Song data
    var song = {
      songData: [
        { // Instrument 0
          i: [
          2, // OSC1_WAVEFORM
          60, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          108, // OSC2_VOL
          128, // OSC2_SEMI
          5, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          5, // ENV_ATTACK
          6, // ENV_SUSTAIN
          49, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          195, // LFO_AMT
          6, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          29, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          178, // FX_PAN_AMT
          13, // FX_PAN_FREQ
          121, // FX_DELAY_AMT
          4 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1,1,2,2,1,1,2,2,1,1,2,2],
          // Columns
          c: [
            {n: [127,,127,,127,,127,,130,,130,,130,,130,,127,,127,,127,,127,,130,,130,,130,,130],
             f: []},
            {n: [129,,129,,129,,129,,132,,132,,132,,132,,129,,129,,129,,129,,132,,132,,132,,132],
             f: []}
          ]
        },
        { // Instrument 1
          i: [
          0, // OSC1_WAVEFORM
          255, // OSC1_VOL
          116, // OSC1_SEMI
          1, // OSC1_XENV
          0, // OSC2_WAVEFORM
          255, // OSC2_VOL
          116, // OSC2_SEMI
          0, // OSC2_DETUNE
          1, // OSC2_XENV
          14, // NOISE_VOL
          4, // ENV_ATTACK
          6, // ENV_SUSTAIN
          45, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          0, // LFO_AMT
          0, // LFO_FREQ
          0, // LFO_FX_FREQ
          2, // FX_FILTER
          136, // FX_FREQ
          15, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          0, // FX_PAN_AMT
          0, // FX_PAN_FREQ
          66, // FX_DELAY_AMT
          6 // FX_DELAY_TIME
          ],
          // Patterns
          p: [],
          // Columns
          c: [
          ]
        },
        { // Instrument 2
          i: [
          3, // OSC1_WAVEFORM
          0, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          68, // OSC2_VOL
          128, // OSC2_SEMI
          0, // OSC2_DETUNE
          1, // OSC2_XENV
          218, // NOISE_VOL
          4, // ENV_ATTACK
          4, // ENV_SUSTAIN
          40, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          1, // LFO_WAVEFORM
          55, // LFO_AMT
          4, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          67, // FX_FREQ
          115, // FX_RESONANCE
          124, // FX_DIST
          190, // FX_DRIVE
          67, // FX_PAN_AMT
          6, // FX_PAN_FREQ
          39, // FX_DELAY_AMT
          1 // FX_DELAY_TIME
          ],
          // Patterns
          p: [],
          // Columns
          c: [
          ]
        },
        { // Instrument 3
          i: [
          0, // OSC1_WAVEFORM
          0, // OSC1_VOL
          140, // OSC1_SEMI
          0, // OSC1_XENV
          0, // OSC2_WAVEFORM
          0, // OSC2_VOL
          140, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          255, // NOISE_VOL
          158, // ENV_ATTACK
          158, // ENV_SUSTAIN
          158, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          51, // LFO_AMT
          2, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          58, // FX_FREQ
          239, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          88, // FX_PAN_AMT
          1, // FX_PAN_FREQ
          157, // FX_DELAY_AMT
          16 // FX_DELAY_TIME
          ],
          // Patterns
          p: [1,1,1,1,1,1,1,1,1,1,1,1],
          // Columns
          c: [
            {n: [115],
             f: []}
          ]
        },
        { // Instrument 4
          i: [
          2, // OSC1_WAVEFORM
          100, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          201, // OSC2_VOL
          128, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          5, // ENV_ATTACK
          6, // ENV_SUSTAIN
          58, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          195, // LFO_AMT
          6, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          135, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          147, // FX_PAN_AMT
          6, // FX_PAN_FREQ
          121, // FX_DELAY_AMT
          6 // FX_DELAY_TIME
          ],
          // Patterns
          p: [],
          // Columns
          c: [
          ]
        },
        { // Instrument 5
          i: [
          2, // OSC1_WAVEFORM
          100, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          201, // OSC2_VOL
          128, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          5, // ENV_ATTACK
          6, // ENV_SUSTAIN
          58, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          195, // LFO_AMT
          6, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          135, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          147, // FX_PAN_AMT
          6, // FX_PAN_FREQ
          121, // FX_DELAY_AMT
          6 // FX_DELAY_TIME
          ],
          // Patterns
          p: [],
          // Columns
          c: [
          ]
        },
        { // Instrument 6
          i: [
          2, // OSC1_WAVEFORM
          100, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          201, // OSC2_VOL
          128, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          5, // ENV_ATTACK
          6, // ENV_SUSTAIN
          58, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          195, // LFO_AMT
          6, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          135, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          147, // FX_PAN_AMT
          6, // FX_PAN_FREQ
          121, // FX_DELAY_AMT
          6 // FX_DELAY_TIME
          ],
          // Patterns
          p: [],
          // Columns
          c: [
          ]
        },
        { // Instrument 7
          i: [
          2, // OSC1_WAVEFORM
          100, // OSC1_VOL
          128, // OSC1_SEMI
          0, // OSC1_XENV
          3, // OSC2_WAVEFORM
          201, // OSC2_VOL
          128, // OSC2_SEMI
          0, // OSC2_DETUNE
          0, // OSC2_XENV
          0, // NOISE_VOL
          5, // ENV_ATTACK
          6, // ENV_SUSTAIN
          58, // ENV_RELEASE
          0, // ARP_CHORD
          0, // ARP_SPEED
          0, // LFO_WAVEFORM
          195, // LFO_AMT
          6, // LFO_FREQ
          1, // LFO_FX_FREQ
          2, // FX_FILTER
          135, // FX_FREQ
          0, // FX_RESONANCE
          0, // FX_DIST
          32, // FX_DRIVE
          147, // FX_PAN_AMT
          6, // FX_PAN_FREQ
          121, // FX_DELAY_AMT
          6 // FX_DELAY_TIME
          ],
          // Patterns
          p: [],
          // Columns
          c: [
          ]
        }
      ],
      rowLen: 5513,   // In sample lengths
      patternLen: 32,  // Rows per pattern
      endPattern: 13  // End pattern
    };

var narrationContent = [
  "Use W,A,S,D or Arrows to move.",
  "Life is funny isn't it?",
  "Just when you think you’ve got it all figured out...",
  "Just when you finally begin to plan something, get excited about something...",
  "and feel like you know what direction you’re heading in, the paths change...",
  "the signs change, the wind blows the other way...",
  "North is suddenly south and east is west, and you’re...",
  "lost",
  "The Forest: by @streetalchemist (words from <em>Love, Rosie</em> by Cecelia Ahern)"
];

var field;
var character;



//----------------------------------------------------------------------------
  // Demo program section
  //----------------------------------------------------------------------------

  // Initialize music generation (player).
  var t0 = new Date();
  var player = new CPlayer();
  player.init(song);

  // Generate music...
  var done = false;
  setInterval(function () {
    if (done) {
      return;
    }

    //var s = document.getElementById("status");
    //s.textContent = s.textContent + ".";

    done = player.generate() >= 1;

    if (done) {
      var t1 = new Date();
      //s.textContent = s.textContent + "done (" + (t1 - t0) + "ms)";

      // Put the generated song in an Audio element.
      var wave = player.createWave();
      var audio = document.createElement("audio");
      audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
      audio.loop = true;
      audio.play();
    }
  }, 0);


function start() {
  narration.setNarrationContent(narrationContent);
  field = new Field(5400,3900);
  character = new Character();

  camera.setTarget(character);
  camera.setField(field);

  gameObjects.push(character);
  game.character = character;

  for(var loc in enemyLocations) {
    var enemy = new Enemy();
    enemy.x = enemyLocations[loc][0]*mapMultiplier;
    enemy.y = enemyLocations[loc][1]*mapMultiplier;
    gameObjects.push(enemy);
  }

  wakeupButton.onclick = function() {
    wakeupButton.parentNode.removeChild(wakeupButton);
    hud.fadeFromWhite();
    narration.advanceNarration();
  }

  buildMap();
}

function buildMap() {
  for(row in map) {
    for(col in map[row]) {

      //Place wall tiles
      if(map[row][col] === 0) {
        var barrier = new BaseObject();
        barrier.x = col*mapMultiplier;
        barrier.y = row*mapMultiplier;
        barrier.width = mapMultiplier+1;
        barrier.height = mapMultiplier+1;
        barrier.setColor(game.patterns.trees.data);
        gameObjects.push(barrier);
      }

      //Place Character
      if(map[row][col] === 3) {
        character.x = col*mapMultiplier;
        character.y = row*mapMultiplier;
      } 

      //Place magnetic tiles
      if(map[row][col] === 4) {
        var mag = new Trigger(col*mapMultiplier,row*mapMultiplier,mapMultiplier,mapMultiplier);
        mag.setTriggerData({
          onetime:false,
          type:"magnetic",
        });
        mag.setColor(game.patterns.metal.data);
        gameObjects.push(mag);
      }

      //Place waypoints
      if(map[row][col] >= 10 && map[row][col] <= 19) {
        var mag = new Trigger(col*mapMultiplier,row*mapMultiplier,mapMultiplier,mapMultiplier);
        mag.setTriggerData({
          onetime:false,
          type:"magnetic",
        });
        mag.setColor(game.patterns.metal.data);
        gameObjects.push(mag);
        var trigger = new Trigger(col*mapMultiplier,row*mapMultiplier,mapMultiplier*2,mapMultiplier*2);
        trigger.setTriggerData({
          onetime:true,
          type:"waypoint",
          value:(map[row][col]-10)
        });
        trigger.renderLayer = 3;
        //triggerCount++;
        gameObjects.push(trigger);
      }

      //Place false/movable walls to disappear
      if(map[row][col] >= 20 && map[row][col] <= 29) {
        var falseWall = new FalseWall(col*mapMultiplier, row*mapMultiplier,mapMultiplier,mapMultiplier);
        falseWall.setStateChange("disappear",map[row][col]-20);
        falseWall.setColor(game.patterns.trees.data);
        gameObjects.push(falseWall);
      }

      //Place false/movable walls to appear
      if(map[row][col] >= 30 && map[row][col] <= 39) {
        var falseWall = new FalseWall(col*mapMultiplier, row*mapMultiplier,mapMultiplier,mapMultiplier);
        falseWall.setStateChange("appear",map[row][col]-30);
        falseWall.setColor(game.patterns.trees.data);
        gameObjects.push(falseWall);
      }

      //Place false/movable walls to disappear and leave behind a magnetic
      if(map[row][col] >= 40 && map[row][col] <= 49) {
        var mag = new Trigger(col*mapMultiplier,row*mapMultiplier,mapMultiplier,mapMultiplier);
        mag.setTriggerData({
          onetime:false,
          type:"magnetic",
        });
        mag.active = false;
        mag.triggerWaypoint = map[row][col]-40;
        mag.setColor(game.patterns.metal.data);
        gameObjects.push(mag);


        var falseWall = new FalseWall(col*mapMultiplier, row*mapMultiplier,mapMultiplier,mapMultiplier);
        falseWall.setStateChange("disappear",map[row][col]-40);
        falseWall.setColor(game.patterns.trees.data);
        gameObjects.push(falseWall);
      }

      //Place false/movable walls to disappear and leave behind a waypoint
      if(map[row][col] >= 50 && map[row][col] <= 59) {
        var mag = new Trigger(col*mapMultiplier,row*mapMultiplier,mapMultiplier,mapMultiplier);
        mag.setTriggerData({
          onetime:false,
          type:"magnetic",
        });
        mag.active = false;
        mag.triggerWaypoint = map[row][col]-50;
        mag.setColor(game.patterns.metal.data);
        gameObjects.push(mag);


        var trigger = new Trigger(col*mapMultiplier,row*mapMultiplier,mapMultiplier*2,mapMultiplier*2);
        trigger.setTriggerData({
          onetime:true,
          type:"waypoint",
          value:(map[row][col]-50)
        });
        trigger.renderLayer = 3;
        trigger.triggerWaypoint = map[row][col]-50;
        trigger.active = false;
        //triggerCount++;
        gameObjects.push(trigger);


        var falseWall = new FalseWall(col*mapMultiplier, row*mapMultiplier,mapMultiplier,mapMultiplier);
        falseWall.setStateChange("disappear",map[row][col]-50);
        falseWall.setColor(game.patterns.trees.data);
        gameObjects.push(falseWall);
      }


      //Place final waypoint
      if(map[row][col] == 99) {
        var mag = new Trigger(col*mapMultiplier,row*mapMultiplier,mapMultiplier,mapMultiplier);
        mag.setTriggerData({
          onetime:false,
          type:"magnetic",
        });
        mag.setColor(game.patterns.metal.data);
        gameObjects.push(mag);
        var trigger = new Trigger(col*mapMultiplier,row*mapMultiplier,mapMultiplier*3,mapMultiplier*2);
        trigger.setTriggerData({
          onetime:true,
          type:"waypoint",
          value:4
        });
        trigger.renderLayer = 3;
        //triggerCount++;
        gameObjects.push(trigger);
      }

    }

    gameObjects.sort(function(a, b) {
      if (a.renderLayer < b.renderLayer) {
        return -1;
      }
      if (a.renderLayer > b.renderLayer) {
        return 1;
      }
      return 0;
    });

  }

  //Set triggers
  character.setCompass(compass);
}


function update(elapsed) {
  if(game.ready) {
    camera.update(elapsed);
    compass.update(elapsed);
    hud.update(elapsed);

    for(obj in gameObjects) {
      gameObjects[obj].update(elapsed);
    }
  }
}

function render() {
  // Clear the screen
  if(game.ready) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    field.render();
    camera.render();


    for(obj in gameObjects) {
      if(gameObjects[obj] !== character && gameObjects[obj].collisionType != "enemy") {
        gameObjects[obj].render();
      }
    }

    for(obj in gameObjects) {
      if(gameObjects[obj].collisionType == "enemy") {
        gameObjects[obj].render();
      }
    }

    character.render();

    compass.render();
    hud.render();
    game.renderNoise(ctx, .25, true);

  }
}

raf.start(function(elapsed) {
  if(!game.initialized) {
    if(game.ready) {
      game.generateNoiseFrames(canvas.width, canvas.height, .25);
      start();
      game.initialized = true;
    }
  }
  update(elapsed);
  render();
});

},{"./BaseObject":2,"./CPlayer":3,"./camera":6,"./character":7,"./compass":8,"./enemy":9,"./engine13":10,"./falseWall":11,"./field":12,"./hud":13,"./input":14,"./jsfxr":15,"./narration":16,"./raf":17,"./trigger":18}],2:[function(require,module,exports){
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
},{}],3:[function(require,module,exports){
/* -*- mode: javascript; tab-width: 4; indent-tabs-mode: nil; -*-
*
* Copyright (c) 2011-2013 Marcus Geelnard
*
* This software is provided 'as-is', without any express or implied
* warranty. In no event will the authors be held liable for any damages
* arising from the use of this software.
*
* Permission is granted to anyone to use this software for any purpose,
* including commercial applications, and to alter it and redistribute it
* freely, subject to the following restrictions:
*
* 1. The origin of this software must not be misrepresented; you must not
*    claim that you wrote the original software. If you use this software
*    in a product, an acknowledgment in the product documentation would be
*    appreciated but is not required.
*
* 2. Altered source versions must be plainly marked as such, and must not be
*    misrepresented as being the original software.
*
* 3. This notice may not be removed or altered from any source
*    distribution.
*
*/

"use strict";

var CPlayer = function() {

    //--------------------------------------------------------------------------
    // Private methods
    //--------------------------------------------------------------------------

    // Oscillators
    var osc_sin = function (value) {
        return Math.sin(value * 6.283184);
    };

    var osc_saw = function (value) {
        return 2 * (value % 1) - 1;
    };

    var osc_square = function (value) {
        return (value % 1) < 0.5 ? 1 : -1;
    };

    var osc_tri = function (value) {
        var v2 = (value % 1) * 4;
        if(v2 < 2) return v2 - 1;
        return 3 - v2;
    };

    var getnotefreq = function (n) {
        // 174.61.. / 44100 = 0.003959503758 (F3)
        return 0.003959503758 * Math.pow(2, (n - 128) / 12);
    };

    var createNote = function (instr, n, rowLen) {
        var osc1 = mOscillators[instr.i[0]],
            o1vol = instr.i[1],
            o1xenv = instr.i[3],
            osc2 = mOscillators[instr.i[4]],
            o2vol = instr.i[5],
            o2xenv = instr.i[8],
            noiseVol = instr.i[9],
            attack = instr.i[10] * instr.i[10] * 4,
            sustain = instr.i[11] * instr.i[11] * 4,
            release = instr.i[12] * instr.i[12] * 4,
            releaseInv = 1 / release,
            arp = instr.i[13],
            arpInterval = rowLen * Math.pow(2, 2 - instr.i[14]);

        var noteBuf = new Int32Array(attack + sustain + release);

        // Re-trig oscillators
        var c1 = 0, c2 = 0;

        // Local variables.
        var j, j2, e, t, rsample, o1t, o2t;

        // Generate one note (attack + sustain + release)
        for (j = 0, j2 = 0; j < attack + sustain + release; j++, j2++) {
            if (j2 >= 0) {
                // Switch arpeggio note.
                arp = (arp >> 8) | ((arp & 255) << 4);
                j2 -= arpInterval;

                // Calculate note frequencies for the oscillators
                o1t = getnotefreq(n + (arp & 15) + instr.i[2] - 128);
                o2t = getnotefreq(n + (arp & 15) + instr.i[6] - 128) * (1 + 0.0008 * instr.i[7]);
            }

            // Envelope
            e = 1;
            if (j < attack) {
                e = j / attack;
            } else if (j >= attack + sustain) {
                e -= (j - attack - sustain) * releaseInv;
            }

            // Oscillator 1
            t = o1t;
            if (o1xenv) {
                t *= e * e;
            }
            c1 += t;
            rsample = osc1(c1) * o1vol;

            // Oscillator 2
            t = o2t;
            if (o2xenv) {
                t *= e * e;
            }
            c2 += t;
            rsample += osc2(c2) * o2vol;

            // Noise oscillator
            if (noiseVol) {
                rsample += (2 * Math.random() - 1) * noiseVol;
            }

            // Add to (mono) channel buffer
            noteBuf[j] = (80 * rsample * e) | 0;
        }

        return noteBuf;
    };


    //--------------------------------------------------------------------------
    // Private members
    //--------------------------------------------------------------------------

    // Array of oscillator functions
    var mOscillators = [
        osc_sin,
        osc_square,
        osc_saw,
        osc_tri
    ];

    // Private variables set up by init()
    var mSong, mLastRow, mCurrentCol, mNumWords, mMixBuf;


    //--------------------------------------------------------------------------
    // Initialization
    //--------------------------------------------------------------------------

    this.init = function (song) {
        // Define the song
        mSong = song;

        // Init iteration state variables
        mLastRow = song.endPattern - 2;
        mCurrentCol = 0;

        // Prepare song info
        mNumWords =  song.rowLen * song.patternLen * (mLastRow + 1) * 2;

        // Create work buffer (initially cleared)
        mMixBuf = new Int32Array(mNumWords);
    };


    //--------------------------------------------------------------------------
    // Public methods
    //--------------------------------------------------------------------------

    // Generate audio data for a single track
    this.generate = function () {
        // Local variables
        var i, j, b, p, row, col, n, cp,
            k, t, lfor, e, x, rsample, rowStartSample, f, da;

        // Put performance critical items in local variables
        var chnBuf = new Int32Array(mNumWords),
            instr = mSong.songData[mCurrentCol],
            rowLen = mSong.rowLen,
            patternLen = mSong.patternLen;

        // Clear effect state
        var low = 0, band = 0, high;
        var lsample, filterActive = false;

        // Clear note cache.
        var noteCache = [];

         // Patterns
         for (p = 0; p <= mLastRow; ++p) {
            cp = instr.p[p];

            // Pattern rows
            for (row = 0; row < patternLen; ++row) {
                // Execute effect command.
                var cmdNo = cp ? instr.c[cp - 1].f[row] : 0;
                if (cmdNo) {
                    instr.i[cmdNo - 1] = instr.c[cp - 1].f[row + patternLen] || 0;

                    // Clear the note cache since the instrument has changed.
                    if (cmdNo < 16) {
                        noteCache = [];
                    }
                }

                // Put performance critical instrument properties in local variables
                var oscLFO = mOscillators[instr.i[15]],
                    lfoAmt = instr.i[16] / 512,
                    lfoFreq = Math.pow(2, instr.i[17] - 9) / rowLen,
                    fxLFO = instr.i[18],
                    fxFilter = instr.i[19],
                    fxFreq = instr.i[20] * 43.23529 * 3.141592 / 44100,
                    q = 1 - instr.i[21] / 255,
                    dist = instr.i[22] * 1e-5,
                    drive = instr.i[23] / 32,
                    panAmt = instr.i[24] / 512,
                    panFreq = 6.283184 * Math.pow(2, instr.i[25] - 9) / rowLen,
                    dlyAmt = instr.i[26] / 255,
                    dly = instr.i[27] * rowLen;

                // Calculate start sample number for this row in the pattern
                rowStartSample = (p * patternLen + row) * rowLen;

                // Generate notes for this pattern row
                for (col = 0; col < 4; ++col) {
                    n = cp ? instr.c[cp - 1].n[row + col * patternLen] : 0;
                    if (n) {
                        if (!noteCache[n]) {
                            noteCache[n] = createNote(instr, n, rowLen);
                        }

                        // Copy note from the note cache
                        var noteBuf = noteCache[n];
                        for (j = 0, i = rowStartSample * 2; j < noteBuf.length; j++, i += 2) {
                          chnBuf[i] += noteBuf[j];
                        }
                    }
                }

                // Perform effects for this pattern row
                for (j = 0; j < rowLen; j++) {
                    // Dry mono-sample
                    k = (rowStartSample + j) * 2;
                    rsample = chnBuf[k];

                    // We only do effects if we have some sound input
                    if (rsample || filterActive) {
                        // State variable filter
                        f = fxFreq;
                        if (fxLFO) {
                            f *= oscLFO(lfoFreq * k) * lfoAmt + 0.5;
                        }
                        f = 1.5 * Math.sin(f);
                        low += f * band;
                        high = q * (rsample - band) - low;
                        band += f * high;
                        rsample = fxFilter == 3 ? band : fxFilter == 1 ? high : low;

                        // Distortion
                        if (dist) {
                            rsample *= dist;
                            rsample = rsample < 1 ? rsample > -1 ? osc_sin(rsample*.25) : -1 : 1;
                            rsample /= dist;
                        }

                        // Drive
                        rsample *= drive;

                        // Is the filter active (i.e. still audiable)?
                        filterActive = rsample * rsample > 1e-5;

                        // Panning
                        t = Math.sin(panFreq * k) * panAmt + 0.5;
                        lsample = rsample * (1 - t);
                        rsample *= t;
                    } else {
                        lsample = 0;
                    }

                    // Delay is always done, since it does not need sound input
                    if (k >= dly) {
                        // Left channel = left + right[-p] * t
                        lsample += chnBuf[k-dly+1] * dlyAmt;

                        // Right channel = right + left[-p] * t
                        rsample += chnBuf[k-dly] * dlyAmt;
                    }

                    // Store in stereo channel buffer (needed for the delay effect)
                    chnBuf[k] = lsample | 0;
                    chnBuf[k+1] = rsample | 0;

                    // ...and add to stereo mix buffer
                    mMixBuf[k] += lsample | 0;
                    mMixBuf[k+1] += rsample | 0;
                }
            }
        }

        // Next iteration. Return progress (1.0 == done!).
        mCurrentCol++;
        return mCurrentCol / 8;
    };

    // Create a WAVE formatted Uint8Array from the generated audio data
    this.createWave = function() {
        // Create WAVE header
        var headerLen = 44;
        var l1 = headerLen + mNumWords * 2 - 8;
        var l2 = l1 - 36;
        var wave = new Uint8Array(headerLen + mNumWords * 2);
        wave.set(
            [82,73,70,70,
             l1 & 255,(l1 >> 8) & 255,(l1 >> 16) & 255,(l1 >> 24) & 255,
             87,65,86,69,102,109,116,32,16,0,0,0,1,0,2,0,
             68,172,0,0,16,177,2,0,4,0,16,0,100,97,116,97,
             l2 & 255,(l2 >> 8) & 255,(l2 >> 16) & 255,(l2 >> 24) & 255]
        );

        // Append actual wave data
        for (var i = 0, idx = headerLen; i < mNumWords; ++i) {
            // Note: We clamp here
            var y = mMixBuf[i];
            y = y < -32767 ? -32767 : (y > 32767 ? 32767 : y);
            wave[idx++] = y & 255;
            wave[idx++] = (y >> 8) & 255;
        }

        // Return the WAVE formatted typed array
        return wave;
    };

    // Get n samples of wave data at time t [s]. Wave data in range [-2,2].
    this.getData = function(t, n) {
        var i = 2 * Math.floor(t * 44100);
        var d = new Array(n);
        for (var j = 0; j < 2*n; j += 1) {
            var k = i + j;
            d[j] = t > 0 && k < mMixBuf.length ? mMixBuf[k] / 32768 : 0;
        }
        return d;
    };
};


module.exports = CPlayer;
},{}],4:[function(require,module,exports){
module.exports=require(2)
},{"/Users/alex/Documents/Projects/Fun/js13k-2017/src/BaseObject.js":2}],5:[function(require,module,exports){
var BaseObject = require('./BaseObject');

class Bullet extends BaseObject {

	constructor() {
		super();
		this.x = 0;
		this.y = 0;
		this.xVel = 0;
		this.yVel = 0;
		this.width = 5;
		this.height = 5;
		this.color = '#ffffff';
		this.speed = 400;
		this.collisionType = "bullet";
		this.bulletType = "";
	}

	setPosition(x,y) {
		this.x = x;
		this.y = y;
	}

	setVelocity(xVel,yVel) {
		this.xVel = xVel;
		this.yVel = yVel;
	}

	update(elapsed) {
		this.x += this.xVel*elapsed;
		this.y += this.yVel*elapsed;

		if(!engine.isOnScreen(this)) {
			this.kill();
		}
	}

	render() {
		ctx.beginPath();
	    ctx.rect(this.x-camera.x, this.y-camera.y, this.width, this.height);
	    ctx.closePath();
	    ctx.fillStyle = this.color;
	    ctx.fill();
	}

	kill() {
		var i = gameObjects.indexOf(this);
    	gameObjects.splice(i, 1);
	}
}

module.exports = Bullet;
},{"./BaseObject":2}],6:[function(require,module,exports){
class Camera {

	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = 800;
		this.height = 450;
		this.pocket = {
			x:275,
			y:100,
			width:250,
			height:250,
			color:'#cccccc'
		}
	};

	setTarget(target) {
		this.target = target;
	}

	setField(field) {
		this.field = field;
	}

	update(elapsed) {

		//Keep target in camera pocket if possible
		if(this.target.x + this.target.width > this.x+this.pocket.x+this.pocket.width) { //East
			this.x = this.target.x + this.target.width - this.pocket.x - this.pocket.width;
		}
		if(this.target.x < this.x + this.pocket.x) { //West
			this.x = this.target.x - this.pocket.x;
		}
		if(this.target.y < this.y + this.pocket.y) { //North
			this.y = this.target.y - this.pocket.y;
		}
		if(this.target.y + this.target.height > this.y + this.pocket.y + this.pocket.height) { //South
			this.y = this.target.y + this.target.height - this.pocket.y - this.pocket.height;
		}

		//Don't let the camera go outside of the field
		if(this.x < this.field.x) { //West
			this.x = this.field.x;
		}

		if(this.x + this.width > this.field.x + this.field.width) { //East
			this.x = this.field.x+this.field.width - this.width;
		}

		if(this.y < this.field.y) { //North
			this.y = this.field.y;
		}

		if(this.y + this.height > this.field.y + this.field.height) { //South
			this.y = this.field.y+this.field.height - this.height;
		}

	}

	render() {
		// ctx.beginPath();
	 //    ctx.rect(this.pocket.x, this.pocket.y, this.pocket.width, this.pocket.height);
	 //    ctx.closePath();
	 //    ctx.fillStyle = this.pocket.color;
	 //    ctx.fill();
	}
}

module.exports = Camera;
},{}],7:[function(require,module,exports){
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
},{"./baseObject":4,"./bullet":5}],8:[function(require,module,exports){
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
},{}],9:[function(require,module,exports){
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
},{"./baseObject":4,"./bullet":5}],10:[function(require,module,exports){
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
},{"./falseWall":11,"./trigger":18}],11:[function(require,module,exports){
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
},{"./BaseObject":2}],12:[function(require,module,exports){
class Field {

	constructor(width, height) {
		this.x = 0;
		this.y = 0;
		this.width = width;
		this.height = height;
		this.color = '#333333';
	}


	render() {
		ctx.beginPath();
	    ctx.rect(this.x-camera.x, this.y-camera.y, this.width, this.height);
	    ctx.closePath();
	    ctx.fillStyle = this.color;
	    ctx.fill();
	}
}

module.exports = Field;
},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrParams() {
  //--------------------------------------------------------------------------
  //
  //  Settings String Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Parses a settings array into the parameters
   * @param array Array of the settings values, where elements 0 - 23 are
   *                a: waveType
   *                b: attackTime
   *                c: sustainTime
   *                d: sustainPunch
   *                e: decayTime
   *                f: startFrequency
   *                g: minFrequency
   *                h: slide
   *                i: deltaSlide
   *                j: vibratoDepth
   *                k: vibratoSpeed
   *                l: changeAmount
   *                m: changeSpeed
   *                n: squareDuty
   *                o: dutySweep
   *                p: repeatSpeed
   *                q: phaserOffset
   *                r: phaserSweep
   *                s: lpFilterCutoff
   *                t: lpFilterCutoffSweep
   *                u: lpFilterResonance
   *                v: hpFilterCutoff
   *                w: hpFilterCutoffSweep
   *                x: masterVolume
   * @return If the string successfully parsed
   */
  this.setSettings = function(values)
  {
    for ( var i = 0; i < 24; i++ )
    {
      this[String.fromCharCode( 97 + i )] = values[i] || 0;
    }

    // I moved this here from the reset(true) function
    if (this['c'] < .01) {
      this['c'] = .01;
    }

    var totalTime = this['b'] + this['c'] + this['e'];
    if (totalTime < .18) {
      var multiplier = .18 / totalTime;
      this['b']  *= multiplier;
      this['c'] *= multiplier;
      this['e']   *= multiplier;
    }
  }
}

/**
 * SfxrSynth
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
function SfxrSynth() {
  // All variables are kept alive through function closures

  //--------------------------------------------------------------------------
  //
  //  Sound Parameters
  //
  //--------------------------------------------------------------------------

  this._params = new SfxrParams();  // Params instance

  //--------------------------------------------------------------------------
  //
  //  Synth Variables
  //
  //--------------------------------------------------------------------------

  var _envelopeLength0, // Length of the attack stage
      _envelopeLength1, // Length of the sustain stage
      _envelopeLength2, // Length of the decay stage

      _period,          // Period of the wave
      _maxPeriod,       // Maximum period before sound stops (from minFrequency)

      _slide,           // Note slide
      _deltaSlide,      // Change in slide

      _changeAmount,    // Amount to change the note by
      _changeTime,      // Counter for the note change
      _changeLimit,     // Once the time reaches this limit, the note changes

      _squareDuty,      // Offset of center switching point in the square wave
      _dutySweep;       // Amount to change the duty by

  //--------------------------------------------------------------------------
  //
  //  Synth Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Resets the runing variables from the params
   * Used once at the start (total reset) and for the repeat effect (partial reset)
   */
  this.reset = function() {
    // Shorter reference
    var p = this._params;

    _period       = 100 / (p['f'] * p['f'] + .001);
    _maxPeriod    = 100 / (p['g']   * p['g']   + .001);

    _slide        = 1 - p['h'] * p['h'] * p['h'] * .01;
    _deltaSlide   = -p['i'] * p['i'] * p['i'] * .000001;

    if (!p['a']) {
      _squareDuty = .5 - p['n'] / 2;
      _dutySweep  = -p['o'] * .00005;
    }

    _changeAmount =  1 + p['l'] * p['l'] * (p['l'] > 0 ? -.9 : 10);
    _changeTime   = 0;
    _changeLimit  = p['m'] == 1 ? 0 : (1 - p['m']) * (1 - p['m']) * 20000 + 32;
  }

  // I split the reset() function into two functions for better readability
  this.totalReset = function() {
    this.reset();

    // Shorter reference
    var p = this._params;

    // Calculating the length is all that remained here, everything else moved somewhere
    _envelopeLength0 = p['b']  * p['b']  * 100000;
    _envelopeLength1 = p['c'] * p['c'] * 100000;
    _envelopeLength2 = p['e']   * p['e']   * 100000 + 12;
    // Full length of the volume envelop (and therefore sound)
    // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
    return ((_envelopeLength0 + _envelopeLength1 + _envelopeLength2) / 3 | 0) * 3;
  }

  /**
   * Writes the wave to the supplied buffer ByteArray
   * @param buffer A ByteArray to write the wave to
   * @return If the wave is finished
   */
  this.synthWave = function(buffer, length) {
    // Shorter reference
    var p = this._params;

    // If the filters are active
    var _filters = p['s'] != 1 || p['v'],
        // Cutoff multiplier which adjusts the amount the wave position can move
        _hpFilterCutoff = p['v'] * p['v'] * .1,
        // Speed of the high-pass cutoff multiplier
        _hpFilterDeltaCutoff = 1 + p['w'] * .0003,
        // Cutoff multiplier which adjusts the amount the wave position can move
        _lpFilterCutoff = p['s'] * p['s'] * p['s'] * .1,
        // Speed of the low-pass cutoff multiplier
        _lpFilterDeltaCutoff = 1 + p['t'] * .0001,
        // If the low pass filter is active
        _lpFilterOn = p['s'] != 1,
        // masterVolume * masterVolume (for quick calculations)
        _masterVolume = p['x'] * p['x'],
        // Minimum frequency before stopping
        _minFreqency = p['g'],
        // If the phaser is active
        _phaser = p['q'] || p['r'],
        // Change in phase offset
        _phaserDeltaOffset = p['r'] * p['r'] * p['r'] * .2,
        // Phase offset for phaser effect
        _phaserOffset = p['q'] * p['q'] * (p['q'] < 0 ? -1020 : 1020),
        // Once the time reaches this limit, some of the    iables are reset
        _repeatLimit = p['p'] ? ((1 - p['p']) * (1 - p['p']) * 20000 | 0) + 32 : 0,
        // The punch factor (louder at begining of sustain)
        _sustainPunch = p['d'],
        // Amount to change the period of the wave by at the peak of the vibrato wave
        _vibratoAmplitude = p['j'] / 2,
        // Speed at which the vibrato phase moves
        _vibratoSpeed = p['k'] * p['k'] * .01,
        // The type of wave to generate
        _waveType = p['a'];

    var _envelopeLength      = _envelopeLength0,     // Length of the current envelope stage
        _envelopeOverLength0 = 1 / _envelopeLength0, // (for quick calculations)
        _envelopeOverLength1 = 1 / _envelopeLength1, // (for quick calculations)
        _envelopeOverLength2 = 1 / _envelopeLength2; // (for quick calculations)

    // Damping muliplier which restricts how fast the wave position can move
    var _lpFilterDamping = 5 / (1 + p['u'] * p['u'] * 20) * (.01 + _lpFilterCutoff);
    if (_lpFilterDamping > .8) {
      _lpFilterDamping = .8;
    }
    _lpFilterDamping = 1 - _lpFilterDamping;

    var _finished = false,     // If the sound has finished
        _envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
        _envelopeTime     = 0, // Current time through current enelope stage
        _envelopeVolume   = 0, // Current volume of the envelope
        _hpFilterPos      = 0, // Adjusted wave position after high-pass filter
        _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
        _lpFilterOldPos,       // Previous low-pass wave position
        _lpFilterPos      = 0, // Adjusted wave position after low-pass filter
        _periodTemp,           // Period modified by vibrato
        _phase            = 0, // Phase through the wave
        _phaserInt,            // Integer phaser offset, for bit maths
        _phaserPos        = 0, // Position through the phaser buffer
        _pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
        _repeatTime       = 0, // Counter for the repeats
        _sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
        _superSample,          // Actual sample writen to the wave
        _vibratoPhase     = 0; // Phase through the vibrato sine wave

    // Buffer of wave values used to create the out of phase second wave
    var _phaserBuffer = new Array(1024),
        // Buffer of random values used to generate noise
        _noiseBuffer  = new Array(32);
    for (var i = _phaserBuffer.length; i--; ) {
      _phaserBuffer[i] = 0;
    }
    for (var i = _noiseBuffer.length; i--; ) {
      _noiseBuffer[i] = Math.random() * 2 - 1;
    }

    for (var i = 0; i < length; i++) {
      if (_finished) {
        return i;
      }

      // Repeats every _repeatLimit times, partially resetting the sound parameters
      if (_repeatLimit) {
        if (++_repeatTime >= _repeatLimit) {
          _repeatTime = 0;
          this.reset();
        }
      }

      // If _changeLimit is reached, shifts the pitch
      if (_changeLimit) {
        if (++_changeTime >= _changeLimit) {
          _changeLimit = 0;
          _period *= _changeAmount;
        }
      }

      // Acccelerate and apply slide
      _slide += _deltaSlide;
      _period *= _slide;

      // Checks for frequency getting too low, and stops the sound if a minFrequency was set
      if (_period > _maxPeriod) {
        _period = _maxPeriod;
        if (_minFreqency > 0) {
          _finished = true;
        }
      }

      _periodTemp = _period;

      // Applies the vibrato effect
      if (_vibratoAmplitude > 0) {
        _vibratoPhase += _vibratoSpeed;
        _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
      }

      _periodTemp |= 0;
      if (_periodTemp < 8) {
        _periodTemp = 8;
      }

      // Sweeps the square duty
      if (!_waveType) {
        _squareDuty += _dutySweep;
        if (_squareDuty < 0) {
          _squareDuty = 0;
        } else if (_squareDuty > .5) {
          _squareDuty = .5;
        }
      }

      // Moves through the different stages of the volume envelope
      if (++_envelopeTime > _envelopeLength) {
        _envelopeTime = 0;

        switch (++_envelopeStage)  {
          case 1:
            _envelopeLength = _envelopeLength1;
            break;
          case 2:
            _envelopeLength = _envelopeLength2;
        }
      }

      // Sets the volume based on the position in the envelope
      switch (_envelopeStage) {
        case 0:
          _envelopeVolume = _envelopeTime * _envelopeOverLength0;
          break;
        case 1:
          _envelopeVolume = 1 + (1 - _envelopeTime * _envelopeOverLength1) * 2 * _sustainPunch;
          break;
        case 2:
          _envelopeVolume = 1 - _envelopeTime * _envelopeOverLength2;
          break;
        case 3:
          _envelopeVolume = 0;
          _finished = true;
      }

      // Moves the phaser offset
      if (_phaser) {
        _phaserOffset += _phaserDeltaOffset;
        _phaserInt = _phaserOffset | 0;
        if (_phaserInt < 0) {
          _phaserInt = -_phaserInt;
        } else if (_phaserInt > 1023) {
          _phaserInt = 1023;
        }
      }

      // Moves the high-pass filter cutoff
      if (_filters && _hpFilterDeltaCutoff) {
        _hpFilterCutoff *= _hpFilterDeltaCutoff;
        if (_hpFilterCutoff < .00001) {
          _hpFilterCutoff = .00001;
        } else if (_hpFilterCutoff > .1) {
          _hpFilterCutoff = .1;
        }
      }

      _superSample = 0;
      for (var j = 8; j--; ) {
        // Cycles through the period
        _phase++;
        if (_phase >= _periodTemp) {
          _phase %= _periodTemp;

          // Generates new random noise for this period
          if (_waveType == 3) {
            for (var n = _noiseBuffer.length; n--; ) {
              _noiseBuffer[n] = Math.random() * 2 - 1;
            }
          }
        }

        // Gets the sample from the oscillator
        switch (_waveType) {
          case 0: // Square wave
            _sample = ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5;
            break;
          case 1: // Saw wave
            _sample = 1 - _phase / _periodTemp * 2;
            break;
          case 2: // Sine wave (fast and accurate approx)
            _pos = _phase / _periodTemp;
            _pos = (_pos > .5 ? _pos - 1 : _pos) * 6.28318531;
            _sample = 1.27323954 * _pos + .405284735 * _pos * _pos * (_pos < 0 ? 1 : -1);
            _sample = .225 * ((_sample < 0 ? -1 : 1) * _sample * _sample  - _sample) + _sample;
            break;
          case 3: // Noise
            _sample = _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)];
        }

        // Applies the low and high pass filters
        if (_filters) {
          _lpFilterOldPos = _lpFilterPos;
          _lpFilterCutoff *= _lpFilterDeltaCutoff;
          if (_lpFilterCutoff < 0) {
            _lpFilterCutoff = 0;
          } else if (_lpFilterCutoff > .1) {
            _lpFilterCutoff = .1;
          }

          if (_lpFilterOn) {
            _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
            _lpFilterDeltaPos *= _lpFilterDamping;
          } else {
            _lpFilterPos = _sample;
            _lpFilterDeltaPos = 0;
          }

          _lpFilterPos += _lpFilterDeltaPos;

          _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
          _hpFilterPos *= 1 - _hpFilterCutoff;
          _sample = _hpFilterPos;
        }

        // Applies the phaser effect
        if (_phaser) {
          _phaserBuffer[_phaserPos % 1024] = _sample;
          _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
          _phaserPos++;
        }

        _superSample += _sample;
      }

      // Averages out the super samples and applies volumes
      _superSample *= .125 * _envelopeVolume * _masterVolume;

      // Clipping if too loud
      buffer[i] = _superSample >= 1 ? 32767 : _superSample <= -1 ? -32768 : _superSample * 32767 | 0;
    }

    return length;
  }
}

// Adapted from http://codebase.es/riffwave/
var synth = new SfxrSynth();
// Export for the Closure Compiler
var JSFXR = function(settings) {
  // Initialize SfxrParams
  synth._params.setSettings(settings);
  // Synthesize Wave
  var envelopeFullLength = synth.totalReset();
  var data = new Uint8Array(((envelopeFullLength + 1) / 2 | 0) * 4 + 44);
  var used = synth.synthWave(new Uint16Array(data.buffer, 44), envelopeFullLength) * 2;
  var dv = new Uint32Array(data.buffer, 0, 44);
  // Initialize header
  dv[0] = 0x46464952; // "RIFF"
  dv[1] = used + 36;  // put total size here
  dv[2] = 0x45564157; // "WAVE"
  dv[3] = 0x20746D66; // "fmt "
  dv[4] = 0x00000010; // size of the following
  dv[5] = 0x00010001; // Mono: 1 channel, PCM format
  dv[6] = 0x0000AC44; // 44,100 samples per second
  dv[7] = 0x00015888; // byte rate: two bytes per sample
  dv[8] = 0x00100002; // 16 bits per sample, aligned on every two bytes
  dv[9] = 0x61746164; // "data"
  dv[10] = used;      // put number of samples here

  // Base64 encoding written by me, @maettig
  used += 44;
  var i = 0,
      base64Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      output = 'data:audio/wav;base64,';
  for (; i < used; i += 3)
  {
    var a = data[i] << 16 | data[i + 1] << 8 | data[i + 2];
    output += base64Characters[a >> 18] + base64Characters[a >> 12 & 63] + base64Characters[a >> 6 & 63] + base64Characters[a & 63];
  }
  return output;
}

module.exports = JSFXR;
},{}],16:[function(require,module,exports){
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
},{}],17:[function(require,module,exports){
// Holds last iteration timestamp.
var time = 0;

/**
 * Calls `fn` on next frame.
 *
 * @param  {Function} fn The function
 * @return {int} The request ID
 * @api private
 */
function raf(fn) {
  return window.requestAnimationFrame(function() {
    var now = Date.now();
    var elapsed = now - time;

    if (elapsed > 999) {
      elapsed = 1 / 60;
    } else {
      elapsed /= 1000;
    }

    time = now;
    fn(elapsed);
  });
}

module.exports = {
  /**
   * Calls `fn` on every frame with `elapsed` set to the elapsed
   * time in milliseconds.
   *
   * @param  {Function} fn The function
   * @return {int} The request ID
   * @api public
   */
  start: function(fn) {
    return raf(function tick(elapsed) {
      fn(elapsed);
      raf(tick);
    });
  },
  /**
   * Cancels the specified animation frame request.
   *
   * @param {int} id The request ID
   * @api public
   */
  stop: function(id) {
    window.cancelAnimationFrame(id);
  }
};

},{}],18:[function(require,module,exports){
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
},{"./BaseObject":2}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIuL3NyYy9tYWluIiwiL1VzZXJzL2FsZXgvRG9jdW1lbnRzL1Byb2plY3RzL0Z1bi9qczEzay0yMDE3L3NyYy9CYXNlT2JqZWN0LmpzIiwiL1VzZXJzL2FsZXgvRG9jdW1lbnRzL1Byb2plY3RzL0Z1bi9qczEzay0yMDE3L3NyYy9DUGxheWVyLmpzIiwiL1VzZXJzL2FsZXgvRG9jdW1lbnRzL1Byb2plY3RzL0Z1bi9qczEzay0yMDE3L3NyYy9idWxsZXQuanMiLCIvVXNlcnMvYWxleC9Eb2N1bWVudHMvUHJvamVjdHMvRnVuL2pzMTNrLTIwMTcvc3JjL2NhbWVyYS5qcyIsIi9Vc2Vycy9hbGV4L0RvY3VtZW50cy9Qcm9qZWN0cy9GdW4vanMxM2stMjAxNy9zcmMvY2hhcmFjdGVyLmpzIiwiL1VzZXJzL2FsZXgvRG9jdW1lbnRzL1Byb2plY3RzL0Z1bi9qczEzay0yMDE3L3NyYy9jb21wYXNzLmpzIiwiL1VzZXJzL2FsZXgvRG9jdW1lbnRzL1Byb2plY3RzL0Z1bi9qczEzay0yMDE3L3NyYy9lbmVteS5qcyIsIi9Vc2Vycy9hbGV4L0RvY3VtZW50cy9Qcm9qZWN0cy9GdW4vanMxM2stMjAxNy9zcmMvZW5naW5lMTMuanMiLCIvVXNlcnMvYWxleC9Eb2N1bWVudHMvUHJvamVjdHMvRnVuL2pzMTNrLTIwMTcvc3JjL2ZhbHNlV2FsbC5qcyIsIi9Vc2Vycy9hbGV4L0RvY3VtZW50cy9Qcm9qZWN0cy9GdW4vanMxM2stMjAxNy9zcmMvZmllbGQuanMiLCIvVXNlcnMvYWxleC9Eb2N1bWVudHMvUHJvamVjdHMvRnVuL2pzMTNrLTIwMTcvc3JjL2h1ZC5qcyIsIi9Vc2Vycy9hbGV4L0RvY3VtZW50cy9Qcm9qZWN0cy9GdW4vanMxM2stMjAxNy9zcmMvaW5wdXQuanMiLCIvVXNlcnMvYWxleC9Eb2N1bWVudHMvUHJvamVjdHMvRnVuL2pzMTNrLTIwMTcvc3JjL2pzZnhyLmpzIiwiL1VzZXJzL2FsZXgvRG9jdW1lbnRzL1Byb2plY3RzL0Z1bi9qczEzay0yMDE3L3NyYy9uYXJyYXRpb24uanMiLCIvVXNlcnMvYWxleC9Eb2N1bWVudHMvUHJvamVjdHMvRnVuL2pzMTNrLTIwMTcvc3JjL3JhZi5qcyIsIi9Vc2Vycy9hbGV4L0RvY3VtZW50cy9Qcm9qZWN0cy9GdW4vanMxM2stMjAxNy9zcmMvdHJpZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5cUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3pWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5TUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbmVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciByYWYgPSByZXF1aXJlKCcuL3JhZicpO1xuXG52YXIgRW5naW5lMTMgPSByZXF1aXJlKCcuL2VuZ2luZTEzJyk7XG52YXIgQmFzZU9iamVjdCA9IHJlcXVpcmUoJy4vQmFzZU9iamVjdCcpO1xudmFyIENoYXJhY3RlciA9IHJlcXVpcmUoJy4vY2hhcmFjdGVyJyk7XG52YXIgRW5lbXkgPSByZXF1aXJlKCcuL2VuZW15Jyk7XG52YXIgSW5wdXQgPSByZXF1aXJlKCcuL2lucHV0Jyk7XG52YXIgQ2FtZXJhID0gcmVxdWlyZSgnLi9jYW1lcmEnKTtcbnZhciBGaWVsZCA9IHJlcXVpcmUoJy4vZmllbGQnKTtcbnZhciBDb21wYXNzID0gcmVxdWlyZSgnLi9jb21wYXNzJyk7XG52YXIgVHJpZ2dlciA9IHJlcXVpcmUoJy4vdHJpZ2dlcicpO1xudmFyIEh1ZCA9IHJlcXVpcmUoJy4vaHVkJyk7XG52YXIgRmFsc2VXYWxsID0gcmVxdWlyZSgnLi9mYWxzZVdhbGwnKTtcbnZhciBOYXJyYXRpb24gPSByZXF1aXJlKCcuL25hcnJhdGlvbicpO1xudmFyIENQbGF5ZXIgPSByZXF1aXJlKCcuL0NQbGF5ZXInKTtcbnZhciBKU0ZYUiA9IHJlcXVpcmUoJy4vanNmeHInKTtcblxudmFyIGNhbnZhcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNnYW1lJyk7XG52YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cbnZhciBpbnB1dCA9IG5ldyBJbnB1dCgpO1xudmFyIGNhbWVyYSA9IG5ldyBDYW1lcmEoKTtcbnZhciBjb21wYXNzID0gbmV3IENvbXBhc3MoKTtcbnZhciBnYW1lID0gbmV3IEVuZ2luZTEzKGN0eCk7XG52YXIgbmFycmF0aW9uID0gbmV3IE5hcnJhdGlvbihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjbmFycmF0aW9uX2hvbGRlcicpKTtcbnZhciBodWQgPSBuZXcgSHVkKGNhbnZhcy53aWR0aCxjYW52YXMuaGVpZ2h0KTtcblxudmFyIG1hcE11bHRpcGxpZXIgPSAyMDA7XG52YXIgdHJpZ2dlckNvdW50ID0gMDtcbnZhciB3YWtldXBCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjd2FrZXVwX2J1dHRvbicpO1xuXG53aW5kb3cuZW5naW5lID0gRW5naW5lMTM7XG53aW5kb3cuZ2FtZSA9IGdhbWU7XG53aW5kb3cuY2FtZXJhID0gY2FtZXJhO1xud2luZG93LmlucHV0ID0gaW5wdXQ7XG53aW5kb3cuY3R4ID0gY3R4O1xud2luZG93LmdhbWVPYmplY3RzID0gW107XG5nYW1lLmdhbWVPYmplY3RzID0gZ2FtZU9iamVjdHM7XG5nYW1lLnRvdGFsV2F5cG9pbnRzID0gNTtcbmdhbWUubmFycmF0aW9uID0gbmFycmF0aW9uO1xuZ2FtZS5odWQgPSBodWQ7XG5nYW1lLnNvdW5kcyA9IHt9O1xuXG5cblxuXG52YXIgbWFwID0gW1xuICBbIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAgXSxcbiAgWyAwLCAwLDEzLCA0LCA0LCAwLCAwLCAxLCAxLCAwLCAwLCAwLCA0LDEwLCA0LCAwLCAwLCAwIF0sXG4gIFsgMCwgMCwgNCwgNCwgNCwyMywgMSwgMSwgMSwgMSwgNCwgNCwgNCwgNCwgNCwgMSwgMSwgMCBdLFxuICBbIDAsIDAsIDQsIDQsMjAsMjAsIDEsIDEsIDEsIDEsIDEsIDEsIDQsIDQsIDQsIDAsIDEsIDAgXSxcbiAgWyAwLCAwLCA0LCA0LDIwLCAxLCAxLDQyLDUyLDQyLDEgLDEgLCA0LDIwICwwICwwLCAxLCAwIF0sXG4gIFsgMCwgMCwgMSwgNCwyMywgMSwgMSw0Miw0Miw0Miw0MiwgMSwgMSwyMCwzMiwzMiwzMiwgMCBdLFxuICBbIDAsIDAsMjAsMjAsMjAsIDEsIDEsIDEsIDEsIDEsIDEsIDEsIDEsMjIsIDEsIDEsIDAsIDAgXSxcbiAgWyAwLCAwLCA0LDIwLDIwLCAxLCAzLCAxLCAxLCAxLCAxLCAxLCAxLDIyLCAxLCAxLCAxLCAwIF0sXG4gIFsgMCw5OSwgNCwgNCwyMCwyMCwyNCwyMCwyMCwyMCwyMCwyMCwyMCwyMCwgNCwgNCwgMSwgMCBdLFxuICBbIDAsIDQsIDQsIDQsIDQsIDAsIDEsIDAsIDEsIDEsIDEsMTEsIDQsIDQsIDQsIDQsIDEsIDAgXSxcbiAgWyAwLCA0LCA0LCA0LCAwLCAwLCAxLCAwLCAwLCAwLCAwLCA0LCA0LCA0ICw0ICwwICwwICwwIF0sXG4gIFsgMCwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMSwgMCwgMCwgNCwgNCwgNCwgNCwgMCwgMCwgMCBdLFxuICBbIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAsIDAgXSxcbl07XG5cbnZhciBlbmVteUxvY2F0aW9ucyA9IFtcbiAgWzguNSw2LjVdLFxuICBbMy41LDIuNV0sXG4gIFs0LjUsMTEuNV0sXG4gIFs4LjUsMi41XSxcbiAgWzE1LjUsNy41XSxcbiAgWzE1LjUsMi41XSxcbiAgWzguNSw5LjVdXG5dXG5cbi8vU2hvb3Qgc291bmRcbnZhciBzb3VuZFNob290ID0gSlNGWFIoWzMsLDAuMDU3OCwsMC4xMjIxLDAuMTUsLC0wLjQzNzIsLCwsLCwsLCwsLDEsLCwsLDAuNV0pO1xudmFyIHNvdW5kSGl0ID0gSlNGWFIoWzMsLDAuMDEsLDAuMjcwNCwwLjQ2OTksLC0wLjY3MjIsLCwsLCwsLCwsLDEsLCwwLjI5MzEsLDAuNV0pO1xudmFyIHNvdW5kTWFnbmV0ID0gSlNGWFIoWzAsMC4wNDIyLDAuMTQ2NSwwLjEzNDIsMC45OTM3LDAuMjkzMiwwLjA5MzgsMC4wMjEzLDAuMDcyNywwLjc5NTUsMC4yNDI3LC0wLjY1MjUsMC4wMDMzLDAuMTAyLDAuMDI1NiwwLjYyMDcsMC4wNTQ3LDAuMDIzMSwwLjExOTEsLTAuMDEyMywwLjAyNjgsMC4wNDkyLC0wLjM3OTEsMC4yMl0pO1xuZ2FtZS5zb3VuZHMuc2hvb3QgPSBuZXcgQXVkaW8oKTtcbmdhbWUuc291bmRzLmhpdCA9IG5ldyBBdWRpbygpO1xuZ2FtZS5zb3VuZHMubWFnbmV0ID0gbmV3IEF1ZGlvKCk7XG5nYW1lLnNvdW5kcy5tYWduZXQubG9vcCA9IHRydWU7XG5nYW1lLnNvdW5kcy5zaG9vdC5zcmMgPSBzb3VuZFNob290O1xuZ2FtZS5zb3VuZHMuaGl0LnNyYyA9IHNvdW5kSGl0O1xuZ2FtZS5zb3VuZHMubWFnbmV0LnNyYyA9IHNvdW5kTWFnbmV0O1xuXG4vLyBTb25nIGRhdGFcbiAgICB2YXIgc29uZyA9IHtcbiAgICAgIHNvbmdEYXRhOiBbXG4gICAgICAgIHsgLy8gSW5zdHJ1bWVudCAwXG4gICAgICAgICAgaTogW1xuICAgICAgICAgIDIsIC8vIE9TQzFfV0FWRUZPUk1cbiAgICAgICAgICA2MCwgLy8gT1NDMV9WT0xcbiAgICAgICAgICAxMjgsIC8vIE9TQzFfU0VNSVxuICAgICAgICAgIDAsIC8vIE9TQzFfWEVOVlxuICAgICAgICAgIDMsIC8vIE9TQzJfV0FWRUZPUk1cbiAgICAgICAgICAxMDgsIC8vIE9TQzJfVk9MXG4gICAgICAgICAgMTI4LCAvLyBPU0MyX1NFTUlcbiAgICAgICAgICA1LCAvLyBPU0MyX0RFVFVORVxuICAgICAgICAgIDAsIC8vIE9TQzJfWEVOVlxuICAgICAgICAgIDAsIC8vIE5PSVNFX1ZPTFxuICAgICAgICAgIDUsIC8vIEVOVl9BVFRBQ0tcbiAgICAgICAgICA2LCAvLyBFTlZfU1VTVEFJTlxuICAgICAgICAgIDQ5LCAvLyBFTlZfUkVMRUFTRVxuICAgICAgICAgIDAsIC8vIEFSUF9DSE9SRFxuICAgICAgICAgIDAsIC8vIEFSUF9TUEVFRFxuICAgICAgICAgIDAsIC8vIExGT19XQVZFRk9STVxuICAgICAgICAgIDE5NSwgLy8gTEZPX0FNVFxuICAgICAgICAgIDYsIC8vIExGT19GUkVRXG4gICAgICAgICAgMSwgLy8gTEZPX0ZYX0ZSRVFcbiAgICAgICAgICAyLCAvLyBGWF9GSUxURVJcbiAgICAgICAgICAyOSwgLy8gRlhfRlJFUVxuICAgICAgICAgIDAsIC8vIEZYX1JFU09OQU5DRVxuICAgICAgICAgIDAsIC8vIEZYX0RJU1RcbiAgICAgICAgICAzMiwgLy8gRlhfRFJJVkVcbiAgICAgICAgICAxNzgsIC8vIEZYX1BBTl9BTVRcbiAgICAgICAgICAxMywgLy8gRlhfUEFOX0ZSRVFcbiAgICAgICAgICAxMjEsIC8vIEZYX0RFTEFZX0FNVFxuICAgICAgICAgIDQgLy8gRlhfREVMQVlfVElNRVxuICAgICAgICAgIF0sXG4gICAgICAgICAgLy8gUGF0dGVybnNcbiAgICAgICAgICBwOiBbMSwxLDIsMiwxLDEsMiwyLDEsMSwyLDJdLFxuICAgICAgICAgIC8vIENvbHVtbnNcbiAgICAgICAgICBjOiBbXG4gICAgICAgICAgICB7bjogWzEyNywsMTI3LCwxMjcsLDEyNywsMTMwLCwxMzAsLDEzMCwsMTMwLCwxMjcsLDEyNywsMTI3LCwxMjcsLDEzMCwsMTMwLCwxMzAsLDEzMF0sXG4gICAgICAgICAgICAgZjogW119LFxuICAgICAgICAgICAge246IFsxMjksLDEyOSwsMTI5LCwxMjksLDEzMiwsMTMyLCwxMzIsLDEzMiwsMTI5LCwxMjksLDEyOSwsMTI5LCwxMzIsLDEzMiwsMTMyLCwxMzJdLFxuICAgICAgICAgICAgIGY6IFtdfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgeyAvLyBJbnN0cnVtZW50IDFcbiAgICAgICAgICBpOiBbXG4gICAgICAgICAgMCwgLy8gT1NDMV9XQVZFRk9STVxuICAgICAgICAgIDI1NSwgLy8gT1NDMV9WT0xcbiAgICAgICAgICAxMTYsIC8vIE9TQzFfU0VNSVxuICAgICAgICAgIDEsIC8vIE9TQzFfWEVOVlxuICAgICAgICAgIDAsIC8vIE9TQzJfV0FWRUZPUk1cbiAgICAgICAgICAyNTUsIC8vIE9TQzJfVk9MXG4gICAgICAgICAgMTE2LCAvLyBPU0MyX1NFTUlcbiAgICAgICAgICAwLCAvLyBPU0MyX0RFVFVORVxuICAgICAgICAgIDEsIC8vIE9TQzJfWEVOVlxuICAgICAgICAgIDE0LCAvLyBOT0lTRV9WT0xcbiAgICAgICAgICA0LCAvLyBFTlZfQVRUQUNLXG4gICAgICAgICAgNiwgLy8gRU5WX1NVU1RBSU5cbiAgICAgICAgICA0NSwgLy8gRU5WX1JFTEVBU0VcbiAgICAgICAgICAwLCAvLyBBUlBfQ0hPUkRcbiAgICAgICAgICAwLCAvLyBBUlBfU1BFRURcbiAgICAgICAgICAwLCAvLyBMRk9fV0FWRUZPUk1cbiAgICAgICAgICAwLCAvLyBMRk9fQU1UXG4gICAgICAgICAgMCwgLy8gTEZPX0ZSRVFcbiAgICAgICAgICAwLCAvLyBMRk9fRlhfRlJFUVxuICAgICAgICAgIDIsIC8vIEZYX0ZJTFRFUlxuICAgICAgICAgIDEzNiwgLy8gRlhfRlJFUVxuICAgICAgICAgIDE1LCAvLyBGWF9SRVNPTkFOQ0VcbiAgICAgICAgICAwLCAvLyBGWF9ESVNUXG4gICAgICAgICAgMzIsIC8vIEZYX0RSSVZFXG4gICAgICAgICAgMCwgLy8gRlhfUEFOX0FNVFxuICAgICAgICAgIDAsIC8vIEZYX1BBTl9GUkVRXG4gICAgICAgICAgNjYsIC8vIEZYX0RFTEFZX0FNVFxuICAgICAgICAgIDYgLy8gRlhfREVMQVlfVElNRVxuICAgICAgICAgIF0sXG4gICAgICAgICAgLy8gUGF0dGVybnNcbiAgICAgICAgICBwOiBbXSxcbiAgICAgICAgICAvLyBDb2x1bW5zXG4gICAgICAgICAgYzogW1xuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgeyAvLyBJbnN0cnVtZW50IDJcbiAgICAgICAgICBpOiBbXG4gICAgICAgICAgMywgLy8gT1NDMV9XQVZFRk9STVxuICAgICAgICAgIDAsIC8vIE9TQzFfVk9MXG4gICAgICAgICAgMTI4LCAvLyBPU0MxX1NFTUlcbiAgICAgICAgICAwLCAvLyBPU0MxX1hFTlZcbiAgICAgICAgICAzLCAvLyBPU0MyX1dBVkVGT1JNXG4gICAgICAgICAgNjgsIC8vIE9TQzJfVk9MXG4gICAgICAgICAgMTI4LCAvLyBPU0MyX1NFTUlcbiAgICAgICAgICAwLCAvLyBPU0MyX0RFVFVORVxuICAgICAgICAgIDEsIC8vIE9TQzJfWEVOVlxuICAgICAgICAgIDIxOCwgLy8gTk9JU0VfVk9MXG4gICAgICAgICAgNCwgLy8gRU5WX0FUVEFDS1xuICAgICAgICAgIDQsIC8vIEVOVl9TVVNUQUlOXG4gICAgICAgICAgNDAsIC8vIEVOVl9SRUxFQVNFXG4gICAgICAgICAgMCwgLy8gQVJQX0NIT1JEXG4gICAgICAgICAgMCwgLy8gQVJQX1NQRUVEXG4gICAgICAgICAgMSwgLy8gTEZPX1dBVkVGT1JNXG4gICAgICAgICAgNTUsIC8vIExGT19BTVRcbiAgICAgICAgICA0LCAvLyBMRk9fRlJFUVxuICAgICAgICAgIDEsIC8vIExGT19GWF9GUkVRXG4gICAgICAgICAgMiwgLy8gRlhfRklMVEVSXG4gICAgICAgICAgNjcsIC8vIEZYX0ZSRVFcbiAgICAgICAgICAxMTUsIC8vIEZYX1JFU09OQU5DRVxuICAgICAgICAgIDEyNCwgLy8gRlhfRElTVFxuICAgICAgICAgIDE5MCwgLy8gRlhfRFJJVkVcbiAgICAgICAgICA2NywgLy8gRlhfUEFOX0FNVFxuICAgICAgICAgIDYsIC8vIEZYX1BBTl9GUkVRXG4gICAgICAgICAgMzksIC8vIEZYX0RFTEFZX0FNVFxuICAgICAgICAgIDEgLy8gRlhfREVMQVlfVElNRVxuICAgICAgICAgIF0sXG4gICAgICAgICAgLy8gUGF0dGVybnNcbiAgICAgICAgICBwOiBbXSxcbiAgICAgICAgICAvLyBDb2x1bW5zXG4gICAgICAgICAgYzogW1xuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAgeyAvLyBJbnN0cnVtZW50IDNcbiAgICAgICAgICBpOiBbXG4gICAgICAgICAgMCwgLy8gT1NDMV9XQVZFRk9STVxuICAgICAgICAgIDAsIC8vIE9TQzFfVk9MXG4gICAgICAgICAgMTQwLCAvLyBPU0MxX1NFTUlcbiAgICAgICAgICAwLCAvLyBPU0MxX1hFTlZcbiAgICAgICAgICAwLCAvLyBPU0MyX1dBVkVGT1JNXG4gICAgICAgICAgMCwgLy8gT1NDMl9WT0xcbiAgICAgICAgICAxNDAsIC8vIE9TQzJfU0VNSVxuICAgICAgICAgIDAsIC8vIE9TQzJfREVUVU5FXG4gICAgICAgICAgMCwgLy8gT1NDMl9YRU5WXG4gICAgICAgICAgMjU1LCAvLyBOT0lTRV9WT0xcbiAgICAgICAgICAxNTgsIC8vIEVOVl9BVFRBQ0tcbiAgICAgICAgICAxNTgsIC8vIEVOVl9TVVNUQUlOXG4gICAgICAgICAgMTU4LCAvLyBFTlZfUkVMRUFTRVxuICAgICAgICAgIDAsIC8vIEFSUF9DSE9SRFxuICAgICAgICAgIDAsIC8vIEFSUF9TUEVFRFxuICAgICAgICAgIDAsIC8vIExGT19XQVZFRk9STVxuICAgICAgICAgIDUxLCAvLyBMRk9fQU1UXG4gICAgICAgICAgMiwgLy8gTEZPX0ZSRVFcbiAgICAgICAgICAxLCAvLyBMRk9fRlhfRlJFUVxuICAgICAgICAgIDIsIC8vIEZYX0ZJTFRFUlxuICAgICAgICAgIDU4LCAvLyBGWF9GUkVRXG4gICAgICAgICAgMjM5LCAvLyBGWF9SRVNPTkFOQ0VcbiAgICAgICAgICAwLCAvLyBGWF9ESVNUXG4gICAgICAgICAgMzIsIC8vIEZYX0RSSVZFXG4gICAgICAgICAgODgsIC8vIEZYX1BBTl9BTVRcbiAgICAgICAgICAxLCAvLyBGWF9QQU5fRlJFUVxuICAgICAgICAgIDE1NywgLy8gRlhfREVMQVlfQU1UXG4gICAgICAgICAgMTYgLy8gRlhfREVMQVlfVElNRVxuICAgICAgICAgIF0sXG4gICAgICAgICAgLy8gUGF0dGVybnNcbiAgICAgICAgICBwOiBbMSwxLDEsMSwxLDEsMSwxLDEsMSwxLDFdLFxuICAgICAgICAgIC8vIENvbHVtbnNcbiAgICAgICAgICBjOiBbXG4gICAgICAgICAgICB7bjogWzExNV0sXG4gICAgICAgICAgICAgZjogW119XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7IC8vIEluc3RydW1lbnQgNFxuICAgICAgICAgIGk6IFtcbiAgICAgICAgICAyLCAvLyBPU0MxX1dBVkVGT1JNXG4gICAgICAgICAgMTAwLCAvLyBPU0MxX1ZPTFxuICAgICAgICAgIDEyOCwgLy8gT1NDMV9TRU1JXG4gICAgICAgICAgMCwgLy8gT1NDMV9YRU5WXG4gICAgICAgICAgMywgLy8gT1NDMl9XQVZFRk9STVxuICAgICAgICAgIDIwMSwgLy8gT1NDMl9WT0xcbiAgICAgICAgICAxMjgsIC8vIE9TQzJfU0VNSVxuICAgICAgICAgIDAsIC8vIE9TQzJfREVUVU5FXG4gICAgICAgICAgMCwgLy8gT1NDMl9YRU5WXG4gICAgICAgICAgMCwgLy8gTk9JU0VfVk9MXG4gICAgICAgICAgNSwgLy8gRU5WX0FUVEFDS1xuICAgICAgICAgIDYsIC8vIEVOVl9TVVNUQUlOXG4gICAgICAgICAgNTgsIC8vIEVOVl9SRUxFQVNFXG4gICAgICAgICAgMCwgLy8gQVJQX0NIT1JEXG4gICAgICAgICAgMCwgLy8gQVJQX1NQRUVEXG4gICAgICAgICAgMCwgLy8gTEZPX1dBVkVGT1JNXG4gICAgICAgICAgMTk1LCAvLyBMRk9fQU1UXG4gICAgICAgICAgNiwgLy8gTEZPX0ZSRVFcbiAgICAgICAgICAxLCAvLyBMRk9fRlhfRlJFUVxuICAgICAgICAgIDIsIC8vIEZYX0ZJTFRFUlxuICAgICAgICAgIDEzNSwgLy8gRlhfRlJFUVxuICAgICAgICAgIDAsIC8vIEZYX1JFU09OQU5DRVxuICAgICAgICAgIDAsIC8vIEZYX0RJU1RcbiAgICAgICAgICAzMiwgLy8gRlhfRFJJVkVcbiAgICAgICAgICAxNDcsIC8vIEZYX1BBTl9BTVRcbiAgICAgICAgICA2LCAvLyBGWF9QQU5fRlJFUVxuICAgICAgICAgIDEyMSwgLy8gRlhfREVMQVlfQU1UXG4gICAgICAgICAgNiAvLyBGWF9ERUxBWV9USU1FXG4gICAgICAgICAgXSxcbiAgICAgICAgICAvLyBQYXR0ZXJuc1xuICAgICAgICAgIHA6IFtdLFxuICAgICAgICAgIC8vIENvbHVtbnNcbiAgICAgICAgICBjOiBbXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7IC8vIEluc3RydW1lbnQgNVxuICAgICAgICAgIGk6IFtcbiAgICAgICAgICAyLCAvLyBPU0MxX1dBVkVGT1JNXG4gICAgICAgICAgMTAwLCAvLyBPU0MxX1ZPTFxuICAgICAgICAgIDEyOCwgLy8gT1NDMV9TRU1JXG4gICAgICAgICAgMCwgLy8gT1NDMV9YRU5WXG4gICAgICAgICAgMywgLy8gT1NDMl9XQVZFRk9STVxuICAgICAgICAgIDIwMSwgLy8gT1NDMl9WT0xcbiAgICAgICAgICAxMjgsIC8vIE9TQzJfU0VNSVxuICAgICAgICAgIDAsIC8vIE9TQzJfREVUVU5FXG4gICAgICAgICAgMCwgLy8gT1NDMl9YRU5WXG4gICAgICAgICAgMCwgLy8gTk9JU0VfVk9MXG4gICAgICAgICAgNSwgLy8gRU5WX0FUVEFDS1xuICAgICAgICAgIDYsIC8vIEVOVl9TVVNUQUlOXG4gICAgICAgICAgNTgsIC8vIEVOVl9SRUxFQVNFXG4gICAgICAgICAgMCwgLy8gQVJQX0NIT1JEXG4gICAgICAgICAgMCwgLy8gQVJQX1NQRUVEXG4gICAgICAgICAgMCwgLy8gTEZPX1dBVkVGT1JNXG4gICAgICAgICAgMTk1LCAvLyBMRk9fQU1UXG4gICAgICAgICAgNiwgLy8gTEZPX0ZSRVFcbiAgICAgICAgICAxLCAvLyBMRk9fRlhfRlJFUVxuICAgICAgICAgIDIsIC8vIEZYX0ZJTFRFUlxuICAgICAgICAgIDEzNSwgLy8gRlhfRlJFUVxuICAgICAgICAgIDAsIC8vIEZYX1JFU09OQU5DRVxuICAgICAgICAgIDAsIC8vIEZYX0RJU1RcbiAgICAgICAgICAzMiwgLy8gRlhfRFJJVkVcbiAgICAgICAgICAxNDcsIC8vIEZYX1BBTl9BTVRcbiAgICAgICAgICA2LCAvLyBGWF9QQU5fRlJFUVxuICAgICAgICAgIDEyMSwgLy8gRlhfREVMQVlfQU1UXG4gICAgICAgICAgNiAvLyBGWF9ERUxBWV9USU1FXG4gICAgICAgICAgXSxcbiAgICAgICAgICAvLyBQYXR0ZXJuc1xuICAgICAgICAgIHA6IFtdLFxuICAgICAgICAgIC8vIENvbHVtbnNcbiAgICAgICAgICBjOiBbXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7IC8vIEluc3RydW1lbnQgNlxuICAgICAgICAgIGk6IFtcbiAgICAgICAgICAyLCAvLyBPU0MxX1dBVkVGT1JNXG4gICAgICAgICAgMTAwLCAvLyBPU0MxX1ZPTFxuICAgICAgICAgIDEyOCwgLy8gT1NDMV9TRU1JXG4gICAgICAgICAgMCwgLy8gT1NDMV9YRU5WXG4gICAgICAgICAgMywgLy8gT1NDMl9XQVZFRk9STVxuICAgICAgICAgIDIwMSwgLy8gT1NDMl9WT0xcbiAgICAgICAgICAxMjgsIC8vIE9TQzJfU0VNSVxuICAgICAgICAgIDAsIC8vIE9TQzJfREVUVU5FXG4gICAgICAgICAgMCwgLy8gT1NDMl9YRU5WXG4gICAgICAgICAgMCwgLy8gTk9JU0VfVk9MXG4gICAgICAgICAgNSwgLy8gRU5WX0FUVEFDS1xuICAgICAgICAgIDYsIC8vIEVOVl9TVVNUQUlOXG4gICAgICAgICAgNTgsIC8vIEVOVl9SRUxFQVNFXG4gICAgICAgICAgMCwgLy8gQVJQX0NIT1JEXG4gICAgICAgICAgMCwgLy8gQVJQX1NQRUVEXG4gICAgICAgICAgMCwgLy8gTEZPX1dBVkVGT1JNXG4gICAgICAgICAgMTk1LCAvLyBMRk9fQU1UXG4gICAgICAgICAgNiwgLy8gTEZPX0ZSRVFcbiAgICAgICAgICAxLCAvLyBMRk9fRlhfRlJFUVxuICAgICAgICAgIDIsIC8vIEZYX0ZJTFRFUlxuICAgICAgICAgIDEzNSwgLy8gRlhfRlJFUVxuICAgICAgICAgIDAsIC8vIEZYX1JFU09OQU5DRVxuICAgICAgICAgIDAsIC8vIEZYX0RJU1RcbiAgICAgICAgICAzMiwgLy8gRlhfRFJJVkVcbiAgICAgICAgICAxNDcsIC8vIEZYX1BBTl9BTVRcbiAgICAgICAgICA2LCAvLyBGWF9QQU5fRlJFUVxuICAgICAgICAgIDEyMSwgLy8gRlhfREVMQVlfQU1UXG4gICAgICAgICAgNiAvLyBGWF9ERUxBWV9USU1FXG4gICAgICAgICAgXSxcbiAgICAgICAgICAvLyBQYXR0ZXJuc1xuICAgICAgICAgIHA6IFtdLFxuICAgICAgICAgIC8vIENvbHVtbnNcbiAgICAgICAgICBjOiBbXG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7IC8vIEluc3RydW1lbnQgN1xuICAgICAgICAgIGk6IFtcbiAgICAgICAgICAyLCAvLyBPU0MxX1dBVkVGT1JNXG4gICAgICAgICAgMTAwLCAvLyBPU0MxX1ZPTFxuICAgICAgICAgIDEyOCwgLy8gT1NDMV9TRU1JXG4gICAgICAgICAgMCwgLy8gT1NDMV9YRU5WXG4gICAgICAgICAgMywgLy8gT1NDMl9XQVZFRk9STVxuICAgICAgICAgIDIwMSwgLy8gT1NDMl9WT0xcbiAgICAgICAgICAxMjgsIC8vIE9TQzJfU0VNSVxuICAgICAgICAgIDAsIC8vIE9TQzJfREVUVU5FXG4gICAgICAgICAgMCwgLy8gT1NDMl9YRU5WXG4gICAgICAgICAgMCwgLy8gTk9JU0VfVk9MXG4gICAgICAgICAgNSwgLy8gRU5WX0FUVEFDS1xuICAgICAgICAgIDYsIC8vIEVOVl9TVVNUQUlOXG4gICAgICAgICAgNTgsIC8vIEVOVl9SRUxFQVNFXG4gICAgICAgICAgMCwgLy8gQVJQX0NIT1JEXG4gICAgICAgICAgMCwgLy8gQVJQX1NQRUVEXG4gICAgICAgICAgMCwgLy8gTEZPX1dBVkVGT1JNXG4gICAgICAgICAgMTk1LCAvLyBMRk9fQU1UXG4gICAgICAgICAgNiwgLy8gTEZPX0ZSRVFcbiAgICAgICAgICAxLCAvLyBMRk9fRlhfRlJFUVxuICAgICAgICAgIDIsIC8vIEZYX0ZJTFRFUlxuICAgICAgICAgIDEzNSwgLy8gRlhfRlJFUVxuICAgICAgICAgIDAsIC8vIEZYX1JFU09OQU5DRVxuICAgICAgICAgIDAsIC8vIEZYX0RJU1RcbiAgICAgICAgICAzMiwgLy8gRlhfRFJJVkVcbiAgICAgICAgICAxNDcsIC8vIEZYX1BBTl9BTVRcbiAgICAgICAgICA2LCAvLyBGWF9QQU5fRlJFUVxuICAgICAgICAgIDEyMSwgLy8gRlhfREVMQVlfQU1UXG4gICAgICAgICAgNiAvLyBGWF9ERUxBWV9USU1FXG4gICAgICAgICAgXSxcbiAgICAgICAgICAvLyBQYXR0ZXJuc1xuICAgICAgICAgIHA6IFtdLFxuICAgICAgICAgIC8vIENvbHVtbnNcbiAgICAgICAgICBjOiBbXG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgcm93TGVuOiA1NTEzLCAgIC8vIEluIHNhbXBsZSBsZW5ndGhzXG4gICAgICBwYXR0ZXJuTGVuOiAzMiwgIC8vIFJvd3MgcGVyIHBhdHRlcm5cbiAgICAgIGVuZFBhdHRlcm46IDEzICAvLyBFbmQgcGF0dGVyblxuICAgIH07XG5cbnZhciBuYXJyYXRpb25Db250ZW50ID0gW1xuICBcIlVzZSBXLEEsUyxEIG9yIEFycm93cyB0byBtb3ZlLlwiLFxuICBcIkxpZmUgaXMgZnVubnkgaXNuJ3QgaXQ/XCIsXG4gIFwiSnVzdCB3aGVuIHlvdSB0aGluayB5b3XigJl2ZSBnb3QgaXQgYWxsIGZpZ3VyZWQgb3V0Li4uXCIsXG4gIFwiSnVzdCB3aGVuIHlvdSBmaW5hbGx5IGJlZ2luIHRvIHBsYW4gc29tZXRoaW5nLCBnZXQgZXhjaXRlZCBhYm91dCBzb21ldGhpbmcuLi5cIixcbiAgXCJhbmQgZmVlbCBsaWtlIHlvdSBrbm93IHdoYXQgZGlyZWN0aW9uIHlvdeKAmXJlIGhlYWRpbmcgaW4sIHRoZSBwYXRocyBjaGFuZ2UuLi5cIixcbiAgXCJ0aGUgc2lnbnMgY2hhbmdlLCB0aGUgd2luZCBibG93cyB0aGUgb3RoZXIgd2F5Li4uXCIsXG4gIFwiTm9ydGggaXMgc3VkZGVubHkgc291dGggYW5kIGVhc3QgaXMgd2VzdCwgYW5kIHlvdeKAmXJlLi4uXCIsXG4gIFwibG9zdFwiLFxuICBcIlRoZSBGb3Jlc3Q6IGJ5IEBzdHJlZXRhbGNoZW1pc3QgKHdvcmRzIGZyb20gPGVtPkxvdmUsIFJvc2llPC9lbT4gYnkgQ2VjZWxpYSBBaGVybilcIlxuXTtcblxudmFyIGZpZWxkO1xudmFyIGNoYXJhY3RlcjtcblxuXG5cbi8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBEZW1vIHByb2dyYW0gc2VjdGlvblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvLyBJbml0aWFsaXplIG11c2ljIGdlbmVyYXRpb24gKHBsYXllcikuXG4gIHZhciB0MCA9IG5ldyBEYXRlKCk7XG4gIHZhciBwbGF5ZXIgPSBuZXcgQ1BsYXllcigpO1xuICBwbGF5ZXIuaW5pdChzb25nKTtcblxuICAvLyBHZW5lcmF0ZSBtdXNpYy4uLlxuICB2YXIgZG9uZSA9IGZhbHNlO1xuICBzZXRJbnRlcnZhbChmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGRvbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvL3ZhciBzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdGF0dXNcIik7XG4gICAgLy9zLnRleHRDb250ZW50ID0gcy50ZXh0Q29udGVudCArIFwiLlwiO1xuXG4gICAgZG9uZSA9IHBsYXllci5nZW5lcmF0ZSgpID49IDE7XG5cbiAgICBpZiAoZG9uZSkge1xuICAgICAgdmFyIHQxID0gbmV3IERhdGUoKTtcbiAgICAgIC8vcy50ZXh0Q29udGVudCA9IHMudGV4dENvbnRlbnQgKyBcImRvbmUgKFwiICsgKHQxIC0gdDApICsgXCJtcylcIjtcblxuICAgICAgLy8gUHV0IHRoZSBnZW5lcmF0ZWQgc29uZyBpbiBhbiBBdWRpbyBlbGVtZW50LlxuICAgICAgdmFyIHdhdmUgPSBwbGF5ZXIuY3JlYXRlV2F2ZSgpO1xuICAgICAgdmFyIGF1ZGlvID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpO1xuICAgICAgYXVkaW8uc3JjID0gVVJMLmNyZWF0ZU9iamVjdFVSTChuZXcgQmxvYihbd2F2ZV0sIHt0eXBlOiBcImF1ZGlvL3dhdlwifSkpO1xuICAgICAgYXVkaW8ubG9vcCA9IHRydWU7XG4gICAgICBhdWRpby5wbGF5KCk7XG4gICAgfVxuICB9LCAwKTtcblxuXG5mdW5jdGlvbiBzdGFydCgpIHtcbiAgbmFycmF0aW9uLnNldE5hcnJhdGlvbkNvbnRlbnQobmFycmF0aW9uQ29udGVudCk7XG4gIGZpZWxkID0gbmV3IEZpZWxkKDU0MDAsMzkwMCk7XG4gIGNoYXJhY3RlciA9IG5ldyBDaGFyYWN0ZXIoKTtcblxuICBjYW1lcmEuc2V0VGFyZ2V0KGNoYXJhY3Rlcik7XG4gIGNhbWVyYS5zZXRGaWVsZChmaWVsZCk7XG5cbiAgZ2FtZU9iamVjdHMucHVzaChjaGFyYWN0ZXIpO1xuICBnYW1lLmNoYXJhY3RlciA9IGNoYXJhY3RlcjtcblxuICBmb3IodmFyIGxvYyBpbiBlbmVteUxvY2F0aW9ucykge1xuICAgIHZhciBlbmVteSA9IG5ldyBFbmVteSgpO1xuICAgIGVuZW15LnggPSBlbmVteUxvY2F0aW9uc1tsb2NdWzBdKm1hcE11bHRpcGxpZXI7XG4gICAgZW5lbXkueSA9IGVuZW15TG9jYXRpb25zW2xvY11bMV0qbWFwTXVsdGlwbGllcjtcbiAgICBnYW1lT2JqZWN0cy5wdXNoKGVuZW15KTtcbiAgfVxuXG4gIHdha2V1cEJ1dHRvbi5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgd2FrZXVwQnV0dG9uLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQod2FrZXVwQnV0dG9uKTtcbiAgICBodWQuZmFkZUZyb21XaGl0ZSgpO1xuICAgIG5hcnJhdGlvbi5hZHZhbmNlTmFycmF0aW9uKCk7XG4gIH1cblxuICBidWlsZE1hcCgpO1xufVxuXG5mdW5jdGlvbiBidWlsZE1hcCgpIHtcbiAgZm9yKHJvdyBpbiBtYXApIHtcbiAgICBmb3IoY29sIGluIG1hcFtyb3ddKSB7XG5cbiAgICAgIC8vUGxhY2Ugd2FsbCB0aWxlc1xuICAgICAgaWYobWFwW3Jvd11bY29sXSA9PT0gMCkge1xuICAgICAgICB2YXIgYmFycmllciA9IG5ldyBCYXNlT2JqZWN0KCk7XG4gICAgICAgIGJhcnJpZXIueCA9IGNvbCptYXBNdWx0aXBsaWVyO1xuICAgICAgICBiYXJyaWVyLnkgPSByb3cqbWFwTXVsdGlwbGllcjtcbiAgICAgICAgYmFycmllci53aWR0aCA9IG1hcE11bHRpcGxpZXIrMTtcbiAgICAgICAgYmFycmllci5oZWlnaHQgPSBtYXBNdWx0aXBsaWVyKzE7XG4gICAgICAgIGJhcnJpZXIuc2V0Q29sb3IoZ2FtZS5wYXR0ZXJucy50cmVlcy5kYXRhKTtcbiAgICAgICAgZ2FtZU9iamVjdHMucHVzaChiYXJyaWVyKTtcbiAgICAgIH1cblxuICAgICAgLy9QbGFjZSBDaGFyYWN0ZXJcbiAgICAgIGlmKG1hcFtyb3ddW2NvbF0gPT09IDMpIHtcbiAgICAgICAgY2hhcmFjdGVyLnggPSBjb2wqbWFwTXVsdGlwbGllcjtcbiAgICAgICAgY2hhcmFjdGVyLnkgPSByb3cqbWFwTXVsdGlwbGllcjtcbiAgICAgIH0gXG5cbiAgICAgIC8vUGxhY2UgbWFnbmV0aWMgdGlsZXNcbiAgICAgIGlmKG1hcFtyb3ddW2NvbF0gPT09IDQpIHtcbiAgICAgICAgdmFyIG1hZyA9IG5ldyBUcmlnZ2VyKGNvbCptYXBNdWx0aXBsaWVyLHJvdyptYXBNdWx0aXBsaWVyLG1hcE11bHRpcGxpZXIsbWFwTXVsdGlwbGllcik7XG4gICAgICAgIG1hZy5zZXRUcmlnZ2VyRGF0YSh7XG4gICAgICAgICAgb25ldGltZTpmYWxzZSxcbiAgICAgICAgICB0eXBlOlwibWFnbmV0aWNcIixcbiAgICAgICAgfSk7XG4gICAgICAgIG1hZy5zZXRDb2xvcihnYW1lLnBhdHRlcm5zLm1ldGFsLmRhdGEpO1xuICAgICAgICBnYW1lT2JqZWN0cy5wdXNoKG1hZyk7XG4gICAgICB9XG5cbiAgICAgIC8vUGxhY2Ugd2F5cG9pbnRzXG4gICAgICBpZihtYXBbcm93XVtjb2xdID49IDEwICYmIG1hcFtyb3ddW2NvbF0gPD0gMTkpIHtcbiAgICAgICAgdmFyIG1hZyA9IG5ldyBUcmlnZ2VyKGNvbCptYXBNdWx0aXBsaWVyLHJvdyptYXBNdWx0aXBsaWVyLG1hcE11bHRpcGxpZXIsbWFwTXVsdGlwbGllcik7XG4gICAgICAgIG1hZy5zZXRUcmlnZ2VyRGF0YSh7XG4gICAgICAgICAgb25ldGltZTpmYWxzZSxcbiAgICAgICAgICB0eXBlOlwibWFnbmV0aWNcIixcbiAgICAgICAgfSk7XG4gICAgICAgIG1hZy5zZXRDb2xvcihnYW1lLnBhdHRlcm5zLm1ldGFsLmRhdGEpO1xuICAgICAgICBnYW1lT2JqZWN0cy5wdXNoKG1hZyk7XG4gICAgICAgIHZhciB0cmlnZ2VyID0gbmV3IFRyaWdnZXIoY29sKm1hcE11bHRpcGxpZXIscm93Km1hcE11bHRpcGxpZXIsbWFwTXVsdGlwbGllcioyLG1hcE11bHRpcGxpZXIqMik7XG4gICAgICAgIHRyaWdnZXIuc2V0VHJpZ2dlckRhdGEoe1xuICAgICAgICAgIG9uZXRpbWU6dHJ1ZSxcbiAgICAgICAgICB0eXBlOlwid2F5cG9pbnRcIixcbiAgICAgICAgICB2YWx1ZToobWFwW3Jvd11bY29sXS0xMClcbiAgICAgICAgfSk7XG4gICAgICAgIHRyaWdnZXIucmVuZGVyTGF5ZXIgPSAzO1xuICAgICAgICAvL3RyaWdnZXJDb3VudCsrO1xuICAgICAgICBnYW1lT2JqZWN0cy5wdXNoKHRyaWdnZXIpO1xuICAgICAgfVxuXG4gICAgICAvL1BsYWNlIGZhbHNlL21vdmFibGUgd2FsbHMgdG8gZGlzYXBwZWFyXG4gICAgICBpZihtYXBbcm93XVtjb2xdID49IDIwICYmIG1hcFtyb3ddW2NvbF0gPD0gMjkpIHtcbiAgICAgICAgdmFyIGZhbHNlV2FsbCA9IG5ldyBGYWxzZVdhbGwoY29sKm1hcE11bHRpcGxpZXIsIHJvdyptYXBNdWx0aXBsaWVyLG1hcE11bHRpcGxpZXIsbWFwTXVsdGlwbGllcik7XG4gICAgICAgIGZhbHNlV2FsbC5zZXRTdGF0ZUNoYW5nZShcImRpc2FwcGVhclwiLG1hcFtyb3ddW2NvbF0tMjApO1xuICAgICAgICBmYWxzZVdhbGwuc2V0Q29sb3IoZ2FtZS5wYXR0ZXJucy50cmVlcy5kYXRhKTtcbiAgICAgICAgZ2FtZU9iamVjdHMucHVzaChmYWxzZVdhbGwpO1xuICAgICAgfVxuXG4gICAgICAvL1BsYWNlIGZhbHNlL21vdmFibGUgd2FsbHMgdG8gYXBwZWFyXG4gICAgICBpZihtYXBbcm93XVtjb2xdID49IDMwICYmIG1hcFtyb3ddW2NvbF0gPD0gMzkpIHtcbiAgICAgICAgdmFyIGZhbHNlV2FsbCA9IG5ldyBGYWxzZVdhbGwoY29sKm1hcE11bHRpcGxpZXIsIHJvdyptYXBNdWx0aXBsaWVyLG1hcE11bHRpcGxpZXIsbWFwTXVsdGlwbGllcik7XG4gICAgICAgIGZhbHNlV2FsbC5zZXRTdGF0ZUNoYW5nZShcImFwcGVhclwiLG1hcFtyb3ddW2NvbF0tMzApO1xuICAgICAgICBmYWxzZVdhbGwuc2V0Q29sb3IoZ2FtZS5wYXR0ZXJucy50cmVlcy5kYXRhKTtcbiAgICAgICAgZ2FtZU9iamVjdHMucHVzaChmYWxzZVdhbGwpO1xuICAgICAgfVxuXG4gICAgICAvL1BsYWNlIGZhbHNlL21vdmFibGUgd2FsbHMgdG8gZGlzYXBwZWFyIGFuZCBsZWF2ZSBiZWhpbmQgYSBtYWduZXRpY1xuICAgICAgaWYobWFwW3Jvd11bY29sXSA+PSA0MCAmJiBtYXBbcm93XVtjb2xdIDw9IDQ5KSB7XG4gICAgICAgIHZhciBtYWcgPSBuZXcgVHJpZ2dlcihjb2wqbWFwTXVsdGlwbGllcixyb3cqbWFwTXVsdGlwbGllcixtYXBNdWx0aXBsaWVyLG1hcE11bHRpcGxpZXIpO1xuICAgICAgICBtYWcuc2V0VHJpZ2dlckRhdGEoe1xuICAgICAgICAgIG9uZXRpbWU6ZmFsc2UsXG4gICAgICAgICAgdHlwZTpcIm1hZ25ldGljXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBtYWcuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIG1hZy50cmlnZ2VyV2F5cG9pbnQgPSBtYXBbcm93XVtjb2xdLTQwO1xuICAgICAgICBtYWcuc2V0Q29sb3IoZ2FtZS5wYXR0ZXJucy5tZXRhbC5kYXRhKTtcbiAgICAgICAgZ2FtZU9iamVjdHMucHVzaChtYWcpO1xuXG5cbiAgICAgICAgdmFyIGZhbHNlV2FsbCA9IG5ldyBGYWxzZVdhbGwoY29sKm1hcE11bHRpcGxpZXIsIHJvdyptYXBNdWx0aXBsaWVyLG1hcE11bHRpcGxpZXIsbWFwTXVsdGlwbGllcik7XG4gICAgICAgIGZhbHNlV2FsbC5zZXRTdGF0ZUNoYW5nZShcImRpc2FwcGVhclwiLG1hcFtyb3ddW2NvbF0tNDApO1xuICAgICAgICBmYWxzZVdhbGwuc2V0Q29sb3IoZ2FtZS5wYXR0ZXJucy50cmVlcy5kYXRhKTtcbiAgICAgICAgZ2FtZU9iamVjdHMucHVzaChmYWxzZVdhbGwpO1xuICAgICAgfVxuXG4gICAgICAvL1BsYWNlIGZhbHNlL21vdmFibGUgd2FsbHMgdG8gZGlzYXBwZWFyIGFuZCBsZWF2ZSBiZWhpbmQgYSB3YXlwb2ludFxuICAgICAgaWYobWFwW3Jvd11bY29sXSA+PSA1MCAmJiBtYXBbcm93XVtjb2xdIDw9IDU5KSB7XG4gICAgICAgIHZhciBtYWcgPSBuZXcgVHJpZ2dlcihjb2wqbWFwTXVsdGlwbGllcixyb3cqbWFwTXVsdGlwbGllcixtYXBNdWx0aXBsaWVyLG1hcE11bHRpcGxpZXIpO1xuICAgICAgICBtYWcuc2V0VHJpZ2dlckRhdGEoe1xuICAgICAgICAgIG9uZXRpbWU6ZmFsc2UsXG4gICAgICAgICAgdHlwZTpcIm1hZ25ldGljXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBtYWcuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIG1hZy50cmlnZ2VyV2F5cG9pbnQgPSBtYXBbcm93XVtjb2xdLTUwO1xuICAgICAgICBtYWcuc2V0Q29sb3IoZ2FtZS5wYXR0ZXJucy5tZXRhbC5kYXRhKTtcbiAgICAgICAgZ2FtZU9iamVjdHMucHVzaChtYWcpO1xuXG5cbiAgICAgICAgdmFyIHRyaWdnZXIgPSBuZXcgVHJpZ2dlcihjb2wqbWFwTXVsdGlwbGllcixyb3cqbWFwTXVsdGlwbGllcixtYXBNdWx0aXBsaWVyKjIsbWFwTXVsdGlwbGllcioyKTtcbiAgICAgICAgdHJpZ2dlci5zZXRUcmlnZ2VyRGF0YSh7XG4gICAgICAgICAgb25ldGltZTp0cnVlLFxuICAgICAgICAgIHR5cGU6XCJ3YXlwb2ludFwiLFxuICAgICAgICAgIHZhbHVlOihtYXBbcm93XVtjb2xdLTUwKVxuICAgICAgICB9KTtcbiAgICAgICAgdHJpZ2dlci5yZW5kZXJMYXllciA9IDM7XG4gICAgICAgIHRyaWdnZXIudHJpZ2dlcldheXBvaW50ID0gbWFwW3Jvd11bY29sXS01MDtcbiAgICAgICAgdHJpZ2dlci5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgLy90cmlnZ2VyQ291bnQrKztcbiAgICAgICAgZ2FtZU9iamVjdHMucHVzaCh0cmlnZ2VyKTtcblxuXG4gICAgICAgIHZhciBmYWxzZVdhbGwgPSBuZXcgRmFsc2VXYWxsKGNvbCptYXBNdWx0aXBsaWVyLCByb3cqbWFwTXVsdGlwbGllcixtYXBNdWx0aXBsaWVyLG1hcE11bHRpcGxpZXIpO1xuICAgICAgICBmYWxzZVdhbGwuc2V0U3RhdGVDaGFuZ2UoXCJkaXNhcHBlYXJcIixtYXBbcm93XVtjb2xdLTUwKTtcbiAgICAgICAgZmFsc2VXYWxsLnNldENvbG9yKGdhbWUucGF0dGVybnMudHJlZXMuZGF0YSk7XG4gICAgICAgIGdhbWVPYmplY3RzLnB1c2goZmFsc2VXYWxsKTtcbiAgICAgIH1cblxuXG4gICAgICAvL1BsYWNlIGZpbmFsIHdheXBvaW50XG4gICAgICBpZihtYXBbcm93XVtjb2xdID09IDk5KSB7XG4gICAgICAgIHZhciBtYWcgPSBuZXcgVHJpZ2dlcihjb2wqbWFwTXVsdGlwbGllcixyb3cqbWFwTXVsdGlwbGllcixtYXBNdWx0aXBsaWVyLG1hcE11bHRpcGxpZXIpO1xuICAgICAgICBtYWcuc2V0VHJpZ2dlckRhdGEoe1xuICAgICAgICAgIG9uZXRpbWU6ZmFsc2UsXG4gICAgICAgICAgdHlwZTpcIm1hZ25ldGljXCIsXG4gICAgICAgIH0pO1xuICAgICAgICBtYWcuc2V0Q29sb3IoZ2FtZS5wYXR0ZXJucy5tZXRhbC5kYXRhKTtcbiAgICAgICAgZ2FtZU9iamVjdHMucHVzaChtYWcpO1xuICAgICAgICB2YXIgdHJpZ2dlciA9IG5ldyBUcmlnZ2VyKGNvbCptYXBNdWx0aXBsaWVyLHJvdyptYXBNdWx0aXBsaWVyLG1hcE11bHRpcGxpZXIqMyxtYXBNdWx0aXBsaWVyKjIpO1xuICAgICAgICB0cmlnZ2VyLnNldFRyaWdnZXJEYXRhKHtcbiAgICAgICAgICBvbmV0aW1lOnRydWUsXG4gICAgICAgICAgdHlwZTpcIndheXBvaW50XCIsXG4gICAgICAgICAgdmFsdWU6NFxuICAgICAgICB9KTtcbiAgICAgICAgdHJpZ2dlci5yZW5kZXJMYXllciA9IDM7XG4gICAgICAgIC8vdHJpZ2dlckNvdW50Kys7XG4gICAgICAgIGdhbWVPYmplY3RzLnB1c2godHJpZ2dlcik7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBnYW1lT2JqZWN0cy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgIGlmIChhLnJlbmRlckxheWVyIDwgYi5yZW5kZXJMYXllcikge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgICBpZiAoYS5yZW5kZXJMYXllciA+IGIucmVuZGVyTGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9XG4gICAgICByZXR1cm4gMDtcbiAgICB9KTtcblxuICB9XG5cbiAgLy9TZXQgdHJpZ2dlcnNcbiAgY2hhcmFjdGVyLnNldENvbXBhc3MoY29tcGFzcyk7XG59XG5cblxuZnVuY3Rpb24gdXBkYXRlKGVsYXBzZWQpIHtcbiAgaWYoZ2FtZS5yZWFkeSkge1xuICAgIGNhbWVyYS51cGRhdGUoZWxhcHNlZCk7XG4gICAgY29tcGFzcy51cGRhdGUoZWxhcHNlZCk7XG4gICAgaHVkLnVwZGF0ZShlbGFwc2VkKTtcblxuICAgIGZvcihvYmogaW4gZ2FtZU9iamVjdHMpIHtcbiAgICAgIGdhbWVPYmplY3RzW29ial0udXBkYXRlKGVsYXBzZWQpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiByZW5kZXIoKSB7XG4gIC8vIENsZWFyIHRoZSBzY3JlZW5cbiAgaWYoZ2FtZS5yZWFkeSkge1xuICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblxuICAgIGZpZWxkLnJlbmRlcigpO1xuICAgIGNhbWVyYS5yZW5kZXIoKTtcblxuXG4gICAgZm9yKG9iaiBpbiBnYW1lT2JqZWN0cykge1xuICAgICAgaWYoZ2FtZU9iamVjdHNbb2JqXSAhPT0gY2hhcmFjdGVyICYmIGdhbWVPYmplY3RzW29ial0uY29sbGlzaW9uVHlwZSAhPSBcImVuZW15XCIpIHtcbiAgICAgICAgZ2FtZU9iamVjdHNbb2JqXS5yZW5kZXIoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3Iob2JqIGluIGdhbWVPYmplY3RzKSB7XG4gICAgICBpZihnYW1lT2JqZWN0c1tvYmpdLmNvbGxpc2lvblR5cGUgPT0gXCJlbmVteVwiKSB7XG4gICAgICAgIGdhbWVPYmplY3RzW29ial0ucmVuZGVyKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY2hhcmFjdGVyLnJlbmRlcigpO1xuXG4gICAgY29tcGFzcy5yZW5kZXIoKTtcbiAgICBodWQucmVuZGVyKCk7XG4gICAgZ2FtZS5yZW5kZXJOb2lzZShjdHgsIC4yNSwgdHJ1ZSk7XG5cbiAgfVxufVxuXG5yYWYuc3RhcnQoZnVuY3Rpb24oZWxhcHNlZCkge1xuICBpZighZ2FtZS5pbml0aWFsaXplZCkge1xuICAgIGlmKGdhbWUucmVhZHkpIHtcbiAgICAgIGdhbWUuZ2VuZXJhdGVOb2lzZUZyYW1lcyhjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQsIC4yNSk7XG4gICAgICBzdGFydCgpO1xuICAgICAgZ2FtZS5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIHVwZGF0ZShlbGFwc2VkKTtcbiAgcmVuZGVyKCk7XG59KTtcbiIsImNsYXNzIEJhc2VPYmplY3Qge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMueCA9IDA7XG5cdFx0dGhpcy55ID0gMDtcblx0XHR0aGlzLndpZHRoID0gODA7XG5cdFx0dGhpcy5oZWlnaHQgPSA4MDtcblx0XHR0aGlzLmNvbG9yID0gJyNmZjQ1MDAnO1xuXHRcdHRoaXMuY29sbGlzaW9uVHlwZSA9IFwic3RhdGljXCI7XG5cdFx0dGhpcy5yZW5kZXJMYXllciA9IDU7XG5cdH1cblxuXHR1cGRhdGUoZWxhcHNlZCkge1xuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGlmKGVuZ2luZS5pc09uU2NyZWVuKHRoaXMpKSB7XG5cdFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdCAgICBcdGN0eC5yZWN0KHRoaXMueC1jYW1lcmEueCwgdGhpcy55LWNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cdCAgICBcdGN0eC5jbG9zZVBhdGgoKTtcblx0ICAgIFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG5cdCAgICBcdGN0eC5zYXZlKCk7XG5cdFx0XHRjdHgudHJhbnNsYXRlKHRoaXMueC1jYW1lcmEueCwgdGhpcy55LWNhbWVyYS55KTtcblx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRjdHgucmVzdG9yZSgpO1xuXHRcdH1cblx0fVxuXG5cdHNldENvbG9yKGNvbG9yKSB7XG5cdFx0dGhpcy5jb2xvciA9IGNvbG9yO1xuXHR9XG5cblx0Y2hlY2tGb3JTdGF0aWNFbnRpdHlDb2xsaXNpb25zKCkge1xuXHRcdHZhciBjb2xsaWRlcyA9IHtcblx0XHRcdFwidmFsdWVcIjpmYWxzZSxcblx0XHRcdFwiY29sbGlzaW9uc1wiOltdXG5cdFx0fTtcblxuXHRcdHZhciBzdGF0aWNPYmplY3RzID0gZ2FtZU9iamVjdHMuZmlsdGVyKGZ1bmN0aW9uKGVsZW0sIGksIGFycmF5KSB7XG5cdFx0ICAgIHJldHVybiBlbGVtLmNvbGxpc2lvblR5cGUgPT09IFwic3RhdGljXCI7XG5cdFx0fSk7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3RhdGljT2JqZWN0cy5sZW5ndGg7IGkrKykge1xuXHRcdCBcdHZhciBzdGF0aWNFbnRpdHkgPSBzdGF0aWNPYmplY3RzW2ldO1xuXHRcdFx0aWYoZW5naW5lLnJlY3RJbnRlcnNlY3QodGhpcy54LHRoaXMueSx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0LHN0YXRpY0VudGl0eS54LHN0YXRpY0VudGl0eS55LHN0YXRpY0VudGl0eS53aWR0aCxzdGF0aWNFbnRpdHkuaGVpZ2h0KSkge1xuXHRcdCBcdFx0dmFyIG5ld0NvbGxpc2lvbiA9IHt9O1xuXHRcdCBcdFx0bmV3Q29sbGlzaW9uLnZhbHVlID0gdHJ1ZTtcblx0XHQgXHRcdG5ld0NvbGxpc2lvbi50eXBlID0gXCJzdGF0aWNcIjtcblxuXHRcdCBcdFx0Ly9DYWxjdWxhdGUgeCBvdmVybGFwXG5cdFx0IFx0XHR2YXIgbGVmdFNpZGUgPSAodGhpcy54K3RoaXMud2lkdGgpIC0gc3RhdGljRW50aXR5Lng7XG5cdFx0IFx0XHR2YXIgcmlnaHRTaWRlID0gKHN0YXRpY0VudGl0eS54K3N0YXRpY0VudGl0eS53aWR0aCkgLSB0aGlzLng7XG5cdFx0XHRcdGlmKE1hdGgubWluKGxlZnRTaWRlLHJpZ2h0U2lkZSkgPT0gbGVmdFNpZGUpIHtcblx0XHRcdFx0XHRuZXdDb2xsaXNpb24ueEFtb3VudCA9IGxlZnRTaWRlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG5ld0NvbGxpc2lvbi54QW1vdW50ID0gcmlnaHRTaWRlKi0xO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9DYWxjdWxhdGUgeSBvdmVybGFwXG5cdFx0XHRcdHZhciB0b3BTaWRlID0gKHRoaXMueSArIHRoaXMuaGVpZ2h0KSAtIChzdGF0aWNFbnRpdHkueSk7XG5cdFx0XHRcdHZhciBib3R0b21TaWRlID0gKHN0YXRpY0VudGl0eS55K3N0YXRpY0VudGl0eS5oZWlnaHQpIC0gKHRoaXMueSk7XG5cdFx0XHRcdGlmKE1hdGgubWluKHRvcFNpZGUsYm90dG9tU2lkZSkgPT0gdG9wU2lkZSkge1xuXHRcdFx0XHRcdG5ld0NvbGxpc2lvbi55QW1vdW50ID0gdG9wU2lkZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRuZXdDb2xsaXNpb24ueUFtb3VudCA9IGJvdHRvbVNpZGUqPS0xO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNvbGxpZGVzLmNvbGxpc2lvbnMucHVzaChuZXdDb2xsaXNpb24pO1xuXHRcdCBcdH1cblx0XHR9XG5cdFx0cmV0dXJuIGNvbGxpZGVzO1xuXHR9XG5cblx0Y2hlY2tGb3JUcmlnZ2VyQ29sbGlzaW9ucygpIHtcblx0XHR2YXIgY29sbGlkZXMgPSB7XCJ2YWx1ZVwiOmZhbHNlfTtcblxuXHRcdHZhciB0cmlnZ2VyT2JqZWN0cyA9IGdhbWVPYmplY3RzLmZpbHRlcihmdW5jdGlvbihlbGVtLCBpLCBhcnJheSkge1xuXHRcdFx0cmV0dXJuIGVsZW0uY29sbGlzaW9uVHlwZSA9PT0gXCJ0cmlnZ2VyXCI7XG5cdFx0fSk7XG5cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdHJpZ2dlck9iamVjdHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciB0cmlnZ2VyRW50aXR5ID0gdHJpZ2dlck9iamVjdHNbaV07XG5cdFx0XHRpZihlbmdpbmUucmVjdEludGVyc2VjdCh0aGlzLngsdGhpcy55LHRoaXMud2lkdGgsdGhpcy5oZWlnaHQsdHJpZ2dlckVudGl0eS54LHRyaWdnZXJFbnRpdHkueSx0cmlnZ2VyRW50aXR5LndpZHRoLHRyaWdnZXJFbnRpdHkuaGVpZ2h0KSAmJiB0cmlnZ2VyRW50aXR5LmFjdGl2ZSA9PSB0cnVlKSB7XG5cdFx0IFx0XHRjb2xsaWRlcy52YWx1ZSA9IHRydWU7XG5cdFx0IFx0XHRjb2xsaWRlcy50eXBlID0gXCJ0cmlnZ2VyXCI7XG5cdFx0IFx0XHRjb2xsaWRlcy5vdGhlciA9IHRyaWdnZXJFbnRpdHk7XG5cdFx0IFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiBjb2xsaWRlcztcblx0fVxuXG5cdGNoZWNrRm9yQnVsbGV0Q29sbGlzaW9ucygpIHtcblx0XHR2YXIgY29sbGlkZXMgPSB7XG5cdFx0XHRcInZhbHVlXCI6ZmFsc2UsXG5cdFx0XHRcImNvbGxpc2lvbnNcIjpbXVxuXHRcdH07XG5cblx0XHR2YXIgYnVsbGV0T2JqZWN0cyA9IGdhbWVPYmplY3RzLmZpbHRlcihmdW5jdGlvbihlbGVtLCBpLCBhcnJheSkge1xuXHRcdFx0cmV0dXJuIGVsZW0uY29sbGlzaW9uVHlwZSA9PT0gXCJidWxsZXRcIjtcblx0XHR9KTtcblxuXHRcdGZvcih2YXIgYnVsbGV0IGluIGJ1bGxldE9iamVjdHMpIHtcblx0XHRcdHZhciBidWxsZXRPYmogPSBidWxsZXRPYmplY3RzW2J1bGxldF07XG5cdFx0XHRpZihlbmdpbmUucmVjdEludGVyc2VjdCh0aGlzLngsdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCxidWxsZXRPYmoueCxidWxsZXRPYmoueSxidWxsZXRPYmoud2lkdGgsYnVsbGV0T2JqLmhlaWdodCkpIHtcblx0XHRcdFx0Y29sbGlkZXMuY29sbGlzaW9ucy5wdXNoKGJ1bGxldE9iaik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbGxpZGVzO1xuXHR9XG5cblx0Y2hlY2tGb3JFbmVteUNvbGxpc2lvbnMoKSB7XG5cdFx0dmFyIGNvbGxpZGVzID0ge1xuXHRcdFx0XCJ2YWx1ZVwiOmZhbHNlLFxuXHRcdFx0XCJjb2xsaXNpb25zXCI6W11cblx0XHR9O1xuXG5cdFx0dmFyIGJ1bGxldE9iamVjdHMgPSBnYW1lT2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZWxlbSwgaSwgYXJyYXkpIHtcblx0XHRcdHJldHVybiBlbGVtLmNvbGxpc2lvblR5cGUgPT09IFwiZW5lbXlcIjtcblx0XHR9KTtcblxuXHRcdGZvcih2YXIgYnVsbGV0IGluIGJ1bGxldE9iamVjdHMpIHtcblx0XHRcdHZhciBidWxsZXRPYmogPSBidWxsZXRPYmplY3RzW2J1bGxldF07XG5cdFx0XHRpZihlbmdpbmUucmVjdEludGVyc2VjdCh0aGlzLngsdGhpcy55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCxidWxsZXRPYmoueCxidWxsZXRPYmoueSxidWxsZXRPYmoud2lkdGgsYnVsbGV0T2JqLmhlaWdodCkpIHtcblx0XHRcdFx0Y29sbGlkZXMuY29sbGlzaW9ucy5wdXNoKGJ1bGxldE9iaik7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNvbGxpZGVzO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQmFzZU9iamVjdDsiLCIvKiAtKi0gbW9kZTogamF2YXNjcmlwdDsgdGFiLXdpZHRoOiA0OyBpbmRlbnQtdGFicy1tb2RlOiBuaWw7IC0qLVxuKlxuKiBDb3B5cmlnaHQgKGMpIDIwMTEtMjAxMyBNYXJjdXMgR2VlbG5hcmRcbipcbiogVGhpcyBzb2Z0d2FyZSBpcyBwcm92aWRlZCAnYXMtaXMnLCB3aXRob3V0IGFueSBleHByZXNzIG9yIGltcGxpZWRcbiogd2FycmFudHkuIEluIG5vIGV2ZW50IHdpbGwgdGhlIGF1dGhvcnMgYmUgaGVsZCBsaWFibGUgZm9yIGFueSBkYW1hZ2VzXG4qIGFyaXNpbmcgZnJvbSB0aGUgdXNlIG9mIHRoaXMgc29mdHdhcmUuXG4qXG4qIFBlcm1pc3Npb24gaXMgZ3JhbnRlZCB0byBhbnlvbmUgdG8gdXNlIHRoaXMgc29mdHdhcmUgZm9yIGFueSBwdXJwb3NlLFxuKiBpbmNsdWRpbmcgY29tbWVyY2lhbCBhcHBsaWNhdGlvbnMsIGFuZCB0byBhbHRlciBpdCBhbmQgcmVkaXN0cmlidXRlIGl0XG4qIGZyZWVseSwgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIHJlc3RyaWN0aW9uczpcbipcbiogMS4gVGhlIG9yaWdpbiBvZiB0aGlzIHNvZnR3YXJlIG11c3Qgbm90IGJlIG1pc3JlcHJlc2VudGVkOyB5b3UgbXVzdCBub3RcbiogICAgY2xhaW0gdGhhdCB5b3Ugd3JvdGUgdGhlIG9yaWdpbmFsIHNvZnR3YXJlLiBJZiB5b3UgdXNlIHRoaXMgc29mdHdhcmVcbiogICAgaW4gYSBwcm9kdWN0LCBhbiBhY2tub3dsZWRnbWVudCBpbiB0aGUgcHJvZHVjdCBkb2N1bWVudGF0aW9uIHdvdWxkIGJlXG4qICAgIGFwcHJlY2lhdGVkIGJ1dCBpcyBub3QgcmVxdWlyZWQuXG4qXG4qIDIuIEFsdGVyZWQgc291cmNlIHZlcnNpb25zIG11c3QgYmUgcGxhaW5seSBtYXJrZWQgYXMgc3VjaCwgYW5kIG11c3Qgbm90IGJlXG4qICAgIG1pc3JlcHJlc2VudGVkIGFzIGJlaW5nIHRoZSBvcmlnaW5hbCBzb2Z0d2FyZS5cbipcbiogMy4gVGhpcyBub3RpY2UgbWF5IG5vdCBiZSByZW1vdmVkIG9yIGFsdGVyZWQgZnJvbSBhbnkgc291cmNlXG4qICAgIGRpc3RyaWJ1dGlvbi5cbipcbiovXG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgQ1BsYXllciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIFByaXZhdGUgbWV0aG9kc1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIC8vIE9zY2lsbGF0b3JzXG4gICAgdmFyIG9zY19zaW4gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc2luKHZhbHVlICogNi4yODMxODQpO1xuICAgIH07XG5cbiAgICB2YXIgb3NjX3NhdyA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gMiAqICh2YWx1ZSAlIDEpIC0gMTtcbiAgICB9O1xuXG4gICAgdmFyIG9zY19zcXVhcmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuICh2YWx1ZSAlIDEpIDwgMC41ID8gMSA6IC0xO1xuICAgIH07XG5cbiAgICB2YXIgb3NjX3RyaSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgdjIgPSAodmFsdWUgJSAxKSAqIDQ7XG4gICAgICAgIGlmKHYyIDwgMikgcmV0dXJuIHYyIC0gMTtcbiAgICAgICAgcmV0dXJuIDMgLSB2MjtcbiAgICB9O1xuXG4gICAgdmFyIGdldG5vdGVmcmVxID0gZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgLy8gMTc0LjYxLi4gLyA0NDEwMCA9IDAuMDAzOTU5NTAzNzU4IChGMylcbiAgICAgICAgcmV0dXJuIDAuMDAzOTU5NTAzNzU4ICogTWF0aC5wb3coMiwgKG4gLSAxMjgpIC8gMTIpO1xuICAgIH07XG5cbiAgICB2YXIgY3JlYXRlTm90ZSA9IGZ1bmN0aW9uIChpbnN0ciwgbiwgcm93TGVuKSB7XG4gICAgICAgIHZhciBvc2MxID0gbU9zY2lsbGF0b3JzW2luc3RyLmlbMF1dLFxuICAgICAgICAgICAgbzF2b2wgPSBpbnN0ci5pWzFdLFxuICAgICAgICAgICAgbzF4ZW52ID0gaW5zdHIuaVszXSxcbiAgICAgICAgICAgIG9zYzIgPSBtT3NjaWxsYXRvcnNbaW5zdHIuaVs0XV0sXG4gICAgICAgICAgICBvMnZvbCA9IGluc3RyLmlbNV0sXG4gICAgICAgICAgICBvMnhlbnYgPSBpbnN0ci5pWzhdLFxuICAgICAgICAgICAgbm9pc2VWb2wgPSBpbnN0ci5pWzldLFxuICAgICAgICAgICAgYXR0YWNrID0gaW5zdHIuaVsxMF0gKiBpbnN0ci5pWzEwXSAqIDQsXG4gICAgICAgICAgICBzdXN0YWluID0gaW5zdHIuaVsxMV0gKiBpbnN0ci5pWzExXSAqIDQsXG4gICAgICAgICAgICByZWxlYXNlID0gaW5zdHIuaVsxMl0gKiBpbnN0ci5pWzEyXSAqIDQsXG4gICAgICAgICAgICByZWxlYXNlSW52ID0gMSAvIHJlbGVhc2UsXG4gICAgICAgICAgICBhcnAgPSBpbnN0ci5pWzEzXSxcbiAgICAgICAgICAgIGFycEludGVydmFsID0gcm93TGVuICogTWF0aC5wb3coMiwgMiAtIGluc3RyLmlbMTRdKTtcblxuICAgICAgICB2YXIgbm90ZUJ1ZiA9IG5ldyBJbnQzMkFycmF5KGF0dGFjayArIHN1c3RhaW4gKyByZWxlYXNlKTtcblxuICAgICAgICAvLyBSZS10cmlnIG9zY2lsbGF0b3JzXG4gICAgICAgIHZhciBjMSA9IDAsIGMyID0gMDtcblxuICAgICAgICAvLyBMb2NhbCB2YXJpYWJsZXMuXG4gICAgICAgIHZhciBqLCBqMiwgZSwgdCwgcnNhbXBsZSwgbzF0LCBvMnQ7XG5cbiAgICAgICAgLy8gR2VuZXJhdGUgb25lIG5vdGUgKGF0dGFjayArIHN1c3RhaW4gKyByZWxlYXNlKVxuICAgICAgICBmb3IgKGogPSAwLCBqMiA9IDA7IGogPCBhdHRhY2sgKyBzdXN0YWluICsgcmVsZWFzZTsgaisrLCBqMisrKSB7XG4gICAgICAgICAgICBpZiAoajIgPj0gMCkge1xuICAgICAgICAgICAgICAgIC8vIFN3aXRjaCBhcnBlZ2dpbyBub3RlLlxuICAgICAgICAgICAgICAgIGFycCA9IChhcnAgPj4gOCkgfCAoKGFycCAmIDI1NSkgPDwgNCk7XG4gICAgICAgICAgICAgICAgajIgLT0gYXJwSW50ZXJ2YWw7XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgbm90ZSBmcmVxdWVuY2llcyBmb3IgdGhlIG9zY2lsbGF0b3JzXG4gICAgICAgICAgICAgICAgbzF0ID0gZ2V0bm90ZWZyZXEobiArIChhcnAgJiAxNSkgKyBpbnN0ci5pWzJdIC0gMTI4KTtcbiAgICAgICAgICAgICAgICBvMnQgPSBnZXRub3RlZnJlcShuICsgKGFycCAmIDE1KSArIGluc3RyLmlbNl0gLSAxMjgpICogKDEgKyAwLjAwMDggKiBpbnN0ci5pWzddKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gRW52ZWxvcGVcbiAgICAgICAgICAgIGUgPSAxO1xuICAgICAgICAgICAgaWYgKGogPCBhdHRhY2spIHtcbiAgICAgICAgICAgICAgICBlID0gaiAvIGF0dGFjaztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaiA+PSBhdHRhY2sgKyBzdXN0YWluKSB7XG4gICAgICAgICAgICAgICAgZSAtPSAoaiAtIGF0dGFjayAtIHN1c3RhaW4pICogcmVsZWFzZUludjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gT3NjaWxsYXRvciAxXG4gICAgICAgICAgICB0ID0gbzF0O1xuICAgICAgICAgICAgaWYgKG8xeGVudikge1xuICAgICAgICAgICAgICAgIHQgKj0gZSAqIGU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjMSArPSB0O1xuICAgICAgICAgICAgcnNhbXBsZSA9IG9zYzEoYzEpICogbzF2b2w7XG5cbiAgICAgICAgICAgIC8vIE9zY2lsbGF0b3IgMlxuICAgICAgICAgICAgdCA9IG8ydDtcbiAgICAgICAgICAgIGlmIChvMnhlbnYpIHtcbiAgICAgICAgICAgICAgICB0ICo9IGUgKiBlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYzIgKz0gdDtcbiAgICAgICAgICAgIHJzYW1wbGUgKz0gb3NjMihjMikgKiBvMnZvbDtcblxuICAgICAgICAgICAgLy8gTm9pc2Ugb3NjaWxsYXRvclxuICAgICAgICAgICAgaWYgKG5vaXNlVm9sKSB7XG4gICAgICAgICAgICAgICAgcnNhbXBsZSArPSAoMiAqIE1hdGgucmFuZG9tKCkgLSAxKSAqIG5vaXNlVm9sO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBBZGQgdG8gKG1vbm8pIGNoYW5uZWwgYnVmZmVyXG4gICAgICAgICAgICBub3RlQnVmW2pdID0gKDgwICogcnNhbXBsZSAqIGUpIHwgMDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBub3RlQnVmO1xuICAgIH07XG5cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBQcml2YXRlIG1lbWJlcnNcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyBBcnJheSBvZiBvc2NpbGxhdG9yIGZ1bmN0aW9uc1xuICAgIHZhciBtT3NjaWxsYXRvcnMgPSBbXG4gICAgICAgIG9zY19zaW4sXG4gICAgICAgIG9zY19zcXVhcmUsXG4gICAgICAgIG9zY19zYXcsXG4gICAgICAgIG9zY190cmlcbiAgICBdO1xuXG4gICAgLy8gUHJpdmF0ZSB2YXJpYWJsZXMgc2V0IHVwIGJ5IGluaXQoKVxuICAgIHZhciBtU29uZywgbUxhc3RSb3csIG1DdXJyZW50Q29sLCBtTnVtV29yZHMsIG1NaXhCdWY7XG5cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBJbml0aWFsaXphdGlvblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uIChzb25nKSB7XG4gICAgICAgIC8vIERlZmluZSB0aGUgc29uZ1xuICAgICAgICBtU29uZyA9IHNvbmc7XG5cbiAgICAgICAgLy8gSW5pdCBpdGVyYXRpb24gc3RhdGUgdmFyaWFibGVzXG4gICAgICAgIG1MYXN0Um93ID0gc29uZy5lbmRQYXR0ZXJuIC0gMjtcbiAgICAgICAgbUN1cnJlbnRDb2wgPSAwO1xuXG4gICAgICAgIC8vIFByZXBhcmUgc29uZyBpbmZvXG4gICAgICAgIG1OdW1Xb3JkcyA9ICBzb25nLnJvd0xlbiAqIHNvbmcucGF0dGVybkxlbiAqIChtTGFzdFJvdyArIDEpICogMjtcblxuICAgICAgICAvLyBDcmVhdGUgd29yayBidWZmZXIgKGluaXRpYWxseSBjbGVhcmVkKVxuICAgICAgICBtTWl4QnVmID0gbmV3IEludDMyQXJyYXkobU51bVdvcmRzKTtcbiAgICB9O1xuXG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gUHVibGljIG1ldGhvZHNcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgICAvLyBHZW5lcmF0ZSBhdWRpbyBkYXRhIGZvciBhIHNpbmdsZSB0cmFja1xuICAgIHRoaXMuZ2VuZXJhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIC8vIExvY2FsIHZhcmlhYmxlc1xuICAgICAgICB2YXIgaSwgaiwgYiwgcCwgcm93LCBjb2wsIG4sIGNwLFxuICAgICAgICAgICAgaywgdCwgbGZvciwgZSwgeCwgcnNhbXBsZSwgcm93U3RhcnRTYW1wbGUsIGYsIGRhO1xuXG4gICAgICAgIC8vIFB1dCBwZXJmb3JtYW5jZSBjcml0aWNhbCBpdGVtcyBpbiBsb2NhbCB2YXJpYWJsZXNcbiAgICAgICAgdmFyIGNobkJ1ZiA9IG5ldyBJbnQzMkFycmF5KG1OdW1Xb3JkcyksXG4gICAgICAgICAgICBpbnN0ciA9IG1Tb25nLnNvbmdEYXRhW21DdXJyZW50Q29sXSxcbiAgICAgICAgICAgIHJvd0xlbiA9IG1Tb25nLnJvd0xlbixcbiAgICAgICAgICAgIHBhdHRlcm5MZW4gPSBtU29uZy5wYXR0ZXJuTGVuO1xuXG4gICAgICAgIC8vIENsZWFyIGVmZmVjdCBzdGF0ZVxuICAgICAgICB2YXIgbG93ID0gMCwgYmFuZCA9IDAsIGhpZ2g7XG4gICAgICAgIHZhciBsc2FtcGxlLCBmaWx0ZXJBY3RpdmUgPSBmYWxzZTtcblxuICAgICAgICAvLyBDbGVhciBub3RlIGNhY2hlLlxuICAgICAgICB2YXIgbm90ZUNhY2hlID0gW107XG5cbiAgICAgICAgIC8vIFBhdHRlcm5zXG4gICAgICAgICBmb3IgKHAgPSAwOyBwIDw9IG1MYXN0Um93OyArK3ApIHtcbiAgICAgICAgICAgIGNwID0gaW5zdHIucFtwXTtcblxuICAgICAgICAgICAgLy8gUGF0dGVybiByb3dzXG4gICAgICAgICAgICBmb3IgKHJvdyA9IDA7IHJvdyA8IHBhdHRlcm5MZW47ICsrcm93KSB7XG4gICAgICAgICAgICAgICAgLy8gRXhlY3V0ZSBlZmZlY3QgY29tbWFuZC5cbiAgICAgICAgICAgICAgICB2YXIgY21kTm8gPSBjcCA/IGluc3RyLmNbY3AgLSAxXS5mW3Jvd10gOiAwO1xuICAgICAgICAgICAgICAgIGlmIChjbWRObykge1xuICAgICAgICAgICAgICAgICAgICBpbnN0ci5pW2NtZE5vIC0gMV0gPSBpbnN0ci5jW2NwIC0gMV0uZltyb3cgKyBwYXR0ZXJuTGVuXSB8fCAwO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIENsZWFyIHRoZSBub3RlIGNhY2hlIHNpbmNlIHRoZSBpbnN0cnVtZW50IGhhcyBjaGFuZ2VkLlxuICAgICAgICAgICAgICAgICAgICBpZiAoY21kTm8gPCAxNikge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm90ZUNhY2hlID0gW107XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBQdXQgcGVyZm9ybWFuY2UgY3JpdGljYWwgaW5zdHJ1bWVudCBwcm9wZXJ0aWVzIGluIGxvY2FsIHZhcmlhYmxlc1xuICAgICAgICAgICAgICAgIHZhciBvc2NMRk8gPSBtT3NjaWxsYXRvcnNbaW5zdHIuaVsxNV1dLFxuICAgICAgICAgICAgICAgICAgICBsZm9BbXQgPSBpbnN0ci5pWzE2XSAvIDUxMixcbiAgICAgICAgICAgICAgICAgICAgbGZvRnJlcSA9IE1hdGgucG93KDIsIGluc3RyLmlbMTddIC0gOSkgLyByb3dMZW4sXG4gICAgICAgICAgICAgICAgICAgIGZ4TEZPID0gaW5zdHIuaVsxOF0sXG4gICAgICAgICAgICAgICAgICAgIGZ4RmlsdGVyID0gaW5zdHIuaVsxOV0sXG4gICAgICAgICAgICAgICAgICAgIGZ4RnJlcSA9IGluc3RyLmlbMjBdICogNDMuMjM1MjkgKiAzLjE0MTU5MiAvIDQ0MTAwLFxuICAgICAgICAgICAgICAgICAgICBxID0gMSAtIGluc3RyLmlbMjFdIC8gMjU1LFxuICAgICAgICAgICAgICAgICAgICBkaXN0ID0gaW5zdHIuaVsyMl0gKiAxZS01LFxuICAgICAgICAgICAgICAgICAgICBkcml2ZSA9IGluc3RyLmlbMjNdIC8gMzIsXG4gICAgICAgICAgICAgICAgICAgIHBhbkFtdCA9IGluc3RyLmlbMjRdIC8gNTEyLFxuICAgICAgICAgICAgICAgICAgICBwYW5GcmVxID0gNi4yODMxODQgKiBNYXRoLnBvdygyLCBpbnN0ci5pWzI1XSAtIDkpIC8gcm93TGVuLFxuICAgICAgICAgICAgICAgICAgICBkbHlBbXQgPSBpbnN0ci5pWzI2XSAvIDI1NSxcbiAgICAgICAgICAgICAgICAgICAgZGx5ID0gaW5zdHIuaVsyN10gKiByb3dMZW47XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxjdWxhdGUgc3RhcnQgc2FtcGxlIG51bWJlciBmb3IgdGhpcyByb3cgaW4gdGhlIHBhdHRlcm5cbiAgICAgICAgICAgICAgICByb3dTdGFydFNhbXBsZSA9IChwICogcGF0dGVybkxlbiArIHJvdykgKiByb3dMZW47XG5cbiAgICAgICAgICAgICAgICAvLyBHZW5lcmF0ZSBub3RlcyBmb3IgdGhpcyBwYXR0ZXJuIHJvd1xuICAgICAgICAgICAgICAgIGZvciAoY29sID0gMDsgY29sIDwgNDsgKytjb2wpIHtcbiAgICAgICAgICAgICAgICAgICAgbiA9IGNwID8gaW5zdHIuY1tjcCAtIDFdLm5bcm93ICsgY29sICogcGF0dGVybkxlbl0gOiAwO1xuICAgICAgICAgICAgICAgICAgICBpZiAobikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFub3RlQ2FjaGVbbl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3RlQ2FjaGVbbl0gPSBjcmVhdGVOb3RlKGluc3RyLCBuLCByb3dMZW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBDb3B5IG5vdGUgZnJvbSB0aGUgbm90ZSBjYWNoZVxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vdGVCdWYgPSBub3RlQ2FjaGVbbl07XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwLCBpID0gcm93U3RhcnRTYW1wbGUgKiAyOyBqIDwgbm90ZUJ1Zi5sZW5ndGg7IGorKywgaSArPSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNobkJ1ZltpXSArPSBub3RlQnVmW2pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gUGVyZm9ybSBlZmZlY3RzIGZvciB0aGlzIHBhdHRlcm4gcm93XG4gICAgICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHJvd0xlbjsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIERyeSBtb25vLXNhbXBsZVxuICAgICAgICAgICAgICAgICAgICBrID0gKHJvd1N0YXJ0U2FtcGxlICsgaikgKiAyO1xuICAgICAgICAgICAgICAgICAgICByc2FtcGxlID0gY2huQnVmW2tdO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIFdlIG9ubHkgZG8gZWZmZWN0cyBpZiB3ZSBoYXZlIHNvbWUgc291bmQgaW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJzYW1wbGUgfHwgZmlsdGVyQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBTdGF0ZSB2YXJpYWJsZSBmaWx0ZXJcbiAgICAgICAgICAgICAgICAgICAgICAgIGYgPSBmeEZyZXE7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZnhMRk8pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmICo9IG9zY0xGTyhsZm9GcmVxICogaykgKiBsZm9BbXQgKyAwLjU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBmID0gMS41ICogTWF0aC5zaW4oZik7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb3cgKz0gZiAqIGJhbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdoID0gcSAqIChyc2FtcGxlIC0gYmFuZCkgLSBsb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICBiYW5kICs9IGYgKiBoaWdoO1xuICAgICAgICAgICAgICAgICAgICAgICAgcnNhbXBsZSA9IGZ4RmlsdGVyID09IDMgPyBiYW5kIDogZnhGaWx0ZXIgPT0gMSA/IGhpZ2ggOiBsb3c7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERpc3RvcnRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcnNhbXBsZSAqPSBkaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJzYW1wbGUgPSByc2FtcGxlIDwgMSA/IHJzYW1wbGUgPiAtMSA/IG9zY19zaW4ocnNhbXBsZSouMjUpIDogLTEgOiAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJzYW1wbGUgLz0gZGlzdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRHJpdmVcbiAgICAgICAgICAgICAgICAgICAgICAgIHJzYW1wbGUgKj0gZHJpdmU7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIElzIHRoZSBmaWx0ZXIgYWN0aXZlIChpLmUuIHN0aWxsIGF1ZGlhYmxlKT9cbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlckFjdGl2ZSA9IHJzYW1wbGUgKiByc2FtcGxlID4gMWUtNTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gUGFubmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdCA9IE1hdGguc2luKHBhbkZyZXEgKiBrKSAqIHBhbkFtdCArIDAuNTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxzYW1wbGUgPSByc2FtcGxlICogKDEgLSB0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJzYW1wbGUgKj0gdDtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxzYW1wbGUgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGVsYXkgaXMgYWx3YXlzIGRvbmUsIHNpbmNlIGl0IGRvZXMgbm90IG5lZWQgc291bmQgaW5wdXRcbiAgICAgICAgICAgICAgICAgICAgaWYgKGsgPj0gZGx5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBMZWZ0IGNoYW5uZWwgPSBsZWZ0ICsgcmlnaHRbLXBdICogdFxuICAgICAgICAgICAgICAgICAgICAgICAgbHNhbXBsZSArPSBjaG5CdWZbay1kbHkrMV0gKiBkbHlBbXQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJpZ2h0IGNoYW5uZWwgPSByaWdodCArIGxlZnRbLXBdICogdFxuICAgICAgICAgICAgICAgICAgICAgICAgcnNhbXBsZSArPSBjaG5CdWZbay1kbHldICogZGx5QW10O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gU3RvcmUgaW4gc3RlcmVvIGNoYW5uZWwgYnVmZmVyIChuZWVkZWQgZm9yIHRoZSBkZWxheSBlZmZlY3QpXG4gICAgICAgICAgICAgICAgICAgIGNobkJ1ZltrXSA9IGxzYW1wbGUgfCAwO1xuICAgICAgICAgICAgICAgICAgICBjaG5CdWZbaysxXSA9IHJzYW1wbGUgfCAwO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIC4uLmFuZCBhZGQgdG8gc3RlcmVvIG1peCBidWZmZXJcbiAgICAgICAgICAgICAgICAgICAgbU1peEJ1ZltrXSArPSBsc2FtcGxlIHwgMDtcbiAgICAgICAgICAgICAgICAgICAgbU1peEJ1ZltrKzFdICs9IHJzYW1wbGUgfCAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5leHQgaXRlcmF0aW9uLiBSZXR1cm4gcHJvZ3Jlc3MgKDEuMCA9PSBkb25lISkuXG4gICAgICAgIG1DdXJyZW50Q29sKys7XG4gICAgICAgIHJldHVybiBtQ3VycmVudENvbCAvIDg7XG4gICAgfTtcblxuICAgIC8vIENyZWF0ZSBhIFdBVkUgZm9ybWF0dGVkIFVpbnQ4QXJyYXkgZnJvbSB0aGUgZ2VuZXJhdGVkIGF1ZGlvIGRhdGFcbiAgICB0aGlzLmNyZWF0ZVdhdmUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gQ3JlYXRlIFdBVkUgaGVhZGVyXG4gICAgICAgIHZhciBoZWFkZXJMZW4gPSA0NDtcbiAgICAgICAgdmFyIGwxID0gaGVhZGVyTGVuICsgbU51bVdvcmRzICogMiAtIDg7XG4gICAgICAgIHZhciBsMiA9IGwxIC0gMzY7XG4gICAgICAgIHZhciB3YXZlID0gbmV3IFVpbnQ4QXJyYXkoaGVhZGVyTGVuICsgbU51bVdvcmRzICogMik7XG4gICAgICAgIHdhdmUuc2V0KFxuICAgICAgICAgICAgWzgyLDczLDcwLDcwLFxuICAgICAgICAgICAgIGwxICYgMjU1LChsMSA+PiA4KSAmIDI1NSwobDEgPj4gMTYpICYgMjU1LChsMSA+PiAyNCkgJiAyNTUsXG4gICAgICAgICAgICAgODcsNjUsODYsNjksMTAyLDEwOSwxMTYsMzIsMTYsMCwwLDAsMSwwLDIsMCxcbiAgICAgICAgICAgICA2OCwxNzIsMCwwLDE2LDE3NywyLDAsNCwwLDE2LDAsMTAwLDk3LDExNiw5NyxcbiAgICAgICAgICAgICBsMiAmIDI1NSwobDIgPj4gOCkgJiAyNTUsKGwyID4+IDE2KSAmIDI1NSwobDIgPj4gMjQpICYgMjU1XVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIEFwcGVuZCBhY3R1YWwgd2F2ZSBkYXRhXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBpZHggPSBoZWFkZXJMZW47IGkgPCBtTnVtV29yZHM7ICsraSkge1xuICAgICAgICAgICAgLy8gTm90ZTogV2UgY2xhbXAgaGVyZVxuICAgICAgICAgICAgdmFyIHkgPSBtTWl4QnVmW2ldO1xuICAgICAgICAgICAgeSA9IHkgPCAtMzI3NjcgPyAtMzI3NjcgOiAoeSA+IDMyNzY3ID8gMzI3NjcgOiB5KTtcbiAgICAgICAgICAgIHdhdmVbaWR4KytdID0geSAmIDI1NTtcbiAgICAgICAgICAgIHdhdmVbaWR4KytdID0gKHkgPj4gOCkgJiAyNTU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSZXR1cm4gdGhlIFdBVkUgZm9ybWF0dGVkIHR5cGVkIGFycmF5XG4gICAgICAgIHJldHVybiB3YXZlO1xuICAgIH07XG5cbiAgICAvLyBHZXQgbiBzYW1wbGVzIG9mIHdhdmUgZGF0YSBhdCB0aW1lIHQgW3NdLiBXYXZlIGRhdGEgaW4gcmFuZ2UgWy0yLDJdLlxuICAgIHRoaXMuZ2V0RGF0YSA9IGZ1bmN0aW9uKHQsIG4pIHtcbiAgICAgICAgdmFyIGkgPSAyICogTWF0aC5mbG9vcih0ICogNDQxMDApO1xuICAgICAgICB2YXIgZCA9IG5ldyBBcnJheShuKTtcbiAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCAyKm47IGogKz0gMSkge1xuICAgICAgICAgICAgdmFyIGsgPSBpICsgajtcbiAgICAgICAgICAgIGRbal0gPSB0ID4gMCAmJiBrIDwgbU1peEJ1Zi5sZW5ndGggPyBtTWl4QnVmW2tdIC8gMzI3NjggOiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkO1xuICAgIH07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gQ1BsYXllcjsiLCJ2YXIgQmFzZU9iamVjdCA9IHJlcXVpcmUoJy4vQmFzZU9iamVjdCcpO1xuXG5jbGFzcyBCdWxsZXQgZXh0ZW5kcyBCYXNlT2JqZWN0IHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMueCA9IDA7XG5cdFx0dGhpcy55ID0gMDtcblx0XHR0aGlzLnhWZWwgPSAwO1xuXHRcdHRoaXMueVZlbCA9IDA7XG5cdFx0dGhpcy53aWR0aCA9IDU7XG5cdFx0dGhpcy5oZWlnaHQgPSA1O1xuXHRcdHRoaXMuY29sb3IgPSAnI2ZmZmZmZic7XG5cdFx0dGhpcy5zcGVlZCA9IDQwMDtcblx0XHR0aGlzLmNvbGxpc2lvblR5cGUgPSBcImJ1bGxldFwiO1xuXHRcdHRoaXMuYnVsbGV0VHlwZSA9IFwiXCI7XG5cdH1cblxuXHRzZXRQb3NpdGlvbih4LHkpIHtcblx0XHR0aGlzLnggPSB4O1xuXHRcdHRoaXMueSA9IHk7XG5cdH1cblxuXHRzZXRWZWxvY2l0eSh4VmVsLHlWZWwpIHtcblx0XHR0aGlzLnhWZWwgPSB4VmVsO1xuXHRcdHRoaXMueVZlbCA9IHlWZWw7XG5cdH1cblxuXHR1cGRhdGUoZWxhcHNlZCkge1xuXHRcdHRoaXMueCArPSB0aGlzLnhWZWwqZWxhcHNlZDtcblx0XHR0aGlzLnkgKz0gdGhpcy55VmVsKmVsYXBzZWQ7XG5cblx0XHRpZighZW5naW5lLmlzT25TY3JlZW4odGhpcykpIHtcblx0XHRcdHRoaXMua2lsbCgpO1xuXHRcdH1cblx0fVxuXG5cdHJlbmRlcigpIHtcblx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdCAgICBjdHgucmVjdCh0aGlzLngtY2FtZXJhLngsIHRoaXMueS1jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXHQgICAgY3R4LmNsb3NlUGF0aCgpO1xuXHQgICAgY3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG5cdCAgICBjdHguZmlsbCgpO1xuXHR9XG5cblx0a2lsbCgpIHtcblx0XHR2YXIgaSA9IGdhbWVPYmplY3RzLmluZGV4T2YodGhpcyk7XG4gICAgXHRnYW1lT2JqZWN0cy5zcGxpY2UoaSwgMSk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBCdWxsZXQ7IiwiY2xhc3MgQ2FtZXJhIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLnggPSAwO1xuXHRcdHRoaXMueSA9IDA7XG5cdFx0dGhpcy53aWR0aCA9IDgwMDtcblx0XHR0aGlzLmhlaWdodCA9IDQ1MDtcblx0XHR0aGlzLnBvY2tldCA9IHtcblx0XHRcdHg6Mjc1LFxuXHRcdFx0eToxMDAsXG5cdFx0XHR3aWR0aDoyNTAsXG5cdFx0XHRoZWlnaHQ6MjUwLFxuXHRcdFx0Y29sb3I6JyNjY2NjY2MnXG5cdFx0fVxuXHR9O1xuXG5cdHNldFRhcmdldCh0YXJnZXQpIHtcblx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcblx0fVxuXG5cdHNldEZpZWxkKGZpZWxkKSB7XG5cdFx0dGhpcy5maWVsZCA9IGZpZWxkO1xuXHR9XG5cblx0dXBkYXRlKGVsYXBzZWQpIHtcblxuXHRcdC8vS2VlcCB0YXJnZXQgaW4gY2FtZXJhIHBvY2tldCBpZiBwb3NzaWJsZVxuXHRcdGlmKHRoaXMudGFyZ2V0LnggKyB0aGlzLnRhcmdldC53aWR0aCA+IHRoaXMueCt0aGlzLnBvY2tldC54K3RoaXMucG9ja2V0LndpZHRoKSB7IC8vRWFzdFxuXHRcdFx0dGhpcy54ID0gdGhpcy50YXJnZXQueCArIHRoaXMudGFyZ2V0LndpZHRoIC0gdGhpcy5wb2NrZXQueCAtIHRoaXMucG9ja2V0LndpZHRoO1xuXHRcdH1cblx0XHRpZih0aGlzLnRhcmdldC54IDwgdGhpcy54ICsgdGhpcy5wb2NrZXQueCkgeyAvL1dlc3Rcblx0XHRcdHRoaXMueCA9IHRoaXMudGFyZ2V0LnggLSB0aGlzLnBvY2tldC54O1xuXHRcdH1cblx0XHRpZih0aGlzLnRhcmdldC55IDwgdGhpcy55ICsgdGhpcy5wb2NrZXQueSkgeyAvL05vcnRoXG5cdFx0XHR0aGlzLnkgPSB0aGlzLnRhcmdldC55IC0gdGhpcy5wb2NrZXQueTtcblx0XHR9XG5cdFx0aWYodGhpcy50YXJnZXQueSArIHRoaXMudGFyZ2V0LmhlaWdodCA+IHRoaXMueSArIHRoaXMucG9ja2V0LnkgKyB0aGlzLnBvY2tldC5oZWlnaHQpIHsgLy9Tb3V0aFxuXHRcdFx0dGhpcy55ID0gdGhpcy50YXJnZXQueSArIHRoaXMudGFyZ2V0LmhlaWdodCAtIHRoaXMucG9ja2V0LnkgLSB0aGlzLnBvY2tldC5oZWlnaHQ7XG5cdFx0fVxuXG5cdFx0Ly9Eb24ndCBsZXQgdGhlIGNhbWVyYSBnbyBvdXRzaWRlIG9mIHRoZSBmaWVsZFxuXHRcdGlmKHRoaXMueCA8IHRoaXMuZmllbGQueCkgeyAvL1dlc3Rcblx0XHRcdHRoaXMueCA9IHRoaXMuZmllbGQueDtcblx0XHR9XG5cblx0XHRpZih0aGlzLnggKyB0aGlzLndpZHRoID4gdGhpcy5maWVsZC54ICsgdGhpcy5maWVsZC53aWR0aCkgeyAvL0Vhc3Rcblx0XHRcdHRoaXMueCA9IHRoaXMuZmllbGQueCt0aGlzLmZpZWxkLndpZHRoIC0gdGhpcy53aWR0aDtcblx0XHR9XG5cblx0XHRpZih0aGlzLnkgPCB0aGlzLmZpZWxkLnkpIHsgLy9Ob3J0aFxuXHRcdFx0dGhpcy55ID0gdGhpcy5maWVsZC55O1xuXHRcdH1cblxuXHRcdGlmKHRoaXMueSArIHRoaXMuaGVpZ2h0ID4gdGhpcy5maWVsZC55ICsgdGhpcy5maWVsZC5oZWlnaHQpIHsgLy9Tb3V0aFxuXHRcdFx0dGhpcy55ID0gdGhpcy5maWVsZC55K3RoaXMuZmllbGQuaGVpZ2h0IC0gdGhpcy5oZWlnaHQ7XG5cdFx0fVxuXG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0Ly8gY3R4LmJlZ2luUGF0aCgpO1xuXHQgLy8gICAgY3R4LnJlY3QodGhpcy5wb2NrZXQueCwgdGhpcy5wb2NrZXQueSwgdGhpcy5wb2NrZXQud2lkdGgsIHRoaXMucG9ja2V0LmhlaWdodCk7XG5cdCAvLyAgICBjdHguY2xvc2VQYXRoKCk7XG5cdCAvLyAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5wb2NrZXQuY29sb3I7XG5cdCAvLyAgICBjdHguZmlsbCgpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ2FtZXJhOyIsInZhciBCYXNlT2JqZWN0ID0gcmVxdWlyZSgnLi9iYXNlT2JqZWN0Jyk7XG52YXIgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKTtcblxuY2xhc3MgQ2hhcmFjdGVyIGV4dGVuZHMgQmFzZU9iamVjdCB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0c3VwZXIoKTtcblx0XHR0aGlzLnggPSAwO1xuXHRcdHRoaXMueSA9IDA7XG5cdFx0dGhpcy5hbGl2ZSA9IHRydWU7XG5cdFx0dGhpcy5oZWFsdGggPSAzO1xuXHRcdHRoaXMud2lkdGggPSA0MDtcblx0XHR0aGlzLmhlaWdodCA9IDQwO1xuXHRcdHRoaXMuY29sb3IgPSAnI2ZmZmZmZic7XG5cdFx0dGhpcy5jb2xvckFsaXZlID0gJyNmZmZmZmYnO1xuXHRcdHRoaXMuaGl0Q29sb3IgPSAnIzk2MGYwZic7XG5cdFx0dGhpcy5zcGVlZCA9IDQwMDtcblx0XHR0aGlzLmNvbGxpc2lvblR5cGUgPSBcInBsYXllclwiO1xuXHRcdHRoaXMub25NYWduZXRpYyA9IGZhbHNlO1xuXHRcdHRoaXMuc2hvb3RpbmdJbnRlcnZhbCA9IDAuMjtcblx0XHR0aGlzLnNob290aW5nQ29vbGRvd24gPSAwO1xuXHRcdHRoaXMuYnVsbGV0T2Zmc2V0ID0gMjA7XG5cdFx0dGhpcy5idWxsZXRTcGVlZCA9IDYwMDtcblx0XHR0aGlzLmluaXQgPSBmYWxzZTtcblx0XHR0aGlzLnRyYWlsVXBkYXRlID0gMDtcblx0XHR0aGlzLmludnVsbiA9IGZhbHNlO1xuXHRcdHRoaXMuaW52dWxuVGltZXIgPSAwO1xuXHRcdHRoaXMuaW52dWxuVGltZSA9IC4yNTtcblx0XHR0aGlzLmxhc3RQb3NpdGlvbnMgPSBbXG5cdFx0XHR7eDowLHk6MH0sXG5cdFx0XHR7eDowLHk6MH0sXG5cdFx0XHR7eDowLHk6MH0sXG5cdFx0XHR7eDowLHk6MH0sXG5cdFx0XHR7eDowLHk6MH0sXG5cdFx0XHR7eDowLHk6MH0sXG5cdFx0XHR7eDowLHk6MH0sXG5cdFx0XHR7eDowLHk6MH0sXG5cdFx0XHR7eDowLHk6MH0sXG5cdFx0XHR7eDowLHk6MH0sXG5cdFx0XTtcblx0fVxuXG5cdHNldENvbXBhc3MoY29tcGFzcykge1xuXHRcdHRoaXMuY29tcGFzcyA9IGNvbXBhc3M7XG5cdFx0dGhpcy53YXlwb2ludHMgPSBnYW1lT2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZWxlbSwgaSwgYXJyYXkpIHtcblx0ICAgICAgcmV0dXJuIGVsZW0uY29sbGlzaW9uVHlwZSA9PT0gXCJ0cmlnZ2VyXCIgJiYgZWxlbS50cmlnZ2VyRGF0YS50eXBlID09PSBcIndheXBvaW50XCI7XG5cdCAgXHR9KTtcblx0ICBcdHRoaXMuY29tcGFzcy5zZXRUYXJnZXQodGhpcyx0aGlzLmdldEN1cnJlbnRXYXlwb2ludCgpKTtcblx0fVxuXG5cdGdldEN1cnJlbnRXYXlwb2ludCgpIHtcblx0XHRmb3IodmFyIHdheXBvaW50IGluIHRoaXMud2F5cG9pbnRzKSB7XG5cdFx0XHRpZih0aGlzLndheXBvaW50c1t3YXlwb2ludF0udHJpZ2dlckRhdGEudmFsdWUgPT0gZ2FtZS5jdXJyZW50V2F5cG9pbnQpIHtcblx0XHRcdFx0cmV0dXJuIHRoaXMud2F5cG9pbnRzW3dheXBvaW50XTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvLyBzaG9vdChkaXJlY3Rpb24pIHtcblx0Ly8gXHRpZih0aGlzLnNob290aW5nQ29vbGRvd24gPCAwKSB7XG5cdC8vIFx0XHR0aGlzLnNob290aW5nQ29vbGRvd24gPSB0aGlzLnNob290aW5nSW50ZXJ2YWw7XG5cdC8vIFx0XHR2YXIgYnVsbGV0ID0gbmV3IEJ1bGxldCgpO1xuXHQvLyBcdFx0YnVsbGV0LmJ1bGxldFR5cGUgPSBcImNoYXJhY3RlclwiO1xuXHQvLyBcdFx0c3dpdGNoKGRpcmVjdGlvbikge1xuXHQvLyBcdFx0XHRjYXNlIFwidXBcIjpcblx0Ly8gXHRcdFx0XHRidWxsZXQuc2V0UG9zaXRpb24odGhpcy54K3RoaXMud2lkdGgvMix0aGlzLnkgLSB0aGlzLmJ1bGxldE9mZnNldCk7XG5cdC8vIFx0XHRcdFx0YnVsbGV0LnNldFZlbG9jaXR5KDAsLXRoaXMuYnVsbGV0U3BlZWQpO1xuXHQvLyBcdFx0XHRcdGJyZWFrO1xuXHQvLyBcdFx0XHRjYXNlIFwiZG93blwiOlxuXHQvLyBcdFx0XHRcdGJ1bGxldC5zZXRQb3NpdGlvbih0aGlzLngrdGhpcy53aWR0aC8yLHRoaXMueSArIHRoaXMuaGVpZ2h0ICsgdGhpcy5idWxsZXRPZmZzZXQpO1xuXHQvLyBcdFx0XHRcdGJ1bGxldC5zZXRWZWxvY2l0eSgwLHRoaXMuYnVsbGV0U3BlZWQpO1xuXHQvLyBcdFx0XHRcdGJyZWFrO1xuXHQvLyBcdFx0XHRjYXNlIFwibGVmdFwiOlxuXHQvLyBcdFx0XHRcdGJ1bGxldC5zZXRQb3NpdGlvbih0aGlzLnggLSB0aGlzLmJ1bGxldE9mZnNldCx0aGlzLnkgKyB0aGlzLmhlaWdodC8yKTtcblx0Ly8gXHRcdFx0XHRidWxsZXQuc2V0VmVsb2NpdHkoLXRoaXMuYnVsbGV0U3BlZWQsMCk7XG5cdC8vIFx0XHRcdFx0YnJlYWs7XG5cdC8vIFx0XHRcdGNhc2UgXCJyaWdodFwiOlxuXHQvLyBcdFx0XHRcdGJ1bGxldC5zZXRQb3NpdGlvbih0aGlzLnggKyB0aGlzLndpZHRoICsgdGhpcy5idWxsZXRPZmZzZXQsdGhpcy55ICsgdGhpcy5oZWlnaHQvMik7XG5cdC8vIFx0XHRcdFx0YnVsbGV0LnNldFZlbG9jaXR5KHRoaXMuYnVsbGV0U3BlZWQsMCk7XG5cdC8vIFx0XHRcdFx0YnJlYWs7XG5cdC8vIFx0XHR9XG5cdC8vIFx0XHRnYW1lT2JqZWN0cy5wdXNoKGJ1bGxldCk7XG5cdC8vIFx0fVxuXHQvLyB9XG5cblx0a2lsbCgpIHtcblx0XHR0aGlzLmFsaXZlID0gZmFsc2U7XG5cdH1cblxuXHR1cGRhdGUoZWxhcHNlZCkge1xuXHRcdGlmKHRoaXMuYWxpdmUpIHtcblx0XHRcdHRoaXMuY29sb3IgPSB0aGlzLmNvbG9yQWxpdmU7XG5cblx0XHRcdGlmKCF0aGlzLmluaXQpIHtcblx0XHRcdFx0dGhpcy5jb21wYXNzLnNldFRhcmdldCh0aGlzLHRoaXMuZ2V0Q3VycmVudFdheXBvaW50KCkpO1xuXHRcdFx0XHR0aGlzLmluaXQgPSB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLnNob290aW5nQ29vbGRvd24gLT0gZWxhcHNlZDtcblxuXHRcdFx0dGhpcy5vbk1hZ25ldGljID0gZmFsc2U7XG5cblx0XHRcdC8vVGFrZSBpbiBpbnB1dCBhbmQgbW92ZSBjaGFyYWN0ZXIgYWNjb3JkaW5nbHlcblx0XHRcdGlmKGlucHV0LkQgfHwgaW5wdXQuUklHSFQpIHtcblx0XHRcdFx0dGhpcy54ICs9IHRoaXMuc3BlZWQqZWxhcHNlZDtcblx0XHRcdH0gZWxzZSBpZihpbnB1dC5BIHx8IGlucHV0LkxFRlQpIHtcblx0XHRcdFx0dGhpcy54IC09IHRoaXMuc3BlZWQqZWxhcHNlZDtcblx0XHRcdH1cblxuXHRcdFx0aWYoaW5wdXQuVyB8fCBpbnB1dC5VUCkge1xuXHRcdFx0XHR0aGlzLnkgLT0gdGhpcy5zcGVlZCplbGFwc2VkO1xuXHRcdFx0fSBlbHNlIGlmKGlucHV0LlMgfHwgaW5wdXQuRE9XTikge1xuXHRcdFx0XHR0aGlzLnkgKz0gdGhpcy5zcGVlZCplbGFwc2VkO1xuXHRcdFx0fVxuXG5cblx0XHRcdC8vQ2xhbXAgdG8gY2FtZXJhIGJvdW5kc1xuXHRcdFx0aWYodGhpcy54ICsgdGhpcy53aWR0aCA+IGNhbWVyYS54K2NhbWVyYS53aWR0aCkge1xuXHRcdFx0XHR0aGlzLnggPSBjYW1lcmEueCArIGNhbWVyYS53aWR0aCAtIHRoaXMud2lkdGg7XG5cdFx0XHR9IGVsc2UgaWYodGhpcy54IDwgY2FtZXJhLngpIHtcblx0XHRcdFx0dGhpcy54ID0gY2FtZXJhLng7XG5cdFx0XHR9XG5cblx0XHRcdGlmKHRoaXMueSArIHRoaXMuaGVpZ2h0ID4gY2FtZXJhLnkrY2FtZXJhLmhlaWdodCkge1xuXHRcdFx0XHR0aGlzLnkgPSBjYW1lcmEueSArIGNhbWVyYS5oZWlnaHQgLSB0aGlzLmhlaWdodDtcblx0XHRcdH0gZWxzZSBpZih0aGlzLnkgPCBjYW1lcmEueSkge1xuXHRcdFx0XHR0aGlzLnkgPSBjYW1lcmEueTtcblx0XHRcdH1cblxuXHRcdFx0Ly9TaG9vdGluZyBMb2dpY1xuXHRcdFx0Ly8gaWYoaW5wdXQuTEVGVCkge1xuXHRcdFx0Ly8gXHR0aGlzLnNob290KFwibGVmdFwiKTtcblx0XHRcdC8vIH0gZWxzZSBpZihpbnB1dC5SSUdIVCkge1xuXHRcdFx0Ly8gXHR0aGlzLnNob290KFwicmlnaHRcIik7XG5cdFx0XHQvLyB9IGVsc2UgaWYoaW5wdXQuVVApIHtcblx0XHRcdC8vIFx0dGhpcy5zaG9vdChcInVwXCIpO1xuXHRcdFx0Ly8gfSBlbHNlIGlmKGlucHV0LkRPV04pIHtcblx0XHRcdC8vIFx0dGhpcy5zaG9vdChcImRvd25cIik7XG5cdFx0XHQvLyB9XG5cblx0XHRcdC8vQ2hlY2sgZm9yIHN0YXRpYyBjb2xsaXNpb25zXG5cdFx0XHR2YXIgY29sbGlkaW5nID0gdHJ1ZTtcblx0XHRcdC8vd2hpbGUoY29sbGlkaW5nKSB7XG5cdFx0XHRcdHZhciBjb2xsaXNpb25PYmogPSBzdXBlci5jaGVja0ZvclN0YXRpY0VudGl0eUNvbGxpc2lvbnMoKTtcblx0XHRcdFx0Zm9yKHZhciBjb2xsaXNpb24gaW4gY29sbGlzaW9uT2JqLmNvbGxpc2lvbnMpIHtcblx0XHRcdFx0XHRpZihjb2xsaXNpb25PYmouY29sbGlzaW9uc1tjb2xsaXNpb25dLnZhbHVlID09PSB0cnVlICYmIGNvbGxpc2lvbk9iai5jb2xsaXNpb25zW2NvbGxpc2lvbl0udHlwZSA9PT0gXCJzdGF0aWNcIikge1xuXHRcdFx0XHRcdFx0aWYoTWF0aC5hYnMoY29sbGlzaW9uT2JqLmNvbGxpc2lvbnNbY29sbGlzaW9uXS54QW1vdW50KSA+IE1hdGguYWJzKGNvbGxpc2lvbk9iai5jb2xsaXNpb25zW2NvbGxpc2lvbl0ueUFtb3VudCkpIHtcblx0XHRcdFx0XHRcdFx0dGhpcy55IC09IGNvbGxpc2lvbk9iai5jb2xsaXNpb25zW2NvbGxpc2lvbl0ueUFtb3VudDtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoaXMueCAtPSBjb2xsaXNpb25PYmouY29sbGlzaW9uc1tjb2xsaXNpb25dLnhBbW91bnQ7XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdC8vQ2hlY2sgZm9yIHRyaWdnZXJzXG5cdFx0XHR2YXIgdHJpZ2dlckNvbGxpc2lvbk9iaiA9IHN1cGVyLmNoZWNrRm9yVHJpZ2dlckNvbGxpc2lvbnMoKTtcblx0XHRcdGlmKHRyaWdnZXJDb2xsaXNpb25PYmoudmFsdWUgPT09IHRydWUgJiYgdHJpZ2dlckNvbGxpc2lvbk9iai50eXBlID09PSBcInRyaWdnZXJcIikge1xuXHRcdFx0XHR2YXIgb3RoZXIgPSB0cmlnZ2VyQ29sbGlzaW9uT2JqLm90aGVyO1xuXHRcdFx0XHRzd2l0Y2gob3RoZXIudHJpZ2dlckRhdGEudHlwZSkge1xuXHRcdFx0XHRcdGNhc2UgXCJ3YXlwb2ludFwiOlxuXHRcdFx0XHRcdFx0Ly9nYW1lLmN1cnJlbnRXYXlwb2ludCA9IG90aGVyLnRyaWdnZXJEYXRhLnZhbHVlO1xuXHRcdFx0XHRcdFx0Z2FtZS5zZXRDdXJyZW50V2F5cG9pbnQoZ2FtZS5jdXJyZW50V2F5cG9pbnQrMSk7XG5cdFx0XHRcdFx0XHR0aGlzLmNvbXBhc3Muc2V0VGFyZ2V0KHRoaXMsdGhpcy5nZXRDdXJyZW50V2F5cG9pbnQoKSk7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlIFwibWFnbmV0aWNcIjpcblx0XHRcdFx0XHRcdHRoaXMub25NYWduZXRpYyA9IHRydWU7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKG90aGVyLnRyaWdnZXJEYXRhLm9uZXRpbWUgPT0gdHJ1ZSkge1xuXHRcdFx0XHRcdG90aGVyLmtpbGwoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRpZih0aGlzLm9uTWFnbmV0aWMpIHtcblx0XHRcdFx0dGhpcy5jb21wYXNzLmlzQ29uZnVzZWQgPSB0cnVlO1xuXHRcdFx0XHRnYW1lLnNvdW5kcy5tYWduZXQucGxheSgpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5jb21wYXNzLmlzQ29uZnVzZWQgPSBmYWxzZTtcblx0XHRcdFx0Z2FtZS5zb3VuZHMubWFnbmV0LnBhdXNlKCk7XG5cdFx0XHR9XG5cblxuXG5cdFx0XHRpZighdGhpcy5pbnZ1bG4pIHtcblx0XHRcdFx0dmFyIGJ1bGxldHMgPSBzdXBlci5jaGVja0ZvckJ1bGxldENvbGxpc2lvbnMoKTtcblx0XHRcdFx0aWYoYnVsbGV0cy5jb2xsaXNpb25zLmxlbmd0aCA+IDApIHtcblx0XHRcdFx0XHRmb3IodmFyIGJ1bGxldCBpbiBidWxsZXRzLmNvbGxpc2lvbnMpIHtcblx0XHRcdFx0XHRcdHZhciBidWxsZXRPYmogPSBidWxsZXRzLmNvbGxpc2lvbnNbYnVsbGV0XTtcblx0XHRcdFx0XHRcdGlmKGJ1bGxldE9iai5idWxsZXRUeXBlID09IFwiZW5lbXlcIikge1xuXHRcdFx0XHRcdFx0XHRidWxsZXRPYmoua2lsbCgpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLmhlYWx0aCAtLTtcblx0XHRcdFx0XHRcdFx0Ly90aGlzLmNvbG9yID0gdGhpcy5oaXRDb2xvcjtcblx0XHRcdFx0XHRcdFx0dGhpcy5pbnZ1bG4gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRnYW1lLnNvdW5kcy5oaXQucGxheSgpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLmludnVsblRpbWVyID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGVuZW1pZXMgPSBzdXBlci5jaGVja0ZvckVuZW15Q29sbGlzaW9ucygpO1xuXHRcdFx0XHRcdGlmKGVuZW1pZXMuY29sbGlzaW9ucy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdFx0XHRmb3IodmFyIGVuZW15IGluIGVuZW1pZXMuY29sbGlzaW9ucykge1xuXHRcdFx0XHRcdFx0XHR2YXIgZW5lbXlPYmogPSBlbmVtaWVzLmNvbGxpc2lvbnNbZW5lbXldO1xuXHRcdFx0XHRcdFx0XHR0aGlzLmhlYWx0aCAtLTtcblx0XHRcdFx0XHRcdFx0Ly90aGlzLmNvbG9yID0gdGhpcy5oaXRDb2xvcjtcblx0XHRcdFx0XHRcdFx0dGhpcy5pbnZ1bG4gPSB0cnVlO1xuXHRcdFx0XHRcdFx0XHRnYW1lLnNvdW5kcy5oaXQucGxheSgpO1xuXHRcdFx0XHRcdFx0XHR0aGlzLmludnVsblRpbWVyID0gMDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoaXMuY29sb3IgPSB0aGlzLmhpdENvbG9yO1xuXHRcdFx0XHR0aGlzLmludnVsblRpbWVyICs9IGVsYXBzZWQ7XG5cdFx0XHRcdGlmKHRoaXMuaW52dWxuVGltZXIgPiB0aGlzLmludnVsblRpbWUpIHtcblx0XHRcdFx0XHR0aGlzLmludnVsbiA9IGZhbHNlO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmKHRoaXMuaGVhbHRoIDw9IDApIHtcblx0XHRcdFx0Z2FtZS5odWQuZmFkZVRvRGVhZCgpO1xuXHRcdFx0XHR0aGlzLmtpbGwoKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYodGhpcy50cmFpbFVwZGF0ZSAlIDIgPT0gMCkge1xuXHRcdFx0dGhpcy5sYXN0UG9zaXRpb25zLnVuc2hpZnQoe3g6dGhpcy54LHk6dGhpcy55fSk7XG5cdFx0XHR0aGlzLmxhc3RQb3NpdGlvbnMucG9wKCk7XG5cdFx0fVxuXHRcdHRoaXMudHJhaWxVcGRhdGUrKztcblx0XHRpZih0aGlzLnRyYWlsVXBkYXRlID4gMTAwKSB7XG5cdFx0XHR0aGlzLnRyYWlsVXBkYXRlID0gMDtcblx0XHR9XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0aWYodGhpcy5hbGl2ZSkge1xuXHRcdFx0dmFyIGFscGhhID0gMTtcblx0XHRcdGlmKHRoaXMuaW52dWxuKSB7XG5cdFx0XHRcdGFscGhhID0gLjU7XG5cdFx0XHRcdGN0eC5nbG9iYWxBbHBoYSA9IGFscGhhO1xuXHRcdFx0fVxuXHQgICAgXHRjdHguYmVnaW5QYXRoKCk7XG4gICAgXHRcdGN0eC5hcmModGhpcy54LWNhbWVyYS54K3RoaXMud2lkdGgvMiwgdGhpcy55LWNhbWVyYS55K3RoaXMuaGVpZ2h0LzIsIHRoaXMud2lkdGgvMiwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuICAgIFx0XHRjdHguY2xvc2VQYXRoKCk7XG4gICAgXHRcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgIFx0XHRjdHguZmlsbCgpO1xuXG4gICAgXHRcdGZvcih2YXIgaSA9IHRoaXMubGFzdFBvc2l0aW9ucy5sZW5ndGgtMTsgaSA+PSAwOyBpLS0pIHtcblx0ICAgIFx0XHRpZihpICE9IDApIHtcblx0XHQgICAgXHRcdHZhciBhbHBoYVZhbHVlID0gKHRoaXMubGFzdFBvc2l0aW9ucy5sZW5ndGgtaSkqLjEqYWxwaGE7XG5cdFx0ICAgIFx0XHRjdHguYmVnaW5QYXRoKCk7XG5cdFx0ICAgIFx0XHRjdHguYXJjKHRoaXMubGFzdFBvc2l0aW9uc1tpXS54LWNhbWVyYS54K3RoaXMud2lkdGgvMisoTWF0aC5yYW5kb20oKSo0LTIpLCB0aGlzLmxhc3RQb3NpdGlvbnNbaV0ueS1jYW1lcmEueSt0aGlzLmhlaWdodC8yKyhNYXRoLnJhbmRvbSgpKjQtMiksIHRoaXMud2lkdGgvMioodGhpcy5sYXN0UG9zaXRpb25zLmxlbmd0aC1pKSouMSwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuXHRcdCAgICBcdFx0Y3R4LmNsb3NlUGF0aCgpO1xuXHRcdCAgICBcdFx0Y3R4LmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XG5cdFx0ICAgIFx0XHRjdHguZ2xvYmFsQWxwaGEgPSBhbHBoYVZhbHVlO1xuXHRcdCAgICBcdFx0Y3R4LmZpbGwoKTtcblx0XHQgICAgXHR9XG5cdCAgICBcdH1cblx0ICAgIFx0Y3R4Lmdsb2JhbEFscGhhID0gMTtcblx0XHR9XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDaGFyYWN0ZXI7IiwiY2xhc3MgQ29tcGFzcyB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5jb2xvciA9ICcjZmZmZmZmJztcblx0XHR0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIFx0dGhpcy5jYW52YXMud2lkdGggPSAxNTA7XG4gICAgXHR0aGlzLmNhbnZhcy5oZWlnaHQgPSAxNTA7XG4gICAgXHR0aGlzLmN0eCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgXHR0aGlzLmN1cnJlbnRBbmdsZTtcbiAgICBcdHRoaXMuYW5nbGVEZWcgPSAwO1xuICAgIFx0dGhpcy5pc0NvbmZ1c2VkID0gZmFsc2U7XG4gICAgXHR0aGlzLmNvbmZ1c2VkU3BlZWQgPSAyMDA7XG4gICAgXHR0aGlzLnRhcmdldCA9IG51bGw7XG5cdH1cblxuXHRzZXRUYXJnZXQoaG9sZGVyLCB0YXJnZXQpIHtcblx0XHR0aGlzLmhvbGRlciA9IGhvbGRlcjtcblx0XHR0aGlzLnRhcmdldCA9IHRhcmdldDtcblx0fVxuXG5cdHVwZGF0ZShlbGFwc2VkKSB7XG5cdFx0aWYodGhpcy50YXJnZXQgIT0gbnVsbCkge1xuXHRcdFx0aWYodGhpcy5pc0NvbmZ1c2VkKSB7XG5cdFx0XHRcdHRoaXMuYW5nbGVEZWcgPSB0aGlzLmN1cnJlbnRBbmdsZSArIHRoaXMuY29uZnVzZWRTcGVlZCplbGFwc2VkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5hbmdsZURlZyA9IE1hdGguYXRhbjIoKHRoaXMudGFyZ2V0LnkrdGhpcy50YXJnZXQuaGVpZ2h0LzIpIC0gKHRoaXMuaG9sZGVyLnkrdGhpcy5ob2xkZXIuaGVpZ2h0LzIpLCAodGhpcy50YXJnZXQueCt0aGlzLnRhcmdldC53aWR0aC8yKSAtICh0aGlzLmhvbGRlci54KSt0aGlzLmhvbGRlci5oZWlnaHQvMikgKiAxODAgLyBNYXRoLlBJO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLmN1cnJlbnRBbmdsZSA9IHRoaXMuYW5nbGVEZWc7XG5cdFx0fVxuXHR9XG5cblxuXHRyZW5kZXIoKSB7XG5cdFx0dGhpcy5jdHguY2xlYXJSZWN0KDAsMCx0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcblxuXHRcdGlmKHRoaXMuaXNDb25mdXNlZCkge1xuXHRcdFx0dGhpcy5jdHguZ2xvYmFsQWxwaGEgPSAuMjtcblx0XHR9XG5cdFx0Ly90aGlzLmN0eC5zaGFkb3dCbHVyID0gNTtcblx0XHQvL3RoaXMuY3R4LnNoYWRvd0NvbG9yID0gXCIjZjQ0MmYxXCI7XG5cdFx0dGhpcy5jdHguYmVnaW5QYXRoKCk7XG5cdCAgICB0aGlzLmN0eC5hcmMoNzUsIDc1LCA1MCwgMCwgTWF0aC5QSSAqIDIsIHRydWUpO1xuXHQgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG5cdCAgICB0aGlzLmN0eC5saW5lV2lkdGggPSA1O1xuXHQgICAgdGhpcy5jdHguc3Ryb2tlU3R5bGUgPSB0aGlzLmNvbG9yO1xuXHQgICAgdGhpcy5jdHguZmlsbFN0eWxlID0gZ2FtZS5wYXR0ZXJucy5jb21wYXNzR3JhZGllbnQ7XG5cdCAgICB0aGlzLmN0eC5maWxsKCk7XG5cdCAgICB0aGlzLmN0eC5zdHJva2UoKTtcblxuXHQgICAgLy90aGlzLnNoYWRvd0JsdXIgPSAwO1xuXHQgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgXHR0aGlzLmN0eC5tb3ZlVG8oNzUsIDM1KTtcbiAgICBcdHRoaXMuY3R4LmxpbmVUbyg4NSwgNTApO1xuICAgIFx0dGhpcy5jdHgubGluZVRvKDY1LCA1MCk7XG4gICAgXHR0aGlzLmN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuICAgIFx0dGhpcy5jdHguZmlsbCgpO1xuXG4gICAgXHRlbmdpbmUuZHJhd1JvdGF0ZWRJbWFnZShjdHgsdGhpcy5jYW52YXMsIDgwLCAzNzAsIHRoaXMuYW5nbGVEZWcrOTApO1xuXG4gICAgXHR0aGlzLmN0eC5nbG9iYWxBbHBoYSA9IDE7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb21wYXNzOyIsInZhciBCYXNlT2JqZWN0ID0gcmVxdWlyZSgnLi9iYXNlT2JqZWN0Jyk7XG52YXIgQnVsbGV0ID0gcmVxdWlyZSgnLi9idWxsZXQnKTtcblxuY2xhc3MgRW5lbXkgZXh0ZW5kcyBCYXNlT2JqZWN0IHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMueCA9IDA7XG5cdFx0dGhpcy55ID0gMDtcblx0XHR0aGlzLndpZHRoID0gNDA7XG5cdFx0dGhpcy5oZWlnaHQgPSA0MDtcblx0XHR0aGlzLnJhZGl1c0FjdGl2YXRlID0gMjAwO1xuXHRcdHRoaXMucmFkaXVzRGVhY3RpdmF0ZSA9IDM1MDtcblx0XHR0aGlzLmNvbG9yQWN0aXZlID0gJyNmZjAwMDAnO1xuXHRcdHRoaXMuY29sb3JJbmFjdGl2ZSA9ICcjMDAwMDAwJztcblx0XHR0aGlzLmhpdENvbG9yID0gJyNhNDQyZjQnO1xuXHRcdHRoaXMuYWN0aXZlID0gZmFsc2U7XG5cdFx0dGhpcy5jb2xvciA9ICcjMDAwMDAwJztcblx0XHR0aGlzLnNwZWVkID0gNzU7XG5cdFx0dGhpcy5oZWFsdGggPSAyO1xuXHRcdHRoaXMuY29sbGlzaW9uVHlwZSA9IFwiZW5lbXlcIjtcblx0XHR0aGlzLnNob290aW5nSW50ZXJ2YWwgPSAuODtcblx0XHR0aGlzLnNob290aW5nQ29vbGRvd24gPSAwO1xuXHRcdHRoaXMuYnVsbGV0T2Zmc2V0ID0gMjA7XG5cdFx0dGhpcy5idWxsZXRTcGVlZCA9IDYwMDtcblx0XHR0aGlzLmN1cnJlbnRseUhpdCA9IGZhbHNlO1xuXHRcdHRoaXMucmFkYXJQdWxzZVRpbWUgPSAzO1xuXHRcdHRoaXMucmFkYXJQdWxzZURpc3RhbmNlID0gMjAwO1xuXHRcdHRoaXMucmFkYXJQdWxzZVRpbWVyID0gMDtcblx0fVxuXG5cdHNob290KGRpcmVjdGlvbikge1xuXHRcdGlmKHRoaXMuc2hvb3RpbmdDb29sZG93biA8IDApIHtcblx0XHRcdHRoaXMuc2hvb3RpbmdDb29sZG93biA9IHRoaXMuc2hvb3RpbmdJbnRlcnZhbDtcblx0XHRcdHZhciBidWxsZXQgPSBuZXcgQnVsbGV0KCk7XG5cdFx0XHRidWxsZXQuYnVsbGV0VHlwZSA9IFwiZW5lbXlcIjtcblx0XHRcdHN3aXRjaChkaXJlY3Rpb24pIHtcblx0XHRcdFx0Y2FzZSBcInVwXCI6XG5cdFx0XHRcdFx0YnVsbGV0LnNldFBvc2l0aW9uKHRoaXMueCt0aGlzLndpZHRoLzIsdGhpcy55IC0gdGhpcy5idWxsZXRPZmZzZXQpO1xuXHRcdFx0XHRcdGJ1bGxldC5zZXRWZWxvY2l0eSgwLC10aGlzLmJ1bGxldFNwZWVkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImRvd25cIjpcblx0XHRcdFx0XHRidWxsZXQuc2V0UG9zaXRpb24odGhpcy54K3RoaXMud2lkdGgvMix0aGlzLnkgKyB0aGlzLmhlaWdodCArIHRoaXMuYnVsbGV0T2Zmc2V0KTtcblx0XHRcdFx0XHRidWxsZXQuc2V0VmVsb2NpdHkoMCx0aGlzLmJ1bGxldFNwZWVkKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImxlZnRcIjpcblx0XHRcdFx0XHRidWxsZXQuc2V0UG9zaXRpb24odGhpcy54IC0gdGhpcy5idWxsZXRPZmZzZXQsdGhpcy55ICsgdGhpcy5oZWlnaHQvMik7XG5cdFx0XHRcdFx0YnVsbGV0LnNldFZlbG9jaXR5KC10aGlzLmJ1bGxldFNwZWVkLDApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicmlnaHRcIjpcblx0XHRcdFx0XHRidWxsZXQuc2V0UG9zaXRpb24odGhpcy54ICsgdGhpcy53aWR0aCArIHRoaXMuYnVsbGV0T2Zmc2V0LHRoaXMueSArIHRoaXMuaGVpZ2h0LzIpO1xuXHRcdFx0XHRcdGJ1bGxldC5zZXRWZWxvY2l0eSh0aGlzLmJ1bGxldFNwZWVkLDApO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0Z2FtZU9iamVjdHMucHVzaChidWxsZXQpO1xuXHRcdFx0Z2FtZS5zb3VuZHMuc2hvb3QucGxheSgpO1xuXHRcdH1cblx0fVxuXG5cdGtpbGwoKSB7XG5cdFx0dmFyIGkgPSBnYW1lT2JqZWN0cy5pbmRleE9mKHRoaXMpO1xuICAgIFx0Z2FtZU9iamVjdHMuc3BsaWNlKGksIDEpO1xuXHR9XG5cblx0dXBkYXRlKGVsYXBzZWQpIHtcblxuXHRcdHRoaXMuc2hvb3RpbmdDb29sZG93biAtPSBlbGFwc2VkO1xuXG5cdFx0Ly9UYWtlIGluIGlucHV0IGFuZCBtb3ZlIGNoYXJhY3RlciBhY2NvcmRpbmdseVxuXHRcdC8vIGlmKGlucHV0LkQpIHtcblx0XHQvLyBcdHRoaXMueCArPSB0aGlzLnNwZWVkKmVsYXBzZWQ7XG5cdFx0Ly8gfSBlbHNlIGlmKGlucHV0LkEpIHtcblx0XHQvLyBcdHRoaXMueCAtPSB0aGlzLnNwZWVkKmVsYXBzZWQ7XG5cdFx0Ly8gfVxuXG5cdFx0Ly8gaWYoaW5wdXQuVykge1xuXHRcdC8vIFx0dGhpcy55IC09IHRoaXMuc3BlZWQqZWxhcHNlZDtcblx0XHQvLyB9IGVsc2UgaWYoaW5wdXQuUykge1xuXHRcdC8vIFx0dGhpcy55ICs9IHRoaXMuc3BlZWQqZWxhcHNlZDtcblx0XHQvLyB9XG5cblx0XHQvL3VwZGF0ZSByYWRhciBwdWxzZVxuXHRcdHRoaXMucmFkYXJQdWxzZVRpbWVyICs9IGVsYXBzZWQ7XG5cdFx0aWYodGhpcy5yYWRhclB1bHNlVGltZXIgPiB0aGlzLnJhZGFyUHVsc2VUaW1lKSB7XG5cdFx0XHR0aGlzLnJhZGFyUHVsc2VUaW1lciA9IDA7XG5cdFx0fVxuXG5cblxuXHRcdGlmKCF0aGlzLmFjdGl2ZSkge1xuXHRcdFx0aWYoZW5naW5lLnJhZGl1c0RldGVjdChnYW1lLmNoYXJhY3Rlci54K2dhbWUuY2hhcmFjdGVyLndpZHRoLzIsZ2FtZS5jaGFyYWN0ZXIueStnYW1lLmNoYXJhY3Rlci5oZWlnaHQvMiwgdGhpcy54K3RoaXMud2lkdGgvMiwgdGhpcy55K3RoaXMuaGVpZ2h0LzIsdGhpcy5yYWRpdXNBY3RpdmF0ZSkpIHtcblx0XHRcdFx0dGhpcy5hY3RpdmUgPSB0cnVlO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZighZW5naW5lLnJhZGl1c0RldGVjdChnYW1lLmNoYXJhY3Rlci54K2dhbWUuY2hhcmFjdGVyLndpZHRoLzIsZ2FtZS5jaGFyYWN0ZXIueStnYW1lLmNoYXJhY3Rlci5oZWlnaHQvMiwgdGhpcy54K3RoaXMud2lkdGgvMiwgdGhpcy55K3RoaXMuaGVpZ2h0LzIsdGhpcy5yYWRpdXNEZWFjdGl2YXRlKSkge1xuXHRcdFx0XHR0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0fVxuXHRcdH1cblxuXG5cdFx0aWYodGhpcy5hY3RpdmUpIHtcblx0XHRcdHRoaXMuY29sb3IgPSB0aGlzLmNvbG9yQWN0aXZlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLmNvbG9yID0gdGhpcy5jb2xvckluYWN0aXZlO1xuXHRcdH1cblxuXHRcdGlmKHRoaXMuYWN0aXZlKSB7XG5cdFx0XHR0aGlzLnJhZGFyUHVsc2VUaW1lciA9IDA7XG5cdFx0XHRpZihNYXRoLmFicyhnYW1lLmNoYXJhY3Rlci54IC0gdGhpcy54KSA+IE1hdGguYWJzKGdhbWUuY2hhcmFjdGVyLnkgLSB0aGlzLnkpKSB7IC8vQ2hlY2sgaWYgaG9yaXpvbnRhbCBvciB2ZXJ0aWNhbCBkaXN0YW5jZSBpcyBiaWdnZXIgYW5kIHNob290IGJhc2VkIG9uIHRoYXQgZGV0ZXJtaW5hdGlvblxuXHRcdFx0XHRpZihnYW1lLmNoYXJhY3Rlci54ID4gdGhpcy54KSB7XG5cdFx0XHRcdFx0dGhpcy5zaG9vdChcInJpZ2h0XCIpO1xuXHRcdFx0XHR9IGVsc2UgaWYoZ2FtZS5jaGFyYWN0ZXIueCA8IHRoaXMueCkge1xuXHRcdFx0XHRcdHRoaXMuc2hvb3QoXCJsZWZ0XCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZihnYW1lLmNoYXJhY3Rlci55IDwgdGhpcy55KSB7XG5cdFx0XHRcdFx0dGhpcy5zaG9vdChcInVwXCIpO1xuXHRcdFx0XHR9IGVsc2UgaWYoZ2FtZS5jaGFyYWN0ZXIueSA+IHRoaXMueSkge1xuXHRcdFx0XHRcdHRoaXMuc2hvb3QoXCJkb3duXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGlmKGdhbWUuY2hhcmFjdGVyLnggPiB0aGlzLngpIHtcblx0XHRcdFx0dGhpcy54ICs9IHRoaXMuc3BlZWQqZWxhcHNlZDtcblx0XHRcdH0gZWxzZSBpZihnYW1lLmNoYXJhY3Rlci54IDwgdGhpcy54KSB7XG5cdFx0XHRcdHRoaXMueCAtPSB0aGlzLnNwZWVkKmVsYXBzZWQ7XG5cdFx0XHR9XG5cblx0XHRcdGlmKGdhbWUuY2hhcmFjdGVyLnkgPCB0aGlzLnkpIHtcblx0XHRcdFx0dGhpcy55IC09IHRoaXMuc3BlZWQqZWxhcHNlZDtcblx0XHRcdH0gZWxzZSBpZihnYW1lLmNoYXJhY3Rlci55ID4gdGhpcy55KSB7XG5cdFx0XHRcdHRoaXMueSArPSB0aGlzLnNwZWVkKmVsYXBzZWQ7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0Ly9DaGVjayBmb3Igc3RhdGljIGNvbGxpc2lvbnNcblx0XHR2YXIgY29sbGlkaW5nID0gdHJ1ZTtcblx0XHR2YXIgY29sbGlzaW9uT2JqID0gc3VwZXIuY2hlY2tGb3JTdGF0aWNFbnRpdHlDb2xsaXNpb25zKCk7XG5cdFx0aWYoY29sbGlzaW9uT2JqLmNvbGxpc2lvbnMubGVuZ3RoID4gMCkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhjb2xsaXNpb25PYmouY29sbGlzaW9ucyk7XG5cdFx0fVxuXHRcdGZvcih2YXIgY29sbGlzaW9uIGluIGNvbGxpc2lvbk9iai5jb2xsaXNpb25zKSB7XG5cdFx0XHRpZihjb2xsaXNpb25PYmouY29sbGlzaW9uc1tjb2xsaXNpb25dLnZhbHVlID09PSB0cnVlICYmIGNvbGxpc2lvbk9iai5jb2xsaXNpb25zW2NvbGxpc2lvbl0udHlwZSA9PT0gXCJzdGF0aWNcIikge1xuXHRcdFx0XHRpZihNYXRoLmFicyhjb2xsaXNpb25PYmouY29sbGlzaW9uc1tjb2xsaXNpb25dLnhBbW91bnQpID4gTWF0aC5hYnMoY29sbGlzaW9uT2JqLmNvbGxpc2lvbnNbY29sbGlzaW9uXS55QW1vdW50KSkge1xuXHRcdFx0XHRcdHRoaXMueSAtPSBjb2xsaXNpb25PYmouY29sbGlzaW9uc1tjb2xsaXNpb25dLnlBbW91bnQ7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGhpcy54IC09IGNvbGxpc2lvbk9iai5jb2xsaXNpb25zW2NvbGxpc2lvbl0ueEFtb3VudDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHRoaXMuY3VycmVudGx5SGl0ID0gZmFsc2U7XG5cdFx0dmFyIGJ1bGxldHMgPSBzdXBlci5jaGVja0ZvckJ1bGxldENvbGxpc2lvbnMoKTtcblx0XHRpZihidWxsZXRzLmNvbGxpc2lvbnMubGVuZ3RoID4gMCkge1xuXHRcdFx0Zm9yKHZhciBidWxsZXQgaW4gYnVsbGV0cy5jb2xsaXNpb25zKSB7XG5cdFx0XHRcdHZhciBidWxsZXRPYmogPSBidWxsZXRzLmNvbGxpc2lvbnNbYnVsbGV0XTtcblx0XHRcdFx0aWYoYnVsbGV0T2JqLmJ1bGxldFR5cGUgPT0gXCJjaGFyYWN0ZXJcIikge1xuXHRcdFx0XHRcdGJ1bGxldE9iai5raWxsKCk7XG5cdFx0XHRcdFx0dGhpcy5oZWFsdGggLS07XG5cdFx0XHRcdFx0dGhpcy5jdXJyZW50bHlIaXQgPSB0cnVlO1xuXHRcdFx0XHRcdHRoaXMuY29sb3IgPSB0aGlzLmhpdENvbG9yO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYodGhpcy5oZWFsdGggPD0gMCkge1xuXHRcdFx0dGhpcy5raWxsKCk7XG5cdFx0fVxuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdC8vRGVhY3RpdmF0ZSBSYWRpdXNcblx0XHQvLyBjdHguYmVnaW5QYXRoKCk7XG5cdFx0Ly8gY3R4LmFyYyh0aGlzLngtY2FtZXJhLngrdGhpcy53aWR0aC8yLHRoaXMueS1jYW1lcmEueSt0aGlzLmhlaWdodC8yLHRoaXMucmFkaXVzRGVhY3RpdmF0ZSwwKk1hdGguUEksMipNYXRoLlBJKTtcblx0IC8vICAgIGN0eC5jbG9zZVBhdGgoKTtcblx0IC8vICAgIGN0eC5maWxsU3R5bGUgPSAncmdiYSgyNTUsIDAsIDAsIC4zKSc7XG5cdCAvLyAgICBjdHguZmlsbCgpO1xuXG5cdCAgICAvL0FjdGl2YXRlIFJhZGl1c1xuXHQgLy8gICAgY3R4LmJlZ2luUGF0aCgpO1xuXHRcdC8vIGN0eC5hcmModGhpcy54LWNhbWVyYS54K3RoaXMud2lkdGgvMix0aGlzLnktY2FtZXJhLnkrdGhpcy5oZWlnaHQvMix0aGlzLnJhZGl1c0FjdGl2YXRlLDAqTWF0aC5QSSwyKk1hdGguUEkpO1xuXHQgLy8gICAgY3R4LmNsb3NlUGF0aCgpO1xuXHQgLy8gICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDI1NSwgMCwgMCwgLjcpJztcblx0IC8vICAgIGN0eC5maWxsKCk7XG5cdCBcdC8vd2hhdCBwZXJjZW50YWdlIG11Y2ggb2YgdGhlIHJhZGFyIHB1bHNlIHRpbWUgaGFzIHBhc3NlZD9cblx0XHR2YXIgcHVsc2VQZXJjZW50ID0gdGhpcy5yYWRhclB1bHNlVGltZXIvdGhpcy5yYWRhclB1bHNlVGltZTtcblx0XHR2YXIgb3BhY2l0eSA9IDEtcHVsc2VQZXJjZW50O1xuXG5cdFx0aWYoIXRoaXMuYWN0aXZlKSB7XG5cdFx0IFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdFx0Y3R4LmFyYyh0aGlzLngtY2FtZXJhLngrdGhpcy53aWR0aC8yLHRoaXMueS1jYW1lcmEueSt0aGlzLmhlaWdodC8yLHRoaXMucmFkYXJQdWxzZURpc3RhbmNlKnB1bHNlUGVyY2VudCwwKk1hdGguUEksMipNYXRoLlBJKTtcblx0XHRcdGN0eC5jbG9zZVBhdGgoKTtcblx0XHQgICAgY3R4LmZpbGxTdHlsZSA9ICdyZ2JhKDI1NSwgMCwgMCwgJytvcGFjaXR5KycpJztcblx0XHQgICAgY3R4LmZpbGwoKTtcblx0XHR9XG5cblxuXHQgICAgLy9SZWN0XG5cdCAgICBjdHguYmVnaW5QYXRoKCk7XG5cdFx0Y3R4LmFyYyh0aGlzLngtY2FtZXJhLngrdGhpcy53aWR0aC8yLCB0aGlzLnktY2FtZXJhLnkrdGhpcy5oZWlnaHQvMiwgdGhpcy53aWR0aC8yLCAwLCBNYXRoLlBJICogMiwgdHJ1ZSk7XG5cdCAgICBjdHguY2xvc2VQYXRoKCk7XG5cdCAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcblx0ICAgIGN0eC5maWxsKCk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBFbmVteTsiLCJ2YXIgRmFsc2VXYWxsID0gcmVxdWlyZSgnLi9mYWxzZVdhbGwnKTtcbnZhciBUcmlnZ2VyID0gcmVxdWlyZSgnLi90cmlnZ2VyJyk7XG5cbmNsYXNzIEVuZ2luZTEzIHtcblx0Y29uc3RydWN0b3IoY29udGV4dCkge1xuXHRcdHRoaXMuY3VycmVudFdheXBvaW50ID0gMDtcblx0XHR0aGlzLm9uTWFnbmV0aWMgPSBmYWxzZTtcblx0XHR0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuXHRcdHRoaXMuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcblx0XHR0aGlzLm5vaXNlQ2FudmFzID0gbnVsbDtcblx0XHR0aGlzLm5vaXNlQ2FudmFzQTAgPSBudWxsO1xuXHRcdHRoaXMubm9pc2VDYW52YXNBMSA9IG51bGw7XG5cdFx0dGhpcy5pbWFnZXNUb0xvYWQgPSB7XG5cdFx0XHR0cmVlczpmYWxzZSxcblx0XHRcdG1ldGFsOmZhbHNlXG5cdFx0fTtcblx0XHR0aGlzLm5vaXNlRnJhbWVJbmRleCA9IDA7XG5cdFx0dGhpcy5ub2lzZUZyYW1lc051bSA9IDEwO1xuXHRcdHRoaXMubm9pc2VGcmFtZXMgPSBbXTtcblx0XHR0aGlzLnJlYWR5ID0gZmFsc2U7XG5cblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0dGhpcy5wYXR0ZXJucyA9IHt9O1xuXHRcdHRoaXMucGF0dGVybnMubWV0YWwgPSBuZXcgSW1hZ2UoKTtcblx0XHR0aGlzLnBhdHRlcm5zLm1ldGFsLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhhdC5pbWFnZXNUb0xvYWQubWV0YWwgPSB0cnVlO1xuXHRcdFx0dGhhdC5jaGVja0lmTG9hZGVkKCk7XG5cdFx0fVxuXHRcdHRoaXMucGF0dGVybnMubWV0YWwuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaE1nQXlBSUFBQUFBQUFETXpNeUgvQzFoTlVDQkVZWFJoV0UxUVBEOTRjR0ZqYTJWMElHSmxaMmx1UFNMdnU3OGlJR2xrUFNKWE5VMHdUWEJEWldocFNIcHlaVk42VGxSamVtdGpPV1FpUHo0Z1BIZzZlRzF3YldWMFlTQjRiV3h1Y3pwNFBTSmhaRzlpWlRwdWN6cHRaWFJoTHlJZ2VEcDRiWEIwYXowaVFXUnZZbVVnV0UxUUlFTnZjbVVnTlM0MUxXTXdNakVnTnprdU1UVTBPVEV4TENBeU1ERXpMekV3THpJNUxURXhPalEzT2pFMklDQWdJQ0FnSUNBaVBpQThjbVJtT2xKRVJpQjRiV3h1Y3pweVpHWTlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1Rrdk1ESXZNakl0Y21SbUxYTjViblJoZUMxdWN5TWlQaUE4Y21SbU9rUmxjMk55YVhCMGFXOXVJSEprWmpwaFltOTFkRDBpSWlCNGJXeHVjenA0YlhBOUltaDBkSEE2THk5dWN5NWhaRzlpWlM1amIyMHZlR0Z3THpFdU1DOGlJSGh0Ykc1ek9uaHRjRTFOUFNKb2RIUndPaTh2Ym5NdVlXUnZZbVV1WTI5dEwzaGhjQzh4TGpBdmJXMHZJaUI0Yld4dWN6cHpkRkpsWmowaWFIUjBjRG92TDI1ekxtRmtiMkpsTG1OdmJTOTRZWEF2TVM0d0wzTlVlWEJsTDFKbGMyOTFjbU5sVW1WbUl5SWdlRzF3T2tOeVpXRjBiM0pVYjI5c1BTSkJaRzlpWlNCUWFHOTBiM05vYjNBZ1EwTWdLRTFoWTJsdWRHOXphQ2tpSUhodGNFMU5Pa2x1YzNSaGJtTmxTVVE5SW5odGNDNXBhV1E2T0VGR1EwVTFRems0T0RZd01URkZOMEV5TkRZNU56QTBNRGxHUWpVd1FqZ2lJSGh0Y0UxTk9rUnZZM1Z0Wlc1MFNVUTlJbmh0Y0M1a2FXUTZPRUZHUTBVMVEwRTRPRFl3TVRGRk4wRXlORFk1TnpBME1EbEdRalV3UWpnaVBpQThlRzF3VFUwNlJHVnlhWFpsWkVaeWIyMGdjM1JTWldZNmFXNXpkR0Z1WTJWSlJEMGllRzF3TG1scFpEbzRRVVpEUlRWRE56ZzROakF4TVVVM1FUSTBOamszTURRd09VWkNOVEJDT0NJZ2MzUlNaV1k2Wkc5amRXMWxiblJKUkQwaWVHMXdMbVJwWkRvNFFVWkRSVFZET0RnNE5qQXhNVVUzUVRJME5qazNNRFF3T1VaQ05UQkNPQ0l2UGlBOEwzSmtaanBFWlhOamNtbHdkR2x2Ymo0Z1BDOXlaR1k2VWtSR1BpQThMM2c2ZUcxd2JXVjBZVDRnUEQ5NGNHRmphMlYwSUdWdVpEMGljaUkvUGdILy92MzgrL3I1K1BmMjlmVHo4dkh3Nys3dDdPdnE2ZWpuNXVYazQrTGg0Ti9lM2R6YjJ0blkxOWJWMU5QUzBkRFB6czNNeThySnlNZkd4Y1REd3NIQXY3Njl2THU2dWJpM3RyVzBzN0t4c0srdXJheXJxcW1vcDZhbHBLT2lvYUNmbnAyY201cVptSmVXbFpTVGtwR1FqNDZOakl1S2lZaUhob1dFZzRLQmdIOStmWHg3ZW5sNGQzWjFkSE55Y1hCdmJtMXNhMnBwYUdkbVpXUmpZbUZnWDE1ZFhGdGFXVmhYVmxWVVUxSlJVRTlPVFV4TFNrbElSMFpGUkVOQ1FVQS9QajA4T3pvNU9EYzJOVFF6TWpFd0x5NHRMQ3NxS1NnbkppVWtJeUloSUI4ZUhSd2JHaGtZRnhZVkZCTVNFUkFQRGcwTUN3b0pDQWNHQlFRREFnRUFBQ0g1QkFBQUFBQUFMQUFBQUFBeUFESUFBQUpsakkrcHkrMFBvNXkwMnV1QTNoeW9EbjRnaDVYbWlhYnFpbzVrNG03aXlOYjJqZWRWck0ydVQ5TUpoOFRpamVlQjhZQXZvL01KSFNLWkhXb3ppczFxajB0bHpKcmNpc2RreE5UN1F3Zkw3TGI3Yk83RzErNjZIUWMvNUEzN3UvK2YweWZvVWdBQU93PT0nO1xuXHRcdC8vdGhpcy5wYXR0ZXJucy5tZXRhbC5kYXRhID0gY29udGV4dC5jcmVhdGVQYXR0ZXJuKHRoaXMucGF0dGVybnMubWV0YWwsICdyZXBlYXQnKTtcblx0XHR0aGlzLnBhdHRlcm5zLnRyZWVzID0gbmV3IEltYWdlKCk7XG5cdFx0dGhpcy5wYXR0ZXJucy50cmVlcy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcblx0XHRcdHRoYXQuaW1hZ2VzVG9Mb2FkLnRyZWVzID0gdHJ1ZTtcblx0XHRcdHRoYXQuY2hlY2tJZkxvYWRlZCgpO1xuXHRcdH1cblx0XHR0aGlzLnBhdHRlcm5zLnRyZWVzLnNyYyA9ICdkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhNZ0F5QUlBQUFBQUFBRE16TXlIL0MxaE5VQ0JFWVhSaFdFMVFQRDk0Y0dGamEyVjBJR0psWjJsdVBTTHZ1NzhpSUdsa1BTSlhOVTB3VFhCRFpXaHBTSHB5WlZONlRsUmplbXRqT1dRaVB6NGdQSGc2ZUcxd2JXVjBZU0I0Yld4dWN6cDRQU0poWkc5aVpUcHVjenB0WlhSaEx5SWdlRHA0YlhCMGF6MGlRV1J2WW1VZ1dFMVFJRU52Y21VZ05TNDFMV013TWpFZ056a3VNVFUwT1RFeExDQXlNREV6THpFd0x6STVMVEV4T2pRM09qRTJJQ0FnSUNBZ0lDQWlQaUE4Y21SbU9sSkVSaUI0Yld4dWN6cHlaR1k5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZNREl2TWpJdGNtUm1MWE41Ym5SaGVDMXVjeU1pUGlBOGNtUm1Pa1JsYzJOeWFYQjBhVzl1SUhKa1pqcGhZbTkxZEQwaUlpQjRiV3h1Y3pwNGJYQTlJbWgwZEhBNkx5OXVjeTVoWkc5aVpTNWpiMjB2ZUdGd0x6RXVNQzhpSUhodGJHNXpPbmh0Y0UxTlBTSm9kSFJ3T2k4dmJuTXVZV1J2WW1VdVkyOXRMM2hoY0M4eExqQXZiVzB2SWlCNGJXeHVjenB6ZEZKbFpqMGlhSFIwY0RvdkwyNXpMbUZrYjJKbExtTnZiUzk0WVhBdk1TNHdMM05VZVhCbEwxSmxjMjkxY21ObFVtVm1JeUlnZUcxd09rTnlaV0YwYjNKVWIyOXNQU0pCWkc5aVpTQlFhRzkwYjNOb2IzQWdRME1nS0UxaFkybHVkRzl6YUNraUlIaHRjRTFOT2tsdWMzUmhibU5sU1VROUluaHRjQzVwYVdRNk9FRkdRMFUxUXpVNE9EWXdNVEZGTjBFeU5EWTVOekEwTURsR1FqVXdRamdpSUhodGNFMU5Pa1J2WTNWdFpXNTBTVVE5SW5odGNDNWthV1E2T0VGR1EwVTFRelk0T0RZd01URkZOMEV5TkRZNU56QTBNRGxHUWpVd1FqZ2lQaUE4ZUcxd1RVMDZSR1Z5YVhabFpFWnliMjBnYzNSU1pXWTZhVzV6ZEdGdVkyVkpSRDBpZUcxd0xtbHBaRG80UVVaRFJUVkRNemc0TmpBeE1VVTNRVEkwTmprM01EUXdPVVpDTlRCQ09DSWdjM1JTWldZNlpHOWpkVzFsYm5SSlJEMGllRzF3TG1ScFpEbzRRVVpEUlRWRE5EZzROakF4TVVVM1FUSTBOamszTURRd09VWkNOVEJDT0NJdlBpQThMM0prWmpwRVpYTmpjbWx3ZEdsdmJqNGdQQzl5WkdZNlVrUkdQaUE4TDNnNmVHMXdiV1YwWVQ0Z1BEOTRjR0ZqYTJWMElHVnVaRDBpY2lJL1BnSC8vdjM4Ky9yNStQZjI5ZlR6OHZIdzcrN3Q3T3ZxNmVqbjV1WGs0K0xoNE4vZTNkemIydG5ZMTliVjFOUFMwZERQenMzTXk4ckp5TWZHeGNURHdzSEF2NzY5dkx1NnViaTN0clcwczdLeHNLK3VyYXlycXFtb3A2YWxwS09pb2FDZm5wMmNtNXFabUplV2xaU1RrcEdRajQ2TmpJdUtpWWlIaG9XRWc0S0JnSDkrZlh4N2VubDRkM1oxZEhOeWNYQnZibTFzYTJwcGFHZG1aV1JqWW1GZ1gxNWRYRnRhV1ZoWFZsVlVVMUpSVUU5T1RVeExTa2xJUjBaRlJFTkNRVUEvUGowOE96bzVPRGMyTlRRek1qRXdMeTR0TENzcUtTZ25KaVVrSXlJaElCOGVIUndiR2hrWUZ4WVZGQk1TRVJBUERnME1Dd29KQ0FjR0JRUURBZ0VBQUNINUJBQUFBQUFBTEFBQUFBQXlBRElBQUFLMGpJOEd5YzNyWWdKVTJrRGhiYm51MTMxVDU0a1lxWDFvWnE2bFNKcElMSjkwaThwdWV1M3d6b3NBZzV3aGNUUlV1WENybjIrVDdCbWxVYUh4QmJwYXI5Z0RsN1VGVXNXU2I1a2IxaGJOMlcvUURmYkM0N1k1dE11c3pmQk92ZnlvQkhnbktHampwOEJudUhXbzJBWklWd09KZUlQRW1CWmlxVWVaeVlUSjZaVHpPYmdrZWxaVjZ2Q0Vlcm01K2tmbStucTZDaGNyUzJwYk40dGE2enBYcVBrTC9DbVp1MlpNaFd4UnJQelh2UGg4YkZrQUFEcz0nO1xuXHRcdC8vdGhpcy5wYXR0ZXJucy50cmVlcy5kYXRhID0gY29udGV4dC5jcmVhdGVQYXR0ZXJuKHRoaXMucGF0dGVybnMudHJlZXMsICdyZXBlYXQnKTtcblxuXHRcdHRoaXMucGF0dGVybnMuY29tcGFzc0dyYWRpZW50ID0gY29udGV4dC5jcmVhdGVSYWRpYWxHcmFkaWVudCg3NSwgNzUsIDEwMCwgNzUsIDc1LCAwKTtcblx0XHR0aGlzLnBhdHRlcm5zLmNvbXBhc3NHcmFkaWVudC5hZGRDb2xvclN0b3AoMCwgJyMzMzMzMzMnKTtcblx0XHR0aGlzLnBhdHRlcm5zLmNvbXBhc3NHcmFkaWVudC5hZGRDb2xvclN0b3AoMSwgJyNjY2NjY2MnKTtcblx0fVxuXG5cdHN0YXRpYyByZWN0SW50ZXJzZWN0KHgxLHkxLHdpZHRoMSxoZWlnaHQxLHgyLHkyLHdpZHRoMixoZWlnaHQyKSB7XG5cdFx0cmV0dXJuICEoeDIgPiB4MSArIHdpZHRoMSB8fCB4MiArIHdpZHRoMiA8IHgxIHx8IHkyID4geTEgKyBoZWlnaHQxIHx8IHkyICsgaGVpZ2h0MiA8IHkxKTtcblx0fVxuXG5cdHN0YXRpYyByYWRpdXNEZXRlY3QoeDEseTEseDIseTIscmFkaXVzKSB7XG5cdFx0cmV0dXJuIChNYXRoLnNxcnQoKHgyLXgxKSooeDIteDEpICsgKHkyLXkxKSooeTIteTEpKSA8IHJhZGl1cyk7XG5cdH1cblxuXHRzdGF0aWMgZHJhd1JvdGF0ZWRJbWFnZShjb250ZXh0LCBpbWFnZSwgeCwgeSwgYW5nbGUpIHtcblx0XHR2YXIgVE9fUkFESUFOUyA9IE1hdGguUEkgLyAxODA7XG5cdCAgICBjb250ZXh0LnNhdmUoKTtcblx0ICAgIGNvbnRleHQudHJhbnNsYXRlKHgsIHkpO1xuXHQgICAgY29udGV4dC5yb3RhdGUoYW5nbGUgKiBUT19SQURJQU5TKTtcblx0ICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCAtKGltYWdlLndpZHRoIC8gMiksIC0oaW1hZ2UuaGVpZ2h0IC8gMiksIGltYWdlLndpZHRoLCBpbWFnZS5oZWlnaHQpO1xuXHQgICAgY29udGV4dC5yZXN0b3JlKCk7XG5cdH1cblxuXHRzdGF0aWMgaXNPblNjcmVlbihvYmopIHtcblx0XHRyZXR1cm4gZW5naW5lLnJlY3RJbnRlcnNlY3Qob2JqLngsb2JqLnksb2JqLndpZHRoLG9iai5oZWlnaHQsY2FtZXJhLngsY2FtZXJhLnksY2FtZXJhLndpZHRoLGNhbWVyYS5oZWlnaHQpO1xuXHR9XG5cblx0cmVzdGFydCgpIHtcblx0XHQvL2NvbnNvbGUubG9nKFwicmVzdGFydGluZyBub3dcIik7XG5cdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdH1cblxuXHRnZW5lcmF0ZU5vaXNlRnJhbWVzKHdpZHRoLCBoZWlnaHQsIG9wYWNpdHkpIHtcblx0XHRmb3IodmFyIGZyYW1lQ291bnQgPSAwOyBmcmFtZUNvdW50IDwgdGhpcy5ub2lzZUZyYW1lc051bTsgZnJhbWVDb3VudCsrKSB7XG5cdFx0XHR2YXIgbmV3Tm9pc2VDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpO1xuXHRcdFx0bmV3Tm9pc2VDYW52YXMud2lkdGggPSB3aWR0aDtcblx0XHRcdG5ld05vaXNlQ2FudmFzLmhlaWdodCA9IGhlaWdodDtcblxuXHRcdFx0dmFyIG5ld05vaXNlQ29udGV4dCA9IG5ld05vaXNlQ2FudmFzLmdldENvbnRleHQoJzJkJyk7XG5cdFx0XHRuZXdOb2lzZUNvbnRleHQuY2xlYXJSZWN0KDAsMCx3aWR0aCxoZWlnaHQpO1xuXG5cblx0XHRcdC8vVE9ETzogQ3JlYXRlIGEgY2FudmFzIGluIGEgbmFtZXNwYWNlLCBjcmVhdGUgdGhpcyBkYXRhIGFuZCBkcmF3IGl0IHdoZW4gbmVlZGVkIHdpdGggYSBtdWx0aXBsZSwgbWF5YmUgYWRkIGFuICdhbmltYXRlZCcgb3B0aW9uIGZvciB3aGV0aGVyIHRvIGdlbmVyYXRlIGEgbmV3IG5vaXNlIGZpZWxkIGVhY2ggZnJhbWUgb3Igbm90IHRvIGdpdmUgaXQgYSAnbW92aW5nIGZpbG0gZ3JhaW4nIGVmZmVjdFxuXHRcdFx0dmFyIGltYWdlRGF0YSA9IG5ld05vaXNlQ29udGV4dC5nZXRJbWFnZURhdGEoMCwgMCwgd2lkdGgsIGhlaWdodCk7XG5cdFx0XHR2YXIgcGl4ZWxzID0gaW1hZ2VEYXRhLmRhdGE7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgaWwgPSBwaXhlbHMubGVuZ3RoOyBpIDwgaWw7IGkgKz0gNCkge1xuXHRcdFx0XHR2YXIgY29sb3IgPSBNYXRoLnJvdW5kKE1hdGgucmFuZG9tKCkgKiAyNTUpO1xuXHQgIFx0XHRcblx0ICBcdFx0XHQvLyBCZWNhdXNlIHRoZSBub2lzZSBpcyBtb25vY2hyb21hdGljLCB3ZSBzaG91bGQgcHV0IHRoZSBzYW1lIHZhbHVlIGluIHRoZSBSLCBHIGFuZCBCIGNoYW5uZWxzXG5cdCAgXHRcdFx0cGl4ZWxzW2ldID0gcGl4ZWxzW2kgKyAxXSA9IHBpeGVsc1tpICsgMl0gPSBjb2xvcjtcblx0ICBcdFx0XHQvLyBNYWtlIHN1cmUgcGl4ZWxzIGFyZSBvcGFxdWVcblx0ICBcdFx0XHRwaXhlbHNbaSArIDNdID0gKDI1NSpvcGFjaXR5KTtcblxuXHRcdFx0fVxuXHRcdFx0Ly8gUHV0IHBpeGVscyBiYWNrIGludG8gY2FudmFzXG5cdFx0XHRuZXdOb2lzZUNvbnRleHQucHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XG5cdFx0XHR0aGlzLm5vaXNlRnJhbWVzLnB1c2gobmV3Tm9pc2VDYW52YXMpO1xuXHRcdH1cblx0XHQvL3RoaXMubm9pc2VDYW52YXMuY3JlYXRlZCA9IHRydWU7XG5cblx0XHQvLyBpZighdGhpcy5ub2lzZUNhbnZhcykge1xuXHRcdC8vIFx0dGhpcy5ub2lzZUNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cdFx0Ly8gXHR0aGlzLm5vaXNlQ2FudmFzLndpZHRoID0gd2lkdGg7XG5cdFx0Ly8gXHR0aGlzLm5vaXNlQ2FudmFzLmhlaWdodCA9IGhlaWdodDtcblx0XHQvLyBcdHRoaXMubm9pc2VDYW52YXMwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcblx0XHQvLyBcdHRoaXMubm9pc2VDYW52YXMwLndpZHRoID0gd2lkdGg7XG5cdFx0Ly8gXHR0aGlzLm5vaXNlQ2FudmFzMC5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0Ly8gXHR0aGlzLm5vaXNlQ2FudmFzMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG5cdFx0Ly8gXHR0aGlzLm5vaXNlQ2FudmFzMS53aWR0aCA9IHdpZHRoO1xuXHRcdC8vIFx0dGhpcy5ub2lzZUNhbnZhczEuaGVpZ2h0ID0gaGVpZ2h0O1xuXHRcdC8vIFx0Ly9DRS5ub2lzZUNhbnZhcy5jb250ZXh0ID0gQ0Uubm9pc2VDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHQvLyB9XG5cblx0XHQvLyBpZihhbmltYXRlZCB8fCAhdGhpcy5ub2lzZUNhbnZhcy5jcmVhdGVkKSB7XG5cdFx0Ly8gXHQvLyB2YXIgY29udGV4dDAgPSB0aGlzLm5vaXNlQ2FudmFzMC5nZXRDb250ZXh0KCcyZCcpO1xuXHRcdC8vIFx0Ly8gY29udGV4dDAuY2xlYXJSZWN0KDAsIDAsIHdpZHRoLCBoZWlnaHQpO1xuXHRcdC8vIFx0Ly8gdmFyIGNvbnRleHQxID0gdGhpcy5ub2lzZUNhbnZhczEuZ2V0Q29udGV4dCgnMmQnKTtcblx0XHQvLyBcdC8vIGNvbnRleHQxLmNsZWFyUmVjdCgwLCAwLCB3aWR0aCwgaGVpZ2h0KTtcblxuXHRcdC8vIFx0Ly9UT0RPOiBDcmVhdGUgYSBjYW52YXMgaW4gYSBuYW1lc3BhY2UsIGNyZWF0ZSB0aGlzIGRhdGEgYW5kIGRyYXcgaXQgd2hlbiBuZWVkZWQgd2l0aCBhIG11bHRpcGxlLCBtYXliZSBhZGQgYW4gJ2FuaW1hdGVkJyBvcHRpb24gZm9yIHdoZXRoZXIgdG8gZ2VuZXJhdGUgYSBuZXcgbm9pc2UgZmllbGQgZWFjaCBmcmFtZSBvciBub3QgdG8gZ2l2ZSBpdCBhICdtb3ZpbmcgZmlsbSBncmFpbicgZWZmZWN0XG5cdFx0Ly8gXHR2YXIgaW1hZ2VEYXRhID0gY29udGV4dDAuZ2V0SW1hZ2VEYXRhKDAsIDAsIHRoaXMubm9pc2VDYW52YXMwLndpZHRoLCB0aGlzLm5vaXNlQ2FudmFzMC5oZWlnaHQpO1xuXHRcdC8vIFx0dmFyIHBpeGVscyA9IGltYWdlRGF0YS5kYXRhO1xuXHRcdC8vIFx0Zm9yICh2YXIgaSA9IDAsIGlsID0gcGl4ZWxzLmxlbmd0aDsgaSA8IGlsOyBpICs9IDQpIHtcblx0XHQvLyBcdFx0dmFyIGNvbG9yID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMjU1KTtcblx0ICBcdFx0XG5cdCAvLyAgXHRcdFx0Ly8gQmVjYXVzZSB0aGUgbm9pc2UgaXMgbW9ub2Nocm9tYXRpYywgd2Ugc2hvdWxkIHB1dCB0aGUgc2FtZSB2YWx1ZSBpbiB0aGUgUiwgRyBhbmQgQiBjaGFubmVsc1xuXHQgLy8gIFx0XHRcdHBpeGVsc1tpXSA9IHBpeGVsc1tpICsgMV0gPSBwaXhlbHNbaSArIDJdID0gY29sb3I7XG5cdCAvLyAgXHRcdFx0Ly8gTWFrZSBzdXJlIHBpeGVscyBhcmUgb3BhcXVlXG5cdCAvLyAgXHRcdFx0cGl4ZWxzW2kgKyAzXSA9ICgyNTUqb3BhY2l0eSk7XG5cblx0XHQvLyBcdH1cblx0XHQvLyBcdC8vIFB1dCBwaXhlbHMgYmFjayBpbnRvIGNhbnZhc1xuXHRcdC8vIFx0Y29udGV4dDAucHV0SW1hZ2VEYXRhKGltYWdlRGF0YSwgMCwgMCk7XG5cblx0XHQvLyBcdHZhciBpbWFnZURhdGExID0gY29udGV4dDEuZ2V0SW1hZ2VEYXRhKDAsIDAsIHRoaXMubm9pc2VDYW52YXMxLndpZHRoLCB0aGlzLm5vaXNlQ2FudmFzMS5oZWlnaHQpO1xuXHRcdC8vIFx0dmFyIHBpeGVsczEgPSBpbWFnZURhdGExLmRhdGE7XG5cdFx0Ly8gXHRmb3IgKHZhciBpID0gMCwgaWwgPSBwaXhlbHMxLmxlbmd0aDsgaSA8IGlsOyBpICs9IDQpIHtcblx0XHQvLyBcdFx0dmFyIGNvbG9yID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMjU1KTtcblx0ICBcdFx0XG5cdCAvLyAgXHRcdFx0Ly8gQmVjYXVzZSB0aGUgbm9pc2UgaXMgbW9ub2Nocm9tYXRpYywgd2Ugc2hvdWxkIHB1dCB0aGUgc2FtZSB2YWx1ZSBpbiB0aGUgUiwgRyBhbmQgQiBjaGFubmVsc1xuXHQgLy8gIFx0XHRcdHBpeGVsczFbaV0gPSBwaXhlbHMxW2kgKyAxXSA9IHBpeGVsczFbaSArIDJdID0gY29sb3I7XG5cdCAvLyAgXHRcdFx0Ly8gTWFrZSBzdXJlIHBpeGVscyBhcmUgb3BhcXVlXG5cdCAvLyAgXHRcdFx0cGl4ZWxzMVtpICsgM10gPSAoMjU1Km9wYWNpdHkpO1xuXG5cdFx0Ly8gXHR9XG5cdFx0Ly8gXHQvLyBQdXQgcGl4ZWxzIGJhY2sgaW50byBjYW52YXNcblx0XHQvLyBcdGNvbnRleHQxLnB1dEltYWdlRGF0YShpbWFnZURhdGExLCAwLCAwKTtcblxuXG5cblx0XHQvLyBcdHRoaXMubm9pc2VDYW52YXMuY3JlYXRlZCA9IHRydWU7XG5cdFx0Ly8gXHQvL2NvbnNvbGUubG9nKFwid29vdCFcIik7XG5cdFx0Ly8gfVxuXHR9XG5cblx0cmVuZGVyTm9pc2UoY3R4LCBvcGFjaXR5LCBhbmltYXRlZCkge1xuXHRcdGN0eC5nbG9iYWxBbHBoYSA9IG9wYWNpdHk7XG5cblx0XHRpZihhbmltYXRlZCkge1xuXHRcdFx0dGhpcy5ub2lzZUZyYW1lSW5kZXgrKztcblx0XHRcdGlmKHRoaXMubm9pc2VGcmFtZUluZGV4ID09IHRoaXMubm9pc2VGcmFtZXNOdW0pIHtcblx0XHRcdFx0dGhpcy5ub2lzZUZyYW1lSW5kZXggPSAwO1xuXHRcdFx0fVxuXHRcdFx0Y3R4LmRyYXdJbWFnZSh0aGlzLm5vaXNlRnJhbWVzW3RoaXMubm9pc2VGcmFtZUluZGV4XSwwLDApO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdHguZHJhd0ltYWdlKHRoaXMubm9pc2VGcmFtZXNbMF0sMCwwKTtcblx0XHR9XG5cblx0XHRjdHguZ2xvYmFsQWxwaGEgPSAxO1xuXHR9XG5cblx0Y2hlY2tJZkxvYWRlZCgpIHtcblx0XHRpZih0aGlzLmltYWdlc1RvTG9hZC50cmVlcyA9PSB0cnVlICYmIHRoaXMuaW1hZ2VzVG9Mb2FkLm1ldGFsID09IHRydWUpIHtcblx0XHRcdC8vY29uc29sZS5sb2coXCJBbGwgbG9hZGVkIVwiKTtcblx0XHRcdHRoaXMucGF0dGVybnMubWV0YWwuZGF0YSA9IHRoaXMuY29udGV4dC5jcmVhdGVQYXR0ZXJuKHRoaXMucGF0dGVybnMubWV0YWwsICdyZXBlYXQnKTtcblx0XHRcdHRoaXMucGF0dGVybnMudHJlZXMuZGF0YSA9IHRoaXMuY29udGV4dC5jcmVhdGVQYXR0ZXJuKHRoaXMucGF0dGVybnMudHJlZXMsICdyZXBlYXQnKTtcblx0XHRcdHRoaXMucmVhZHkgPSB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwiTm9wZSBub3QgeWV0XCIpO1xuXHRcdH1cblx0fVxuXG5cdHNldEN1cnJlbnRXYXlwb2ludChuZXdXYXlwb2ludCkge1xuXG5cdFx0dGhpcy5jdXJyZW50V2F5cG9pbnQgPSBuZXdXYXlwb2ludDtcblx0XHR0aGlzLm5hcnJhdGlvbi5hZHZhbmNlTmFycmF0aW9uKCk7XG5cblx0XHRpZihuZXdXYXlwb2ludCA9PSB0aGlzLnRvdGFsV2F5cG9pbnRzKSB7XG5cdFx0XHRnYW1lLmh1ZC5mYWRlVG9XaGl0ZSgpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0Z2FtZS5uYXJyYXRpb24uYWR2YW5jZU5hcnJhdGlvbigpO1xuXHRcdFx0fSwgNTAwMCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0dmFyIGZhbHNlV2FsbHMgPSB0aGlzLmdhbWVPYmplY3RzLmZpbHRlcihmdW5jdGlvbihlbGVtLCBpLCBhcnJheSkge1xuXHQgICAgICByZXR1cm4gZWxlbSBpbnN0YW5jZW9mIEZhbHNlV2FsbCAmJiBlbGVtLnRyaWdnZXJXYXlwb2ludCA9PT0gbmV3V2F5cG9pbnQ7XG5cdCAgXHR9KTtcblxuXHRcdGZvcih2YXIgZmFsc2VXYWxsIGluIGZhbHNlV2FsbHMpIHtcblx0XHRcdHN3aXRjaChmYWxzZVdhbGxzW2ZhbHNlV2FsbF0uc3RhdGVDaGFuZ2VUeXBlKSB7XG5cdFx0XHRcdGNhc2UgXCJkaXNhcHBlYXJcIjpcblx0XHRcdFx0XHRmYWxzZVdhbGxzW2ZhbHNlV2FsbF0ua2lsbCgpO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiYXBwZWFyXCI6XG5cdFx0XHRcdFx0ZmFsc2VXYWxsc1tmYWxzZVdhbGxdLnNldFZpc2libGUodHJ1ZSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIHRyaWdnZXJzID0gdGhpcy5nYW1lT2JqZWN0cy5maWx0ZXIoZnVuY3Rpb24oZWxlbSwgaSwgYXJyYXkpIHtcblx0ICAgICAgcmV0dXJuIGVsZW0gaW5zdGFuY2VvZiBUcmlnZ2VyICYmIGVsZW0udHJpZ2dlcldheXBvaW50ID09PSBuZXdXYXlwb2ludDtcblx0ICBcdH0pO1xuXG5cdCAgXHRmb3IodmFyIHRyaWdnZXIgaW4gdHJpZ2dlcnMpIHtcblx0ICBcdFx0dHJpZ2dlcnNbdHJpZ2dlcl0uYWN0aXZlID0gdHJ1ZTtcblx0ICBcdH1cblx0fVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gRW5naW5lMTM7IiwidmFyIEJhc2VPYmplY3QgPSByZXF1aXJlKCcuL0Jhc2VPYmplY3QnKTtcblxuY2xhc3MgRmFsc2VXYWxsIGV4dGVuZHMgQmFzZU9iamVjdCB7XG5cblx0Y29uc3RydWN0b3IoeCx5LHdpZHRoLGhlaWdodCkge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy54ID0geDtcblx0XHR0aGlzLnkgPSB5O1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0XHR0aGlzLmNvbG9yID0gJyMwMDAwNDUnO1xuXHRcdHRoaXMuc3RhdGVDaGFuZ2VUeXBlID0gXCJcIjtcblx0XHR0aGlzLnRyaWdnZXJXYXlwb2ludCA9IDA7XG5cdFx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcblx0XHR0aGlzLnJlbmRlckxheWVyID0gNDtcblx0fVxuXG5cdHVwZGF0ZShlbGFwc2VkKSB7XG5cblx0fVxuXG5cdHNldFN0YXRlQ2hhbmdlKHN0YXRlQ2hhbmdlVHlwZSwgdHJpZ2dlcldheXBvaW50KSB7XG5cdFx0dGhpcy5zdGF0ZUNoYW5nZVR5cGUgPSBzdGF0ZUNoYW5nZVR5cGU7XG5cdFx0dGhpcy50cmlnZ2VyV2F5cG9pbnQgPSB0cmlnZ2VyV2F5cG9pbnQ7XG5cdFx0aWYoc3RhdGVDaGFuZ2VUeXBlID09IFwiYXBwZWFyXCIpIHtcblx0XHRcdHRoaXMuc2V0VmlzaWJsZShmYWxzZSk7XG5cdFx0fVxuXHR9XG5cblx0c2V0VmlzaWJsZSh2aXNpYmxlKSB7XG5cdFx0aWYodmlzaWJsZSkge1xuXHRcdFx0dGhpcy52aXNpYmxlID0gdHJ1ZTtcblx0XHRcdHRoaXMuY29sbGlzaW9uVHlwZSA9IFwic3RhdGljXCI7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMudmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0dGhpcy5jb2xsaXNpb25UeXBlID0gXCJub25lXCI7XG5cdFx0fVxuXHR9XG5cblx0cmVuZGVyKCkge1xuXHRcdGlmKHRoaXMudmlzaWJsZSAmJiBlbmdpbmUuaXNPblNjcmVlbih0aGlzKSkge1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdCAgICBjdHgucmVjdCh0aGlzLngtY2FtZXJhLngsIHRoaXMueS1jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXHRcdCAgICBjdHguY2xvc2VQYXRoKCk7XG5cdFx0ICAgIGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuXHRcdCAgICBjdHguc2F2ZSgpO1xuXHRcdFx0Y3R4LnRyYW5zbGF0ZSh0aGlzLngtY2FtZXJhLngsIHRoaXMueS1jYW1lcmEueSk7XG5cdFx0XHRjdHguZmlsbCgpO1xuXHRcdFx0Y3R4LnJlc3RvcmUoKTtcblx0XHR9XG5cdH1cblxuXHRraWxsKCkge1xuXHRcdHZhciBpID0gZ2FtZU9iamVjdHMuaW5kZXhPZih0aGlzKTtcbiAgICBcdGdhbWVPYmplY3RzLnNwbGljZShpLCAxKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZhbHNlV2FsbDsiLCJjbGFzcyBGaWVsZCB7XG5cblx0Y29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCkge1xuXHRcdHRoaXMueCA9IDA7XG5cdFx0dGhpcy55ID0gMDtcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0dGhpcy5jb2xvciA9ICcjMzMzMzMzJztcblx0fVxuXG5cblx0cmVuZGVyKCkge1xuXHRcdGN0eC5iZWdpblBhdGgoKTtcblx0ICAgIGN0eC5yZWN0KHRoaXMueC1jYW1lcmEueCwgdGhpcy55LWNhbWVyYS55LCB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCk7XG5cdCAgICBjdHguY2xvc2VQYXRoKCk7XG5cdCAgICBjdHguZmlsbFN0eWxlID0gdGhpcy5jb2xvcjtcblx0ICAgIGN0eC5maWxsKCk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGaWVsZDsiLCJjbGFzcyBIdWQge1xuXG5cdGNvbnN0cnVjdG9yKHdpZHRoLGhlaWdodCkge1xuXHRcdHRoaXMud2lkdGggPSB3aWR0aDtcblx0XHR0aGlzLmhlaWdodCA9IGhlaWdodDtcblx0XHR0aGlzLm92ZXJsYXlPcGFjaXR5ID0gMTtcblx0XHR0aGlzLmZhZGluZ1RvV2hpdGUgPSBmYWxzZTtcblx0XHR0aGlzLmZhZGluZ0Zyb21XaGl0ZSA9IGZhbHNlO1xuXHRcdHRoaXMuZmFkaW5nVG9EZWFkID0gZmFsc2U7XG5cdFx0dGhpcy5kZWFkID0gZmFsc2U7XG5cdFx0dGhpcy5mYWRlU3BlZWQgPSAzO1xuXHR9XG5cblx0dXBkYXRlKGVsYXBzZWQpIHtcblx0XHRpZih0aGlzLmZhZGluZ1RvV2hpdGUpIHtcblx0XHRcdGlmKHRoaXMub3ZlcmxheU9wYWNpdHkgPCAxKSB7XG5cdFx0XHRcdHRoaXMub3ZlcmxheU9wYWNpdHkgKz0gMS90aGlzLmZhZGVTcGVlZCplbGFwc2VkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5mYWRpbmdUb1doaXRlID0gZmFsc2U7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYodGhpcy5mYWRpbmdGcm9tV2hpdGUpIHtcblx0XHRcdGlmKHRoaXMub3ZlcmxheU9wYWNpdHkgPiAwKSB7XG5cdFx0XHRcdHRoaXMub3ZlcmxheU9wYWNpdHkgLT0gMS90aGlzLmZhZGVTcGVlZCplbGFwc2VkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5mYWRpbmdGcm9tV2hpdGUgPSBmYWxzZTtcblx0XHRcdFx0dGhpcy5mYWRlU3BlZWQgPSAzO1xuXHRcdFx0XHRnYW1lLm5hcnJhdGlvbi5hZHZhbmNlTmFycmF0aW9uKCk7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRnYW1lLm5hcnJhdGlvbi5hZHZhbmNlTmFycmF0aW9uKCk7XG5cdFx0XHRcdH0sNDAwMCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0aWYodGhpcy5mYWRpbmdUb0RlYWQpIHtcblx0XHRcdGlmKHRoaXMub3ZlcmxheU9wYWNpdHkgPCAxKSB7XG5cdFx0XHRcdHRoaXMub3ZlcmxheU9wYWNpdHkgKz0gMS90aGlzLmZhZGVTcGVlZCplbGFwc2VkO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhpcy5mYWRpbmdUb0RlYWQgPSBmYWxzZTtcblx0XHRcdFx0Z2FtZS5yZXN0YXJ0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0ZmFkZVRvV2hpdGUoKSB7XG5cdFx0dGhpcy5mYWRpbmdUb1doaXRlID0gdHJ1ZTtcblx0fVxuXG5cdGZhZGVGcm9tV2hpdGUoKSB7XG5cdFx0dGhpcy5mYWRlU3BlZWQgPSA0O1xuXHRcdHRoaXMuZmFkaW5nRnJvbVdoaXRlID0gdHJ1ZTtcblx0fVxuXG5cdGZhZGVUb0RlYWQoKSB7XG5cdFx0dGhpcy5mYWRpbmdUb0RlYWQgPSB0cnVlO1xuXHRcdHRoaXMuZGVhZCA9IHRydWU7XG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0aWYodGhpcy5kZWFkKSB7XG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JnYmEoMjU1LDAsMCwnK3RoaXMub3ZlcmxheU9wYWNpdHkrJyknO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjdHguZmlsbFN0eWxlID0gJ3JnYmEoMjU1LDI1NSwyNTUsJyt0aGlzLm92ZXJsYXlPcGFjaXR5KycpJztcblx0XHR9XG5cdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHRcdGN0eC5yZWN0KDAsMCx0aGlzLndpZHRoLHRoaXMuaGVpZ2h0KTtcblx0XHRjdHguY2xvc2VQYXRoKCk7XG5cdFx0Y3R4LmZpbGwoKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEh1ZDsiLCJjbGFzcyBJbnB1dCB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cdFx0dGhpcy5VUCA9IGZhbHNlO1xuXHRcdHRoaXMuUklHSFQgPSBmYWxzZTtcblx0XHR0aGlzLkRPV04gPSBmYWxzZTtcblx0XHR0aGlzLkxFRlQgPSBmYWxzZTtcblx0XHR0aGlzLlcgPSBmYWxzZTtcblx0XHR0aGlzLkEgPSBmYWxzZTtcblx0XHR0aGlzLlMgPSBmYWxzZTtcblx0XHR0aGlzLkQgPSBmYWxzZTtcblxuXHRcdHZhciBjb250ZXh0ID0gdGhpcztcblx0XHR0aGlzLmtleURvd24gPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHQgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuXG5cdFx0ICAgIGlmIChlLmtleUNvZGUgPT0gJzM4Jykge1xuXHRcdCAgICAgICAgLy8gdXAgYXJyb3dcblx0XHQgICAgICAgIGNvbnRleHQuVVAgPSB0cnVlO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PSAnNDAnKSB7XG5cdFx0ICAgICAgICAvLyBkb3duIGFycm93XG5cdFx0ICAgICAgICBjb250ZXh0LkRPV04gPSB0cnVlO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PSAnMzcnKSB7XG5cdFx0ICAgICAgIC8vIGxlZnQgYXJyb3dcblx0XHQgICAgICAgY29udGV4dC5MRUZUID0gdHJ1ZTtcblx0XHQgICAgfVxuXHRcdCAgICBlbHNlIGlmIChlLmtleUNvZGUgPT0gJzM5Jykge1xuXHRcdCAgICAgICAvLyByaWdodCBhcnJvd1xuXHRcdCAgICAgICBjb250ZXh0LlJJR0hUID0gdHJ1ZTtcblx0XHQgICAgfVxuXHRcdCAgICBlbHNlIGlmIChlLmtleUNvZGUgPT0gJzg3Jykge1xuXHRcdCAgICAgICAvLyBXIGtleVxuXHRcdCAgICAgICBjb250ZXh0LlcgPSB0cnVlO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PSAnNjUnKSB7XG5cdFx0ICAgICAgIC8vIEEga2V5XG5cdFx0ICAgICAgIGNvbnRleHQuQSA9IHRydWU7XG5cdFx0ICAgIH1cblx0XHQgICAgZWxzZSBpZiAoZS5rZXlDb2RlID09ICc4MycpIHtcblx0XHQgICAgICAgLy8gUyBrZXlcblx0XHQgICAgICAgY29udGV4dC5TID0gdHJ1ZTtcblx0XHQgICAgfVxuXHRcdCAgICBlbHNlIGlmIChlLmtleUNvZGUgPT0gJzY4Jykge1xuXHRcdCAgICAgICAvLyBEIGtleVxuXHRcdCAgICAgICBjb250ZXh0LkQgPSB0cnVlO1xuXHRcdCAgICB9XG5cblx0XHR9XG5cblx0XHR0aGlzLmtleVVwID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0ICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcblxuXHRcdCAgICBpZiAoZS5rZXlDb2RlID09ICczOCcpIHtcblx0XHQgICAgICAgIC8vIHVwIGFycm93XG5cdFx0ICAgICAgICBjb250ZXh0LlVQID0gZmFsc2U7XG5cdFx0ICAgIH1cblx0XHQgICAgZWxzZSBpZiAoZS5rZXlDb2RlID09ICc0MCcpIHtcblx0XHQgICAgICAgIC8vIGRvd24gYXJyb3dcblx0XHQgICAgICAgIGNvbnRleHQuRE9XTiA9IGZhbHNlO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PSAnMzcnKSB7XG5cdFx0ICAgICAgIC8vIGxlZnQgYXJyb3dcblx0XHQgICAgICAgY29udGV4dC5MRUZUID0gZmFsc2U7XG5cdFx0ICAgIH1cblx0XHQgICAgZWxzZSBpZiAoZS5rZXlDb2RlID09ICczOScpIHtcblx0XHQgICAgICAgLy8gcmlnaHQgYXJyb3dcblx0XHQgICAgICAgY29udGV4dC5SSUdIVCA9IGZhbHNlO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PSAnODcnKSB7XG5cdFx0ICAgICAgIC8vIFcga2V5XG5cdFx0ICAgICAgIGNvbnRleHQuVyA9IGZhbHNlO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PSAnNjUnKSB7XG5cdFx0ICAgICAgIC8vIEEga2V5XG5cdFx0ICAgICAgIGNvbnRleHQuQSA9IGZhbHNlO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PSAnODMnKSB7XG5cdFx0ICAgICAgIC8vIFMga2V5XG5cdFx0ICAgICAgIGNvbnRleHQuUyA9IGZhbHNlO1xuXHRcdCAgICB9XG5cdFx0ICAgIGVsc2UgaWYgKGUua2V5Q29kZSA9PSAnNjgnKSB7XG5cdFx0ICAgICAgIC8vIEQga2V5XG5cdFx0ICAgICAgIGNvbnRleHQuRCA9IGZhbHNlO1xuXHRcdCAgICB9XG5cblx0XHR9XG5cblxuXHRcdGRvY3VtZW50Lm9ua2V5ZG93biA9IHRoaXMua2V5RG93bjtcblx0XHRkb2N1bWVudC5vbmtleXVwID0gdGhpcy5rZXlVcDtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IElucHV0OyIsIi8qKlxuICogU2Z4clBhcmFtc1xuICpcbiAqIENvcHlyaWdodCAyMDEwIFRob21hcyBWaWFuXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXG4gKlxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqXG4gKiBAYXV0aG9yIFRob21hcyBWaWFuXG4gKi9cbi8qKiBAY29uc3RydWN0b3IgKi9cbmZ1bmN0aW9uIFNmeHJQYXJhbXMoKSB7XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy9cbiAgLy8gIFNldHRpbmdzIFN0cmluZyBNZXRob2RzXG4gIC8vXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICAvKipcbiAgICogUGFyc2VzIGEgc2V0dGluZ3MgYXJyYXkgaW50byB0aGUgcGFyYW1ldGVyc1xuICAgKiBAcGFyYW0gYXJyYXkgQXJyYXkgb2YgdGhlIHNldHRpbmdzIHZhbHVlcywgd2hlcmUgZWxlbWVudHMgMCAtIDIzIGFyZVxuICAgKiAgICAgICAgICAgICAgICBhOiB3YXZlVHlwZVxuICAgKiAgICAgICAgICAgICAgICBiOiBhdHRhY2tUaW1lXG4gICAqICAgICAgICAgICAgICAgIGM6IHN1c3RhaW5UaW1lXG4gICAqICAgICAgICAgICAgICAgIGQ6IHN1c3RhaW5QdW5jaFxuICAgKiAgICAgICAgICAgICAgICBlOiBkZWNheVRpbWVcbiAgICogICAgICAgICAgICAgICAgZjogc3RhcnRGcmVxdWVuY3lcbiAgICogICAgICAgICAgICAgICAgZzogbWluRnJlcXVlbmN5XG4gICAqICAgICAgICAgICAgICAgIGg6IHNsaWRlXG4gICAqICAgICAgICAgICAgICAgIGk6IGRlbHRhU2xpZGVcbiAgICogICAgICAgICAgICAgICAgajogdmlicmF0b0RlcHRoXG4gICAqICAgICAgICAgICAgICAgIGs6IHZpYnJhdG9TcGVlZFxuICAgKiAgICAgICAgICAgICAgICBsOiBjaGFuZ2VBbW91bnRcbiAgICogICAgICAgICAgICAgICAgbTogY2hhbmdlU3BlZWRcbiAgICogICAgICAgICAgICAgICAgbjogc3F1YXJlRHV0eVxuICAgKiAgICAgICAgICAgICAgICBvOiBkdXR5U3dlZXBcbiAgICogICAgICAgICAgICAgICAgcDogcmVwZWF0U3BlZWRcbiAgICogICAgICAgICAgICAgICAgcTogcGhhc2VyT2Zmc2V0XG4gICAqICAgICAgICAgICAgICAgIHI6IHBoYXNlclN3ZWVwXG4gICAqICAgICAgICAgICAgICAgIHM6IGxwRmlsdGVyQ3V0b2ZmXG4gICAqICAgICAgICAgICAgICAgIHQ6IGxwRmlsdGVyQ3V0b2ZmU3dlZXBcbiAgICogICAgICAgICAgICAgICAgdTogbHBGaWx0ZXJSZXNvbmFuY2VcbiAgICogICAgICAgICAgICAgICAgdjogaHBGaWx0ZXJDdXRvZmZcbiAgICogICAgICAgICAgICAgICAgdzogaHBGaWx0ZXJDdXRvZmZTd2VlcFxuICAgKiAgICAgICAgICAgICAgICB4OiBtYXN0ZXJWb2x1bWVcbiAgICogQHJldHVybiBJZiB0aGUgc3RyaW5nIHN1Y2Nlc3NmdWxseSBwYXJzZWRcbiAgICovXG4gIHRoaXMuc2V0U2V0dGluZ3MgPSBmdW5jdGlvbih2YWx1ZXMpXG4gIHtcbiAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCAyNDsgaSsrIClcbiAgICB7XG4gICAgICB0aGlzW1N0cmluZy5mcm9tQ2hhckNvZGUoIDk3ICsgaSApXSA9IHZhbHVlc1tpXSB8fCAwO1xuICAgIH1cblxuICAgIC8vIEkgbW92ZWQgdGhpcyBoZXJlIGZyb20gdGhlIHJlc2V0KHRydWUpIGZ1bmN0aW9uXG4gICAgaWYgKHRoaXNbJ2MnXSA8IC4wMSkge1xuICAgICAgdGhpc1snYyddID0gLjAxO1xuICAgIH1cblxuICAgIHZhciB0b3RhbFRpbWUgPSB0aGlzWydiJ10gKyB0aGlzWydjJ10gKyB0aGlzWydlJ107XG4gICAgaWYgKHRvdGFsVGltZSA8IC4xOCkge1xuICAgICAgdmFyIG11bHRpcGxpZXIgPSAuMTggLyB0b3RhbFRpbWU7XG4gICAgICB0aGlzWydiJ10gICo9IG11bHRpcGxpZXI7XG4gICAgICB0aGlzWydjJ10gKj0gbXVsdGlwbGllcjtcbiAgICAgIHRoaXNbJ2UnXSAgICo9IG11bHRpcGxpZXI7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogU2Z4clN5bnRoXG4gKlxuICogQ29weXJpZ2h0IDIwMTAgVGhvbWFzIFZpYW5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqIEBhdXRob3IgVGhvbWFzIFZpYW5cbiAqL1xuLyoqIEBjb25zdHJ1Y3RvciAqL1xuZnVuY3Rpb24gU2Z4clN5bnRoKCkge1xuICAvLyBBbGwgdmFyaWFibGVzIGFyZSBrZXB0IGFsaXZlIHRocm91Z2ggZnVuY3Rpb24gY2xvc3VyZXNcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vXG4gIC8vICBTb3VuZCBQYXJhbWV0ZXJzXG4gIC8vXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB0aGlzLl9wYXJhbXMgPSBuZXcgU2Z4clBhcmFtcygpOyAgLy8gUGFyYW1zIGluc3RhbmNlXG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvL1xuICAvLyAgU3ludGggVmFyaWFibGVzXG4gIC8vXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuICB2YXIgX2VudmVsb3BlTGVuZ3RoMCwgLy8gTGVuZ3RoIG9mIHRoZSBhdHRhY2sgc3RhZ2VcbiAgICAgIF9lbnZlbG9wZUxlbmd0aDEsIC8vIExlbmd0aCBvZiB0aGUgc3VzdGFpbiBzdGFnZVxuICAgICAgX2VudmVsb3BlTGVuZ3RoMiwgLy8gTGVuZ3RoIG9mIHRoZSBkZWNheSBzdGFnZVxuXG4gICAgICBfcGVyaW9kLCAgICAgICAgICAvLyBQZXJpb2Qgb2YgdGhlIHdhdmVcbiAgICAgIF9tYXhQZXJpb2QsICAgICAgIC8vIE1heGltdW0gcGVyaW9kIGJlZm9yZSBzb3VuZCBzdG9wcyAoZnJvbSBtaW5GcmVxdWVuY3kpXG5cbiAgICAgIF9zbGlkZSwgICAgICAgICAgIC8vIE5vdGUgc2xpZGVcbiAgICAgIF9kZWx0YVNsaWRlLCAgICAgIC8vIENoYW5nZSBpbiBzbGlkZVxuXG4gICAgICBfY2hhbmdlQW1vdW50LCAgICAvLyBBbW91bnQgdG8gY2hhbmdlIHRoZSBub3RlIGJ5XG4gICAgICBfY2hhbmdlVGltZSwgICAgICAvLyBDb3VudGVyIGZvciB0aGUgbm90ZSBjaGFuZ2VcbiAgICAgIF9jaGFuZ2VMaW1pdCwgICAgIC8vIE9uY2UgdGhlIHRpbWUgcmVhY2hlcyB0aGlzIGxpbWl0LCB0aGUgbm90ZSBjaGFuZ2VzXG5cbiAgICAgIF9zcXVhcmVEdXR5LCAgICAgIC8vIE9mZnNldCBvZiBjZW50ZXIgc3dpdGNoaW5nIHBvaW50IGluIHRoZSBzcXVhcmUgd2F2ZVxuICAgICAgX2R1dHlTd2VlcDsgICAgICAgLy8gQW1vdW50IHRvIGNoYW5nZSB0aGUgZHV0eSBieVxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy9cbiAgLy8gIFN5bnRoIE1ldGhvZHNcbiAgLy9cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIHJ1bmluZyB2YXJpYWJsZXMgZnJvbSB0aGUgcGFyYW1zXG4gICAqIFVzZWQgb25jZSBhdCB0aGUgc3RhcnQgKHRvdGFsIHJlc2V0KSBhbmQgZm9yIHRoZSByZXBlYXQgZWZmZWN0IChwYXJ0aWFsIHJlc2V0KVxuICAgKi9cbiAgdGhpcy5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIFNob3J0ZXIgcmVmZXJlbmNlXG4gICAgdmFyIHAgPSB0aGlzLl9wYXJhbXM7XG5cbiAgICBfcGVyaW9kICAgICAgID0gMTAwIC8gKHBbJ2YnXSAqIHBbJ2YnXSArIC4wMDEpO1xuICAgIF9tYXhQZXJpb2QgICAgPSAxMDAgLyAocFsnZyddICAgKiBwWydnJ10gICArIC4wMDEpO1xuXG4gICAgX3NsaWRlICAgICAgICA9IDEgLSBwWydoJ10gKiBwWydoJ10gKiBwWydoJ10gKiAuMDE7XG4gICAgX2RlbHRhU2xpZGUgICA9IC1wWydpJ10gKiBwWydpJ10gKiBwWydpJ10gKiAuMDAwMDAxO1xuXG4gICAgaWYgKCFwWydhJ10pIHtcbiAgICAgIF9zcXVhcmVEdXR5ID0gLjUgLSBwWyduJ10gLyAyO1xuICAgICAgX2R1dHlTd2VlcCAgPSAtcFsnbyddICogLjAwMDA1O1xuICAgIH1cblxuICAgIF9jaGFuZ2VBbW91bnQgPSAgMSArIHBbJ2wnXSAqIHBbJ2wnXSAqIChwWydsJ10gPiAwID8gLS45IDogMTApO1xuICAgIF9jaGFuZ2VUaW1lICAgPSAwO1xuICAgIF9jaGFuZ2VMaW1pdCAgPSBwWydtJ10gPT0gMSA/IDAgOiAoMSAtIHBbJ20nXSkgKiAoMSAtIHBbJ20nXSkgKiAyMDAwMCArIDMyO1xuICB9XG5cbiAgLy8gSSBzcGxpdCB0aGUgcmVzZXQoKSBmdW5jdGlvbiBpbnRvIHR3byBmdW5jdGlvbnMgZm9yIGJldHRlciByZWFkYWJpbGl0eVxuICB0aGlzLnRvdGFsUmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnJlc2V0KCk7XG5cbiAgICAvLyBTaG9ydGVyIHJlZmVyZW5jZVxuICAgIHZhciBwID0gdGhpcy5fcGFyYW1zO1xuXG4gICAgLy8gQ2FsY3VsYXRpbmcgdGhlIGxlbmd0aCBpcyBhbGwgdGhhdCByZW1haW5lZCBoZXJlLCBldmVyeXRoaW5nIGVsc2UgbW92ZWQgc29tZXdoZXJlXG4gICAgX2VudmVsb3BlTGVuZ3RoMCA9IHBbJ2InXSAgKiBwWydiJ10gICogMTAwMDAwO1xuICAgIF9lbnZlbG9wZUxlbmd0aDEgPSBwWydjJ10gKiBwWydjJ10gKiAxMDAwMDA7XG4gICAgX2VudmVsb3BlTGVuZ3RoMiA9IHBbJ2UnXSAgICogcFsnZSddICAgKiAxMDAwMDAgKyAxMjtcbiAgICAvLyBGdWxsIGxlbmd0aCBvZiB0aGUgdm9sdW1lIGVudmVsb3AgKGFuZCB0aGVyZWZvcmUgc291bmQpXG4gICAgLy8gTWFrZSBzdXJlIHRoZSBsZW5ndGggY2FuIGJlIGRpdmlkZWQgYnkgMyBzbyB3ZSB3aWxsIG5vdCBuZWVkIHRoZSBwYWRkaW5nIFwiPT1cIiBhZnRlciBiYXNlNjQgZW5jb2RlXG4gICAgcmV0dXJuICgoX2VudmVsb3BlTGVuZ3RoMCArIF9lbnZlbG9wZUxlbmd0aDEgKyBfZW52ZWxvcGVMZW5ndGgyKSAvIDMgfCAwKSAqIDM7XG4gIH1cblxuICAvKipcbiAgICogV3JpdGVzIHRoZSB3YXZlIHRvIHRoZSBzdXBwbGllZCBidWZmZXIgQnl0ZUFycmF5XG4gICAqIEBwYXJhbSBidWZmZXIgQSBCeXRlQXJyYXkgdG8gd3JpdGUgdGhlIHdhdmUgdG9cbiAgICogQHJldHVybiBJZiB0aGUgd2F2ZSBpcyBmaW5pc2hlZFxuICAgKi9cbiAgdGhpcy5zeW50aFdhdmUgPSBmdW5jdGlvbihidWZmZXIsIGxlbmd0aCkge1xuICAgIC8vIFNob3J0ZXIgcmVmZXJlbmNlXG4gICAgdmFyIHAgPSB0aGlzLl9wYXJhbXM7XG5cbiAgICAvLyBJZiB0aGUgZmlsdGVycyBhcmUgYWN0aXZlXG4gICAgdmFyIF9maWx0ZXJzID0gcFsncyddICE9IDEgfHwgcFsndiddLFxuICAgICAgICAvLyBDdXRvZmYgbXVsdGlwbGllciB3aGljaCBhZGp1c3RzIHRoZSBhbW91bnQgdGhlIHdhdmUgcG9zaXRpb24gY2FuIG1vdmVcbiAgICAgICAgX2hwRmlsdGVyQ3V0b2ZmID0gcFsndiddICogcFsndiddICogLjEsXG4gICAgICAgIC8vIFNwZWVkIG9mIHRoZSBoaWdoLXBhc3MgY3V0b2ZmIG11bHRpcGxpZXJcbiAgICAgICAgX2hwRmlsdGVyRGVsdGFDdXRvZmYgPSAxICsgcFsndyddICogLjAwMDMsXG4gICAgICAgIC8vIEN1dG9mZiBtdWx0aXBsaWVyIHdoaWNoIGFkanVzdHMgdGhlIGFtb3VudCB0aGUgd2F2ZSBwb3NpdGlvbiBjYW4gbW92ZVxuICAgICAgICBfbHBGaWx0ZXJDdXRvZmYgPSBwWydzJ10gKiBwWydzJ10gKiBwWydzJ10gKiAuMSxcbiAgICAgICAgLy8gU3BlZWQgb2YgdGhlIGxvdy1wYXNzIGN1dG9mZiBtdWx0aXBsaWVyXG4gICAgICAgIF9scEZpbHRlckRlbHRhQ3V0b2ZmID0gMSArIHBbJ3QnXSAqIC4wMDAxLFxuICAgICAgICAvLyBJZiB0aGUgbG93IHBhc3MgZmlsdGVyIGlzIGFjdGl2ZVxuICAgICAgICBfbHBGaWx0ZXJPbiA9IHBbJ3MnXSAhPSAxLFxuICAgICAgICAvLyBtYXN0ZXJWb2x1bWUgKiBtYXN0ZXJWb2x1bWUgKGZvciBxdWljayBjYWxjdWxhdGlvbnMpXG4gICAgICAgIF9tYXN0ZXJWb2x1bWUgPSBwWyd4J10gKiBwWyd4J10sXG4gICAgICAgIC8vIE1pbmltdW0gZnJlcXVlbmN5IGJlZm9yZSBzdG9wcGluZ1xuICAgICAgICBfbWluRnJlcWVuY3kgPSBwWydnJ10sXG4gICAgICAgIC8vIElmIHRoZSBwaGFzZXIgaXMgYWN0aXZlXG4gICAgICAgIF9waGFzZXIgPSBwWydxJ10gfHwgcFsnciddLFxuICAgICAgICAvLyBDaGFuZ2UgaW4gcGhhc2Ugb2Zmc2V0XG4gICAgICAgIF9waGFzZXJEZWx0YU9mZnNldCA9IHBbJ3InXSAqIHBbJ3InXSAqIHBbJ3InXSAqIC4yLFxuICAgICAgICAvLyBQaGFzZSBvZmZzZXQgZm9yIHBoYXNlciBlZmZlY3RcbiAgICAgICAgX3BoYXNlck9mZnNldCA9IHBbJ3EnXSAqIHBbJ3EnXSAqIChwWydxJ10gPCAwID8gLTEwMjAgOiAxMDIwKSxcbiAgICAgICAgLy8gT25jZSB0aGUgdGltZSByZWFjaGVzIHRoaXMgbGltaXQsIHNvbWUgb2YgdGhlICAgIGlhYmxlcyBhcmUgcmVzZXRcbiAgICAgICAgX3JlcGVhdExpbWl0ID0gcFsncCddID8gKCgxIC0gcFsncCddKSAqICgxIC0gcFsncCddKSAqIDIwMDAwIHwgMCkgKyAzMiA6IDAsXG4gICAgICAgIC8vIFRoZSBwdW5jaCBmYWN0b3IgKGxvdWRlciBhdCBiZWdpbmluZyBvZiBzdXN0YWluKVxuICAgICAgICBfc3VzdGFpblB1bmNoID0gcFsnZCddLFxuICAgICAgICAvLyBBbW91bnQgdG8gY2hhbmdlIHRoZSBwZXJpb2Qgb2YgdGhlIHdhdmUgYnkgYXQgdGhlIHBlYWsgb2YgdGhlIHZpYnJhdG8gd2F2ZVxuICAgICAgICBfdmlicmF0b0FtcGxpdHVkZSA9IHBbJ2onXSAvIDIsXG4gICAgICAgIC8vIFNwZWVkIGF0IHdoaWNoIHRoZSB2aWJyYXRvIHBoYXNlIG1vdmVzXG4gICAgICAgIF92aWJyYXRvU3BlZWQgPSBwWydrJ10gKiBwWydrJ10gKiAuMDEsXG4gICAgICAgIC8vIFRoZSB0eXBlIG9mIHdhdmUgdG8gZ2VuZXJhdGVcbiAgICAgICAgX3dhdmVUeXBlID0gcFsnYSddO1xuXG4gICAgdmFyIF9lbnZlbG9wZUxlbmd0aCAgICAgID0gX2VudmVsb3BlTGVuZ3RoMCwgICAgIC8vIExlbmd0aCBvZiB0aGUgY3VycmVudCBlbnZlbG9wZSBzdGFnZVxuICAgICAgICBfZW52ZWxvcGVPdmVyTGVuZ3RoMCA9IDEgLyBfZW52ZWxvcGVMZW5ndGgwLCAvLyAoZm9yIHF1aWNrIGNhbGN1bGF0aW9ucylcbiAgICAgICAgX2VudmVsb3BlT3Zlckxlbmd0aDEgPSAxIC8gX2VudmVsb3BlTGVuZ3RoMSwgLy8gKGZvciBxdWljayBjYWxjdWxhdGlvbnMpXG4gICAgICAgIF9lbnZlbG9wZU92ZXJMZW5ndGgyID0gMSAvIF9lbnZlbG9wZUxlbmd0aDI7IC8vIChmb3IgcXVpY2sgY2FsY3VsYXRpb25zKVxuXG4gICAgLy8gRGFtcGluZyBtdWxpcGxpZXIgd2hpY2ggcmVzdHJpY3RzIGhvdyBmYXN0IHRoZSB3YXZlIHBvc2l0aW9uIGNhbiBtb3ZlXG4gICAgdmFyIF9scEZpbHRlckRhbXBpbmcgPSA1IC8gKDEgKyBwWyd1J10gKiBwWyd1J10gKiAyMCkgKiAoLjAxICsgX2xwRmlsdGVyQ3V0b2ZmKTtcbiAgICBpZiAoX2xwRmlsdGVyRGFtcGluZyA+IC44KSB7XG4gICAgICBfbHBGaWx0ZXJEYW1waW5nID0gLjg7XG4gICAgfVxuICAgIF9scEZpbHRlckRhbXBpbmcgPSAxIC0gX2xwRmlsdGVyRGFtcGluZztcblxuICAgIHZhciBfZmluaXNoZWQgPSBmYWxzZSwgICAgIC8vIElmIHRoZSBzb3VuZCBoYXMgZmluaXNoZWRcbiAgICAgICAgX2VudmVsb3BlU3RhZ2UgICAgPSAwLCAvLyBDdXJyZW50IHN0YWdlIG9mIHRoZSBlbnZlbG9wZSAoYXR0YWNrLCBzdXN0YWluLCBkZWNheSwgZW5kKVxuICAgICAgICBfZW52ZWxvcGVUaW1lICAgICA9IDAsIC8vIEN1cnJlbnQgdGltZSB0aHJvdWdoIGN1cnJlbnQgZW5lbG9wZSBzdGFnZVxuICAgICAgICBfZW52ZWxvcGVWb2x1bWUgICA9IDAsIC8vIEN1cnJlbnQgdm9sdW1lIG9mIHRoZSBlbnZlbG9wZVxuICAgICAgICBfaHBGaWx0ZXJQb3MgICAgICA9IDAsIC8vIEFkanVzdGVkIHdhdmUgcG9zaXRpb24gYWZ0ZXIgaGlnaC1wYXNzIGZpbHRlclxuICAgICAgICBfbHBGaWx0ZXJEZWx0YVBvcyA9IDAsIC8vIENoYW5nZSBpbiBsb3ctcGFzcyB3YXZlIHBvc2l0aW9uLCBhcyBhbGxvd2VkIGJ5IHRoZSBjdXRvZmYgYW5kIGRhbXBpbmdcbiAgICAgICAgX2xwRmlsdGVyT2xkUG9zLCAgICAgICAvLyBQcmV2aW91cyBsb3ctcGFzcyB3YXZlIHBvc2l0aW9uXG4gICAgICAgIF9scEZpbHRlclBvcyAgICAgID0gMCwgLy8gQWRqdXN0ZWQgd2F2ZSBwb3NpdGlvbiBhZnRlciBsb3ctcGFzcyBmaWx0ZXJcbiAgICAgICAgX3BlcmlvZFRlbXAsICAgICAgICAgICAvLyBQZXJpb2QgbW9kaWZpZWQgYnkgdmlicmF0b1xuICAgICAgICBfcGhhc2UgICAgICAgICAgICA9IDAsIC8vIFBoYXNlIHRocm91Z2ggdGhlIHdhdmVcbiAgICAgICAgX3BoYXNlckludCwgICAgICAgICAgICAvLyBJbnRlZ2VyIHBoYXNlciBvZmZzZXQsIGZvciBiaXQgbWF0aHNcbiAgICAgICAgX3BoYXNlclBvcyAgICAgICAgPSAwLCAvLyBQb3NpdGlvbiB0aHJvdWdoIHRoZSBwaGFzZXIgYnVmZmVyXG4gICAgICAgIF9wb3MsICAgICAgICAgICAgICAgICAgLy8gUGhhc2UgZXhwcmVzZWQgYXMgYSBOdW1iZXIgZnJvbSAwLTEsIHVzZWQgZm9yIGZhc3Qgc2luIGFwcHJveFxuICAgICAgICBfcmVwZWF0VGltZSAgICAgICA9IDAsIC8vIENvdW50ZXIgZm9yIHRoZSByZXBlYXRzXG4gICAgICAgIF9zYW1wbGUsICAgICAgICAgICAgICAgLy8gU3ViLXNhbXBsZSBjYWxjdWxhdGVkIDggdGltZXMgcGVyIGFjdHVhbCBzYW1wbGUsIGF2ZXJhZ2VkIG91dCB0byBnZXQgdGhlIHN1cGVyIHNhbXBsZVxuICAgICAgICBfc3VwZXJTYW1wbGUsICAgICAgICAgIC8vIEFjdHVhbCBzYW1wbGUgd3JpdGVuIHRvIHRoZSB3YXZlXG4gICAgICAgIF92aWJyYXRvUGhhc2UgICAgID0gMDsgLy8gUGhhc2UgdGhyb3VnaCB0aGUgdmlicmF0byBzaW5lIHdhdmVcblxuICAgIC8vIEJ1ZmZlciBvZiB3YXZlIHZhbHVlcyB1c2VkIHRvIGNyZWF0ZSB0aGUgb3V0IG9mIHBoYXNlIHNlY29uZCB3YXZlXG4gICAgdmFyIF9waGFzZXJCdWZmZXIgPSBuZXcgQXJyYXkoMTAyNCksXG4gICAgICAgIC8vIEJ1ZmZlciBvZiByYW5kb20gdmFsdWVzIHVzZWQgdG8gZ2VuZXJhdGUgbm9pc2VcbiAgICAgICAgX25vaXNlQnVmZmVyICA9IG5ldyBBcnJheSgzMik7XG4gICAgZm9yICh2YXIgaSA9IF9waGFzZXJCdWZmZXIubGVuZ3RoOyBpLS07ICkge1xuICAgICAgX3BoYXNlckJ1ZmZlcltpXSA9IDA7XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSBfbm9pc2VCdWZmZXIubGVuZ3RoOyBpLS07ICkge1xuICAgICAgX25vaXNlQnVmZmVyW2ldID0gTWF0aC5yYW5kb20oKSAqIDIgLSAxO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChfZmluaXNoZWQpIHtcbiAgICAgICAgcmV0dXJuIGk7XG4gICAgICB9XG5cbiAgICAgIC8vIFJlcGVhdHMgZXZlcnkgX3JlcGVhdExpbWl0IHRpbWVzLCBwYXJ0aWFsbHkgcmVzZXR0aW5nIHRoZSBzb3VuZCBwYXJhbWV0ZXJzXG4gICAgICBpZiAoX3JlcGVhdExpbWl0KSB7XG4gICAgICAgIGlmICgrK19yZXBlYXRUaW1lID49IF9yZXBlYXRMaW1pdCkge1xuICAgICAgICAgIF9yZXBlYXRUaW1lID0gMDtcbiAgICAgICAgICB0aGlzLnJlc2V0KCk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gSWYgX2NoYW5nZUxpbWl0IGlzIHJlYWNoZWQsIHNoaWZ0cyB0aGUgcGl0Y2hcbiAgICAgIGlmIChfY2hhbmdlTGltaXQpIHtcbiAgICAgICAgaWYgKCsrX2NoYW5nZVRpbWUgPj0gX2NoYW5nZUxpbWl0KSB7XG4gICAgICAgICAgX2NoYW5nZUxpbWl0ID0gMDtcbiAgICAgICAgICBfcGVyaW9kICo9IF9jaGFuZ2VBbW91bnQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gQWNjY2VsZXJhdGUgYW5kIGFwcGx5IHNsaWRlXG4gICAgICBfc2xpZGUgKz0gX2RlbHRhU2xpZGU7XG4gICAgICBfcGVyaW9kICo9IF9zbGlkZTtcblxuICAgICAgLy8gQ2hlY2tzIGZvciBmcmVxdWVuY3kgZ2V0dGluZyB0b28gbG93LCBhbmQgc3RvcHMgdGhlIHNvdW5kIGlmIGEgbWluRnJlcXVlbmN5IHdhcyBzZXRcbiAgICAgIGlmIChfcGVyaW9kID4gX21heFBlcmlvZCkge1xuICAgICAgICBfcGVyaW9kID0gX21heFBlcmlvZDtcbiAgICAgICAgaWYgKF9taW5GcmVxZW5jeSA+IDApIHtcbiAgICAgICAgICBfZmluaXNoZWQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIF9wZXJpb2RUZW1wID0gX3BlcmlvZDtcblxuICAgICAgLy8gQXBwbGllcyB0aGUgdmlicmF0byBlZmZlY3RcbiAgICAgIGlmIChfdmlicmF0b0FtcGxpdHVkZSA+IDApIHtcbiAgICAgICAgX3ZpYnJhdG9QaGFzZSArPSBfdmlicmF0b1NwZWVkO1xuICAgICAgICBfcGVyaW9kVGVtcCAqPSAxICsgTWF0aC5zaW4oX3ZpYnJhdG9QaGFzZSkgKiBfdmlicmF0b0FtcGxpdHVkZTtcbiAgICAgIH1cblxuICAgICAgX3BlcmlvZFRlbXAgfD0gMDtcbiAgICAgIGlmIChfcGVyaW9kVGVtcCA8IDgpIHtcbiAgICAgICAgX3BlcmlvZFRlbXAgPSA4O1xuICAgICAgfVxuXG4gICAgICAvLyBTd2VlcHMgdGhlIHNxdWFyZSBkdXR5XG4gICAgICBpZiAoIV93YXZlVHlwZSkge1xuICAgICAgICBfc3F1YXJlRHV0eSArPSBfZHV0eVN3ZWVwO1xuICAgICAgICBpZiAoX3NxdWFyZUR1dHkgPCAwKSB7XG4gICAgICAgICAgX3NxdWFyZUR1dHkgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKF9zcXVhcmVEdXR5ID4gLjUpIHtcbiAgICAgICAgICBfc3F1YXJlRHV0eSA9IC41O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIE1vdmVzIHRocm91Z2ggdGhlIGRpZmZlcmVudCBzdGFnZXMgb2YgdGhlIHZvbHVtZSBlbnZlbG9wZVxuICAgICAgaWYgKCsrX2VudmVsb3BlVGltZSA+IF9lbnZlbG9wZUxlbmd0aCkge1xuICAgICAgICBfZW52ZWxvcGVUaW1lID0gMDtcblxuICAgICAgICBzd2l0Y2ggKCsrX2VudmVsb3BlU3RhZ2UpICB7XG4gICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgX2VudmVsb3BlTGVuZ3RoID0gX2VudmVsb3BlTGVuZ3RoMTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgIF9lbnZlbG9wZUxlbmd0aCA9IF9lbnZlbG9wZUxlbmd0aDI7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gU2V0cyB0aGUgdm9sdW1lIGJhc2VkIG9uIHRoZSBwb3NpdGlvbiBpbiB0aGUgZW52ZWxvcGVcbiAgICAgIHN3aXRjaCAoX2VudmVsb3BlU3RhZ2UpIHtcbiAgICAgICAgY2FzZSAwOlxuICAgICAgICAgIF9lbnZlbG9wZVZvbHVtZSA9IF9lbnZlbG9wZVRpbWUgKiBfZW52ZWxvcGVPdmVyTGVuZ3RoMDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIF9lbnZlbG9wZVZvbHVtZSA9IDEgKyAoMSAtIF9lbnZlbG9wZVRpbWUgKiBfZW52ZWxvcGVPdmVyTGVuZ3RoMSkgKiAyICogX3N1c3RhaW5QdW5jaDtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIF9lbnZlbG9wZVZvbHVtZSA9IDEgLSBfZW52ZWxvcGVUaW1lICogX2VudmVsb3BlT3Zlckxlbmd0aDI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBfZW52ZWxvcGVWb2x1bWUgPSAwO1xuICAgICAgICAgIF9maW5pc2hlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIC8vIE1vdmVzIHRoZSBwaGFzZXIgb2Zmc2V0XG4gICAgICBpZiAoX3BoYXNlcikge1xuICAgICAgICBfcGhhc2VyT2Zmc2V0ICs9IF9waGFzZXJEZWx0YU9mZnNldDtcbiAgICAgICAgX3BoYXNlckludCA9IF9waGFzZXJPZmZzZXQgfCAwO1xuICAgICAgICBpZiAoX3BoYXNlckludCA8IDApIHtcbiAgICAgICAgICBfcGhhc2VySW50ID0gLV9waGFzZXJJbnQ7XG4gICAgICAgIH0gZWxzZSBpZiAoX3BoYXNlckludCA+IDEwMjMpIHtcbiAgICAgICAgICBfcGhhc2VySW50ID0gMTAyMztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBNb3ZlcyB0aGUgaGlnaC1wYXNzIGZpbHRlciBjdXRvZmZcbiAgICAgIGlmIChfZmlsdGVycyAmJiBfaHBGaWx0ZXJEZWx0YUN1dG9mZikge1xuICAgICAgICBfaHBGaWx0ZXJDdXRvZmYgKj0gX2hwRmlsdGVyRGVsdGFDdXRvZmY7XG4gICAgICAgIGlmIChfaHBGaWx0ZXJDdXRvZmYgPCAuMDAwMDEpIHtcbiAgICAgICAgICBfaHBGaWx0ZXJDdXRvZmYgPSAuMDAwMDE7XG4gICAgICAgIH0gZWxzZSBpZiAoX2hwRmlsdGVyQ3V0b2ZmID4gLjEpIHtcbiAgICAgICAgICBfaHBGaWx0ZXJDdXRvZmYgPSAuMTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBfc3VwZXJTYW1wbGUgPSAwO1xuICAgICAgZm9yICh2YXIgaiA9IDg7IGotLTsgKSB7XG4gICAgICAgIC8vIEN5Y2xlcyB0aHJvdWdoIHRoZSBwZXJpb2RcbiAgICAgICAgX3BoYXNlKys7XG4gICAgICAgIGlmIChfcGhhc2UgPj0gX3BlcmlvZFRlbXApIHtcbiAgICAgICAgICBfcGhhc2UgJT0gX3BlcmlvZFRlbXA7XG5cbiAgICAgICAgICAvLyBHZW5lcmF0ZXMgbmV3IHJhbmRvbSBub2lzZSBmb3IgdGhpcyBwZXJpb2RcbiAgICAgICAgICBpZiAoX3dhdmVUeXBlID09IDMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG4gPSBfbm9pc2VCdWZmZXIubGVuZ3RoOyBuLS07ICkge1xuICAgICAgICAgICAgICBfbm9pc2VCdWZmZXJbbl0gPSBNYXRoLnJhbmRvbSgpICogMiAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0cyB0aGUgc2FtcGxlIGZyb20gdGhlIG9zY2lsbGF0b3JcbiAgICAgICAgc3dpdGNoIChfd2F2ZVR5cGUpIHtcbiAgICAgICAgICBjYXNlIDA6IC8vIFNxdWFyZSB3YXZlXG4gICAgICAgICAgICBfc2FtcGxlID0gKChfcGhhc2UgLyBfcGVyaW9kVGVtcCkgPCBfc3F1YXJlRHV0eSkgPyAuNSA6IC0uNTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMTogLy8gU2F3IHdhdmVcbiAgICAgICAgICAgIF9zYW1wbGUgPSAxIC0gX3BoYXNlIC8gX3BlcmlvZFRlbXAgKiAyO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOiAvLyBTaW5lIHdhdmUgKGZhc3QgYW5kIGFjY3VyYXRlIGFwcHJveClcbiAgICAgICAgICAgIF9wb3MgPSBfcGhhc2UgLyBfcGVyaW9kVGVtcDtcbiAgICAgICAgICAgIF9wb3MgPSAoX3BvcyA+IC41ID8gX3BvcyAtIDEgOiBfcG9zKSAqIDYuMjgzMTg1MzE7XG4gICAgICAgICAgICBfc2FtcGxlID0gMS4yNzMyMzk1NCAqIF9wb3MgKyAuNDA1Mjg0NzM1ICogX3BvcyAqIF9wb3MgKiAoX3BvcyA8IDAgPyAxIDogLTEpO1xuICAgICAgICAgICAgX3NhbXBsZSA9IC4yMjUgKiAoKF9zYW1wbGUgPCAwID8gLTEgOiAxKSAqIF9zYW1wbGUgKiBfc2FtcGxlICAtIF9zYW1wbGUpICsgX3NhbXBsZTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMzogLy8gTm9pc2VcbiAgICAgICAgICAgIF9zYW1wbGUgPSBfbm9pc2VCdWZmZXJbTWF0aC5hYnMoX3BoYXNlICogMzIgLyBfcGVyaW9kVGVtcCB8IDApXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFwcGxpZXMgdGhlIGxvdyBhbmQgaGlnaCBwYXNzIGZpbHRlcnNcbiAgICAgICAgaWYgKF9maWx0ZXJzKSB7XG4gICAgICAgICAgX2xwRmlsdGVyT2xkUG9zID0gX2xwRmlsdGVyUG9zO1xuICAgICAgICAgIF9scEZpbHRlckN1dG9mZiAqPSBfbHBGaWx0ZXJEZWx0YUN1dG9mZjtcbiAgICAgICAgICBpZiAoX2xwRmlsdGVyQ3V0b2ZmIDwgMCkge1xuICAgICAgICAgICAgX2xwRmlsdGVyQ3V0b2ZmID0gMDtcbiAgICAgICAgICB9IGVsc2UgaWYgKF9scEZpbHRlckN1dG9mZiA+IC4xKSB7XG4gICAgICAgICAgICBfbHBGaWx0ZXJDdXRvZmYgPSAuMTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoX2xwRmlsdGVyT24pIHtcbiAgICAgICAgICAgIF9scEZpbHRlckRlbHRhUG9zICs9IChfc2FtcGxlIC0gX2xwRmlsdGVyUG9zKSAqIF9scEZpbHRlckN1dG9mZjtcbiAgICAgICAgICAgIF9scEZpbHRlckRlbHRhUG9zICo9IF9scEZpbHRlckRhbXBpbmc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIF9scEZpbHRlclBvcyA9IF9zYW1wbGU7XG4gICAgICAgICAgICBfbHBGaWx0ZXJEZWx0YVBvcyA9IDA7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgX2xwRmlsdGVyUG9zICs9IF9scEZpbHRlckRlbHRhUG9zO1xuXG4gICAgICAgICAgX2hwRmlsdGVyUG9zICs9IF9scEZpbHRlclBvcyAtIF9scEZpbHRlck9sZFBvcztcbiAgICAgICAgICBfaHBGaWx0ZXJQb3MgKj0gMSAtIF9ocEZpbHRlckN1dG9mZjtcbiAgICAgICAgICBfc2FtcGxlID0gX2hwRmlsdGVyUG9zO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQXBwbGllcyB0aGUgcGhhc2VyIGVmZmVjdFxuICAgICAgICBpZiAoX3BoYXNlcikge1xuICAgICAgICAgIF9waGFzZXJCdWZmZXJbX3BoYXNlclBvcyAlIDEwMjRdID0gX3NhbXBsZTtcbiAgICAgICAgICBfc2FtcGxlICs9IF9waGFzZXJCdWZmZXJbKF9waGFzZXJQb3MgLSBfcGhhc2VySW50ICsgMTAyNCkgJSAxMDI0XTtcbiAgICAgICAgICBfcGhhc2VyUG9zKys7XG4gICAgICAgIH1cblxuICAgICAgICBfc3VwZXJTYW1wbGUgKz0gX3NhbXBsZTtcbiAgICAgIH1cblxuICAgICAgLy8gQXZlcmFnZXMgb3V0IHRoZSBzdXBlciBzYW1wbGVzIGFuZCBhcHBsaWVzIHZvbHVtZXNcbiAgICAgIF9zdXBlclNhbXBsZSAqPSAuMTI1ICogX2VudmVsb3BlVm9sdW1lICogX21hc3RlclZvbHVtZTtcblxuICAgICAgLy8gQ2xpcHBpbmcgaWYgdG9vIGxvdWRcbiAgICAgIGJ1ZmZlcltpXSA9IF9zdXBlclNhbXBsZSA+PSAxID8gMzI3NjcgOiBfc3VwZXJTYW1wbGUgPD0gLTEgPyAtMzI3NjggOiBfc3VwZXJTYW1wbGUgKiAzMjc2NyB8IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlbmd0aDtcbiAgfVxufVxuXG4vLyBBZGFwdGVkIGZyb20gaHR0cDovL2NvZGViYXNlLmVzL3JpZmZ3YXZlL1xudmFyIHN5bnRoID0gbmV3IFNmeHJTeW50aCgpO1xuLy8gRXhwb3J0IGZvciB0aGUgQ2xvc3VyZSBDb21waWxlclxudmFyIEpTRlhSID0gZnVuY3Rpb24oc2V0dGluZ3MpIHtcbiAgLy8gSW5pdGlhbGl6ZSBTZnhyUGFyYW1zXG4gIHN5bnRoLl9wYXJhbXMuc2V0U2V0dGluZ3Moc2V0dGluZ3MpO1xuICAvLyBTeW50aGVzaXplIFdhdmVcbiAgdmFyIGVudmVsb3BlRnVsbExlbmd0aCA9IHN5bnRoLnRvdGFsUmVzZXQoKTtcbiAgdmFyIGRhdGEgPSBuZXcgVWludDhBcnJheSgoKGVudmVsb3BlRnVsbExlbmd0aCArIDEpIC8gMiB8IDApICogNCArIDQ0KTtcbiAgdmFyIHVzZWQgPSBzeW50aC5zeW50aFdhdmUobmV3IFVpbnQxNkFycmF5KGRhdGEuYnVmZmVyLCA0NCksIGVudmVsb3BlRnVsbExlbmd0aCkgKiAyO1xuICB2YXIgZHYgPSBuZXcgVWludDMyQXJyYXkoZGF0YS5idWZmZXIsIDAsIDQ0KTtcbiAgLy8gSW5pdGlhbGl6ZSBoZWFkZXJcbiAgZHZbMF0gPSAweDQ2NDY0OTUyOyAvLyBcIlJJRkZcIlxuICBkdlsxXSA9IHVzZWQgKyAzNjsgIC8vIHB1dCB0b3RhbCBzaXplIGhlcmVcbiAgZHZbMl0gPSAweDQ1NTY0MTU3OyAvLyBcIldBVkVcIlxuICBkdlszXSA9IDB4MjA3NDZENjY7IC8vIFwiZm10IFwiXG4gIGR2WzRdID0gMHgwMDAwMDAxMDsgLy8gc2l6ZSBvZiB0aGUgZm9sbG93aW5nXG4gIGR2WzVdID0gMHgwMDAxMDAwMTsgLy8gTW9ubzogMSBjaGFubmVsLCBQQ00gZm9ybWF0XG4gIGR2WzZdID0gMHgwMDAwQUM0NDsgLy8gNDQsMTAwIHNhbXBsZXMgcGVyIHNlY29uZFxuICBkdls3XSA9IDB4MDAwMTU4ODg7IC8vIGJ5dGUgcmF0ZTogdHdvIGJ5dGVzIHBlciBzYW1wbGVcbiAgZHZbOF0gPSAweDAwMTAwMDAyOyAvLyAxNiBiaXRzIHBlciBzYW1wbGUsIGFsaWduZWQgb24gZXZlcnkgdHdvIGJ5dGVzXG4gIGR2WzldID0gMHg2MTc0NjE2NDsgLy8gXCJkYXRhXCJcbiAgZHZbMTBdID0gdXNlZDsgICAgICAvLyBwdXQgbnVtYmVyIG9mIHNhbXBsZXMgaGVyZVxuXG4gIC8vIEJhc2U2NCBlbmNvZGluZyB3cml0dGVuIGJ5IG1lLCBAbWFldHRpZ1xuICB1c2VkICs9IDQ0O1xuICB2YXIgaSA9IDAsXG4gICAgICBiYXNlNjRDaGFyYWN0ZXJzID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nLFxuICAgICAgb3V0cHV0ID0gJ2RhdGE6YXVkaW8vd2F2O2Jhc2U2NCwnO1xuICBmb3IgKDsgaSA8IHVzZWQ7IGkgKz0gMylcbiAge1xuICAgIHZhciBhID0gZGF0YVtpXSA8PCAxNiB8IGRhdGFbaSArIDFdIDw8IDggfCBkYXRhW2kgKyAyXTtcbiAgICBvdXRwdXQgKz0gYmFzZTY0Q2hhcmFjdGVyc1thID4+IDE4XSArIGJhc2U2NENoYXJhY3RlcnNbYSA+PiAxMiAmIDYzXSArIGJhc2U2NENoYXJhY3RlcnNbYSA+PiA2ICYgNjNdICsgYmFzZTY0Q2hhcmFjdGVyc1thICYgNjNdO1xuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gSlNGWFI7IiwiY2xhc3MgTmFycmF0aW9uIHtcblxuXHRjb25zdHJ1Y3RvcihzZWwpIHtcblx0XHR0aGlzLm5hcnJhdGlvbkhvbGRlciA9IHNlbDtcblx0XHR0aGlzLmN1cnJlbnROYXJyYXRpb24gPSAtMTtcblx0XHR0aGlzLmN1cnJlbnRTaG93bk5hcnJhdGlvbiA9IG51bGw7XG5cdH1cblxuXHRzZXROYXJyYXRpb25Db250ZW50KG5ld0NvbnRlbnQpIHtcblx0XHR0aGlzLmNvbnRlbnQgPSBuZXdDb250ZW50O1xuXHR9XG5cblx0YWR2YW5jZU5hcnJhdGlvbih0aW1lQmVmb3JlTmV4dCA9IC0xKSB7XG5cdFx0aWYodGltZUJlZm9yZU5leHQgIT0gLTEpIHtcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0dGhhdC5hZHZhbmNlTmFycmF0aW9uKCk7XG5cdFx0XHR9LHRpbWVCZWZvcmVOZXh0KTtcblx0XHR9XG5cblx0XHR0aGlzLmN1cnJlbnROYXJyYXRpb24rKztcblx0XHRpZih0aGlzLmNvbnRlbnRbdGhpcy5jdXJyZW50TmFycmF0aW9uXSkge1xuXHRcdFx0dGhpcy5yZW1vdmVDdXJyZW50TmFycmF0aW9uKCk7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHRoaXMuY29udGVudFt0aGlzLmN1cnJlbnROYXJyYXRpb25dO1xuXHRcdFx0dmFyIG5ld3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwicFwiKTtcblx0XHRcdG5ld3AuY2xhc3NMaXN0LmFkZChcIm5hcnJhdGlvbi1zZXRcIik7XG5cdFx0XHRuZXdwLmlubmVySFRNTCA9IG5ld0NvbnRlbnQ7XG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHRoYXQuYW5pbWF0ZUluTmFycmF0aW9uKG5ld3ApO1xuXHRcdFx0fSwgNTAwKTtcblx0XHRcdHRoaXMubmFycmF0aW9uSG9sZGVyLmFwcGVuZENoaWxkKG5ld3ApO1xuXHRcdFx0dGhpcy5jdXJyZW50U2hvd25OYXJyYXRpb24gPSBuZXdwO1xuXHRcdH1cblx0fVxuXG5cdGFuaW1hdGVJbk5hcnJhdGlvbihwKSB7XG5cdFx0cC5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpO1xuXHR9XG5cblx0cmVtb3ZlQ3VycmVudE5hcnJhdGlvbigpIHtcblx0XHRpZih0aGlzLmN1cnJlbnRTaG93bk5hcnJhdGlvbikge1xuXHRcdFx0dGhpcy5jdXJyZW50U2hvd25OYXJyYXRpb24uY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKTtcblx0XHRcdHRoaXMuY3VycmVudFNob3duTmFycmF0aW9uLmNsYXNzTGlzdC5hZGQoXCJpbmFjdGl2ZVwiKTtcblx0XHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcdHZhciBpbmFjdGl2ZU5hcnJhdGlvbiA9IHRoaXMuY3VycmVudFNob3duTmFycmF0aW9uO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHR0aGF0Lm5hcnJhdGlvbkhvbGRlci5yZW1vdmVDaGlsZChpbmFjdGl2ZU5hcnJhdGlvbik7XG5cdFx0XHR9LCA1MDApO1xuXHRcdH1cblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE5hcnJhdGlvbjsiLCIvLyBIb2xkcyBsYXN0IGl0ZXJhdGlvbiB0aW1lc3RhbXAuXG52YXIgdGltZSA9IDA7XG5cbi8qKlxuICogQ2FsbHMgYGZuYCBvbiBuZXh0IGZyYW1lLlxuICpcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb25cbiAqIEByZXR1cm4ge2ludH0gVGhlIHJlcXVlc3QgSURcbiAqIEBhcGkgcHJpdmF0ZVxuICovXG5mdW5jdGlvbiByYWYoZm4pIHtcbiAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgdmFyIG5vdyA9IERhdGUubm93KCk7XG4gICAgdmFyIGVsYXBzZWQgPSBub3cgLSB0aW1lO1xuXG4gICAgaWYgKGVsYXBzZWQgPiA5OTkpIHtcbiAgICAgIGVsYXBzZWQgPSAxIC8gNjA7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsYXBzZWQgLz0gMTAwMDtcbiAgICB9XG5cbiAgICB0aW1lID0gbm93O1xuICAgIGZuKGVsYXBzZWQpO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8qKlxuICAgKiBDYWxscyBgZm5gIG9uIGV2ZXJ5IGZyYW1lIHdpdGggYGVsYXBzZWRgIHNldCB0byB0aGUgZWxhcHNlZFxuICAgKiB0aW1lIGluIG1pbGxpc2Vjb25kcy5cbiAgICpcbiAgICogQHBhcmFtICB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvblxuICAgKiBAcmV0dXJuIHtpbnR9IFRoZSByZXF1ZXN0IElEXG4gICAqIEBhcGkgcHVibGljXG4gICAqL1xuICBzdGFydDogZnVuY3Rpb24oZm4pIHtcbiAgICByZXR1cm4gcmFmKGZ1bmN0aW9uIHRpY2soZWxhcHNlZCkge1xuICAgICAgZm4oZWxhcHNlZCk7XG4gICAgICByYWYodGljayk7XG4gICAgfSk7XG4gIH0sXG4gIC8qKlxuICAgKiBDYW5jZWxzIHRoZSBzcGVjaWZpZWQgYW5pbWF0aW9uIGZyYW1lIHJlcXVlc3QuXG4gICAqXG4gICAqIEBwYXJhbSB7aW50fSBpZCBUaGUgcmVxdWVzdCBJRFxuICAgKiBAYXBpIHB1YmxpY1xuICAgKi9cbiAgc3RvcDogZnVuY3Rpb24oaWQpIHtcbiAgICB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUoaWQpO1xuICB9XG59O1xuIiwidmFyIEJhc2VPYmplY3QgPSByZXF1aXJlKCcuL0Jhc2VPYmplY3QnKTtcblxuY2xhc3MgVHJpZ2dlciBleHRlbmRzIEJhc2VPYmplY3Qge1xuXG5cdGNvbnN0cnVjdG9yKHgseSx3aWR0aCxoZWlnaHQpIHtcblx0XHRzdXBlcigpO1xuXHRcdHRoaXMueCA9IHg7XG5cdFx0dGhpcy55ID0geTtcblx0XHR0aGlzLndpZHRoID0gd2lkdGg7XG5cdFx0dGhpcy5oZWlnaHQgPSBoZWlnaHQ7XG5cdFx0dGhpcy5jb2xvciA9ICcjNWRhZjQ2Jztcblx0XHR0aGlzLmNvbGxpc2lvblR5cGUgPSBcInRyaWdnZXJcIjtcblx0XHR0aGlzLnJlbmRlckxheWVyID0gMjtcblx0XHR0aGlzLmFjdGl2ZSA9IHRydWU7XG5cdFx0dGhpcy50cmlnZ2VyV2F5cG9pbnQgPSAtMTtcblx0fVxuXG5cdHNldFRyaWdnZXJEYXRhKG9iaikge1xuXHRcdHRoaXMudHJpZ2dlckRhdGEgPSBvYmo7XG5cdH1cblxuXHR1cGRhdGUoZWxhcHNlZCkge1xuXG5cdH1cblxuXHRyZW5kZXIoKSB7XG5cdFx0aWYoZW5naW5lLmlzT25TY3JlZW4odGhpcykgJiYgdGhpcy50cmlnZ2VyRGF0YS50eXBlICE9IFwid2F5cG9pbnRcIikge1xuXHRcdFx0Y3R4LmJlZ2luUGF0aCgpO1xuXHQgICAgXHRjdHgucmVjdCh0aGlzLngtY2FtZXJhLngsIHRoaXMueS1jYW1lcmEueSwgdGhpcy53aWR0aCwgdGhpcy5oZWlnaHQpO1xuXHQgICAgXHRjdHguY2xvc2VQYXRoKCk7XG5cdCAgICBcdGN0eC5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xuXG5cdCAgICBcdGN0eC5zYXZlKCk7XG5cdFx0XHRjdHgudHJhbnNsYXRlKHRoaXMueC1jYW1lcmEueCwgdGhpcy55LWNhbWVyYS55KTtcblx0XHRcdGN0eC5maWxsKCk7XG5cdFx0XHRjdHgucmVzdG9yZSgpO1xuXHRcdH1cblx0fVxuXG5cdGtpbGwoKSB7XG5cdFx0dmFyIGkgPSBnYW1lT2JqZWN0cy5pbmRleE9mKHRoaXMpO1xuICAgIFx0Z2FtZU9iamVjdHMuc3BsaWNlKGksIDEpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVHJpZ2dlcjsiXX0=
