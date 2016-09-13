import { each, map, memoize, $ } from './util.js';

/**
 * Pre render an image element into a canvas element
 * @param  {Object} opts - options object (width, height, and buffer)
 * @return {HTMLCanvasElement}
 */
function load( opts ) {
  var w           = opts.w || ( opts.w = 32 );
  var h           = opts.h || ( opts.h = 32 );
  var img         = $( 'img.' + opts.name )[ 0 ];
  var canvas      = document.createElement('canvas');
  var ctx         = canvas.getContext('2d');
  canvas.width    = w;
  canvas.height   = h;

  ctx.imageSmoothingEnabled = false;
  ctx.drawImage( img, 0, 0, w, h );

  return canvas;
}

export default memoize( load, function( opts ) {
  return opts.name;
});
