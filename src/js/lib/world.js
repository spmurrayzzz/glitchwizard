import canvases from './canvases.js';
import Floor from '../classes/floor.js';
import Spikes from '../classes/spikes.js';
import Bomb from '../classes/bomb.js';
import Arrow from '../classes/Arrow.js';
import { random, shuffle } from './util.js';
import camera from './camera.js';
import player from './player.js';
import loop from './loop.js';

var canvas = canvases.main;
var w = canvases.main.w;
var h = canvases.main.h;


var floors = [];
var x = 0;
var i;
var size;

for ( i = 0; i < 30; i++) {
  size = random( 0, 3 );
  floors.push( createFloor( size, x, h - 128 ) );
  x += incrementX( floors[ i ] );
}

var spikes = [];
floors.forEach(function( floor, i ) {
  var spike;
  if ( i > 0 && random( 1, 100 ) >= 50 ) {
    spike = createSpikes();
    spike.x = floor.x + floor.w / 2 - spike.w / 2;
    spike.y = floor.y - spike.h / 2 ;
    spikes.push( spike );
    floor.spikes = spike;
  }
});

var bombs = [];
floors.forEach(function( floor, i, arr ) {
  var deltaX;
  var bomb;
  var x;

  if ( i < arr.length - 1 && random( 1, 100 ) <= 50 ) {
    x = floor.x + floor.w + getRandomGap() / 2;
    bomb = new Bomb({ x: x , y: h });
    bombs.push( bomb );
    floor.bomb = bomb;
  }
});

var arrows = [];
function getOnscreenArrows() {
  return arrows.filter( isOnscreen );
}

function getArrow() {
  var arrow = arrows.filter(function( arrow ) {
    return arrow.isOffscreen();
  }).pop();

  if ( !arrow ) {
    arrow = new Arrow({ x: -100, y: -100 });
    arrows.push( arrow );
    canvas.addEntity( arrow );
  }
  return arrow;
}

var world = {
  floors: floors,
  spikes: spikes,
  bombs: bombs,
  getOnscreenFloors: getOnscreenFloors,
  getOnscreenSpikes: getOnscreenSpikes,
  getOnscreenBombs: getOnscreenBombs,
  getOnscreenArrows: getOnscreenArrows,
  start: start
};

function incrementX( lastFloor ) {
  return lastFloor.w + getRandomGap();
}

function createFloor( size, x, y ) {
  return new Floor({ size: size, x: x, y: y });
}

function createSpikes( x, y ) {
  return new Spikes({ x: x, y: y });
}

function getRandomGap() {
  return random( 128, 220 );
}

function isOnscreen( item ) {
  return item.isOnscreen() === true;
}

function isOffscreen( item ) {
  return item.isOffscreen() === true;
}

function getOldFloors() {
  return floors.filter(function( floor ) {
    return floor.isBehind() && floor.isOffscreen();
  });
}

function getCurrentFloors() {
  return getOnscreenFloors();
}

function getOffscreenFloors() {
  return floors.filter( isOffscreen );
}

function getOnscreenFloors() {
  return floors.filter( isOnscreen );
}

function getOnscreenSpikes() {
  return spikes.filter( isOnscreen );
}

function getOnscreenBombs() {
  return bombs.filter( isOnscreen );
}

function getOffscreenBombs() {
  return bombs.filter( isOffscreen );
}

function recycle() {
  getOldFloors().forEach(function( floor ) {
    floor.x = x;
    x += w + getRandomGap();
  });
}

function checkForReset(){
  if ( canvas.w - camera.x <= 1200 ) {
    reset();
  }
}

function reset() {
  var current = getCurrentFloors();
  var other = getOffscreenFloors();
  var bombs = getOnscreenBombs();
  var arrows = getOnscreenArrows();
  var last;

  current.forEach(function( floor, i ) {
    var spikes;
    var bomb;
    var delta;
    var bombDelta;

    delta = floor.x - camera.x;

    if ( floor.bomb ) {
      bomb = floor.bomb;
      bombDelta = bomb.x - floor.x;
      bomb.x = delta + bombDelta;
    }

    x = floor.x = delta;

    if ( floor.spikes ) {
      spikes = floor.spikes;
      spikes.x = floor.x + floor.w / 2 - spikes.w / 2;
    }

    x += incrementX( floor );
  });

  arrows.forEach(function( arrow, i ) {
    arrow.x -= camera.x;
  });

  shuffle( other ).forEach(function( floor ) {
    var spikes;
    var bomb;
    floor.x = x;

    if ( floor.spikes ) {
      spikes = floor.spikes;
      spikes.x = floor.x + floor.w / 2 - spikes.w / 2;
    }

    if ( floor.bomb ) {
      bomb = floor.bomb;
      bomb.x = floor.x + floor.w + getRandomGap() / 2 ;
    }

    x += incrementX( floor );
  });

  player.x = player.x - camera.x;
  camera.x = 0;
  floors = current.concat( other );
}

function start() {
  var counter = 0;
  var length = random( 1, 12 );

  loop.on( 'update', function( scale, delta ) {
    counter += delta;
    if ( counter >= 1e3 * length ) {
      counter = 0;
      length = random( 1, 12 );
      getArrow().throwAt( player );
    }
  })
}

canvas.on( 'before-update', checkForReset );
canvas.on( 'before-update', recycle );

canvas.world = world;


export default world;
