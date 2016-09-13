import loop from './loop.js';
import { $, random } from './util.js';
import canvases from './canvases.js';

var view = $('.camera')[ 0 ];
var ctx = view.getContext('2d');
var w = view.width;
var h = view.height;

function render() {
  ctx.drawImage( canvases.main.el, camera.x, camera.y, w, h, 0, 0, w, h );
}

var camera = {

  w: w,
  h: h,
  x: 0,
  y: 0,

  velocity: 0,

  get offset() {
    return camera.w / 4;
  },

  shake: function() {
    camera.shakeEffect = true;
    camera.effectCount = 30;;
  },

  render: function() {
    ctx.clearRect( 0, 0, w, h );

    if ( camera.shakeEffect && camera.effectCount-- ) {

      ctx.save();
      ctx.translate( random( 1, 5 ), random( 1, 5 ) );
      render();
      ctx.restore();

    } else {

      if ( camera.effectCount <= 0 && camera.shakeEffect ) {
        camera.shakeEffect = false;
        camera.effectCount = 0;
      }

      render();
    }
  }

};

loop.on( 'render', camera.render.bind( camera ) );

export default camera;
