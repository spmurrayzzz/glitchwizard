import { $, sequence } from './util.js';
import loop from './loop.js';
import floors from '../sprites/floor.js';

var bg      = $('canvas.bg')[ 0 ];
var ctx     = bg.getContext('2d');

// initial render
ctx.globalAlpha = 0.055;
ctx.translate( 0, -120 );
ctx.drawImage( floors.middle, 0, 0, 32, 32, 0, 0, 800, 1200 );
ctx.drawImage( floors.middle, 0, 0, 32, 32, 800, 0, 800, 1200 );

// x-axis parallax scroll values
var x = 0;
var x2 = 0;

loop.on( 'render', function() {
  ctx.clearRect( 0, 0, 800, 1200 );

  // move the first sprite
  ctx.save();
  ctx.translate( x -= 3, 0 );
  ctx.drawImage( floors.middle, 0, 0, 32, 32, 0, 0, 800, 1200 );
  ctx.drawImage( floors.middle, 0, 0, 32, 32, 800, 0, 800, 1200 );
  ctx.restore();

  // move the second sprite
  ctx.save();
  ctx.globalAlpha = 0.055;
  ctx.translate( x2 -= 10, 80 );
  ctx.drawImage( floors.middle, 0, 0, 32, 32, 0, 0, 800, 1200 );
  ctx.drawImage( floors.middle, 0, 0, 32, 32, 800, 0, 800, 1200 );
  ctx.restore();

  // reset parallax coordinates
  x = x <= -800 ? 0 : x;
  x2 = x2 <= -800 ? 0 : x2;

});
