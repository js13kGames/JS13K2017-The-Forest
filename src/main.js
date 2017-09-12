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
