import { $, debounce } from './util.js';

var camera = $('canvas.camera')[ 0 ];
var bg = $('canvas.bg')[ 0 ];
var hud = $('canvas.hud')[ 0 ];
var stage = $('.stage')[ 0 ];


function resize() {
  var aspect = window.innerWidth / window.innerHeight;
  var scale;
  scale = window.innerWidth / camera.width;
  if ( aspect <= 1 ) {
    scale = window.innerWidth / camera.width;
  } else {
    scale = window.innerHeight / camera.height;
  }
  var h = camera.height * scale - 25;
  var w = camera.width * scale - 25;

  camera.style.height = h + 'px';
  bg.style.height = h + 'px';
  hud.style.height = h + 'px';
  stage.style.height = h + 'px';

  camera.style.width = w + 'px';
  bg.style.width = w + 'px';
  hud.style.width = w + 'px';
  stage.style.width = w + 'px';
}

resize();
window.addEventListener( 'resize', debounce( resize, 300 ) );
window.addEventListener( 'orientationchange', debounce( resize, 300 ) );
