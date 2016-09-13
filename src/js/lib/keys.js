import { listenTo } from './util.js';

var keys = {
  37: 'LEFT',
  38: 'UP',
  39: 'RIGHT',
  40: 'DOWN',
  32: 'SPACE',
  80: 'P',
  82: 'R'
};

var states = {
  LEFT:       false,
  UP:         false,
  RIGHT:      false,
  DOWN:       false,
  SPACE:      false,
  P:          false,
  R:          false
};

export default states

listenTo( 'keydown', function( ev ) {
  var code = ev.keyCode;
  states[ keys[ code ] ] = true;
});

listenTo( 'keyup', function( ev ) {
  var code = ev.keyCode;
  states[ keys[ code ] ] = false;
});
