import Emitter from '../classes/emitter.js';
import { listenTo, debounce } from './util.js';
import keys from './keys.js';

var loop = new Emitter();
var raf = window.requestAnimationFrame;
var lastFrame = null;
var active = false;
var framerate = ( 1 / 60 ) * 1000;

loop.start = function() {
  if ( active ) {
    return;
  }
  lastFrame = Date.now();
  active = true;
  raf( tick );
  loop.emit('start');
};

loop.stop = function() {
  if ( !active ) {
    return;
  }
  active = false;
  loop.emit('stop');
};

function tick() {
  var now, scale, deltaT;

  if ( !active ) {
    return;
  }

  now = Date.now();
  deltaT = now - lastFrame;
  scale = Math.max( deltaT / framerate, 1 ).toFixed( 2 );

  loop.emit( 'update', scale, deltaT );
  loop.emit( 'render', deltaT );

  lastFrame = Date.now();
  raf( tick );
}

listenTo( 'blur', debounce( loop.stop, 250 ) );
listenTo( 'focus', debounce( loop.start, 250 ) );

export default loop;

window.loop = loop;
