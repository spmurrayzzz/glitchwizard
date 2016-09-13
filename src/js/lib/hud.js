import heart from '../sprites/heart.js';
import { $, memoize } from '../lib/util.js';
import loop from '../lib/loop.js';
import player from '../lib/player.js';
import text from '../lib/text.js';

var canvas = $('.hud')[ 0 ];
var ctx = canvas.getContext('2d');
var w = canvas.width;
var h = canvas.height;
var empty = [];
var distance = 0;
var renderTitle = true;

var titleOpts = {
  shadowColor: '#000',
  shadowBlur: 15
};

var distanceOpts = {
  shadowColor: '#000',
  shadowBlur: 1
};

player.on( 'update', function( num ) {
  var delta = Math.max( num, 0 );
  distance += delta * 0.01;
});

player.once( 'move', function() {
  setTimeout(function() {
    renderTitle = false;
  }, 3000 );
});

ctx.imageSmoothingEnabled = false;

var getHearts = memoize(function( num ) {
  if ( num <= 0 ) {
    return empty;
  }
  return [ heart ].concat( getHearts( --num ) );
});

function renderHearts() {
  getHearts( player.health ).reduce(function( prev, heart ) {
    ctx.drawImage( heart, prev, 4, 32, 32);
    return prev - 40;
  }, w - 38 );
}

function renderDistance() {
  var opts = {
    shadowColor: '#000',
    shadowBlur: 1
  };
  var dist = Math.floor( distance );
  text.draw( ctx, 'distance: ', 4, 10, 3, 'rgb( 255, 255, 255 )', distanceOpts );
  // since we prime the text renderer cache per string arg we dont want to make
  // a massive memory leak
  Array.prototype.slice.call( dist.toString() )
  .forEach(function( num, i ) {
    text.draw( ctx, num, 175 + i * 20, 10, 3, 'rgb( 255, 255, 255 )', distanceOpts );
  });
}

function renderTitleScreen() {
  if ( !renderTitle && player.dead ) {
    return;
  }
  text.draw( ctx, 'glitch', 220, 100, 10, '#fff', titleOpts );
  text.draw( ctx, 'wizard', 220, 200, 10, '#fff', titleOpts );
  text.draw( ctx, 'travel as far as you can, fam', 135, 300, 3, '#fff', titleOpts );
}

function renderGameOver() {
  if ( !player.dead ) {
    return;
  }
  text.draw( ctx, 'game', 275, 100, 10, '#fff', titleOpts );
  text.draw( ctx, 'over', 275, 200, 10, '#fff', titleOpts );
  text.draw( ctx, 'press R to try again', 210, 300, 3, '#fff', titleOpts );
}

function render() {
  ctx.clearRect( 0, 0, w, h );

  renderTitleScreen();
  renderHearts();
  renderDistance();
  renderGameOver();
}

loop.on( 'render', render );
